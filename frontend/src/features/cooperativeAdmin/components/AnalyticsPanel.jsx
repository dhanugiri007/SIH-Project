import StatCard from './StatCard';

export default function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-8">
      <StatCard
        label="Online Workers"
        value={`${analytics.onlineWorkerCount} / ${analytics.workerCount}`}
        subtext="Active in dispatch pool"
      />
      <StatCard
        label="Fill Rate"
        value={`${analytics.fillRate}%`}
        subtext="Successful match ratio"
      />
      <StatCard
        label="Avg Dispatch Latency"
        value={`${analytics.avgDispatchMinutes} min`}
        subtext="Greedy solver turnaround"
      />
      <StatCard
        label="Tasks Completed"
        value={analytics.completedTasks}
        subtext="Verified work delivered"
      />
      <StatCard
        label="Worker Payouts"
        value={`₹${analytics.totalEarningsDistributed}`}
        subtext="Direct cooperative income"
      />
      <StatCard
        label="Cooperative Reserve"
        value={`₹${analytics.totalCommissionEarned}`}
        subtext="Platform operational fund"
      />
    </div>
  );
}