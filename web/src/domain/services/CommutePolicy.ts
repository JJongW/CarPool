import { AttendanceStatus, ParityPolicy, UserEntity, VehicleEntity } from "@/domain/entities/CarpoolEntity";

export class CommutePolicy {
  static isOffDuty(status: AttendanceStatus): boolean {
    return status !== "ON_DUTY";
  }

  static isVehicleAllowed(vehicle: VehicleEntity, policy: ParityPolicy): boolean {
    if (policy === "ALL_ALLOWED") return true;
    if (policy === "NONE_ALLOWED") return false;

    const required = policy === "ODD_ONLY" ? 1 : 0;
    return vehicle.plateLastDigit % 2 === required;
  }

  static canDrive(user: UserEntity, vehicle: VehicleEntity | undefined, policy: ParityPolicy): boolean {
    if (this.isOffDuty(user.attendanceStatus)) return false;
    if (!vehicle) return false;
    return this.isVehicleAllowed(vehicle, policy);
  }
}
