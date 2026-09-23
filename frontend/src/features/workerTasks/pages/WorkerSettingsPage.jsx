import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkerSettings } from '../hooks/useWorkerSettings';
import AvailabilityWindowEditor from '../components/AvailabilityWindowEditor';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import Navbar from '../../../shared/components/Navbar';

export default function WorkerSettingsPage() {
  const {
    profile, loading, saving, locating, locationError,
    saveSkillsAndCapacity, saveAvailabilityWindows, addCertification, captureLocationNow,
  } = useWorkerSettings();

  const [skillsInput, setSkillsInput] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [windows, setWindows] = useState([]);
  const [certName, setCertName] = useState('');
  const [certBody, setCertBody] = useState('');

  useEffect(() => {
    if (profile) {
      setSkillsInput(profile.skills?.join(', ') || '');
      setCapacity(profile.capacity || 1);
      setWindows(profile.availability?.windows || []);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-2xl w-full mx-auto p-12 text-center text-sm text-[#8A909F]">
          <div className="inline-block w-6 h-6 border-2 border-[#B8861B] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading worker configuration...</p>
        </div>
      </div>
    );
  }

  const hasLocation = profile?.location?.coordinates?.some((c) => c !== 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#101010] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Link
          to="/worker"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8861B] hover:text-[#A57412] mb-5 transition-colors"
        >
          ← Back to task queue
        </Link>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF9E8] border border-[#EED58C] text-[#80540B] text-[11px] font-bold uppercase tracking-wider mb-2">
            Member Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0D] tracking-tight">
            Worker Partner Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#596174] mt-1">
            Configure your geographic dispatch anchor, weekly availability slots, skills, and certifications.
          </p>
        </div>

        {/* Location Section */}
        <div className="border border-[#E8E5DE] rounded-2xl p-6 bg-white shadow-sahyog-card mb-6">
          <h2 className="text-sm font-bold text-[#0A0A0D] mb-1">Geographic Dispatch Anchor</h2>
          <p className="text-xs text-[#596174] mb-3 leading-relaxed">
            Used by our greedy dispatch algorithm to compute proximity scores. Workers closer to service sites receive priority allocation.
          </p>

          {hasLocation ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-[#16834B] bg-[#E8F8EF] px-3 py-1 rounded-full border border-[#A7E8C2] mb-3 font-semibold">
              <span>✓ Coordinates saved ({profile.location.coordinates[1].toFixed(4)}, {profile.location.coordinates[0].toFixed(4)})</span>
            </div>
          ) : (
            <p className="text-xs text-[#B7791F] mb-3 font-medium">⚠️ No GPS coordinate anchor recorded yet</p>
          )}

          <div>
            <button
              onClick={captureLocationNow}
              disabled={locating}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#B8861B] hover:bg-[#A57412] text-white disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              📍 {locating ? 'Capturing GPS...' : hasLocation ? 'Update Anchor Location' : 'Capture Current Location'}
            </button>
          </div>
          {locationError && <p className="text-xs text-[#C2413B] mt-2">{locationError}</p>}
        </div>

        {/* Skills and Capacity */}
        <div className="border border-[#E8E5DE] rounded-2xl p-6 bg-white shadow-sahyog-card mb-6">
          <h2 className="text-sm font-bold text-[#0A0A0D] mb-3">Skills & Concurrency Capacity</h2>

          <Input
            label="Verified Skills (comma-separated)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="electrical, plumbing, carpentry"
          />

          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#101010] uppercase tracking-wide mb-1.5">
              Maximum Concurrent Tasks Capacity
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-24 px-3 py-2 bg-white border border-[#E8E5DE] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32]"
            />
          </div>

          <Button
            type="button"
            variant="primary"
            disabled={saving}
            onClick={() => {
              const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
              saveSkillsAndCapacity(skills, capacity);
            }}
          >
            {saving ? 'Saving...' : 'Save Skills & Capacity'}
          </Button>
        </div>

        {/* Availability Schedule */}
        <div className="border border-[#E8E5DE] rounded-2xl p-6 bg-white shadow-sahyog-card mb-6">
          <h2 className="text-sm font-bold text-[#0A0A0D] mb-1">Weekly Working Schedule</h2>
          <p className="text-xs text-[#596174] mb-4">
            Tasks are only offered to you during these working windows.
          </p>

          <AvailabilityWindowEditor windows={windows} onChange={setWindows} />

          <div className="mt-5 pt-4 border-t border-[#F0EDE6]">
            <Button
              type="button"
              variant="primary"
              disabled={saving}
              onClick={() => saveAvailabilityWindows(windows)}
            >
              {saving ? 'Updating Schedule...' : 'Save Availability Windows'}
            </Button>
          </div>
        </div>

        {/* Certifications */}
        <div className="border border-[#E8E5DE] rounded-2xl p-6 bg-white shadow-sahyog-card">
          <h2 className="text-sm font-bold text-[#0A0A0D] mb-1">Certifications & Licenses</h2>
          <p className="text-xs text-[#596174] mb-4">
            Certifications verified by your cooperative administrator increase your matching score.
          </p>

          {profile?.certifications?.length > 0 && (
            <div className="space-y-2 mb-5">
              {profile.certifications.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#E8E5DE] bg-[#FAF9F6]">
                  <div>
                    <p className="text-xs font-bold text-[#0A0A0D]">{c.name}</p>
                    <p className="text-[11px] text-[#596174]">{c.issuingBody}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    c.verified
                      ? 'bg-[#E8F8EF] border-[#A7E8C2] text-[#16834B]'
                      : 'bg-[#FFF9E8] border-[#EED58C] text-[#80540B]'
                  }`}>
                    {c.verified ? '✓ Verified by Admin' : 'Pending Verification'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 pt-3 border-t border-[#F0EDE6]">
            <Input
              label="Certificate Name"
              placeholder="e.g. ITI Electrician Wireman License"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
            />
            <Input
              label="Issuing Organization"
              placeholder="e.g. National Council for Vocational Training"
              value={certBody}
              onChange={(e) => setCertBody(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={saving || !certName.trim()}
              onClick={async () => {
                await addCertification(certName, certBody);
                setCertName('');
                setCertBody('');
              }}
            >
              + Submit Certificate for Verification
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}