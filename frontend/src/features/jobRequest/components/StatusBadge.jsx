const STATUS_COLORS = {
  processing: 'bg-gray-100 text-gray-600',
  ready: 'bg-sky-100 text-sky-700',
  failed: 'bg-red-100 text-red-700',
  dispatched: 'bg-violet-100 text-violet-700',
  pending: 'bg-gray-100 text-gray-600',
  offered: 'bg-amber-100 text-amber-700',
  assigned: 'bg-violet-100 text-violet-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  verified: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}