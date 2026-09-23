import { Link } from 'react-router-dom';
import { useMyJobs } from '../hooks/useMyJobs';
import StatusBadge from '../components/StatusBadge';
import Navbar from '../../../shared/components/Navbar';

export default function MyJobsPage() {
  const { jobs, loading } = useMyJobs();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E5DE]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF9E8] border border-[#EED58C] text-[#80540B] text-[11px] font-bold uppercase tracking-wider mb-2">
              Customer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0D] tracking-tight">
              My Service Requests
            </h1>
            <p className="text-xs sm:text-sm text-[#596174] mt-1">
              Track multi-task cooperative jobs, dispatch progress, live worker crews, and receipts.
            </p>
          </div>

          <Link
            to="/customer/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#B8861B] hover:bg-[#A57412] text-white font-semibold text-sm shadow-sm transition-all duration-200 self-start sm:self-auto cursor-pointer"
          >
            <span>+ New Request</span>
          </Link>
        </div>

        {loading && (
          <div className="p-12 text-center text-sm text-[#8A909F]">
            <div className="inline-block w-6 h-6 border-2 border-[#B8861B] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading your active service requests...</p>
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="p-10 border border-[#E8E5DE] rounded-2xl bg-white text-center shadow-sahyog-card">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF9E8] border border-[#EED58C] flex items-center justify-center text-[#B8861B] mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-[#0A0A0D]">No service requests yet</h2>
            <p className="text-xs text-[#596174] mt-1 max-w-sm mx-auto mb-5">
              Submit your first request using natural language or voice dictation — Sahyog Flow breaks it into tasks and matches verified workers.
            </p>
            <Link
              to="/customer/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B8861B] hover:bg-[#A57412] text-white text-xs font-semibold"
            >
              <span>Create First Request</span>
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {jobs.map((job) => (
            <Link
              key={job._id}
              to={`/customer/jobs/${job._id}`}
              className="flex items-center justify-between p-5 bg-white border border-[#E8E5DE] hover:border-[#D5A63A] rounded-2xl shadow-sahyog-card hover:shadow-sahyog-hover transition-all duration-200 group"
            >
              <div className="pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-sm sm:text-base text-[#0A0A0D] group-hover:text-[#B8861B] transition-colors">
                    {job.title}
                  </h2>
                </div>
                <p className="text-xs text-[#596174] line-clamp-1 mb-1.5">
                  &ldquo;{job.rawRequestText}&rdquo;
                </p>
                <div className="flex items-center gap-3 text-[11px] text-[#8A909F]">
                  <span>📅 {new Date(job.createdAt).toLocaleDateString()} at {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {job.tasks?.length > 0 && <span>• {job.tasks.length} sub-tasks</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={job.status} />
                <span className="text-[#8A909F] group-hover:text-[#B8861B] group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}