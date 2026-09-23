import { useParams, Link } from 'react-router-dom';
import { useJobDetail } from '../hooks/useJobDetail';
import StatusBadge from '../components/StatusBadge';
import TaskCard from '../components/TaskCard';
import JobTimeline from '../components/JobTimeline';
import SettlementView from '../components/SettlementView';
import { WorkCellProvider, useWorkCellContext } from '../../workcell/workCellContext';
import WorkCellBoard from '../../workcell/components/WorkCellBoard';
import Navbar from '../../../shared/components/Navbar';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-3xl w-full mx-auto p-12 text-center text-sm text-[#8A909F]">
          <div className="inline-block w-6 h-6 border-2 border-[#B8861B] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading service request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-3xl w-full mx-auto p-12 text-center">
          <div className="p-4 rounded-xl bg-[#FCE9E7] border border-[#F5C2BF] text-xs text-[#C2413B] font-medium inline-block">
            {error}
          </div>
          <div className="mt-4">
            <Link to="/customer/jobs" className="text-xs font-semibold text-[#B8861B]">← Return to all requests</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const showLiveCrew = ['dispatched', 'in_progress', 'completed'].includes(job.status);
  const showSettlement = ['completed'].includes(job.status);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Link
          to="/customer/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8861B] hover:text-[#A57412] mb-5 transition-colors"
        >
          ← Back to my service requests
        </Link>

        {/* Header Card */}
        <div className="p-6 md:p-8 bg-white border border-[#E8E5DE] rounded-2xl shadow-sahyog-card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A0A0D]">
              {job.title}
            </h1>
            <StatusBadge status={job.status} />
          </div>

          <p className="text-xs sm:text-sm text-[#596174] italic mb-4 leading-relaxed">
            &ldquo;{job.rawRequestText}&rdquo;
          </p>

          <div className="pt-3 border-t border-[#F0EDE6] flex flex-wrap items-center gap-4 text-xs text-[#8A909F]">
            <span>📅 Created: {new Date(job.createdAt).toLocaleString()}</span>
            {job.serviceAddress && <span>📍 {job.serviceAddress}</span>}
            <span>• {job.tasks?.length || 0} sub-tasks</span>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#101010]">
              Dispatched Tasks
            </h2>
            <span className="text-xs text-[#596174]">{job.tasks?.length || 0} allocated</span>
          </div>

          <div className="space-y-3.5">
            {job.tasks.map((task) => (
              <TaskCard key={task._id} task={task} onVerify={verifyTask} onCancel={cancelTask} />
            ))}
          </div>
        </div>

        {showLiveCrew && <LiveCrewSection jobId={jobId} />}
        {showSettlement && <SettlementView jobId={jobId} />}
        <JobTimeline jobId={jobId} />
      </main>
    </div>
  );
}