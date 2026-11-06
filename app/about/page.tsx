import Avatar from "@/components/avatar"
import { Card, SectionLabel, AvailableBadge } from "@/components/bento"
import { EXPERIENCE, INTERESTS } from "@/lib/data"
import { getSkills } from "@/lib/api"

export const metadata = { title: "About | Nnabugwu Solomon" }
export const revalidate = 300

export default async function AboutPage() {
  const skills = await getSkills()
  return (
    <div className="flex flex-col gap-5">
      <Card glow="tr" className="px-7 py-10 sm:px-12 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted sm:text-sm">About me</p>
          <AvailableBadge />
        </div>
        <h1 className="mt-8 max-w-2xl text-gradient text-4xl font-semibold tracking-tighter sm:text-5xl">
          Where design meets code<span className="text-brand">.</span>
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
          <div className="w-fit rounded-full border border-white/10 bg-ink/60 p-2.5">
            <Avatar className="h-40 w-40 sm:h-52 sm:w-52" sizes="400px" />
          </div>
          <div className="max-w-2xl space-y-4 text-base leading-relaxed text-neutral-300 sm:text-lg">
            <p>
              I&rsquo;m a passionate software developer with a love for creating immersive digital experiences. My
              journey began in the early days of the web, and I&rsquo;ve evolved alongside the technologies that power
              our digital world.
            </p>
            <p>
              With a background in both design and development, I bring a unique perspective to every project. I
              believe in the balance between form and function: websites and apps that look great and perform
              flawlessly.
            </p>
            <p>
              When I&rsquo;m not coding, you&rsquo;ll find me capturing moments through photography, crafting engaging
              content, or exploring visual storytelling.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
        <Card className="px-7 py-10 sm:px-10 sm:py-12 md:col-span-3">
          <SectionLabel>My Journey</SectionLabel>
          <ol className="mt-10 space-y-8 border-l border-line pl-6">
            {EXPERIENCE.map((job, i) => (
              <li key={job.title} className="relative">
                <span
                  className={`absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-brand" : "bg-neutral-500"}`}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className={`text-lg sm:text-xl ${i === 0 ? "text-brand" : "text-fg"}`}>{job.title}</p>
                  <p className="text-sm text-muted">{job.date}</p>
                </div>
                <p className="mt-1 text-sm text-neutral-400">{job.company}</p>
                <p className="mt-3 text-base leading-relaxed text-neutral-300">{job.description}</p>
              </li>
            ))}
          </ol>
        </Card>

        <div className="flex flex-col gap-5 md:col-span-2">
          <Card className="px-7 py-10 sm:px-10">
            <SectionLabel>Skills</SectionLabel>
            <div className="mt-8 space-y-6">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group}>
                  <p className="mb-3 text-sm uppercase tracking-wider text-muted">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span key={s} className="rounded-full border border-line bg-ink/60 px-3 py-1 text-sm text-neutral-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card glow="bl" className="flex-1 px-7 py-10 sm:px-10">
            <SectionLabel>Interests</SectionLabel>
            <ul className="mt-6 space-y-2 text-base text-neutral-300">
              {INTERESTS.map((x) => (
                <li key={x} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {x}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
