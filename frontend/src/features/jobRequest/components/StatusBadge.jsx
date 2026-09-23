const STATUS_CONFIG = {
  processing: {
    bg: 'bg-[#F5F2EB]',
    border: 'border-[#E8E5DE]',
    text: 'text-[#596174]',
    dot: 'bg-[#8A909F]',
  },
  ready: {
    bg: 'bg-[#FFF9E8]',
    border: 'border-[#EED58C]',
    text: 'text-[#80540B]',
    dot: 'bg-[#B8861B]',
  },
  failed: {
    bg: 'bg-[#FCE9E7]',
    border: 'border-[#F5C2BF]',
    text: 'text-[#C2413B]',
    dot: 'bg-[#C2413B]',
  },
  dispatched: {
    bg: 'bg-[#FFF9E8]',
    border: 'border-[#EED58C]',
    text: 'text-[#80540B]',
    dot: 'bg-[#B8861B]',
  },
  pending: {
    bg: 'bg-[#FAF9F6]',
    border: 'border-[#E8E5DE]',
    text: 'text-[#596174]',
    dot: 'bg-[#8A909F]',
  },
  offered: {
    bg: 'bg-[#FFF9E8]',
    border: 'border-[#D5A63A]',
    text: 'text-[#5C3C08]',
    dot: 'bg-[#C99A32]',
  },
  assigned: {
    bg: 'bg-[#F5F2EB]',
    border: 'border-[#D8D2C4]',
    text: 'text-[#101010]',
    dot: 'bg-[#B8861B]',
  },
  in_progress: {
    bg: 'bg-[#FFF9E8]',
    border: 'border-[#D5A63A]',
    text: 'text-[#80540B]',
    dot: 'bg-[#B8861B] animate-pulse',
  },
  completed: {
    bg: 'bg-[#E8F8EF]',
    border: 'border-[#A7E8C2]',
    text: 'text-[#16834B]',
    dot: 'bg-[#16834B]',
  },
  verified: {
    bg: 'bg-[#E8F8EF]',
    border: 'border-[#A7E8C2]',
    text: 'text-[#16834B]',
    dot: 'bg-[#16834B]',
  },
  cancelled: {
    bg: 'bg-[#FCE9E7]',
    border: 'border-[#F5C2BF]',
    text: 'text-[#C2413B]',
    dot: 'bg-[#C2413B]',
  },
};

export default function StatusBadge({ status }) {
  const conf = STATUS_CONFIG[status] || {
    bg: 'bg-[#F5F2EB]',
    border: 'border-[#E8E5DE]',
    text: 'text-[#596174]',
    dot: 'bg-[#8A909F]',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${conf.bg} ${conf.border} ${conf.text} capitalize select-none`}>
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      {status ? status.replace('_', ' ') : 'Unknown'}
    </span>
  );
}