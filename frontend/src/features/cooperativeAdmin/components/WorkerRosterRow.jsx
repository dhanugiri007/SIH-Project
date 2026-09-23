import { useState } from 'react';

export default function WorkerRosterRow({ worker, onUpdateCapacity, onToggleActive, onVerifyCert }) {
  const [expanded, setExpanded] = useState(false);
  const [capacityInput, setCapacityInput] = useState(worker?.capacity ?? 1);

  // Guard AFTER hooks (hooks must always run in the same order), but BEFORE any
  // rendering logic touches worker/worker.user.
  if (!worker || !worker.user) return null;

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button onClick={() => setExpanded((e) => !e)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${worker.availability?.isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`} />
          <div>
            <p className="font-medium text-gray-900 text-sm">{worker.user.name}</p>
            <p className="text-xs text-gray-400">{worker.skills?.join(', ') || 'No skills listed'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">⭐ {worker.ratingAvg?.toFixed(1) || '—'} ({worker.ratingCount || 0})</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${worker.user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {worker.user.isActive ? 'Active' : 'Suspended'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 w-28">Capacity</label>
            <input
              type="number"
              min={0}
              value={capacityInput}
              onChange={(e) => setCapacityInput(Number(e.target.value))}
              className="w-20 text-sm px-2 py-1 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={() => onUpdateCapacity(worker.user._id, capacityInput)}
              className="text-xs px-3 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Update
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 w-28">Account status</label>
            <button
              onClick={() => onToggleActive(worker.user._id, !worker.user.isActive)}
              className={`text-xs px-3 py-1 rounded-full ${
                worker.user.isActive ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {worker.user.isActive ? 'Suspend worker' : 'Reactivate worker'}
            </button>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Certifications</p>
            {(!worker.certifications || worker.certifications.length === 0) && (
              <p className="text-xs text-gray-400">None submitted</p>
            )}
            <div className="space-y-1.5">
              {worker.certifications?.map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-white border border-gray-100 rounded px-2 py-1.5">
                  <span>{cert.name} {cert.issuingBody && `· ${cert.issuingBody}`}</span>
                  {cert.verified ? (
                    <span className="text-emerald-600 font-medium">✓ Verified</span>
                  ) : (
                    <button onClick={() => onVerifyCert(worker.user._id, idx)} className="text-indigo-600 hover:underline">
                      Verify
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}