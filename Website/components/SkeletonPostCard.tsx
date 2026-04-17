export default function SkeletonPostCard() {
  return (
    <div className="bg-white rounded-card shadow-card">
      <div className="h-48 shimmer rounded-t-card" />
      <div className="p-4 space-y-2">
        <div className="h-4 shimmer rounded w-3/4" />
        <div className="h-3 shimmer rounded w-1/2" />
        <div className="h-3 shimmer rounded w-2/3" />
      </div>
    </div>
  );
}
