import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WorkerTasksProvider, useWorkerTasksContext } from '../workerTasksContext';
import { useJoinWorkCells } from '../../workcell/hooks/useJoinWorkCells';
import { useLocationBroadcast } from '../hooks/useLocationBroadcast';
import { useSocket } from '../../../shared/hooks/useSocket';
import { workCellApiService } from '../../workcell/service/workCellApiService';
import AvailabilityToggle from '../components/AvailabilityToggle';
import WorkerTaskCard from '../components/WorkerTaskCard';
import NotificationBell from '../../notifications/components/NotificationBell';

function WorkerDashboardInner() {
  const { tasks, loading, isOnline, toggle, startTask, completeTask, reportIssue } = useWorkerTasksContext();
  const { socket, connected } = useSocket();
  const [activeWorkCellId, setActiveWorkCellId] = useState(null);

  const activeJobIds = useMemo(() => [...new Set(tasks.filter((t) => t.job?._id).map((t) => t.job._id))], [tasks]);
  useJoinWorkCells(activeJobIds);

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
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Link to="/worker/earnings" className="text-sm px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              💰 Earnings
            </Link>
            <AvailabilityToggle isOnline={isOnline} onToggle={toggle} />
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && tasks.length === 0 && (
          <p className="text-gray-400">No tasks assigned yet. {!isOnline && 'Go online to become eligible for new dispatch.'}</p>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <WorkerTaskCard key={task._id} task={task} onStart={startTask} onComplete={completeTask} onReportIssue={reportIssue} />
          ))}
        </div>
      </div>
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