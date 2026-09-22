export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h1 className="text-3xl font-bold mb-4">SAHYOG FLOW</h1>
          <p className="text-indigo-100">
            The cooperative gig platform that turns everyday requests into coordinated,
            fairly-dispatched work — for customers, workers, and cooperatives alike.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}