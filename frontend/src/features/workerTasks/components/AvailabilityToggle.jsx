export default function AvailabilityToggle({ isOnline, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-colors ${
        isOnline ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-500'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {isOnline ? 'Available for jobs' : 'Offline'}
    </button>
  );
}