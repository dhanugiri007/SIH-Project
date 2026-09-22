import { useParams, Link } from 'react-router-dom';
import { useJobDetail } from '../hooks/useJobDetail';
import StatusBadge from '../components/StatusBadge';
import TaskCard from '../components/TaskCard';
import JobTimeline from '../components/JobTimeline';
import SettlementView from '../components/SettlementView';
import { WorkCellProvider, useWorkCellContext } from '../../workcell/workCellContext';
import WorkCellBoard from '../../workcell/components/WorkCellBoard';

function LiveCrewInner() {
  const { workCell, presentUserIds, liveLocations, loading, error } = useWorkCellContext();
  if (loading || error || !workCell) return null;
  return (
    <div className="mt-6">
      <WorkCellBoard workCell={workCell} presentUserIds={presentUserIds} liveLocations={liveLocations} />
    </div>
  );
}

function LiveCrewSection({ jobId }) {
  return (
    <WorkCellProvider jobId={jobId}>
      <LiveCrewInner />
    </WorkCellProvider>
  );
}

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { job, loading, error, verifyTask, cancelTask } = useJobDetail(jobId);

  if (loading) return <div className="p-10 text-gray-500">Loading job...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!job) return null;

  const showLiveCrew = ['dispatched', 'in_progress', 'completed'].includes(job.status);
  const showSettlement = ['completed'].includes(job.status);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/customer/jobs" className="text-sm text-indigo-600 mb-4 inline-block">← Back to my jobs</Link>

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-gray-400 text-sm mb-6">"{job.rawRequestText}"</p>

        <div className="space-y-3">
          {job.tasks.map((task) => (
            <TaskCard key={task._id} task={task} onVerify={verifyTask} onCancel={cancelTask} />
          ))}
        </div>

        {showLiveCrew && <LiveCrewSection jobId={jobId} />}
        {showSettlement && <SettlementView jobId={jobId} />}
        <JobTimeline jobId={jobId} />
      </div>
    </div>
  );
}