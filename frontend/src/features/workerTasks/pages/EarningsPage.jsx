import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { payoutService } from '../service/payoutService';
import Navbar from '../../../shared/components/Navbar';

export default function EarningsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    payoutService.getMine().then(setPayouts).finally(() => setLoading(false));
  }, []);

  const total = payouts.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.workerPayout, 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Link
          to="/worker"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8861B] hover:text-[#A57412] mb-5 transition-colors"
        >
          ← Back to task queue
        </Link>

        {/* Earnings Summary Banner */}
        <div className="p-6 md:p-8 bg-white border border-[#E8E5DE] rounded-2xl shadow-sahyog-card mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF9E8] border border-[#EED58C] text-[#80540B] text-[11px] font-bold uppercase tracking-wider mb-2">
              Cooperative Payout Ledger
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0D] tracking-tight">
              My Earnings
            </h1>
            <p className="text-xs text-[#596174] mt-1">
              Direct, un-docked earnings credited upon customer verification.
            </p>
          </div>

          <div className="p-4 bg-[#FAF9F6] border border-[#E8E5DE] rounded-2xl text-left sm:text-right min-w-[180px]">
            <span className="text-xs font-semibold text-[#596174] uppercase tracking-wide block mb-1">
              Total Disbursed
            </span>
            <span className="text-3xl font-extrabold text-[#16834B]">
              ₹{total}
            </span>
          </div>
        </div>

        {loading && (
          <div className="p-12 text-center text-sm text-[#8A909F]">
            <div className="inline-block w-6 h-6 border-2 border-[#B8861B] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading your payout history...</p>
          </div>
        )}

        {!loading && payouts.length === 0 && (
          <div className="p-10 border border-[#E8E5DE] rounded-2xl bg-white text-center shadow-sahyog-card">
            <p className="text-sm font-semibold text-[#101010]">No completed payouts recorded yet</p>
            <p className="text-xs text-[#596174] mt-1">Complete your assigned tasks to generate cooperative payout disbursements.</p>
          </div>
        )}

        <div className="space-y-3.5">
          {payouts.map((p, idx) => (
            <div key={idx} className="border border-[#E8E5DE] rounded-2xl p-5 bg-white shadow-sahyog-card">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6] mb-3">
                <p className="font-bold text-sm text-[#0A0A0D]">{p.job?.title || 'Completed Job'}</p>
                <span className="text-xs font-semibold text-[#16834B] bg-[#E8F8EF] px-2.5 py-0.5 rounded-full border border-[#A7E8C2]">
                  Disbursed
                </span>
              </div>
              <div className="space-y-2">
                {p.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-[#596174]">
                    <span>{item.title}</span>
                    <span className="font-bold text-[#101010]">₹{item.workerPayout}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}