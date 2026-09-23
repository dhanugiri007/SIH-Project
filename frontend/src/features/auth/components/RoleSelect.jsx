const roles = [
  {
    value: 'customer',
    label: 'Customer',
    desc: 'Request local services',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    value: 'worker',
    label: 'Worker',
    desc: 'Join a cooperative',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
  },
  {
    value: 'cooperativeAdmin',
    label: 'Coop Admin',
    desc: 'Manage a cooperative',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function RoleSelect({ value, onChange }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-[#101010] uppercase tracking-wide mb-1.5">
        Registering As
      </label>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((r) => {
          const isSelected = value === r.value;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => onChange(r.value)}
              className={`p-2.5 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? 'border-[#D5A63A] bg-[#FFF9E8] text-[#80540B] shadow-sm ring-1 ring-[#D5A63A]'
                  : 'border-[#E8E5DE] bg-white text-[#596174] hover:border-[#D5A63A] hover:bg-[#FAF9F6]'
              }`}
            >
              <div className={`mb-1 ${isSelected ? 'text-[#B8861B]' : 'text-[#8A909F]'}`}>
                {r.icon}
              </div>
              <div className="text-xs font-bold text-[#0A0A0D] leading-tight">{r.label}</div>
              <div className="text-[10px] text-[#8A909F] mt-0.5 leading-tight">{r.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}