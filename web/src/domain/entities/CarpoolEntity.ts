export type AttendanceStatus = "ON_DUTY" | "VACATION" | "OFF" | "PERSONAL_LEAVE" | "BUSINESS_TRIP";
export type ParityPolicy = "ODD_ONLY" | "EVEN_ONLY" | "ALL_ALLOWED" | "NONE_ALLOWED";

export interface UserEntity {
  id: string;
  name: string;
  attendanceStatus: AttendanceStatus;
}

export interface VehicleEntity {
  id: string;
  ownerId: string;
  plateLastDigit: number;
}
