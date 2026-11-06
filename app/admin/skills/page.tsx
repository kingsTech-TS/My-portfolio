"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { Plus, Sparkles, X } from "lucide-react"
import { api, ApiError } from "@/lib/admin-api"
import { useToast } from "@/components/ui/use-toast"
import { Btn, inputClass, Spinner } from "@/components/admin/ui"
import { cn } from "@/components/lib/utils"

interface Skill {
  id: string
  name: string
  group: string
  order: number
}

const DEFAULT_GROUPS = ["Frontend", "Backend", "Tools"]
const NEW_GROUP = "__new__"

export default function SkillsPage() {
  const { toast } = useToast()
  const [skills, setSkills] = useState<Skill[] | null>(null)
  const [name, setName] = useState("")
  const [group, setGroup] = useState("Frontend")
  const [customGroup, setCustomGroup] = useState("")
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(() => {
    api<{ items: Skill[] }>("/api/admin/skills")
      .then((r) => setSkills(r.items))
      .catch((e) => {
        setSkills([])
        if (e instanceof ApiError && e.status !== 401) toast({ title: "Could not load skills", description: e.message, variant: "destructive" })
      })
  }, [toast])

  useEffect(load, [load])

  const groups = useMemo(() => {
    const map = new Map<string, Skill[]>()
    for (const g of DEFAULT_GROUPS) map.set(g, [])
    for (const s of skills ?? []) {
      if (!map.has(s.group)) map.set(s.group, [])
      map.get(s.group)!.push(s)
    }
    return [...map.entries()]
  }, [skills])

  async function add(e: FormEvent) {
    e.preventDefault()
    const targetGroup = group === NEW_GROUP ? customGroup.trim() : group
    if (!name.trim() || !targetGroup) return
    setAdding(true)
    try {
      const skill = await api<Skill>("/api/admin/skills", { method: "POST", json: { name: name.trim(), group: targetGroup } })
      setSkills((prev) => [...(prev ?? []), skill])
      setName("")
      if (group === NEW_GROUP) {
        setGroup(targetGroup)
        setCustomGroup("")
      }
    } catch (err) {
      toast({ title: "Could not add skill", description: (err as Error).message, variant: "destructive" })
    } finally {
      setAdding(false)
    }
  }

  async function remove(skill: Skill) {
    setDeleting(skill.id)
    try {
      await api(`/api/admin/skills/${skill.id}`, { method: "DELETE" })
      setSkills((prev) => (prev ?? []).filter((s) => s.id !== skill.id))
    } catch (err) {
      toast({ title: "Could not delete skill", description: (err as Error).message, variant: "destructive" })
    } finally {
      setDeleting(null)
    }
  }

  const groupNames = groups.map(([g]) => g)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Skills</h1>
        <p className="mt-1 text-sm text-muted">Shown in the scrolling strip on the home page and grouped on the About page.</p>
      </div>

      {/* add form */}
      <form
        onSubmit={add}
        className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] sm:flex-row sm:items-center"
      >
        <input
          aria-label="Skill name"
          placeholder="Add a skill, e.g. TanStack Query"
          value={name}
          maxLength={40}
          onChange={(e) => setName(e.target.value)}
          className={cn(inputClass, "sm:flex-1")}
        />
        <select aria-label="Group" value={group} onChange={(e) => setGroup(e.target.value)} className={cn(inputClass, "sm:w-44")}>
          {groupNames.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
          <option value={NEW_GROUP}>New group…</option>
        </select>
        {group === NEW_GROUP && (
          <input
            aria-label="New group name"
            placeholder="Group name"
            value={customGroup}
            maxLength={30}
            onChange={(e) => setCustomGroup(e.target.value)}
            className={cn(inputClass, "sm:w-40")}
          />
        )}
        <Btn type="submit" variant="primary" loading={adding} disabled={!name.trim() || (group === NEW_GROUP && !customGroup.trim())}>
          <Plus className="h-4 w-4" /> Add
        </Btn>
      </form>

      {skills === null ? (
        <div className="grid place-items-center py-20">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {groups.map(([g, items]) => (
            <section key={g} className="rounded-2xl border border-line bg-card p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-fg">{g}</h2>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-neutral-400">{items.length}</span>
              </div>
              {items.length === 0 ? (
                <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-line py-8 text-center text-xs text-muted">
                  <Sparkles className="h-4 w-4" />
                  No {g.toLowerCase()} skills yet
                </div>
              ) : (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="group flex items-center gap-1 rounded-full border border-line bg-ink/60 py-1 pl-3 pr-1 text-sm text-neutral-200"
                    >
                      {s.name}
                      <button
                        onClick={() => remove(s)}
                        disabled={deleting === s.id}
                        aria-label={`Delete ${s.name}`}
                        className="grid h-6 w-6 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-red-500/15 hover:text-red-300 disabled:opacity-40"
                      >
                        {deleting === s.id ? <Spinner className="h-3 w-3" /> : <X className="h-3.5 w-3.5" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
      <p className="text-xs text-neutral-500">Changes appear on the live site within about 5 minutes.</p>
    </div>
  )
}
