import { useEffect, useState } from 'react';
import { settlementService } from '../service/settlementService';

export default function SettlementView({ jobId }) {
  const [settlement, setSettlement] = useState(null);

  useEffect(() => {
    settlementService.getForJob(jobId).then(setSettlement);
  }, [jobId]);

  if (!settlement) return null;

  return (
    <div className="border border-[#E8E5DE] rounded-2xl p-6 bg-white shadow-sahyog-card mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#0A0A0D]">Fair Settlement Statement</h3>
          <p className="text-xs text-[#596174]">Transparent cooperative rates & verified worker hours</p>
        </div>
        <span className="text-[11px] font-semibold text-[#16834B] bg-[#E8F8EF] px-2.5 py-1 rounded-full border border-[#A7E8C2]">
          Cooperative Cleared
        </span>
      </div>

      <div className="space-y-3 mb-5 divide-y divide-[#F0EDE6]">
        {settlement.lineItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between pt-2.5 text-sm">
            <div>
              <p className="font-semibold text-xs text-[#101010]">{item.title}</p>
              <p className="text-[11px] text-[#596174]">
                {item.workerName} • {item.durationMinutes} min @ ₹{item.ratePerHour}/hr
              </p>
            </div>
            <span className="font-bold text-xs text-[#101010]">₹{item.taskCost}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t-2 border-[#E8E5DE] bg-[#FAF9F6] p-3 rounded-xl">
        <span className="font-bold text-xs uppercase tracking-wider text-[#101010]">Total Direct Payout</span>
        <span className="font-extrabold text-lg text-[#16834B]">₹{settlement.totalAmount}</span>
      </div>
    </div>
  );
}