"use client";

import { useMemo, useState } from "react";
import { CommuteStatusList } from "@/components/CommuteStatusList/CommuteStatusList";
import { RideOfferCard } from "@/components/RideOfferCard/RideOfferCard";
import { TodaySummaryCard } from "@/components/TodaySummaryCard/TodaySummaryCard";
import {
  profiles as initialProfiles,
  rideOffers as initialRideOffers,
  rideRequests as initialRequests,
  vehicles as initialVehicles,
} from "@/lib/CarpoolMockData";
import { dateParity, remainingSeats, waitingCount } from "@/lib/CarpoolRules";
import { autoPromoteWaiting, classifyProfiles, createRequest, updateRequestStatus } from "@/lib/CarpoolService";
import { AttendanceType, RideOffer, RideRequest, Vehicle } from "@/lib/CarpoolTypes";

const attendanceLabels: Record<AttendanceType, string> = {
  ON_DUTY: "출근",
  VACATION: "휴가",
  OFF: "휴무",
  PERSONAL_LEAVE: "청원휴가",
  BUSINESS_TRIP: "근취",
};

export function CarpoolDashboard() {
  const [loginName, setLoginName] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [rideOffers] = useState(initialRideOffers);
  const [requests, setRequests] = useState(initialRequests);
  const [plateNumberInput, setPlateNumberInput] = useState("");
  const [seatCapacityInput, setSeatCapacityInput] = useState("3");
  const now = useMemo(() => new Date(), []);
  const parityMode = dateParity(now) === "ODD" ? "ODD_ONLY" : "EVEN_ONLY";
  const parityLabel = `${dateParity(now) === "ODD" ? "홀수" : "짝수"} 차량 운행일`;

  const classified = useMemo(
    () => classifyProfiles(profiles, vehicles, parityMode, now),
    [profiles, vehicles, parityMode, now],
  );

  const driverProfiles = classified.filter((item) => item.canDrive).map((item) => item.profile);
  const riderProfiles = classified.filter((item) => item.needsRide).map((item) => item.profile);
  const offDutyProfiles = classified.filter((item) => item.offDuty).map((item) => item.profile);
  const currentUser = profiles.find((item) => item.id === currentUserId) ?? null;
  const currentUserVehicle = vehicles.find((item) => item.ownerId === currentUserId);

  const requestStatusLabel: Record<RideRequest["status"], string> = {
    WAITING: "대기",
    APPROVED: "승인",
    REJECTED: "거절",
    CANCELLED: "취소",
  };

  const applyStatusChange = (requestId: string, status: RideRequest["status"], offer: RideOffer) => {
    const updated = updateRequestStatus(requestId, status, requests);
    setRequests(autoPromoteWaiting(offer, updated));
  };

  const handleLogin = () => {
    const trimmed = loginName.trim();
    if (!trimmed) return;

    const existing = profiles.find((item) => item.name === trimmed);
    if (existing) {
      setCurrentUserId(existing.id);
      return;
    }

    const newId = crypto.randomUUID();
    setProfiles((prev) => [
      ...prev,
      { id: newId, name: trimmed, hasVehicle: false, attendanceType: "ON_DUTY" },
    ]);
    setCurrentUserId(newId);
  };

  const handleAttendanceChange = (attendanceType: AttendanceType) => {
    if (!currentUserId) return;
    setProfiles((prev) =>
      prev.map((item) => (item.id === currentUserId ? { ...item, attendanceType } : item)),
    );
  };

  const handleRegisterVehicle = () => {
    if (!currentUserId) return;
    const onlyDigits = plateNumberInput.replace(/\D/g, "");
    if (!plateNumberInput.trim() || onlyDigits.length === 0) return;

    const lastDigit = Number(onlyDigits[onlyDigits.length - 1]);
    const seatCapacity = Math.min(Math.max(Number(seatCapacityInput) || 1, 1), 9);

    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      ownerId: currentUserId,
      plateNumber: plateNumberInput.trim(),
      plateLastDigit: lastDigit,
      seatCapacity,
    };

    setVehicles((prev) => {
      const filtered = prev.filter((item) => item.ownerId !== currentUserId);
      return [...filtered, newVehicle];
    });
    setProfiles((prev) =>
      prev.map((item) => (item.id === currentUserId ? { ...item, hasVehicle: true } : item)),
    );
    setPlateNumberInput("");
    setSeatCapacityInput("3");
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 py-5">
      <header className="mb-4 rounded-2xl bg-[var(--primary)] p-4 text-white shadow-sm">
        <p className="text-xs text-blue-100">311통신대대 카풀방</p>
        <h1 className="mt-1 text-xl font-bold leading-7">모바일 카풀 현황</h1>
        <p className="mt-2 text-sm text-blue-100">2부제 자동 계산 + 개인 비출근일 반영</p>
      </header>

      <main className="space-y-3">
        {!currentUser && (
          <section className="card space-y-3 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">이름으로 로그인</h2>
            <p className="text-xs text-slate-600">
              이름을 입력하면 본인 계정으로 로그인되고 상태 수정/차량 등록이 가능합니다.
            </p>
            <input
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              placeholder="이름 입력 (예: 홍길동)"
              className="focus-ring h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-800"
            />
            <button
              type="button"
              className="focus-ring h-11 w-full rounded-xl bg-[var(--primary)] text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              onClick={handleLogin}
            >
              로그인
            </button>
          </section>
        )}

        {currentUser && (
          <section className="card space-y-3 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">내 정보</h2>
            <p className="text-xs text-slate-600">
              로그인 사용자: <span className="font-semibold text-slate-800">{currentUser.name}</span>
            </p>
            <button
              type="button"
              className="focus-ring h-10 w-full rounded-xl border border-[var(--border)] bg-white text-xs font-semibold text-slate-700"
              onClick={() => setCurrentUserId(null)}
            >
              로그아웃
            </button>
          </section>
        )}

        <TodaySummaryCard
          dateLabel={now.toLocaleDateString("ko-KR")}
          parityLabel={parityLabel}
          offDutyCount={offDutyProfiles.length}
          riderCount={riderProfiles.length}
          driverCount={driverProfiles.length}
        />

        {currentUser && (
          <section className="card space-y-3 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">내 상태 변경</h2>
            <p className="text-xs text-slate-600">
              오늘 내 상태를 설정하세요. 비출근 상태면 자동으로 운행에서 제외됩니다.
            </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(attendanceLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className="focus-ring h-11 rounded-xl border border-[var(--border)] bg-slate-50 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100"
                onClick={() => handleAttendanceChange(value as AttendanceType)}
              >
                {label}
              </button>
            ))}
          </div>
          </section>
        )}

        {currentUser && (
          <section className="card space-y-3 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900">내 차량 등록</h2>
            <input
              value={plateNumberInput}
              onChange={(event) => setPlateNumberInput(event.target.value)}
              placeholder="차량번호 입력 (예: 12가3456)"
              className="focus-ring h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-800"
            />
            <input
              value={seatCapacityInput}
              onChange={(event) => setSeatCapacityInput(event.target.value)}
              type="number"
              min={1}
              max={9}
              placeholder="탑승 가능 인원"
              className="focus-ring h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-slate-800"
            />
            <button
              type="button"
              className="focus-ring h-11 w-full rounded-xl bg-[var(--primary)] text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              onClick={handleRegisterVehicle}
            >
              차량 저장
            </button>
            {currentUserVehicle && (
              <p className="text-xs text-slate-600">
                등록 차량: {currentUserVehicle.plateNumber} / 좌석 {currentUserVehicle.seatCapacity}석
              </p>
            )}
          </section>
        )}

        {rideOffers.map((offer) => {
          const driver = profiles.find((profile) => profile.id === offer.driverId);
          const vehicle = vehicles.find((item) => item.id === offer.vehicleId);
          if (!driver || !vehicle) return null;

          const localRequests = requests
            .filter((item) => item.offerId === offer.id)
            .sort((a, b) => a.queueOrder - b.queueOrder);

          return (
            <section key={offer.id} className="space-y-2">
              <RideOfferCard
                driverName={driver.name}
                plateNumber={vehicle.plateNumber}
                commuteTime={offer.commuteTime}
                remainingSeats={remainingSeats(offer, requests)}
                waitingCount={waitingCount(offer.id, requests)}
              />

              <button
                type="button"
                className="focus-ring h-11 w-full rounded-xl bg-[var(--cta)] text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-600"
                onClick={() => {
                  if (!currentUserId) return;
                  setRequests((prev) => autoPromoteWaiting(offer, createRequest(offer.id, currentUserId, prev)));
                }}
              >
                내가 탑승 신청
              </button>

              <ul className="card space-y-2 p-3">
                {localRequests.map((request) => {
                  const rider = profiles.find((profile) => profile.id === request.riderId);
                  return (
                    <li key={request.id} className="rounded-xl bg-slate-50 p-2">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{rider?.name}</span>
                        <span className="text-slate-500">
                          {requestStatusLabel[request.status]} / 대기순번 #{request.queueOrder}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className="focus-ring h-10 rounded-lg bg-emerald-600 text-xs font-semibold text-white"
                          onClick={() => applyStatusChange(request.id, "APPROVED", offer)}
                        >
                          승인
                        </button>
                        <button
                          type="button"
                          className="focus-ring h-10 rounded-lg bg-rose-600 text-xs font-semibold text-white"
                          onClick={() => applyStatusChange(request.id, "REJECTED", offer)}
                        >
                          거절
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <CommuteStatusList
          title="오늘 탑승 필요 인원"
          profiles={riderProfiles}
          attendanceLabels={attendanceLabels}
        />
        <CommuteStatusList
          title="오늘 비출근 인원"
          profiles={offDutyProfiles}
          attendanceLabels={attendanceLabels}
        />
      </main>
    </div>
  );
}
