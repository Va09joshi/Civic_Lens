export default function CredibilityBadge({
  credibility
}: {
  credibility: "high" | "medium" | "low";
}) {
  let color = "bg-green-500";
  let label = "High Credibility";
  if (credibility === "medium") {
    color = "bg-yellow-400";
    label = "Medium Credibility";
  } else if (credibility === "low") {
    color = "bg-blue-500";
    label = "Low Credibility";
  }
  return (
    <span
      className={`inline-block px-2 py-1 text-xs text-white rounded ${color}`}
      title={label}
    >
      {label}
    </span>
  );
}
