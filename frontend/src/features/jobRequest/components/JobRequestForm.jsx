import { useEffect, useState } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useGeolocation } from '../hooks/useGeolocation';
import { useJobRequestContext } from '../jobRequestContext';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';

export default function JobRequestForm() {
  const { submitRequest, submitting, error } = useJobRequestContext();
  const { supported, listening, transcript, start, stop } = useSpeechToText();
  const { coords, address: resolvedAddress, status: geoStatus, error: geoError, locate } = useGeolocation();

  const [text, setText] = useState('');
  const [address, setAddress] = useState('');
  const [usedVoice, setUsedVoice] = useState(false);

  useEffect(() => {
    if (transcript) {
      setText(transcript);
      setUsedVoice(true);
    }
  }, [transcript]);

  useEffect(() => {
    if (resolvedAddress) {
      setAddress(resolvedAddress);
    }
  }, [resolvedAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await submitRequest({
      rawRequestText: text,
      inputMode: usedVoice ? 'voice' : 'text',
      serviceAddress: address,
      serviceLocation: coords ? { coordinates: [coords.lng, coords.lat] } : undefined,
    });
  };

  const locateLabel = {
    idle: 'Auto-detect current location',
    locating: 'Accessing GPS...',
    resolving: 'Resolving address...',
    done: 'Location pinned',
    error: 'Retry location',
  }[geoStatus] || 'Auto-detect current location';

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#E8E5DE] rounded-2xl p-6 md:p-8 shadow-sahyog-card">
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#101010] uppercase tracking-wide mb-1.5">
          Describe the Work Needed
        </label>
        <p className="text-xs text-[#596174] mb-2.5">
          Describe the requirements in natural language — our dispatch system will extract individual tasks and match certified cooperative workers.
        </p>
        <textarea
          rows={4}
          className="w-full px-3.5 py-2.5 bg-white border border-[#E8E5DE] rounded-xl text-sm text-[#101010] placeholder-[#9CA1AD] outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32] transition-colors leading-relaxed"
          placeholder="e.g. Need kitchen exhaust fan repaired, switchboard short circuit fixed, and two water faucets replaced in the bathroom."
          value={text}
          onChange={(e) => { setText(e.target.value); setUsedVoice(false); }}
        />
      </div>

      <div className="flex items-center gap-3 mb-5">
        {supported ? (
          <button
            type="button"
            onClick={listening ? stop : start}
            className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all duration-150 cursor-pointer ${
              listening
                ? 'bg-[#FCE9E7] border-[#F5C2BF] text-[#C2413B] animate-pulse'
                : 'bg-[#FFF9E8] border-[#EED58C] text-[#80540B] hover:bg-[#FBECC5]'
            }`}
          >
            <span>🎙️</span>
            <span>{listening ? 'Listening... click to finish' : 'Speak your request instead'}</span>
          </button>
        ) : (
          <span className="text-xs text-[#8A909F]">Voice dictation not supported in this browser</span>
        )}
      </div>

      <div className="space-y-2 mb-5">
        <Input
          label="Service Destination Address"
          placeholder="House/Flat number, building, street, landmark"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={locate}
            disabled={geoStatus === 'locating' || geoStatus === 'resolving'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E8E5DE] bg-[#FAF9F6] text-[#596174] hover:text-[#101010] hover:border-[#D5A63A] transition-colors disabled:opacity-60 cursor-pointer"
          >
            <span>📍</span>
            <span>{locateLabel}</span>
          </button>
          {geoStatus === 'error' && (
            <span className="text-xs text-[#C2413B] font-medium">{geoError || 'Could not fetch GPS coords'} — please type address manually</span>
          )}
          {geoStatus === 'done' && (
            <span className="text-xs text-[#16834B] font-medium flex items-center gap-1">
              ✓ GPS verified
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[#FCE9E7] border border-[#F5C2BF] text-xs text-[#C2413B] font-medium mb-4">
          {error}
        </div>
      )}

      <div className="pt-2 border-t border-[#F0EDE6]">
        <Button
          type="submit"
          variant="primary"
          disabled={submitting || !text.trim()}
          iconRight={
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
        >
          {submitting ? 'Analyzing & Decomposing Tasks...' : 'Submit & Find Cooperative Workers'}
        </Button>
      </div>
    </form>
  );
}