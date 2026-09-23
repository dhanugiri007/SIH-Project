export default function AvailabilityToggle({ isOnline, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all duration-150 cursor-pointer shadow-sm ${
        isOnline
          ? 'bg-[#E8F8EF] border-[#A7E8C2] text-[#16834B] hover:bg-[#d8f3e3]'
          : 'bg-[#FAF9F6] border-[#E8E5DE] text-[#596174] hover:border-[#D5A63A] hover:text-[#101010]'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#16834B] animate-pulse' : 'bg-[#8A909F]'}`} />
      <span>{isOnline ? 'Online for Dispatch' : 'Offline / Paused'}</span>
    </button>
  );
}