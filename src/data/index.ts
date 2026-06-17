import type { CodingProfile, Skill } from '@/types'

export const PERSONAL_INFO = {
  name: 'Awaneesh Gupta',
  title: 'B.Tech CSE (AI) Student',
  subtitle: 'Full Stack Developer',
  email: 'kg3327949@gmail.com',
  github: 'https://github.com/awaneeshgupta',
  linkedin: 'https://linkedin.com/in/awaneeshgupta',
  twitter: 'https://twitter.com/awaneeshgupta',
  location: 'India',
  about: `I'm a passionate B.Tech Computer Science (AI) student at Vedam School of Technology, on a mission to build impactful software that sits at the intersection of AI and full-stack development. I love crafting clean, performant applications and diving deep into machine learning concepts.`,
  aboutLong: `My journey in tech started when I wrote my first "Hello, World!" program and instantly became fascinated by the power of code to create something from nothing. Since then, I've been on a continuous learning path — exploring everything from frontend aesthetics to backend architecture to the exciting world of artificial intelligence.

At Vedam School of Technology, I'm pursuing my passion for both AI and software engineering, working on real-world projects that sharpen my skills and expand my thinking. I believe great software is built at the crossroads of technical excellence and user empathy.

When I'm not coding, you'll find me contributing to open source, solving competitive programming problems, or experimenting with the latest AI models. I'm always up for a challenge and love collaborating with people who are as passionate about technology as I am.`,
  education: {
    institution: 'Vedam School of Technology',
    degree: 'B.Tech CSE (AI)',
    duration: '2025 – 2029',
    location: 'India',
  },
  goals: [
    'Build production-grade AI-powered applications',
    'Contribute meaningfully to open source projects',
    'Master the full spectrum from ML research to deployment',
    'Create software that solves real human problems',
  ],
}

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Open Source', href: '/open-source' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
]

export const STATIC_SKILLS: Skill[] = [
  { id: '1', name: 'Python', category: 'language', proficiency: 85, order_index: 1 },
  { id: '2', name: 'TypeScript', category: 'language', proficiency: 80, order_index: 2 },
  { id: '3', name: 'JavaScript', category: 'language', proficiency: 82, order_index: 3 },
  { id: '4', name: 'Java', category: 'language', proficiency: 70, order_index: 4 },
  { id: '5', name: 'C++', category: 'language', proficiency: 65, order_index: 5 },
  { id: '6', name: 'React', category: 'frontend', proficiency: 85, order_index: 1 },
  { id: '7', name: 'Next.js', category: 'frontend', proficiency: 75, order_index: 2 },
  { id: '8', name: 'Tailwind CSS', category: 'frontend', proficiency: 88, order_index: 3 },
  { id: '9', name: 'Framer Motion', category: 'frontend', proficiency: 72, order_index: 4 },
  { id: '10', name: 'Node.js', category: 'backend', proficiency: 78, order_index: 1 },
  { id: '11', name: 'Spring Boot', category: 'backend', proficiency: 70, order_index: 2 },
  { id: '12', name: 'FastAPI', category: 'backend', proficiency: 72, order_index: 3 },
  { id: '13', name: 'PostgreSQL', category: 'database', proficiency: 75, order_index: 1 },
  { id: '14', name: 'MongoDB', category: 'database', proficiency: 70, order_index: 2 },
  { id: '15', name: 'Supabase', category: 'database', proficiency: 80, order_index: 3 },
  { id: '16', name: 'Git & GitHub', category: 'tool', proficiency: 88, order_index: 1 },
  { id: '17', name: 'Docker', category: 'tool', proficiency: 65, order_index: 2 },
  { id: '18', name: 'VS Code', category: 'tool', proficiency: 92, order_index: 3 },
  { id: '19', name: 'Machine Learning', category: 'learning', proficiency: 50, order_index: 1 },
  { id: '20', name: 'LangChain', category: 'learning', proficiency: 40, order_index: 2 },
  { id: '21', name: 'Rust', category: 'learning', proficiency: 25, order_index: 3 },
]

export const CODING_PROFILES: CodingProfile[] = [
  {
    platform: 'GitHub',
    username: 'awaneeshgupta',
    url: 'https://github.com/awaneeshgupta',
    icon: 'github',
    color: '#ffffff',
    stats: { repos: '20+', followers: '15+', contributions: '200+' },
  },
  {
    platform: 'LeetCode',
    username: 'awaneeshgupta',
    url: 'https://leetcode.com/awaneeshgupta',
    icon: 'code',
    color: '#ffa116',
    stats: { solved: '100+', rating: 'Beginner', streak: '10' },
  },
  {
    platform: 'Codeforces',
    username: 'awaneeshgupta',
    url: 'https://codeforces.com/profile/awaneeshgupta',
    icon: 'terminal',
    color: '#1f8dd6',
    stats: { rating: 'Newbie', problems: '50+' },
  },
  {
    platform: 'CodeChef',
    username: 'awaneeshgupta',
    url: 'https://codechef.com/users/awaneeshgupta',
    icon: 'chef-hat',
    color: '#5b4638',
    stats: { rating: '1★', problems: '30+' },
  },
]

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  language: 'Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Databases',
  tool: 'Tools & DevOps',
  learning: 'Currently Learning',
}

export const SKILL_CATEGORY_COLORS: Record<string, string> = {
  language: '#f59e0b',
  frontend: '#60a5fa',
  backend: '#34d399',
  database: '#fb923c',
  tool: '#f472b6',
  learning: '#a3e635',
}
