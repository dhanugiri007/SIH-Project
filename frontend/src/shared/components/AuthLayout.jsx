import Navbar from './Navbar';
import { Link } from 'react-router-dom';

export default function AuthLayout({
  title = 'Welcome back',
  subtitle = 'Sign in to your Sahyog Flow workspace to manage jobs, routes, and earnings.',
  children,
  activeMode = 'login',
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col selection:bg-[#FBECC5] selection:text-[#5C3C08]">
      {/* Top Editorial Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          
          {/* =========================================
              LEFT COLUMN: Marketing Hero & Visuals (58-60%)
             ========================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:pr-4">
            
            {/* Value Proposition Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border border-[#D5A63A] bg-[#FFF9E8]/80 text-[#80540B] text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8861B]" />
              <span>Worker-Owned • Transparent Matching • Fair Work</span>
            </div>

            {/* Hero Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] xl:text-[68px] font-extrabold tracking-[-0.035em] leading-[1.04] text-[#0A0A0D]">
                Work together.
                <span className="block text-[#B8861B] mt-1">
                  Grow together.
                </span>
              </h1>
              <p className="pt-4 text-base sm:text-lg text-[#596174] max-w-xl leading-relaxed font-normal">
                Sahyog Flow is India&apos;s transparent cooperative gig platform. We connect skilled worker cooperatives, local households, and community organizers with fair dispatching, dignified payouts, and verifiable trust.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#B8861B] hover:bg-[#A57412] active:bg-[#80540B] text-white font-semibold text-sm shadow-sm transition-all duration-200 group"
              >
                <span>Find Work as a Member</span>
                <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                to="/customer/new"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-[#F8F5EE] border border-[#D5A63A] hover:border-[#B8861B] text-[#101010] font-semibold text-sm shadow-sm transition-all duration-200"
              >
                <span>Request a Service</span>
              </Link>
            </div>

            {/* Visual Service Panels */}
            <div className="pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8A909F] mb-3">
                Cooperative Services & Dispatch Verticals
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* Panel 1 */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8E5DE] hover:border-[#D5A63A] transition-all duration-200 shadow-sahyog-card flex flex-col justify-between group">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-[#FFF9E8] border border-[#EED58C] flex items-center justify-center text-[#B8861B] mb-3 group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-bold text-[#0A0A0D]">Skilled Trades</h2>
                    <p className="text-xs text-[#596174] mt-1 leading-snug">Electricians, carpenters, plumbing & technician collectives.</p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#F0EDE6] flex items-center justify-between text-[11px] font-medium text-[#B8861B]">
                    <span>Cooperative Certified</span>
                    <span>100% Retained</span>
                  </div>
                </div>

                {/* Panel 2 */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8E5DE] hover:border-[#D5A63A] transition-all duration-200 shadow-sahyog-card flex flex-col justify-between group">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-[#FFF9E8] border border-[#EED58C] flex items-center justify-center text-[#B8861B] mb-3 group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-bold text-[#0A0A0D]">Home & Living</h2>
                    <p className="text-xs text-[#596174] mt-1 leading-snug">Deep cleaning, sanitation, masonry & maintenance workcells.</p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#F0EDE6] flex items-center justify-between text-[11px] font-medium text-[#B8861B]">
                    <span>Multi-task Ready</span>
                    <span>Voice Input</span>
                  </div>
                </div>

                {/* Panel 3 */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8E5DE] hover:border-[#D5A63A] transition-all duration-200 shadow-sahyog-card flex flex-col justify-between group">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-[#FFF9E8] border border-[#EED58C] flex items-center justify-center text-[#B8861B] mb-3 group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-bold text-[#0A0A0D]">Local Logistics</h2>
                    <p className="text-xs text-[#596174] mt-1 leading-snug">Proximity routing, local deliveries & neighborhood support.</p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#F0EDE6] flex items-center justify-between text-[11px] font-medium text-[#B8861B]">
                    <span>Geo-Dispatched</span>
                    <span>Real-time GPS</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Feature & Value Indicators */}
            <div className="pt-2 border-t border-[#E8E5DE]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-[#FAF9F6] border border-[#E8E5DE] text-[#B8861B] mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#101010]">Verified Members</h3>
                    <p className="text-[11px] text-[#596174]">Cooperative certified</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-[#FAF9F6] border border-[#E8E5DE] text-[#B8861B] mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#101010]">Fair Dispatching</h3>
                    <p className="text-[11px] text-[#596174]">Optimal greedy solver</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-[#FAF9F6] border border-[#E8E5DE] text-[#B8861B] mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#101010]">Community Owned</h3>
                    <p className="text-[11px] text-[#596174]">Coop-led governance</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-[#FAF9F6] border border-[#E8E5DE] text-[#B8861B] mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#101010]">Transparent Payouts</h3>
                    <p className="text-[11px] text-[#596174]">Direct worker share</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* =========================================
              RIGHT COLUMN: Cooperative Portal Card (40-42%)
             ========================================= */}
          <div className="lg:col-span-5 w-full max-w-xl mx-auto lg:max-w-none">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E5DE] p-6 sm:p-8 md:p-10 shadow-sahyog-card relative">
              
              {/* Card Top Indicator Bar */}
              <div className="flex items-center justify-between gap-2 pb-6 border-b border-[#F0EDE6] mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9E8] border border-[#EED58C] text-[#80540B] text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8861B]" />
                  <span>Cooperative Portal</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8EF] border border-[#A7E8C2] text-[#16834B] text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#16834B] animate-pulse" />
                  <span>System Operational</span>
                </div>
              </div>

              {/* Form Title & Context */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0D] tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm text-[#596174] mt-1.5 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Form Body (LoginForm / SignupForm) */}
              <div>
                {children}
              </div>

              {/* Trust Badge Footer */}
              <div className="mt-6 pt-5 border-t border-[#F0EDE6] flex items-center justify-center gap-4 text-[11px] text-[#8A909F]">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#16834B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Cooperative Verified
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#B8861B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Encrypted Session
                </span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E5DE] bg-[#FAF9F6] py-6 mt-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#596174]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0A0A0D]">SAHYOG FLOW</span>
            <span>—</span>
            <span>Democratizing Gig Work via Worker Cooperatives</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#B8861B] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#B8861B] transition-colors">Cooperative Bylaws</a>
            <a href="#support" className="hover:text-[#B8861B] transition-colors">Support & Grievances</a>
          </div>
        </div>
      </footer>
    </div>
  );
}