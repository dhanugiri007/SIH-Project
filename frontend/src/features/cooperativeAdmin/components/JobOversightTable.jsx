import StatusBadge from '../../jobRequest/components/StatusBadge';

export default function JobOversightTable({ jobs }) {
  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="flex items-center justify-between p-4 bg-white border border-[#E8E5DE] hover:border-[#D5A63A] rounded-2xl shadow-sahyog-card transition-all"
        >
          <div>
            <p className="font-bold text-sm text-[#0A0A0D]">{job.title}</p>
            <p className="text-xs text-[#596174] mt-0.5">
              Customer: <span className="font-medium text-[#101010]">{job.customer?.name || 'Local Resident'}</span> • {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>
      ))}
      {jobs.length === 0 && (
        <div className="p-8 text-center text-xs text-[#8A909F] bg-white border border-[#E8E5DE] rounded-2xl">
          No cooperative jobs in progress or dispatched yet.
        </div>
      )}
    </div>
  );
}