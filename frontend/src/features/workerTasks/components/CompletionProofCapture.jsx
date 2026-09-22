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
    <div className="border border-gray-200 rounded-lg p-3 mt-2 space-y-2 bg-gray-50/50">
      <label className="block text-xs font-medium text-gray-600">Proof of completion (photo/video)</label>

      {!preview ? (
        <label className="flex items-center justify-center border border-dashed border-gray-300 rounded-lg py-4 text-xs text-gray-500 cursor-pointer hover:bg-gray-50">
          📷 Tap to take photo / choose file
          <input type="file" accept="image/*,video/mp4" capture="environment" className="hidden" onChange={handleFile} />
        </label>
      ) : (
        <div className="space-y-2">
          {file?.type.startsWith('video') ? (
            <video src={preview} controls className="w-full rounded-lg max-h-48" />
          ) : (
            <img src={preview} alt="proof preview" className="w-full rounded-lg max-h-48 object-cover" />
          )}
          <input
            type="text"
            placeholder="Optional note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {preview && (
        <button
          onClick={submit}
          disabled={uploading}
          className="text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Proof'}
        </button>
      )}
    </div>
  );
}