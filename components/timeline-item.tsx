import type { ReactNode } from "react"

interface TimelineItemProps {
  icon: ReactNode
  date: string
  title: string
  company: string
  description: string
  color: "pink" | "cyan" | "yellow" | "green" | "purple"
}

export function TimelineItem({ icon, date, title, company, description, color }: TimelineItemProps) {
  const colorClasses = {
    pink: "bg-pink-500/20 border-pink-500 text-pink-400",
    cyan: "bg-cyan-500/20 border-cyan-500 text-cyan-400",
    yellow: "bg-yellow-500/20 border-yellow-500 text-yellow-400",
    green: "bg-green-500/20 border-green-500 text-green-400",
    purple: "bg-purple-500/20 border-purple-500 text-purple-400",
  }

  return (
    <div className="relative pl-8 border-l-2 border-dashed border-gray-700 sm:pl-10">
      <div
        className={`absolute left-[-9px] sm:left-[-13px] top-0 flex items-center justify-center w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 ${colorClasses[color]}`}
      >
        {icon}
      </div>

      <div className="mb-1 text-xs font-vt323 sm:text-sm">
        <span className={`text-${color}-400`}>{date}</span>
      </div>

      <h3 className="text-base font-bold font-pixel text-white sm:text-lg">{title}</h3>
      <div className="mb-1 text-xs font-vt323 text-gray-400 sm:text-sm sm:mb-2">{company}</div>

      <p className="text-sm text-gray-300 font-vt323 sm:text-base">{description}</p>
    </div>
  )
}
