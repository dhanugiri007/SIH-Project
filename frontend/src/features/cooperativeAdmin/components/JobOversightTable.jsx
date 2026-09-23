import StatusBadge from '../../jobRequest/components/StatusBadge';

export default function JobOversightTable({ jobs }) {
  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <div key={job._id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
          <div>
            <p className="font-medium text-gray-900 text-sm">{job.title}</p>
            <p className="text-xs text-gray-400">{job.customer?.name} · {new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>
      ))}
      {jobs.length === 0 && <p className="text-sm text-gray-400">No jobs involving your cooperative's workers yet.</p>}
    </div>
  );
}