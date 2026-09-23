import { useState } from 'react';
import { CooperativeAdminProvider, useCooperativeAdminContext } from '../cooperativeAdmin';
import AnalyticsPanel from '../components/AnalyticsPanel';
import WorkerRosterTable from '../components/WorkerRosterRow';
import JobOversightTable from '../components/JobOversightTable';
import Navbar from '../../../shared/components/Navbar';

const TABS = [
  { key: 'roster', label: 'Worker Roster & Verification' },
  { key: 'jobs', label: 'Active Job Oversight' },
];

function AdminDashboardInner() {
  const { workers, jobs, analytics, loading, updateCapacity, toggleActive, verifyCertification } = useCooperativeAdminContext();
  const [tab, setTab] = useState('roster');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-5xl w-full mx-auto p-12 text-center text-sm text-[#8A909F]">
          <div className="inline-block w-6 h-6 border-2 border-[#B8861B] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading cooperative administration metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="mb-8 pb-6 border-b border-[#E8E5DE]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF9E8] border border-[#EED58C] text-[#80540B] text-[11px] font-bold uppercase tracking-wider mb-2">
            Cooperative Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0D] tracking-tight">
            Cooperative Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#596174] mt-1">
            Real-time analytics, fair dispatch oversight, worker capacity controls, and certification validation.
          </p>
        </div>

        <AnalyticsPanel analytics={analytics} />

        {/* Tab switcher */}
        <div className="flex gap-4 mb-6 border-b border-[#E8E5DE]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm pb-3 font-semibold transition-all cursor-pointer border-b-2 ${
                tab === t.key
                  ? 'border-[#B8861B] text-[#B8861B]'
                  : 'border-transparent text-[#596174] hover:text-[#101010]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'roster' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#101010]">
                Registered Cooperative Workers ({workers.length})
              </h2>
              <span className="text-xs text-[#596174]">Click to manage capacity & verify credentials</span>
            </div>
            {workers.map((worker) => (
              <WorkerRosterTable
                key={worker.user?._id || worker._id}
                worker={worker}
                onUpdateCapacity={updateCapacity}
                onToggleActive={toggleActive}
                onVerifyCert={verifyCertification}
              />
            ))}
            {workers.length === 0 && (
              <div className="p-8 text-center text-xs text-[#8A909F] bg-white border border-[#E8E5DE] rounded-2xl">
                No workers currently registered under this cooperative.
              </div>
            )}
          </div>
        )}

        {tab === 'jobs' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#101010]">
                Dispatch Oversight ({jobs.length})
              </h2>
            </div>
            <JobOversightTable jobs={jobs} />
          </div>
        )}
      </main>
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