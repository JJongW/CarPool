import { CommutePolicy } from "@/domain/services/CommutePolicy";
import { ParityPolicy, UserEntity, VehicleEntity } from "@/domain/entities/CarpoolEntity";

interface Input {
  users: UserEntity[];
  vehicles: VehicleEntity[];
  date: Date;
  parityPolicy: ParityPolicy;
}

export class GetTodayBoardUseCase {
  execute(input: Input) {
    return input.users.map((user) => {
      const vehicle = input.vehicles.find((item) => item.ownerId === user.id);
      const canDrive = CommutePolicy.canDrive(user, vehicle, input.parityPolicy);
      return {
        userId: user.id,
        canDrive,
        needsRide: !CommutePolicy.isOffDuty(user.attendanceStatus) && !canDrive,
        offDuty: CommutePolicy.isOffDuty(user.attendanceStatus),
      };
    });
  }
}
