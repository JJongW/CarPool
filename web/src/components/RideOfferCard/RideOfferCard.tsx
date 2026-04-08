import { StatusBadge } from "@/components/StatusBadge/StatusBadge";

interface RideOfferCardProps {
  driverName: string;
  plateNumber: string;
  commuteTime: string;
  remainingSeats: number;
  waitingCount: number;
}

export function RideOfferCard({
  driverName,
  plateNumber,
  commuteTime,
  remainingSeats,
  waitingCount,
}: RideOfferCardProps) {
  return (
    <article className="card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">{driverName}</h3>
        <StatusBadge label={remainingSeats > 0 ? "신청 가능" : "대기만 가능"} tone={remainingSeats > 0 ? "success" : "warning"} />
      </div>
      <p className="text-sm text-slate-600">차량 {plateNumber}</p>
      <p className="mt-1 text-sm text-slate-600">출근시간 {commuteTime}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>잔여 좌석 {remainingSeats}석</span>
        <span>대기 {waitingCount}명</span>
      </div>
      <button
        type="button"
        className="focus-ring mt-3 h-11 w-full rounded-xl bg-[var(--primary)] text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
      >
        탑승 신청
      </button>
    </article>
  );
}
