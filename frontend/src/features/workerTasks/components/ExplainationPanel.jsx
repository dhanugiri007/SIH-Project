export default function ExplanationPanel({ explanation }) {
  if (!explanation) return null;
  return (
    <div className="mt-2 text-xs bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-indigo-800 space-y-1">
      <p>{explanation.reason}</p>
      <div className="flex gap-3 flex-wrap text-indigo-600">
        <span>Skill: {explanation.skillMatchScore}</span>
        <span>Proximity: {explanation.proximityScore}</span>
        <span>Fairness: {explanation.fairnessScore}</span>
        <span>Rating: {explanation.ratingScore}</span>
        <span className="font-semibold">Total: {explanation.totalScore}</span>
      </div>
    </div>
  );
}