export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <polygon points="24,1.5 34.5,12 24,22.5 13.5,12" fill="#2f6f78" />
      <polygon points="12,13.5 22.5,24 12,34.5 1.5,24" fill="#e0bf8f" />
      <polygon points="36,13.5 46.5,24 36,34.5 25.5,24" fill="#c66d4c" />
      <polygon points="24,25.5 34.5,36 24,46.5 13.5,36" fill="#35665e" />
    </svg>
  );
}