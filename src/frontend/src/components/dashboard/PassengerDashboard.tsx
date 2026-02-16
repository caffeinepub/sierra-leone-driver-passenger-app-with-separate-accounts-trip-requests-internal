import TripRequestForm from '../trips/TripRequestForm';
import MyTripsPanel from '../trips/MyTripsPanel';

export default function PassengerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Request a Trip</h2>
        <TripRequestForm />
      </div>
      
      <div>
        <h2 className="section-title">My Trips</h2>
        <MyTripsPanel role="passenger" />
      </div>
    </div>
  );
}
