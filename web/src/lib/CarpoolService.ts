import { Profile, RideOffer, RideRequest, Vehicle } from "@/lib/CarpoolTypes";
import { canDriveToday, isOffDuty } from "@/lib/CarpoolRules";

export interface DashboardState {
  profiles: Profile[];
  vehicles: Vehicle[];
  offers: RideOffer[];
  requests: RideRequest[];
}

export const classifyProfiles = (
  profiles: Profile[],
  vehicles: Vehicle[],
  mode: "ODD_ONLY" | "EVEN_ONLY",
  date: Date,
) => {
  return profiles.map((profile) => {
    const vehicle = vehicles.find((item) => item.ownerId === profile.id);
    const canDrive = canDriveToday(profile, vehicle, mode, date);
    const offDuty = isOffDuty(profile.attendanceType);
    return {
      profile,
      canDrive,
      needsRide: !offDuty && !canDrive,
      offDuty,
    };
  });
};

export const nextQueueOrder = (offerId: string, requests: RideRequest[]): number => {
  const maxOrder = requests
    .filter((item) => item.offerId === offerId)
    .reduce((max, item) => Math.max(max, item.queueOrder), 0);
  return maxOrder + 1;
};

export const createRequest = (
  offerId: string,
  riderId: string,
  requests: RideRequest[],
): RideRequest[] => {
  const exists = requests.find(
    (item) =>
      item.offerId === offerId &&
      item.riderId === riderId &&
      (item.status === "WAITING" || item.status === "APPROVED"),
  );
  if (exists) return requests;

  const newRequest: RideRequest = {
    id: crypto.randomUUID(),
    offerId,
    riderId,
    status: "WAITING",
    queueOrder: nextQueueOrder(offerId, requests),
  };
  return [...requests, newRequest];
};

export const updateRequestStatus = (
  requestId: string,
  status: RideRequest["status"],
  requests: RideRequest[],
): RideRequest[] => {
  return requests.map((item) => (item.id === requestId ? { ...item, status } : item));
};

export const autoPromoteWaiting = (offer: RideOffer, requests: RideRequest[]): RideRequest[] => {
  const approvedCount = requests.filter(
    (item) => item.offerId === offer.id && item.status === "APPROVED",
  ).length;
  const availableSeats = offer.seatCapacity - approvedCount;
  if (availableSeats <= 0) return requests;

  const waitingCandidates = requests
    .filter((item) => item.offerId === offer.id && item.status === "WAITING")
    .sort((a, b) => a.queueOrder - b.queueOrder)
    .slice(0, availableSeats);

  const promotedIds = new Set(waitingCandidates.map((item) => item.id));
  return requests.map((item) =>
    promotedIds.has(item.id) ? { ...item, status: "APPROVED" } : item,
  );
};
