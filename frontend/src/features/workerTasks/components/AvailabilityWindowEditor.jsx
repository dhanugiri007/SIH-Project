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
    <div className="space-y-2">
      {DAYS.map(({ key, label }) => {
        const w = getWindow(key);
        return (
          <div key={key} className="flex items-center gap-3">
            <button
              onClick={() => toggleDay(key)}
              className={`w-12 text-xs py-1.5 rounded-full border transition-colors ${
                w ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-400'
              }`}
            >
              {label}
            </button>
            {w && (
              <>
                <input
                  type="time"
                  value={w.start}
                  onChange={(e) => updateTime(key, 'start', e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded outline-none"
                />
                <span className="text-xs text-gray-400">to</span>
                <input
                  type="time"
                  value={w.end}
                  onChange={(e) => updateTime(key, 'end', e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded outline-none"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}