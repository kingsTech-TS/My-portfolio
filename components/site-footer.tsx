import { Card, AvailableBadge } from "@/components/bento"
import { SOCIALS } from "@/lib/data"

export default function SiteFooter() {
  return (
    <Card
      glow="bl"
      className="mt-5 flex flex-col items-center gap-5 px-8 py-7 text-center sm:flex-row sm:justify-between sm:px-12 sm:text-left"
    >
      <p className="text-xl text-neutral-200 sm:text-2xl">Portfolio {new Date().getFullYear()}</p>
      <ul className="flex gap-5 text-base sm:text-lg">
        {SOCIALS.map((s, i) => (
          <li key={s.name}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={i === 0 ? "text-brand hover:text-brand-hi" : "text-neutral-200 hover:text-brand"}
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
      <AvailableBadge />
    </Card>
  )
}
