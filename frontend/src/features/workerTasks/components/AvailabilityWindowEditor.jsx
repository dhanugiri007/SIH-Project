const DAYS = [
  { key: 'mon', label: 'Mon' }, { key: 'tue', label: 'Tue' }, { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' }, { key: 'fri', label: 'Fri' }, { key: 'sat', label: 'Sat' }, { key: 'sun', label: 'Sun' },
];

export default function AvailabilityWindowEditor({ windows, onChange }) {
  const getWindow = (day) => windows.find((w) => w.day === day);

  const toggleDay = (day) => {
    const existing = getWindow(day);
    if (existing) {
      onChange(windows.filter((w) => w.day !== day));
    } else {
      onChange([...windows, { day, start: '09:00', end: '18:00' }]);
    }
  };

  const updateTime = (day, field, value) => {
    onChange(windows.map((w) => (w.day === day ? { ...w, [field]: value } : w)));
  };

  return (
    <div className="space-y-2.5">
      {DAYS.map(({ key, label }) => {
        const w = getWindow(key);
        return (
          <div key={key} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleDay(key)}
              className={`w-14 text-xs font-semibold py-1.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                w
                  ? 'bg-[#B8861B] text-white border-[#B8861B] shadow-sm'
                  : 'bg-white border-[#E8E5DE] text-[#596174] hover:border-[#D5A63A]'
              }`}
            >
              {label}
            </button>
            {w ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={w.start}
                  onChange={(e) => updateTime(key, 'start', e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-white border border-[#E8E5DE] rounded-lg outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32] text-[#101010]"
                />
                <span className="text-xs text-[#8A909F]">to</span>
                <input
                  type="time"
                  value={w.end}
                  onChange={(e) => updateTime(key, 'end', e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-white border border-[#E8E5DE] rounded-lg outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32] text-[#101010]"
                />
              </div>
            ) : (
              <span className="text-xs text-[#8A909F] italic">Off duty / Not scheduled</span>
            )}
          </div>
        );
      })}
    </div>
  );
}