const COLORS = {
  indigo: 'bg-indigo-50 text-indigo-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  violet: 'bg-violet-50 text-violet-700',
};

export default function StatCard({ label, value, color = 'indigo' }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${COLORS[color].split(' ')[1]}`}>{value}</p>
    </div>
  );
}