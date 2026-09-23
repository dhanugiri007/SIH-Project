import { Link } from 'react-router-dom';
import { useMyJobs } from '../hooks/useMyJobs';
import StatusBadge from '../components/StatusBadge';
import NotificationBell from '../../notifications/components/NotificationBell';

export default function MyJobsPage() {
  const { jobs, loading } = useMyJobs();

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Jobs</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Link to="/customer/new" className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              + New Request
            </Link>
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && jobs.length === 0 && <p className="text-gray-400">No jobs yet. Create your first request.</p>}

        <div className="space-y-2">
          {jobs.map((job) => (
            <Link key={job._id} to={`/customer/jobs/${job._id}`} className="flex items-center justify-between border border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{job.title}</p>
                <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleString()}</p>
              </div>
              <StatusBadge status={job.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}