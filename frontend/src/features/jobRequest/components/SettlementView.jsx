import { useEffect, useState } from 'react';
import { settlementService } from '../service/settlementService';

export default function SettlementView({ jobId }) {
  const [settlement, setSettlement] = useState(null);

  useEffect(() => {
    settlementService.getForJob(jobId).then(setSettlement);
  }, [jobId]);

  if (!settlement) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Itemised Bill</h3>
      <div className="space-y-2 mb-4">
        {settlement.lineItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
            <div>
              <p className="text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-400">{item.workerName} · {item.durationMinutes} min @ ₹{item.ratePerHour}/hr</p>
            </div>
            <span className="font-medium text-gray-900">₹{item.taskCost}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="font-semibold text-gray-900">Total</span>
        <span className="font-semibold text-lg text-indigo-600">₹{settlement.totalAmount}</span>
      </div>
    </div>
  );
}