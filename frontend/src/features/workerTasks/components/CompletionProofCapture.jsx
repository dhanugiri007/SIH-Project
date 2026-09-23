import { useState } from 'react';
import { completionProofService } from '../service/completionProofService';

export default function CompletionProofCapture({ taskId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const proof = await completionProofService.upload(taskId, file, note);
      onUploaded(proof);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-[#E8E5DE] rounded-xl p-3.5 mt-3 space-y-2.5 bg-[#FAF9F6]">
      <label className="block text-xs font-semibold text-[#101010] uppercase tracking-wide">
        Proof of Completion (Photo or Video)
      </label>

      {!preview ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E8E5DE] hover:border-[#D5A63A] bg-white rounded-xl py-5 text-xs text-[#596174] cursor-pointer hover:bg-[#FAF9F6] transition-colors">
          <span className="text-xl mb-1">📸</span>
          <span className="font-semibold text-[#101010]">Tap to capture photo or upload video</span>
          <span className="text-[11px] text-[#8A909F] mt-0.5">Required for customer verification and payout clearance</span>
          <input type="file" accept="image/*,video/mp4" capture="environment" className="hidden" onChange={handleFile} />
        </label>
      ) : (
        <div className="space-y-2.5">
          {file?.type.startsWith('video') ? (
            <video src={preview} controls className="w-full rounded-xl max-h-48 bg-black" />
          ) : (
            <img src={preview} alt="proof preview" className="w-full rounded-xl max-h-48 object-cover border border-[#E8E5DE]" />
          )}
          <input
            type="text"
            placeholder="Add note on work done (e.g. replaced washers and tested flow)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-[#E8E5DE] rounded-lg outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32] transition-colors"
          />
        </div>
      )}

      {error && <p className="text-xs text-[#C2413B] font-medium">{error}</p>}

      {preview && (
        <button
          onClick={submit}
          disabled={uploading}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#B8861B] hover:bg-[#A57412] text-white disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
        >
          {uploading ? 'Uploading Proof...' : 'Submit Completion Proof'}
        </button>
      )}
    </div>
  );
}