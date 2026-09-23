export default function Button({
  children,
  variant = 'primary',
  className = '',
  iconRight,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none select-none';

  const variants = {
    primary:
      'w-full py-3 px-5 rounded-xl bg-[#B8861B] hover:bg-[#A57412] active:bg-[#80540B] text-white shadow-sm focus:ring-4 focus:ring-[#C99A32]/25',
    secondary:
      'w-full py-3 px-5 rounded-xl bg-white hover:bg-[#F8F5EE] text-[#101010] border border-[#D5A63A] hover:border-[#B8861B] shadow-sm focus:ring-4 focus:ring-[#C99A32]/20',
    outline:
      'w-full py-3 px-5 rounded-xl bg-white hover:bg-[#F8F5EE] text-[#303039] border border-[#E8E5DE] hover:border-[#D5A63A] shadow-sm focus:ring-4 focus:ring-[#C99A32]/15',
    ghost:
      'py-2 px-3 rounded-lg text-[#596174] hover:text-[#101010] hover:bg-[#F5F2EB]',
  };

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      <span>{children}</span>
      {iconRight && <span className="ml-2 inline-flex items-center">{iconRight}</span>}
    </button>
  );
}