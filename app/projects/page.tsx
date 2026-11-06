import ProjectsGrid from "@/components/projects-grid"
import { getProjects } from "@/lib/api"

export const revalidate = 300

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsGrid projects={projects} />
}
