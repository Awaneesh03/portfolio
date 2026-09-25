<div align="center">

# 🌐 Awaneesh Gupta — Portfolio

**My personal developer portfolio with a built-in admin dashboard. All content — projects, skills, certificates, gallery, resume — is managed live from Supabase, no redeploy needed.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-eta-mocha-cg9jyw53rm.vercel.app)

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)

</div>

---

## ✨ Features

### Public site
- 🏠 **Pages:** Home · About · Skills · Projects (with detail pages) · Open Source · Achievements · Certificates · Gallery · Resume · Contact
- ⌨️ **Command palette** — press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> to jump anywhere
- 🎞️ **Smooth animations** with Framer Motion and a scroll-progress indicator
- 🧑‍💻 **Coding profiles** — GitHub, LeetCode, Codeforces, CodeChef
- ✉️ **Contact form** — messages are stored in the database
- 🛟 **Resilient** — error boundaries and static fallback data if the database is unreachable

### Admin dashboard (`/admin`)
- 🔐 Google sign-in via Supabase Auth, restricted to the site owner
- 🛠️ Manage **projects, skills, achievements, certificates, gallery, resume, profile and site settings**
- 📥 Read contact-form messages
- 🖼️ Drag-and-drop image uploads (react-dropzone + Supabase Storage)

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + TypeScript, Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Routing | React Router |
| Backend | Supabase — PostgreSQL, Auth, Storage |
| UI extras | lucide-react icons, react-hot-toast |
| Hosting | Vercel |

## 🚀 Getting Started

```bash
git clone https://github.com/Awaneesh03/portfolio.git
cd portfolio
npm install
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Set up the database by running [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor, then:

```bash
npm run dev       # → http://localhost:5173
npm run build     # type-check + production build
npm run lint
```

## 📁 Project Structure

```text
src/
├── components/
│   ├── layout/      # Navbar, Footer, Layout
│   ├── sections/    # Hero, About, Skills, Projects, Contact, …
│   └── ui/          # Button, Card, Modal, CommandPalette, …
├── pages/admin/     # Admin login + management panels
├── hooks/           # useProfile, useAvailability
├── lib/supabase.ts  # Supabase client
├── data/            # Static fallback content
└── types/           # Shared TypeScript types
supabase/schema.sql  # Database schema
```

## 🗄 Database Tables

`projects` · `skills` · `achievements` · `certificates` · `gallery_images` · `resumes` · `contact_messages` · `open_source_contributions` · `site_settings`

---

## 👤 Author

**Awaneesh Gupta** — B.Tech CSE (AI) @ Vedam School of Technology

[![GitHub](https://img.shields.io/badge/GitHub-Awaneesh03-181717?style=flat-square&logo=github)](https://github.com/Awaneesh03)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-awaneesh--gupta-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/awaneesh-gupta)

<p align="center"><sub>If you found this project useful, consider giving it a ⭐</sub></p>
