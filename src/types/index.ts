export interface Project {
  id: string
  title: string
  description: string
  long_description?: string
  tech_stack: string[]
  github_url?: string
  live_url?: string
  image_url?: string
  featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string
  credential_url?: string
  image_url?: string
  description?: string
  created_at: string
}

export interface GalleryImage {
  id: string
  title: string
  caption?: string
  category: string
  image_url: string
  order_index: number
  created_at: string
}

export interface Skill {
  id: string
  name: string
  category: 'language' | 'frontend' | 'backend' | 'database' | 'tool' | 'learning'
  proficiency: number
  icon?: string
  order_index: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  category: string
  icon?: string
  created_at: string
}

export interface OpenSourceContribution {
  id: string
  repo_name: string
  repo_url: string
  description: string
  pr_url?: string
  pr_title?: string
  status: 'merged' | 'open' | 'closed'
  date: string
  org_logo?: string
}

export interface CodingProfile {
  platform: string
  username: string
  url: string
  stats?: Record<string, string | number>
  icon: string
  color: string
}

export interface Resume {
  id: string
  file_url: string
  uploaded_at: string
  version: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  read: boolean
}

export interface NavItem {
  label: string
  href: string
}

export type SkillCategory = Skill['category']
