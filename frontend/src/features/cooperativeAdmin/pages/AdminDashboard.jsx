import { useState } from 'react';
import { CooperativeAdminProvider, useCooperativeAdminContext } from '../cooperativeAdmin';
import AnalyticsPanel from '../components/AnalyticsPanel';
import WorkerRosterTable from '../components/WorkerRosterRow';
import JobOversightTable from '../components/JobOversightTable';
import NotificationBell from '../../notification//components/Notification';

const TABS = [
  { key: 'roster', label: 'Worker Roster' },
  { key: 'jobs', label: 'Job Oversight' },
];

function AdminDashboardInner() {
  const { workers, jobs, analytics, loading, updateCapacity, toggleActive, verifyCertification } = useCooperativeAdminContext();
  const [tab, setTab] = useState('roster');

  if (loading) return <div className="p-10 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Cooperative Dashboard</h1>
          <NotificationBell />
        </div>

        <AnalyticsPanel analytics={analytics} />

        <div className="flex gap-2 mb-4 border-b border-gray-100">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm px-4 py-2 border-b-2 transition-colors ${
                tab === t.key ? 'border-indigo-600 text-indigo-600 font-medium' : 'border-transparent text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'roster' && (
          <WorkerRosterTable
            workers={workers}
            onUpdateCapacity={updateCapacity}
            onToggleActive={toggleActive}
            onVerifyCert={verifyCertification}
          />
        )}
        {tab === 'jobs' && <JobOversightTable jobs={jobs} />}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <CooperativeAdminProvider>
      <AdminDashboardInner />
    </CooperativeAdminProvider>
  );
}