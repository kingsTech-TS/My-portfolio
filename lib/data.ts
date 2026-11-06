export const PROFILE = {
  name: "Nnabugwu Solomon",
  role: "Full-stack Developer",
  tagline: "I build pixel-perfect web experiences with modern technologies.",
  email: "ndunewesolomon@gmail.com",
  avatar: "/profile/me.jpg",
  cv: "/CV/Nnabugwu_Solomon_CV.pdf",
}

export const SOCIALS = [
  { name: "Twitter", href: "https://x.com/oneboilikedat" },
  { name: "GitHub", href: "https://github.com/theKingSi?tab=repositories" },
  { name: "WhatsApp", href: "https://wa.link/mzkoo2" },
]

export interface Experience {
  title: string
  company: string
  date: string
  description: string
}

export const EXPERIENCE: Experience[] = [
  {
    title: "Backend Developer",
    company: "Approvable.app",
    date: "2026 - Present",
    description:
      "Building the backend for a visa application review and refusal reapplication platform for people looking to travel and want to know if their document is ready befor they apply.",
  },
  {
    title: "Senior Frontend Developer",
    company: "Life INC.",
    date: "2024 - 2025",
    description:
      "Leading the frontend team in developing modern software applications using React.js, Next.js, JavaScript and TypeScript.",
  },
  {
    title: "JavaScript Certified Developer",
    company: "Techub EKSU",
    date: "2023 - 2024",
    description:
      "Earned certification in JavaScript, enhancing frontend development skills and building dynamic, interactive web applications.",
  },
  {
    title: "Web Designer",
    company: "D'Lence Technologies",
    date: "2022 - 2023",
    description:
      "Designed user-friendly and visually engaging websites, focusing on layout, responsiveness, and user experience.",
  },
  {
    title: "Web Designer in Training",
    company: "D'Lence Technologies",
    date: "2021",
    description:
      "Began the journey into web design by learning HTML, CSS, and design principles through online resources and practice projects.",
  },
]

export const INTERESTS = ["Retro Gaming", "Content Creation", "Photography", "Video Editing", "UI/UX Design"]

export type Category = "All" | "Web App" | "Website" | "Tools"

export interface Project {
  /** set for projects served by the backend API */
  id?: string
  /** false when the project has no live link (demoUrl is "") */
  hasLiveDemo?: boolean
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl: string
  codeUrl: string
  category: Exclude<Category, "All">
  /** shown on the home page */
  featured?: boolean
  /** portrait screenshot for the home page phone mockup ("" if none) */
  mobileImage?: string
}

// Projects and skills are managed in the admin dashboard (/admin) and served by the backend API.
// See lib/api.ts. The original lists were moved to portfolio-BD/scripts/seed_data.json.
