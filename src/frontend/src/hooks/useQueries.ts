import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, TripRequest, Location, AccountType, PayoutRequest, DiamondRecord, DiamondRecordInput, BuyerPlatform } from '../backend';

// User Profile Hooks
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountType, fullName, phone }: { accountType: AccountType; fullName: string; phone: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(accountType, fullName, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fullName, phone }: { fullName: string; phone: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProfile(fullName, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Trip Hooks
export function useCreateTripRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pickup, dropoff, fare }: { pickup: Location; dropoff: Location; fare: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTripRequest(pickup, dropoff, fare);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passengerTrips'] });
      queryClient.invalidateQueries({ queryKey: ['openTrips'] });
    },
  });
}

export function useGetOpenTrips() {
  const { actor, isFetching } = useActor();

  return useQuery<TripRequest[]>({
    queryKey: ['openTrips'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOpenTrips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPassengerTrips() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TripRequest[]>({
    queryKey: ['passengerTrips', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getPassengerTrips(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetDriverTrips() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TripRequest[]>({
    queryKey: ['driverTrips', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getDriverTrips(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAcceptTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptTrip(tripId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['openTrips'] });
      queryClient.invalidateQueries({ queryKey: ['driverTrips'] });
    },
  });
}

export function useCancelTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelTrip(tripId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passengerTrips'] });
      queryClient.invalidateQueries({ queryKey: ['openTrips'] });
    },
  });
}

export function useCompleteTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeTrip(tripId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverTrips'] });
      queryClient.invalidateQueries({ queryKey: ['passengerTrips'] });
      queryClient.invalidateQueries({ queryKey: ['driverEarnings'] });
    },
  });
}

// Earnings and Payout Hooks
export function useGetDriverEarnings() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['driverEarnings'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getDriverEarnings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPayoutHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<PayoutRequest[]>({
    queryKey: ['payoutHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPayoutHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestPayout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestPayout(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverEarnings'] });
      queryClient.invalidateQueries({ queryKey: ['payoutHistory'] });
    },
  });
}

// Diamond Assessment Hooks
export function useGetMyDiamondRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<DiamondRecord[]>({
    queryKey: ['myDiamondRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyDiamondRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDiamondRecord() {
  const { actor, isFetching } = useActor();

  return useMutation({
    mutationFn: async (recordId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDiamondRecord(recordId);
    },
  });
}

export function useCreateDiamondRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DiamondRecordInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDiamondRecord(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDiamondRecords'] });
    },
  });
}

export function useUpdateDiamondRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recordId, input }: { recordId: bigint; input: DiamondRecordInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDiamondRecord(recordId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDiamondRecords'] });
    },
  });
}

export function useGenerateDiamondSummary() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (recordId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateDiamondSummary(recordId);
    },
  });
}

// Buyer Platforms Hooks
export function useGetBuyerPlatforms() {
  const { actor, isFetching } = useActor();

  return useQuery<BuyerPlatform[]>({
    queryKey: ['buyerPlatforms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBuyerPlatforms();
    },
    enabled: !!actor && !isFetching,
  });
}
