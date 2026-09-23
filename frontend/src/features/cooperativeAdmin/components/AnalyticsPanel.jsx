import StatCard from './StatCard';

export default function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <StatCard label="Active Workers" value={`${analytics.onlineWorkerCount}/${analytics.workerCount}`} color="indigo" />
      <StatCard label="Fill Rate" value={`${analytics.fillRate}%`} color="emerald" />
      <StatCard label="Avg Dispatch Time" value={`${analytics.avgDispatchMinutes}m`} color="violet" />
      <StatCard label="Tasks Completed" value={analytics.completedTasks} color="amber" />
      <StatCard label="Earnings Distributed" value={`₹${analytics.totalEarningsDistributed}`} color="emerald" />
      <StatCard label="Commission Earned" value={`₹${analytics.totalCommissionEarned}`} color="indigo" />
    </div>
  );
}