export default function FootballSpinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`${className} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" fill="var(--panel-bg)" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7.5 16 10.4 14.5 15H9.5L8 10.4 12 7.5Z"
        fill="currentColor"
      />
      <path
        d="M12 7.5V3.2M16 10.4 20.1 9M14.5 15l2.4 3.6M9.5 15l-2.4 3.6M8 10.4 3.9 9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}
