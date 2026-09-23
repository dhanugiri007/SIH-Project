export default function ExplanationPanel({ explanation }) {
  if (!explanation) return null;
  return (
    <div className="mt-2.5 text-xs bg-[#FFF9E8] border border-[#EED58C] rounded-xl p-3 text-[#5C3C08] space-y-1.5 shadow-sm">
      <div className="flex items-center gap-1.5 font-semibold text-[#80540B]">
        <span>⚡ Matching Rationale</span>
      </div>
      <p className="leading-relaxed">{explanation.reason}</p>
      <div className="flex gap-3 flex-wrap text-xs pt-1.5 border-t border-[#FBECC5] text-[#80540B]">
        <span>Skill Match: <strong>{explanation.skillMatchScore}</strong></span>
        <span>Proximity: <strong>{explanation.proximityScore}</strong></span>
        <span>Fairness: <strong>{explanation.fairnessScore}</strong></span>
        <span>Rating: <strong>{explanation.ratingScore}</strong></span>
        <span className="font-bold text-[#B8861B]">Score: {explanation.totalScore}</span>
      </div>
    </div>
  );
}