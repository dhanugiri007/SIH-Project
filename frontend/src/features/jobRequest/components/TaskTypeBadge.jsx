const COLORS = {
  cleaning: 'bg-sky-100 text-sky-700',
  electrical: 'bg-amber-100 text-amber-700',
  plumbing: 'bg-blue-100 text-blue-700',
  carpentry: 'bg-orange-100 text-orange-700',
  painting: 'bg-fuchsia-100 text-fuchsia-700',
  appliance_repair: 'bg-emerald-100 text-emerald-700',
  general: 'bg-gray-100 text-gray-700',
};

export default function TaskTypeBadge({ type }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${COLORS[type] || COLORS.general}`}>
      {type.replace('_', ' ')}
    </span>
  );
}