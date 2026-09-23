export default function StatCard({ label, value, subtext, accent = 'gold' }) {
  return (
    <div className="border border-[#E8E5DE] rounded-2xl p-5 bg-white shadow-sahyog-card flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#8A909F] mb-1.5">{label}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0D] tracking-tight">{value}</p>
      </div>
      {subtext && (
        <p className="text-[11px] text-[#596174] mt-2 pt-2 border-t border-[#F0EDE6] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8861B]" />
          <span>{subtext}</span>
        </p>
      )}
    </div>
  );
}