export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'w-full py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}