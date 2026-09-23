import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/authContext';
import NotificationBell from '../../features/notification/components/Notification';

export default function Navbar({ activeSection = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'customer') return '/customer/jobs';
    if (user.role === 'worker') return '/worker';
    return '/admin';
  };

  const roleLabel = {
    customer: 'Customer',
    worker: 'Worker Partner',
    cooperativeAdmin: 'Cooperative Admin',
  }[user?.role] || user?.role;

  return (
    <header className="w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E8E5DE] sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DDB85C] via-[#C99A32] to-[#B8861B] p-0.5 shadow-sm flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-[#FAF9F6] rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#B8861B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#0A0A0D]">
                SAHYOG
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFF9E8] border border-[#EED58C] text-[#B8861B]">
                FLOW
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#596174] hidden sm:inline-block tracking-tight">
              People • Work • Fair Earnings
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to={user ? getDashboardPath() : "/login"}
            className="text-sm font-medium text-[#303039] hover:text-[#B8861B] transition-colors"
          >
            Find Work
          </Link>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-[#303039] hover:text-[#B8861B] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#for-organizations"
            className="text-sm font-medium text-[#303039] hover:text-[#B8861B] transition-colors"
          >
            For Organizations
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-[#303039] hover:text-[#B8861B] transition-colors"
          >
            About
          </a>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Link
                to={getDashboardPath()}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#E8E5DE] text-[#101010] hover:border-[#D5A63A] transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#16834B]" />
                <span>{user.name}</span>
                <span className="text-[#8A909F]">({roleLabel})</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-xs font-medium text-[#596174] hover:text-[#C2413B] px-2 py-1.5 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-[#303039] hover:text-[#B8861B] px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-[#B8861B] hover:bg-[#A57412] text-white shadow-sm transition-all duration-200"
              >
                Join Sahyog
              </Link>
            </div>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-2">
          {user && <NotificationBell />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[#E8E5DE] text-[#303039] hover:bg-[#F5F2EB]"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E8E5DE] bg-[#FAF9F6] px-4 py-4 space-y-3">
          <Link
            to={user ? getDashboardPath() : "/login"}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#303039] py-2"
          >
            Find Work
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#303039] py-2"
          >
            How It Works
          </a>
          <a
            href="#for-organizations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#303039] py-2"
          >
            For Organizations
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#303039] py-2"
          >
            About
          </a>
          <div className="pt-2 border-t border-[#E8E5DE]">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-[#101010]"
                >
                  Go to {roleLabel} Workspace
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="block text-sm text-[#C2413B] font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-medium text-[#303039] border border-[#E8E5DE] rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold text-white bg-[#B8861B] rounded-lg"
                >
                  Join Sahyog
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
