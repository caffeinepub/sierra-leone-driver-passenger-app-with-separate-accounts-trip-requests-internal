import DriverEarningsCard from './DriverEarningsCard';
import PayoutRequestForm from './PayoutRequestForm';
import PayoutHistoryTable from './PayoutHistoryTable';

export default function DriverPayoutsPanel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DriverEarningsCard />
        <PayoutRequestForm />
      </div>
      
      <PayoutHistoryTable />
    </div>
  );
}
