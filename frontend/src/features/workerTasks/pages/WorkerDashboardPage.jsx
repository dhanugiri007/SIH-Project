import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WorkerTasksProvider, useWorkerTasksContext } from '../workerTasksContext';
import { useJoinWorkCells } from '../../workcell/hooks/useJoinWorkCells';
import { useLocationBroadcast } from '../hooks/useLocationBroadcast';
import { useLocationPing } from '../hooks/useLocationPing';
import { useSocket } from '../../../shared/hooks/useSocket';
import { workCellApiService } from '../../workcell/service/workCellApiService';
import AvailabilityToggle from '../components/AvailabilityToggle';
import WorkerTaskCard from '../components/WorkerTaskCard';
import Navbar from '../../../shared/components/Navbar';

function WorkerDashboardInner() {
  const { tasks, loading, isOnline, toggle, startTask, completeTask, reportIssue } = useWorkerTasksContext();
  const { socket, connected } = useSocket();
  const [activeWorkCellId, setActiveWorkCellId] = useState(null);

  const activeJobIds = useMemo(() => [...new Set(tasks.filter((t) => t.job?._id).map((t) => t.job._id))], [tasks]);
  useJoinWorkCells(activeJobIds);
  useLocationPing(isOnline);

  const inProgressTask = tasks.find((t) => t.status === 'in_progress');

  useEffect(() => {
    if (!inProgressTask?.job?._id) {
      setActiveWorkCellId(null);
      return;
    }
    workCellApiService.getByJob(inProgressTask.job._id).then((wc) => setActiveWorkCellId(wc?._id || null)).catch(() => {});
  }, [inProgressTask?.job?._id]);

  useLocationBroadcast(socket, connected, activeWorkCellId, Boolean(inProgressTask));

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E5DE]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF9E8] border border-[#EED58C] text-[#80540B] text-[11px] font-bold uppercase tracking-wider mb-2">
              Worker Partner Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0D] tracking-tight">
              My Assigned Tasks
            </h1>
            <p className="text-xs sm:text-sm text-[#596174] mt-1">
              Real-time cooperative dispatch queue, active task routing, and completion verification.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <Link
              to="/worker/earnings"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#E8E5DE] bg-white text-[#101010] hover:border-[#D5A63A] hover:bg-[#FAF9F6] transition-colors shadow-sm"
            >
              💰 Earnings
            </Link>
            <Link
              to="/worker/settings"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#E8E5DE] bg-white text-[#101010] hover:border-[#D5A63A] hover:bg-[#FAF9F6] transition-colors shadow-sm"
            >
              ⚙️ Preferences
            </Link>
            <AvailabilityToggle isOnline={isOnline} onToggle={toggle} />
          </div>
        </div>

        {loading && (
          <div className="p-12 text-center text-sm text-[#8A909F]">
            <div className="inline-block w-6 h-6 border-2 border-[#B8861B] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading assigned tasks...</p>
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="p-10 border border-[#E8E5DE] rounded-2xl bg-white text-center shadow-sahyog-card">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF9E8] border border-[#EED58C] flex items-center justify-center text-[#B8861B] mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-[#0A0A0D]">Queue is clear</h2>
            <p className="text-xs text-[#596174] mt-1 max-w-sm mx-auto">
              {!isOnline
                ? 'You are currently offline. Switch status to "Online for Dispatch" above to receive tasks in your skill category.'
                : 'No tasks currently assigned. Sahyog Flow is continuously matching jobs based on your location and availability windows.'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {tasks.map((task) => (
            <WorkerTaskCard
              key={task._id}
              task={task}
              onStart={startTask}
              onComplete={completeTask}
              onReportIssue={reportIssue}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function WorkerDashboardPage() {
  return (
    <WorkerTasksProvider>
      <WorkerDashboardInner />
    </WorkerTasksProvider>
  );
}