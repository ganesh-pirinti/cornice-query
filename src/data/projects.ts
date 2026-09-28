import type { Project } from '../types/project';

/**
 * ==============================================================================
 * CORNICE & QUERY — OFFICIAL PROJECT RESOURCE REPOSITORY
 * ==============================================================================
 * 
 * HOW TO ADD A NEW PROJECT:
 * ------------------------------------------------------------------------------
 * 1. Copy the template block below.
 * 2. Paste it into the `PROJECTS` array below.
 * 3. Fill in your project details.
 * 
 * TEMPLATE TO COPY & PASTE:
 * 
  {
    id: 'cq-02',
    slug: 'my-new-project-slug',
    title: 'My New Project Title',
    shortDescription: 'A short 1-2 sentence overview of the build for cards and previews.',
    description: 'Detailed description explaining what was built, key design principles, and tech stack insights.',
    thumbnail: 'https://images.unsplash.com/... or /path/to/thumbnail.jpg',
    videoUrl: 'https://assets.mixkit.co/... or /path/to/video.mp4', // Optional: leave empty or omit if no video
    category: 'UI/UX', // Categories: 'WEB' | 'UI/UX' | 'JAVASCRIPT' | 'REACT' | 'CSS' | 'ANIMATIONS' | 'MINI PROJECTS'
    technologies: ['React', 'Tailwind CSS', 'TypeScript'],
    codeUrl: 'https://github.com/your-username/repo', // Optional: leave empty or omit if code is not public yet
    liveUrl: 'https://your-demo-link.com', // Optional: leave empty or omit if no live demo exists
    socialUrl: 'https://instagram.com/p/...', // Optional: leave empty or omit if no social link
    featured: false, // Set to true to highlight as Featured Build on Homepage
    publishedDate: '2026-09-06',
  },
 * 
 * IMPORTANT:
 * - If codeUrl is empty or omitted, [ GET CODE ] button will NOT be shown.
 * - If liveUrl is empty or omitted, [ LIVE DEMO ] button will NOT be shown.
 * - If socialUrl is empty or omitted, [ ORIGINAL POST ] button will NOT be shown.
 * ==============================================================================
 */

export const PROJECTS: Project[] = [
  /* -------------------------------------------------------------------------- */
  /*  BUILD #01 — Animated Authentication Interface                             */
  /* -------------------------------------------------------------------------- */
  {
    id: 'cq-01',
    slug: 'animated-authentication-interface',
    projectNumber: '01',
    title: 'Animated Authentication Interface',
    shortDescription: 'A modern futuristic glassmorphism login & signup card with fluid kinetic state morphing and real-time password strength validation.',
    description: 'A modern futuristic glassmorphism login & signup card with fluid kinetic state morphing and real-time password strength validation.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    category: 'UI/UX',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Framer Motion'],
    codeUrl: '/downloads/CQ1-Animated-Authentication-Interface.zip',
    liveUrl: '/projects/animated-authentication-interface/index.html',
    socialUrl: 'https://www.instagram.com/reel/Dd1XKn2SX7A/?utm_source=ig_web_button_share_sheet&stkn=MzRlODBiNWFlZA==',
    featured: true,
    publishedDate: '2026-09-01',
    highlights: [
      'Kinetic input field label animations using SVG mask paths',
      'Real-time cryptographic password entropy meter',
      'Zero external font overhead with system UI stack',
      'Full ARIA accessibility & keyboard navigation focus rings'
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  HELPER QUERY FUNCTIONS                                                    */
/* -------------------------------------------------------------------------- */

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug || (slug === 'animated-login-ui' && p.slug === 'animated-authentication-interface'));
}

export function getFeaturedProject(): Project {
  return PROJECTS.find((p) => p.featured) || PROJECTS[0];
}

export function getRelatedProjects(currentSlug: string, limit = 3): Project[] {
  const current = getProjectBySlug(currentSlug);
  if (!current) return PROJECTS.slice(0, limit);
  
  return PROJECTS
    .filter((p) => p.slug !== currentSlug && p.slug !== 'animated-login-ui')
    .slice(0, limit);
}
