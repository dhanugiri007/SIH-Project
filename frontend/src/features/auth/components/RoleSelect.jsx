const roles = [
  { value: 'customer', label: 'Customer', desc: 'Book services' },
  { value: 'worker', label: 'Worker', desc: 'Join a cooperative' },
  { value: 'cooperativeAdmin', label: 'Cooperative', desc: 'Manage a cooperative' },
];

export default function RoleSelect({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {roles.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`border rounded-lg px-2 py-3 text-center transition-colors ${
            value === r.value
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <div className="text-sm font-medium">{r.label}</div>
          <div className="text-[11px] text-gray-400">{r.desc}</div>
        </button>
      ))}
    </div>
  );
}