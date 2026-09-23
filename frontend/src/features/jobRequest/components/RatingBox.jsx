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
      <div className="border border-gray-100 rounded-lg p-3 mt-2 bg-amber-50/30">
        <p className="text-xs text-gray-500 mb-1">Your rating</p>
        <StarPicker value={existing.stars} readOnly />
        {existing.comment && <p className="text-xs text-gray-500 mt-1">"{existing.comment}"</p>}
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
    <div className="border border-gray-100 rounded-lg p-3 mt-2">
      <p className="text-xs text-gray-500 mb-2">Rate {task.assignedWorker.name}'s work</p>
      <StarPicker value={stars} onChange={setStars} />
      <textarea
        rows={2}
        placeholder="Optional feedback"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-indigo-400 mt-2"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <button
        onClick={submit}
        disabled={stars === 0 || submitting}
        className="text-xs px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 mt-2"
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
}