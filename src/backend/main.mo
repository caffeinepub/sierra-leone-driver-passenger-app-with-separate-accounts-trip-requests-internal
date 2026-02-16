import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat64 "mo:core/Nat64";
import Int64 "mo:core/Int64";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // User Roles
  public type UserRole = AccessControl.UserRole;
  public type AccountType = {
    #driver;
    #passenger;
  };
  public type UserProfile = {
    accountType : AccountType;
    fullName : Text;
    phone : Text;
  };

  // Trip Types
  public type TripStatus = {
    #open;
    #accepted;
    #completed;
    #cancelled;
  };

  public type TripRequest = {
    id : Nat;
    passenger : Principal;
    driver : ?Principal;
    pickupLocation : Location;
    dropoffLocation : Location;
    status : TripStatus;
    fare : ?Nat;
    createdAt : Time.Time;
    acceptedAt : ?Time.Time;
    completedAt : ?Time.Time;
  };

  public type Location = {
    description : Text;
    latitude : ?Float;
    longitude : ?Float;
  };

  // Diamond Assessment Types
  public type DiamondRecord = {
    id : Nat;
    owner : Principal;
    createdAt : Time.Time;
    photoUrl : ?Text;
    carat : ?Float;
    estimatedValue : ?Nat;
    notes : Text;
  };

  public type DiamondRecordInput = {
    photoUrl : ?Text;
    carat : ?Float;
    estimatedValue : ?Nat;
    notes : Text;
  };

  public type BuyerPlatform = {
    name : Text;
    url : Text;
  };

  // Earnings and Payouts
  public type PayoutStatus = {
    #requested;
    #approved;
    #rejected;
    #paid;
  };

  public type PayoutRequest = {
    id : Nat;
    driver : Principal;
    amount : Nat;
    status : PayoutStatus;
    createdAt : Time.Time;
    processedAt : ?Time.Time;
  };

  // Custom Sorting Modules
  module TripRequest {
    public func compare(trip1 : TripRequest, trip2 : TripRequest) : Order.Order {
      Nat.compare(trip1.id, trip2.id);
    };

    public func compareByStatus(trip1 : TripRequest, trip2 : TripRequest) : Order.Order {
      switch (Text.compare(debug_show (trip1.status), debug_show (trip2.status))) {
        case (#equal) { compare(trip1, trip2) };
        case (order) { order };
      };
    };
  };

  module PayoutRequest {
    public func compare(payout1 : PayoutRequest, payout2 : PayoutRequest) : Order.Order {
      Nat.compare(payout1.id, payout2.id);
    };

    public func compareByStatus(payout1 : PayoutRequest, payout2 : PayoutRequest) : Order.Order {
      switch (Text.compare(debug_show (payout1.status), debug_show (payout2.status))) {
        case (#equal) { compare(payout1, payout2) };
        case (order) { order };
      };
    };
  };

  // Initialize access control state and authorization mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent State
  var nextDiamondId = 1;
  var nextTripId = 1;
  var nextPayoutId = 1;

  let diamondRecords = Map.empty<Nat, DiamondRecord>();
  let users = Map.empty<Principal, UserProfile>();
  let activeTrips = Map.empty<Nat, TripRequest>();
  let tripHistory = List.empty<TripRequest>();
  let driverEarnings = Map.empty<Principal, Nat>();
  let payoutRequests = Map.empty<Nat, PayoutRequest>();

  // Buyer Platforms (hardcoded for now)
  let buyerPlatforms = [
    {
      name = "Blue Nile";
      url = "https://www.bluenile.com";
    },
    {
      name = "James Allen";
      url = "https://www.jamesallen.com";
    },
    {
      name = "Etsy";
      url = "https://www.etsy.com";
    },
    {
      name = "WP Diamonds";
      url = "https://www.wpdiamonds.com";
    },
  ];

  // User Management
  public shared ({ caller }) func registerUser(accountType : AccountType, fullName : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };
    if (users.containsKey(caller)) {
      Runtime.trap("User already registered");
    };
    let profile : UserProfile = {
      accountType;
      fullName;
      phone;
    };
    users.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    users.add(caller, profile);
  };

  public shared ({ caller }) func updateProfile(fullName : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          accountType = profile.accountType;
          fullName;
          phone;
        };
        users.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getAllDrivers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view drivers");
    };
    let allUsers = users.entries().toArray();
    allUsers.filter<(Principal, UserProfile)>(
      func((p, u)) { u.accountType == #driver }
    );
  };

  // Trip Management (Passenger)
  public shared ({ caller }) func createTripRequest(pickup : Location, dropoff : Location, fare : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create trip requests");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        if (profile.accountType != #passenger) {
          Runtime.trap("Only passengers can create trip requests");
        };
        let tripId = nextTripId;
        nextTripId += 1;
        let trip : TripRequest = {
          id = tripId;
          passenger = caller;
          driver = null;
          pickupLocation = pickup;
          dropoffLocation = dropoff;
          status = #open;
          fare = ?fare;
          createdAt = Time.now();
          acceptedAt = null;
          completedAt = null;
        };
        activeTrips.add(tripId, trip);
        tripId;
      };
    };
  };

  public query ({ caller }) func getOpenTrips() : async [TripRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view open trips");
    };
    activeTrips.values().toArray().filter<TripRequest>(
      func(trip) { trip.status == #open }
    );
  };

  // Trip Management (Driver)
  public shared ({ caller }) func acceptTrip(tripId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept trips");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        if (profile.accountType != #driver) {
          Runtime.trap("Only drivers can accept trips");
        };
        switch (activeTrips.get(tripId)) {
          case (null) { Runtime.trap("Trip not found") };
          case (?trip) {
            if (trip.status != #open) {
              Runtime.trap("Trip is no longer available");
            };
            let updatedTrip : TripRequest = {
              trip with
              driver = ?caller;
              status = #accepted;
              acceptedAt = ?Time.now();
            };
            activeTrips.add(tripId, updatedTrip);
          };
        };
      };
    };
  };

  public shared ({ caller }) func completeTrip(tripId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete trips");
    };
    switch (activeTrips.get(tripId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        let driverId = getDriver(trip);
        if (caller != trip.passenger and caller != driverId) {
          Runtime.trap("Unauthorized: Only the passenger or driver can complete this trip");
        };
        if (trip.status != #accepted) {
          Runtime.trap("Trip is not in an accepted state");
        };

        let finalFare = switch (trip.fare) {
          case (null) { Runtime.trap("Fare must be specified") };
          case (?f) { f };
        };

        let updatedTrip : TripRequest = {
          trip with
          status = #completed;
          fare = ?finalFare;
          completedAt = ?Time.now();
        };

        if (tripIsComplete(updatedTrip)) {
          activeTrips.remove(tripId);

          tripHistory.add(updatedTrip);

          // Update driver earnings
          let currentEarnings = switch (driverEarnings.get(driverId)) {
            case (null) { 0 };
            case (?amount) { amount };
          };
          driverEarnings.add(driverId, currentEarnings + finalFare);
        } else {
          Runtime.trap("Trip must have fare and driver to complete");
        };
      };
    };
  };

  public query ({ caller }) func getPassengerTrips(passenger : Principal) : async [TripRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trips");
    };
    if (caller != passenger and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own trips");
    };
    let activeTripsArray = activeTrips.values().toArray().filter(
      func(trip) {
        trip.passenger == passenger;
      }
    );
    let historyArray = tripHistory.toArray().filter(
      func(trip) {
        trip.passenger == passenger;
      }
    );
    activeTripsArray.concat(historyArray);
  };

  public query ({ caller }) func getDriverTrips(driver : Principal) : async [TripRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trips");
    };
    if (caller != driver and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own trips");
    };
    let activeTripsArray = activeTrips.values().toArray().filter(
      func(trip) {
        switch (trip.driver) {
          case (?d) { d == driver };
          case (null) { false };
        };
      }
    );
    let historyArray = tripHistory.toArray().filter(
      func(trip) {
        switch (trip.driver) {
          case (?d) { d == driver };
          case (null) { false };
        };
      }
    );
    activeTripsArray.concat(historyArray);
  };

  public shared ({ caller }) func cancelTrip(tripId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel trips");
    };
    switch (activeTrips.get(tripId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        if (caller != trip.passenger) {
          Runtime.trap("Unauthorized: Only the passenger can cancel this trip");
        };
        let updatedTrip : TripRequest = {
          trip with
          status = #cancelled;
        };
        activeTrips.add(tripId, updatedTrip);
      };
    };
  };

  // Payout Management
  public shared ({ caller }) func requestPayout(amount : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request payouts");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        if (profile.accountType != #driver) {
          Runtime.trap("Only drivers can request payouts");
        };
        let currentEarnings = switch (driverEarnings.get(caller)) {
          case (null) { 0 };
          case (?balance) { balance };
        };
        if (currentEarnings < amount) {
          Runtime.trap("Insufficient earnings");
        };

        let payoutId = nextPayoutId;
        nextPayoutId += 1;
        let payout : PayoutRequest = {
          id = payoutId;
          driver = caller;
          amount;
          status = #requested;
          createdAt = Time.now();
          processedAt = null;
        };

        driverEarnings.add(caller, currentEarnings - amount);
        payoutRequests.add(payoutId, payout);
        payoutId;
      };
    };
  };

  public query ({ caller }) func getDriverEarnings() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view earnings");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) {
        if (profile.accountType != #driver) {
          Runtime.trap("Only drivers can view earnings");
        };
        switch (driverEarnings.get(caller)) {
          case (null) { 0 };
          case (?balance) { balance };
        };
      };
    };
  };

  public query ({ caller }) func getPayoutHistory() : async [PayoutRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payout history");
    };
    payoutRequests.values().toArray().filter<PayoutRequest>(
      func(request) {
        request.driver == caller;
      }
    );
  };

  public query ({ caller }) func getPendingPayouts() : async [PayoutRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending payouts");
    };
    payoutRequests.values().toArray().filter<PayoutRequest>(
      func(request) {
        request.status == #requested;
      }
    );
  };

  public shared ({ caller }) func updatePayoutStatus(payoutId : Nat, newStatus : PayoutStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update payout status");
    };
    switch (payoutRequests.get(payoutId)) {
      case (null) { Runtime.trap("Payout request not found") };
      case (?payout) {
        let updatedPayout : PayoutRequest = {
          payout with
          status = newStatus;
          processedAt = ?Time.now();
        };
        payoutRequests.add(payoutId, updatedPayout);
      };
    };
  };

  public query ({ caller }) func getTrip(tripId : Nat) : async ?TripRequest {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trips");
    };
    switch (activeTrips.get(tripId)) {
      case (null) {
        // Try to find the trip in history
        switch (findTripInHistory(tripHistory, tripId)) {
          case (null) { null };
          case (?trip) {
            assertTripBelongsToUser(caller, trip);
            ?trip;
          };
        };
      };
      case (?trip) {
        assertTripBelongsToUser(caller, trip);
        ?trip;
      };
    };
  };

  // Diamond Assessment (Backend only)
  public shared ({ caller }) func createDiamondRecord(input : DiamondRecordInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to create a diamond record");
    };

    let diamondId = nextDiamondId;
    nextDiamondId += 1;

    let newRecord : DiamondRecord = {
      id = diamondId;
      owner = caller;
      createdAt = Time.now();
      photoUrl = input.photoUrl;
      carat = input.carat;
      estimatedValue = input.estimatedValue;
      notes = input.notes;
    };

    diamondRecords.add(diamondId, newRecord);
    diamondId;
  };

  public query ({ caller }) func getDiamondRecord(recordId : Nat) : async ?DiamondRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to view your records");
    };

    switch (diamondRecords.get(recordId)) {
      case (null) { null };
      case (?record) {
        if (record.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?record;
        } else {
          null;
        };
      };
    };
  };

  public shared ({ caller }) func updateDiamondRecord(recordId : Nat, input : DiamondRecordInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to update your records");
    };

    switch (diamondRecords.get(recordId)) {
      case (null) { Runtime.trap("Diamond record not found") };
      case (?record) {
        if (record.owner != caller) {
          Runtime.trap("Unauthorized: Only the owner can update this record");
        };

        let updatedRecord : DiamondRecord = {
          record with
          photoUrl = input.photoUrl;
          carat = input.carat;
          estimatedValue = input.estimatedValue;
          notes = input.notes;
        };

        diamondRecords.add(recordId, updatedRecord);
      };
    };
  };

  public query ({ caller }) func getMyDiamondRecords() : async [DiamondRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to view your records");
    };
    diamondRecords.values().toArray().filter<DiamondRecord>(
      func(record) { record.owner == caller }
    );
  };

  public query ({ caller }) func getBuyerPlatforms() : async [BuyerPlatform] {
    buyerPlatforms;
  };

  public query ({ caller }) func generateDiamondSummary(recordId : Nat) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be authenticated to generate summaries");
    };

    switch (diamondRecords.get(recordId)) {
      case (null) { null };
      case (?record) {
        if (record.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner can generate a summary for this record");
        };

        let summary = switch (record.carat, record.estimatedValue) {
          case (null, null) {
            "Diamond Record ID " # record.id.toText() # " with no details available";
          };
          case (?carat, null) {
            "Diamond Record ID " # record.id.toText() # " with carat: " # Float.toText(carat) # " has an undetermined value";
          };
          case (null, ?value) {
            "Diamond Record ID " # record.id.toText() # " with unknown carat has an estimated value of " # value.toText();
          };
          case (?carat, ?value) {
            "Diamond Record ID " # record.id.toText() # " with carat: " # Float.toText(carat) # " has an estimated value of " # value.toText();
          };
        };
        ?summary;
      };
    };
  };

  // Helper functions
  func findTripInHistory(tripList : List.List<TripRequest>, tripId : Nat) : ?TripRequest {
    var foundTrip : ?TripRequest = null;
    for (trip in tripList.values()) {
      if (trip.id == tripId) {
        foundTrip := ?trip;
      };
    };
    foundTrip;
  };

  func getDriver(trip : TripRequest) : Principal {
    switch (trip.driver) {
      case (null) { Runtime.trap("Trip must have a driver") };
      case (?d) { d };
    };
  };

  func tripIsComplete(trip : TripRequest) : Bool {
    switch (trip.driver, trip.fare) {
      case (?_, ?_) { true };
      case (_) { false };
    };
  };

  // Authorization helper
  func assertTripBelongsToUser(user : Principal, trip : TripRequest) {
    let isPassenger = user == trip.passenger;
    let isDriver = switch (trip.driver) {
      case (?d) { user == d };
      case (null) { false };
    };
    let isAdmin = AccessControl.isAdmin(accessControlState, user);

    if (not (isPassenger or isDriver or isAdmin)) {
      Runtime.trap("Unauthorized: You do not have access to this trip");
    };
  };

  // Admin functions
  public shared ({ caller }) func adminUpdateTripStatus(tripId : Nat, status : TripStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (activeTrips.get(tripId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        let updatedTrip : TripRequest = {
          trip with
          status;
        };
        activeTrips.add(tripId, updatedTrip);
      };
    };
  };
};
