type Props = {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  className?: string;
  showLabel?: boolean;
};

export function ProgressRing({
  value,
  size = 32,
  stroke = 3,
  className,
  showLabel = false,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = circumference * (1 - clamped);

  return (
    <span
      className={`relative inline-grid place-items-center ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <span
          className="absolute font-medium leading-none tabular-nums text-primary"
          style={{ fontSize: Math.max(9, size * 0.32) }}
        >
          {Math.round(clamped * 100)}%
        </span>
      )}
    </span>
  );
}
