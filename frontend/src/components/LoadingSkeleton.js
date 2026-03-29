export default function LoadingSkeleton({ lines = 3 }) {
  return (
    <div className="skeleton-card" aria-hidden="true">
      {Array.from({ length: lines }).map((_, idx) => (
        <div key={idx} className={`skeleton-line ${idx === 0 ? "wide" : ""}`} />
      ))}
    </div>
  );
}
