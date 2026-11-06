import HeroCard from "@/components/hero-card"
import { Card, Marquee, ProjectPhoneCard, ProjectStackCard, SectionLabel } from "@/components/bento"
import { EXPERIENCE, type Project } from "@/lib/data"
import { getProjects, getSkills } from "@/lib/api"
import { checkEmbeddable } from "@/lib/embed"

export const revalidate = 300

const SERVICES = [
  { label: "Frontend development", glow: "tr" as const, wide: true },
  { label: "Mobile Dev", glow: "r" as const },
  { label: "Backend & APIs", glow: "bl" as const },
]

const subtitle = (p: Project) => [p.category, p.tags[0]].filter(Boolean).join(" · ")

export default async function Home() {
  const [projects, skills] = await Promise.all([getProjects(), getSkills()])
  const allSkills = Object.values(skills).flat()

  // Featured projects (set in the admin workspace), in site order; top up with the first projects.
  const featured = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 3)
  // Layout slots: 1st and 3rd as stacked cards on the right, 2nd in the phone mockup on the left.
  const [stackTop, phone, stackBottom] = featured.length >= 2 ? featured : [featured[0], undefined, undefined]

  // The phone mockup renders the live site in mobile view when the site allows embedding;
  // otherwise it falls back to the project's screenshot.
  const phoneLiveUrl =
    phone?.demoUrl && phone.hasLiveDemo !== false && (await checkEmbeddable(phone.demoUrl)).embeddable
      ? phone.demoUrl
      : undefined

  return (
    <div className="flex flex-col gap-5">
      <HeroCard projectCount={projects.length} />

      {allSkills.length > 0 && (
        <Card delay={0.1} className="py-5">
          <Marquee items={allSkills} />
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          <Card delay={0.05} className="px-7 py-10 sm:px-10 sm:py-12">
            <SectionLabel>Recent Work</SectionLabel>
            <ul className="mt-8 -mx-3">
              {EXPERIENCE.map((job, i) => (
                <li
                  key={job.title}
                  className="group/row flex items-center justify-between gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-white/[0.03]"
                >
                  <div>
                    <p
                      className={`text-lg font-medium tracking-tight sm:text-xl ${
                        i === 0 ? "text-brand" : "text-fg group-hover/row:text-brand"
                      } transition-colors`}
                    >
                      {job.title}
                    </p>
                    <p className="mt-1 font-mono text-xs text-muted sm:text-sm">{job.date}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300 sm:text-sm">
                    {job.company}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {phone && (
            <ProjectPhoneCard project={phone} subtitle={subtitle(phone)} liveUrl={phoneLiveUrl} className="flex-1" delay={0.1} />
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            {SERVICES.map((s, i) => (
              <Card
                key={s.label}
                glow={s.glow}
                delay={0.05 * i}
                className={`grid h-32 place-items-center px-4 text-center sm:h-36 ${s.wide ? "col-span-2" : ""}`}
              >
                <p className="text-lg font-medium tracking-tight text-neutral-100 sm:text-2xl">{s.label}</p>
              </Card>
            ))}
          </div>

          {stackTop && <ProjectStackCard project={stackTop} subtitle={subtitle(stackTop)} delay={0.1} />}
          {stackBottom && (
            <ProjectStackCard project={stackBottom} subtitle={subtitle(stackBottom)} className="flex-1" delay={0.15} />
          )}
        </div>
      </div>
    </div>
  )
}
