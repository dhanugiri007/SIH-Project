import { useState } from 'react';

export default function WorkerRosterRow({ worker, onUpdateCapacity, onToggleActive, onVerifyCert }) {
  const [expanded, setExpanded] = useState(false);
  const [capacityInput, setCapacityInput] = useState(worker?.capacity ?? 1);

  if (!worker || !worker.user) return null;

  return (
    <div className="border border-[#E8E5DE] rounded-2xl overflow-hidden bg-white shadow-sm mb-3">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#FAF9F6] text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${worker.availability?.isOnline ? 'bg-[#16834B] ring-2 ring-[#A7E8C2]' : 'bg-[#8A909F]'}`} />
          <div>
            <p className="font-bold text-sm text-[#0A0A0D]">{worker.user.name}</p>
            <p className="text-xs text-[#596174] mt-0.5">{worker.skills?.join(', ') || 'General dispatch'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-[#80540B] bg-[#FFF9E8] px-2.5 py-0.5 rounded-full border border-[#EED58C]">
            ★ {worker.ratingAvg?.toFixed(1) || '—'} ({worker.ratingCount || 0})
          </span>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            worker.user.isActive
              ? 'bg-[#E8F8EF] border-[#A7E8C2] text-[#16834B]'
              : 'bg-[#FCE9E7] border-[#F5C2BF] text-[#C2413B]'
          }`}>
            {worker.user.isActive ? 'Active' : 'Suspended'}
          </span>
          <span className="text-xs text-[#8A909F] font-mono">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="p-4 sm:p-5 border-t border-[#F0EDE6] bg-[#FAF9F6] space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-[#596174] w-32 uppercase tracking-wide">
              Capacity Limit
            </label>
            <input
              type="number"
              min={0}
              max={10}
              value={capacityInput}
              onChange={(e) => setCapacityInput(Number(e.target.value))}
              className="w-20 text-xs px-2.5 py-1.5 bg-white border border-[#E8E5DE] rounded-lg outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32]"
            />
            <button
              onClick={() => onUpdateCapacity(worker.user._id, capacityInput)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#B8861B] text-white hover:bg-[#A57412] transition-colors shadow-sm cursor-pointer"
            >
              Update
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-[#596174] w-32 uppercase tracking-wide">
              Status Control
            </label>
            <button
              onClick={() => onToggleActive(worker.user._id, !worker.user.isActive)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                worker.user.isActive
                  ? 'border border-[#F5C2BF] text-[#C2413B] bg-white hover:bg-[#FCE9E7]'
                  : 'bg-[#16834B] text-white hover:bg-[#11693c]'
              }`}
            >
              {worker.user.isActive ? 'Suspend Worker Account' : 'Reactivate Worker'}
            </button>
          </div>

          <div className="pt-2 border-t border-[#E8E5DE]">
            <p className="text-xs font-semibold text-[#101010] uppercase tracking-wide mb-2">
              Submitted Certifications
            </p>
            {(!worker.certifications || worker.certifications.length === 0) && (
              <p className="text-xs text-[#8A909F] italic">No certifications submitted by this worker.</p>
            )}
            <div className="space-y-2">
              {worker.certifications?.map((cert, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-white border border-[#E8E5DE] rounded-xl px-3 py-2">
                  <div>
                    <span className="font-semibold text-[#101010]">{cert.name}</span>
                    {cert.issuingBody && <span className="text-[#596174]"> • {cert.issuingBody}</span>}
                  </div>
                  {cert.verified ? (
                    <span className="text-xs font-semibold text-[#16834B] flex items-center gap-1">
                      ✓ Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => onVerifyCert(worker.user._id, idx)}
                      className="text-xs font-semibold text-[#B8861B] hover:text-[#A57412] underline underline-offset-2 cursor-pointer"
                    >
                      Verify License
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