import OpenTripsList from '../trips/OpenTripsList';
import MyTripsPanel from '../trips/MyTripsPanel';

export default function DriverDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Available Trips</h2>
        <OpenTripsList />
      </div>
      
      <div>
        <h2 className="section-title">My Accepted Trips</h2>
        <MyTripsPanel role="driver" />
      </div>
    </div>
  );
}
