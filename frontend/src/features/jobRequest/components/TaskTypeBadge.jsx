const COLORS = {
  cleaning: 'bg-[#F5F2EB] text-[#596174] border-[#E8E5DE]',
  electrical: 'bg-[#FFF9E8] text-[#80540B] border-[#EED58C]',
  plumbing: 'bg-[#F5F2EB] text-[#303039] border-[#D8D2C4]',
  carpentry: 'bg-[#FFF9E8] text-[#5C3C08] border-[#D5A63A]',
  painting: 'bg-[#FAF9F6] text-[#80540B] border-[#EED58C]',
  appliance_repair: 'bg-[#E8F8EF] text-[#16834B] border-[#A7E8C2]',
  general: 'bg-[#FAF9F6] text-[#596174] border-[#E8E5DE]',
};

export default function TaskTypeBadge({ type }) {
  const style = COLORS[type] || COLORS.general;
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${style} capitalize`}>
      {type ? type.replace('_', ' ') : 'general'}
    </span>
  );
}