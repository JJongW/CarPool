import { Profile, RideOffer, RideRequest, Vehicle } from "@/lib/CarpoolTypes";

export const today = new Date().toISOString().slice(0, 10);

export const profiles: Profile[] = [
  { id: "u1", name: "김운전자", hasVehicle: true, attendanceType: "ON_DUTY", commuteTime: "07:30" },
  { id: "u2", name: "박지원", hasVehicle: true, attendanceType: "VACATION" },
  { id: "u3", name: "이대기", hasVehicle: false, attendanceType: "ON_DUTY" },
  { id: "u4", name: "최탑승", hasVehicle: true, attendanceType: "ON_DUTY" },
];

export const vehicles: Vehicle[] = [
  { id: "v1", ownerId: "u1", plateNumber: "12가3457", plateLastDigit: 7, seatCapacity: 3 },
  { id: "v2", ownerId: "u4", plateNumber: "45나8812", plateLastDigit: 2, seatCapacity: 2 },
];

export const rideOffers: RideOffer[] = [
  { id: "o1", day: today, driverId: "u1", vehicleId: "v1", commuteTime: "07:30", seatCapacity: 3 },
];

export const rideRequests: RideRequest[] = [
  { id: "r1", offerId: "o1", riderId: "u3", status: "APPROVED", queueOrder: 1 },
  { id: "r2", offerId: "o1", riderId: "u4", status: "WAITING", queueOrder: 2 },
];
