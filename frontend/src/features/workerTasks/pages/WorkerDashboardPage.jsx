import { useMemo } from 'react';
import { WorkerTasksProvider, useWorkerTasksContext } from '../workerTasksContext';
import { useJoinWorkCells } from '../../workcell/hooks/useJoinWorkCells';
import AvailabilityToggle from '../components/AvailabilityToggle';
import WorkerTaskCard from '../components/WorkerTaskCard';

function WorkerDashboardInner() {
  const { tasks, loading, isOnline, toggle, startTask, completeTask } = useWorkerTasksContext();

  const activeJobIds = useMemo(
    () => [...new Set(tasks.filter((t) => t.job?._id).map((t) => t.job._id))],
    [tasks]
  );
  useJoinWorkCells(activeJobIds);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
          <AvailabilityToggle isOnline={isOnline} onToggle={toggle} />
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && tasks.length === 0 && (
          <p className="text-gray-400">
            No tasks assigned yet. {!isOnline && 'Go online to become eligible for new dispatch.'}
          </p>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <WorkerTaskCard key={task._id} task={task} onStart={startTask} onComplete={completeTask} />
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