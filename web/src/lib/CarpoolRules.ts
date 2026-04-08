import { AttendanceType, ParityMode, Profile, RideOffer, RideRequest, Vehicle } from "@/lib/CarpoolTypes";

export const isOffDuty = (attendance: AttendanceType): boolean => attendance !== "ON_DUTY";

export const dateParity = (date: Date): "ODD" | "EVEN" => (date.getDate() % 2 === 0 ? "EVEN" : "ODD");

export const isVehicleAllowedByParity = (vehicle: Vehicle, mode: ParityMode, date: Date): boolean => {
  if (mode === "ALL_ALLOWED") return true;
  if (mode === "NONE_ALLOWED") return false;

  const parity = mode === "ODD_ONLY" || mode === "EVEN_ONLY"
    ? mode.replace("_ONLY", "")
    : dateParity(date);
  const vehicleParity = vehicle.plateLastDigit % 2 === 0 ? "EVEN" : "ODD";

  return parity === vehicleParity;
};

export const canDriveToday = (profile: Profile, vehicle: Vehicle | undefined, mode: ParityMode, date: Date): boolean =>
  !isOffDuty(profile.attendanceType) && !!vehicle && isVehicleAllowedByParity(vehicle, mode, date);

export const needsRideToday = (profile: Profile, canDrive: boolean): boolean =>
  !isOffDuty(profile.attendanceType) && !canDrive;

export const approvedCount = (offerId: string, requests: RideRequest[]): number =>
  requests.filter((r) => r.offerId === offerId && r.status === "APPROVED").length;

export const waitingCount = (offerId: string, requests: RideRequest[]): number =>
  requests.filter((r) => r.offerId === offerId && r.status === "WAITING").length;

export const remainingSeats = (offer: RideOffer, requests: RideRequest[]): number =>
  Math.max(offer.seatCapacity - approvedCount(offer.id, requests), 0);
