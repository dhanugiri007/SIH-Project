import { useEffect, useState } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useJobRequestContext } from '../jobRequestContext';
import Button from '../../../shared/components/Button';

export default function JobRequestForm() {
  const { submitRequest, submitting, error } = useJobRequestContext();
  const { supported, listening, transcript, start, stop } = useSpeechToText();
  const [text, setText] = useState('');
  const [usedVoice, setUsedVoice] = useState(false);

  useEffect(() => {
    if (transcript) {
      setText(transcript);
      setUsedVoice(true);
    }
  }, [transcript]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await submitRequest(text, usedVoice ? 'voice' : 'text');
  };

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
        onChange={(e) => {
          setText(e.target.value);
          setUsedVoice(false);
        }}
      />

      <div className="flex items-center gap-3 mb-4">
        {supported ? (
          <button
            type="button"
            onClick={listening ? stop : start}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border transition-colors ${
              listening
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            🎤 {listening ? 'Listening... tap to stop' : 'Speak instead'}
          </button>
        ) : (
          <span className="text-xs text-gray-400">Voice input not supported in this browser</span>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <Button type="submit" disabled={submitting || !text.trim()}>
        {submitting ? 'Understanding your request...' : 'Generate Job Plan'}
      </Button>
    </form>
  );
}