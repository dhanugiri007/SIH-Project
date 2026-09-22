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

  // Once reverse geocoding resolves, fill the address field (only if user hasn't typed their own)
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
    idle: 'Use my current location',
    locating: 'Getting your location...',
    resolving: 'Finding address...',
    done: 'Location captured',
    error: 'Try again',
  }[geoStatus];

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Describe what you need done
      </label>
      <textarea
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
        placeholder="e.g. My kitchen needs deep cleaning, a leaking tap fixed, and a wobbly cabinet hinge repaired"
        value={text}
        onChange={(e) => { setText(e.target.value); setUsedVoice(false); }}
      />

      <div className="flex items-center gap-3 mb-4">
        {supported ? (
          <button
            type="button"
            onClick={listening ? stop : start}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border transition-colors ${
              listening ? 'bg-red-50 border-red-300 text-red-600' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            🎤 {listening ? 'Listening... tap to stop' : 'Speak instead'}
          </button>
        ) : (
          <span className="text-xs text-gray-400">Voice input not supported in this browser</span>
        )}
      </div>

      <Input
        label="Service address"
        placeholder="House / street / area"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={locate}
          disabled={geoStatus === 'locating' || geoStatus === 'resolving'}
          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60"
        >
          📍 {locateLabel}
        </button>
        {geoStatus === 'error' && (
          <span className="text-xs text-red-500">{geoError || 'Could not get location'} — you can still type it manually</span>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <Button type="submit" disabled={submitting || !text.trim()}>
        {submitting ? 'Understanding & dispatching...' : 'Generate Job Plan'}
      </Button>
    </form>
  );
}