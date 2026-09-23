import { useEffect, useState } from 'react';
import StarPicker from './StartPicker';
import { ratingService } from '../service/ratingService';

export default function RatingBox({ task }) {
  const [existing, setExisting] = useState(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    ratingService.getForTask(task._id).then(setExisting);
  }, [task._id]);

  if (!task.assignedWorker || !['completed', 'verified'].includes(task.status)) return null;

  if (existing) {
    return (
      <div className="border border-[#EED58C] rounded-xl p-3 mt-3 bg-[#FFF9E8]/50">
        <p className="text-xs font-semibold text-[#80540B] mb-1">Your Verified Feedback</p>
        <StarPicker value={existing.stars} readOnly />
        {existing.comment && <p className="text-xs text-[#596174] mt-1.5 italic">&ldquo;{existing.comment}&rdquo;</p>}
      </div>
    );
  }

  const submit = async () => {
    if (stars === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const created = await ratingService.submit(task._id, stars, comment);
      setExisting(created);
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-[#E8E5DE] rounded-xl p-3.5 mt-3 bg-[#FAF9F6]">
      <p className="text-xs font-semibold text-[#101010] mb-2">Rate {task.assignedWorker.name}&apos;s work</p>
      <StarPicker value={stars} onChange={setStars} />
      <textarea
        rows={2}
        placeholder="Share a short note about quality and timeliness..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full text-xs px-3 py-2 bg-white border border-[#E8E5DE] rounded-lg outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32] mt-2 transition-colors"
      />
      {error && <p className="text-xs text-[#C2413B] mt-1">{error}</p>}
      <button
        onClick={submit}
        disabled={stars === 0 || submitting}
        className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#B8861B] hover:bg-[#A57412] text-white disabled:opacity-50 mt-2 transition-colors cursor-pointer shadow-sm"
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
}