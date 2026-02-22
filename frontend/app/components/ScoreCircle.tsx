"use client";

interface ScoreCircleProps {
  score: number;
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Dynamic color based on your gauge image
  const getColor = (s: number) => {
    if (s >= 80) return "#34c759"; // Green
    if (s >= 60) return "#afcc2f"; // Light Green/Yellow-Green
    if (s >= 40) return "#ffcc00"; // Yellow
    if (s >= 25) return "#ff9500"; // Orange
    return "#ff3b30"; // Red
  };

  const getRating = (s: number) => {
    if (s >= 80) return "EXCELLENT";
    if (s >= 60) return "GOOD";
    if (s >= 40) return "FAIR";
    return "POOR";
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="relative flex h-48 w-48 items-center justify-center">
        {/* Background Track */}
        <div className="absolute h-[140px] w-[140px] rounded-full bg-[#f1f5f9]" />

        {/* SVG Progress Circle */}
        <svg
          className="h-full w-full -rotate-90 transform"
          viewBox="0 0 192 192"
        >
          {/* Base Track */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress (Color matches the pattern) */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke={getColor(score)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Centered Score Text */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-6xl font-black tracking-tighter text-[#1e293b]">
            {score}
          </span>
          <span
            className="text-[10px] font-black tracking-[0.25em] uppercase mt-[-4px]"
            style={{ color: getColor(score) }}
          >
            {getRating(score)}
          </span>
        </div>
      </div>

      {/* Bottom Strength Badge */}
      <div className="rounded-full bg-[#f1f5f9] px-10 py-3 shadow-sm border border-black/5">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-black/40">
          Resume Strength
        </span>
      </div>
    </div>
  );
}
