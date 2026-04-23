interface SkillBadgeProps {
  name: string;
  color:
    | "cyan"
    | "blue"
    | "green"
    | "yellow"
    | "orange"
    | "pink"
    | "purple"
    | "white"
    | "gray"
    | "red"
    | "indigo"
    | "rose"
    | "silver"
    | "violet"
    | "black"
    | "lime"
    | "emerald"
    | "amber"
    | "sky"
    | "slate"
    | "zinc"
    | "neutral"
    | "stone"
    | "fuchsia";
}

export function SkillBadge({ name, color }: SkillBadgeProps) {
  const colorClasses = {
    cyan: "bg-cyan-900/50 text-cyan-400 border-cyan-500",
    blue: "bg-blue-900/50 text-blue-400 border-blue-500",
    green: "bg-green-900/50 text-green-400 border-green-500",
    yellow: "bg-yellow-900/50 text-yellow-400 border-yellow-500",
    orange: "bg-orange-900/50 text-orange-400 border-orange-500",
    pink: "bg-pink-900/50 text-pink-400 border-pink-500",
    purple: "bg-purple-900/50 text-purple-400 border-purple-500",
    red: "bg-red-900/50 text-red-400 border-red-500",
    white: "bg-gray-900/50 text-white border-gray-500",
    rose: "bg-rose-900/50 text-rose-400 border-rose-500",
    silver: "bg-gray-900/50 text-gray-400 border-gray-500",
    indigo: "bg-indigo-900/50 text-indigo-400 border-indigo-500",
    gray: "bg-gray-900/50 text-gray-400 border-gray-500",
    violet: "bg-violet-950/60 text-violet-400 border-violet-600",
    black: "bg-black/60 text-gray-200 border-gray-600",
    teal: "bg-teal-900/50 text-teal-400 border-teal-500",
    emerald: "bg-emerald-900/50 text-emerald-400 border-emerald-500",
    lime: "bg-lime-900/40 text-lime-400 border-lime-500",
    amber: "bg-amber-900/50 text-amber-400 border-amber-500",
    sky: "bg-sky-900/50 text-sky-400 border-sky-500",
    slate: "bg-slate-900/50 text-slate-400 border-slate-500",
    zinc: "bg-zinc-900/50 text-zinc-400 border-zinc-500",
    neutral: "bg-neutral-900/50 text-neutral-400 border-neutral-500",
    stone: "bg-stone-900/50 text-stone-400 border-stone-500",
    fuchsia: "bg-fuchsia-900/50 text-fuchsia-400 border-fuchsia-500",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${colorClasses[color]} font-vt323 sm:text-sm sm:px-3`}
    >
      {name}
    </span>
  );
}
