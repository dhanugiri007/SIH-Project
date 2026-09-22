import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { payoutService } from '../service/payoutService';

export default function EarningsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    payoutService.getMine().then(setPayouts).finally(() => setLoading(false));
  }, []);

  const total = payouts.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.workerPayout, 0), 0);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link to="/worker" className="text-sm text-indigo-600 mb-4 inline-block">← Back to tasks</Link>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Earnings</h1>
        <p className="text-gray-400 text-sm mb-6">Total earned: <span className="font-semibold text-emerald-600">₹{total}</span></p>

        {loading && <p className="text-gray-500">Loading...</p>}

        <div className="space-y-3">
          {payouts.map((p, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">{p.job?.title}</p>
              {p.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm text-gray-500">
                  <span>{item.title}</span>
                  <span className="font-medium text-emerald-600">₹{item.workerPayout}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}