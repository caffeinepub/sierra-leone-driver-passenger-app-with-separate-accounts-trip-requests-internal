import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    latitude?: number;
    description: string;
    longitude?: number;
}
export interface DiamondRecordInput {
    carat?: number;
    photoUrl?: string;
    notes: string;
    estimatedValue?: bigint;
}
export type Time = bigint;
export interface BuyerPlatform {
    url: string;
    name: string;
}
export interface PayoutRequest {
    id: bigint;
    status: PayoutStatus;
    createdAt: Time;
    processedAt?: Time;
    amount: bigint;
    driver: Principal;
}
export interface TripRequest {
    id: bigint;
    status: TripStatus;
    completedAt?: Time;
    passenger: Principal;
    dropoffLocation: Location;
    fare?: bigint;
    createdAt: Time;
    acceptedAt?: Time;
    driver?: Principal;
    pickupLocation: Location;
}
export interface DiamondRecord {
    id: bigint;
    owner: Principal;
    carat?: number;
    createdAt: Time;
    photoUrl?: string;
    notes: string;
    estimatedValue?: bigint;
}
export interface UserProfile {
    fullName: string;
    accountType: AccountType;
    phone: string;
}
export enum AccountType {
    passenger = "passenger",
    driver = "driver"
}
export enum PayoutStatus {
    requested = "requested",
    paid = "paid",
    approved = "approved",
    rejected = "rejected"
}
export enum TripStatus {
    cancelled = "cancelled",
    open = "open",
    completed = "completed",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptTrip(tripId: bigint): Promise<void>;
    adminUpdateTripStatus(tripId: bigint, status: TripStatus): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelTrip(tripId: bigint): Promise<void>;
    completeTrip(tripId: bigint): Promise<void>;
    createDiamondRecord(input: DiamondRecordInput): Promise<bigint>;
    createTripRequest(pickup: Location, dropoff: Location, fare: bigint): Promise<bigint>;
    generateDiamondSummary(recordId: bigint): Promise<string | null>;
    getAllDrivers(): Promise<Array<[Principal, UserProfile]>>;
    getBuyerPlatforms(): Promise<Array<BuyerPlatform>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDiamondRecord(recordId: bigint): Promise<DiamondRecord | null>;
    getDriverEarnings(): Promise<bigint>;
    getDriverTrips(driver: Principal): Promise<Array<TripRequest>>;
    getMyDiamondRecords(): Promise<Array<DiamondRecord>>;
    getOpenTrips(): Promise<Array<TripRequest>>;
    getPassengerTrips(passenger: Principal): Promise<Array<TripRequest>>;
    getPayoutHistory(): Promise<Array<PayoutRequest>>;
    getPendingPayouts(): Promise<Array<PayoutRequest>>;
    getTrip(tripId: bigint): Promise<TripRequest | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(accountType: AccountType, fullName: string, phone: string): Promise<void>;
    requestPayout(amount: bigint): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDiamondRecord(recordId: bigint, input: DiamondRecordInput): Promise<void>;
    updatePayoutStatus(payoutId: bigint, newStatus: PayoutStatus): Promise<void>;
    updateProfile(fullName: string, phone: string): Promise<void>;
}
