export type AttendanceType = "ON_DUTY" | "VACATION" | "OFF" | "PERSONAL_LEAVE" | "BUSINESS_TRIP";
export type ParityMode = "ODD_ONLY" | "EVEN_ONLY" | "ALL_ALLOWED" | "NONE_ALLOWED";
export type RequestStatus = "WAITING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Vehicle {
  id: string;
  ownerId: string;
  plateNumber: string;
  plateLastDigit: number;
  seatCapacity: number;
}

export interface Profile {
  id: string;
  name: string;
  hasVehicle: boolean;
  attendanceType: AttendanceType;
  commuteTime?: string;
}

export interface RideOffer {
  id: string;
  day: string;
  driverId: string;
  vehicleId: string;
  commuteTime: string;
  seatCapacity: number;
}

export interface RideRequest {
  id: string;
  offerId: string;
  riderId: string;
  status: RequestStatus;
  queueOrder: number;
}
