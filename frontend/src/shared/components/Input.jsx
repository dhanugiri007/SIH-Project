export default function Input({ label, error, helperText, className = '', ...props }) {
  return (
    <div className="mb-4 text-left">
      {label && (
        <label className="block text-xs font-semibold text-[#101010] uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-[#101010] placeholder-[#9CA1AD] transition-all duration-150 outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32] ${
          error ? 'border-[#C2413B] focus:border-[#C2413B] focus:ring-red-200' : 'border-[#E8E5DE] hover:border-[#D8D2C4]'
        } ${className}`}
        {...props}
      />
      {helperText && !error && <p className="text-xs text-[#8A909F] mt-1">{helperText}</p>}
      {error && <p className="text-xs text-[#C2413B] mt-1 font-medium">{error}</p>}
    </div>
  );
}