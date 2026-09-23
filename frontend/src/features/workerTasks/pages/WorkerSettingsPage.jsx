import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkerSettings } from '../hooks/useWorkerSettings';
import AvailabilityWindowEditor from '../components/AvailabilityWindowEditor';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

export default function WorkerSettingsPage() {
  const { profile, loading, saving, saveSkillsAndCapacity, saveAvailabilityWindows, addCertification } = useWorkerSettings();

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

  if (loading) return <div className="p-10 text-gray-500">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-xl mx-auto">
        <Link to="/worker" className="text-sm text-indigo-600 mb-4 inline-block">← Back to tasks</Link>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Worker Settings</h1>

        <div className="border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Skills & Capacity</h3>
          <Input label="Skills (comma-separated)" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
          <Input
            label="Max concurrent tasks"
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
          <Button
            onClick={() => saveSkillsAndCapacity(skillsInput.split(',').map((s) => s.trim()).filter(Boolean), capacity)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Skills & Capacity'}
          </Button>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Weekly Availability</h3>
          <p className="text-xs text-gray-400 mb-3">
            These are informational hours for planning — the "Available for jobs" toggle on your dashboard controls live dispatch eligibility right now.
          </p>
          <AvailabilityWindowEditor windows={windows} onChange={setWindows} />
          <button
            onClick={() => saveAvailabilityWindows(windows)}
            disabled={saving}
            className="text-xs px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 mt-4"
          >
            {saving ? 'Saving...' : 'Save Availability'}
          </button>
        </div>

        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-medium text-gray-900 mb-3">Certifications</h3>
          <div className="space-y-2 mb-3">
            {profile?.certifications?.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm border border-gray-100 rounded px-3 py-2">
                <span>{c.name} {c.issuingBody && `· ${c.issuingBody}`}</span>
                <span className={c.verified ? 'text-emerald-600 text-xs' : 'text-amber-600 text-xs'}>
                  {c.verified ? '✓ Verified' : 'Pending review'}
                </span>
              </div>
            ))}
          </div>
          <Input label="Certification name" value={certName} onChange={(e) => setCertName(e.target.value)} placeholder="e.g. Certified Electrician" />
          <Input label="Issuing body (optional)" value={certBody} onChange={(e) => setCertBody(e.target.value)} />
          <Button
            onClick={async () => {
              if (!certName.trim()) return;
              await addCertification({ name: certName, issuingBody: certBody });
              setCertName('');
              setCertBody('');
            }}
            disabled={saving || !certName.trim()}
          >
            Add Certification
          </Button>
        </div>
      </div>
    </div>
  );
}