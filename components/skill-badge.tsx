interface SkillBadgeProps {
 name: string
    color: "cyan" | "blue" | "green" | "yellow" | "orange" | "pink" | "purple" | "white" | "gray" | "red" | "indigo" | "rose" | "silver" | "violet" | "black"

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
    }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${colorClasses[color]} font-vt323 sm:text-sm sm:px-3`}
    >
      {name}
    </span>
  )
}
