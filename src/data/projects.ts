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
  /*  EXAMPLE PROJECT (Copy this structure for future Cornice & Query posts)    */
  /* -------------------------------------------------------------------------- */
  {
    id: 'cq-01',
    slug: 'animated-login-ui',
    projectNumber: '01',
    title: 'Animated Authentication Interface',
    shortDescription: 'A modern futuristic glassmorphism login & signup card with fluid kinetic state morphing and real-time password strength validation.',
    description: `A production-ready, ultra-smooth authentication interface engineered with modern CSS grid, CSS variables, and Framer Motion micro-interactions. Features dark mode ambient backdrop blur, floating field labels, dynamic validation state transitions, and high-contrast accessibility compliance.

This build was designed for high-conversion web applications looking for a sleek, memorable user onboarding experience without compromising load speed or mobile responsiveness.`,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-code-running-on-a-computer-screen-41554-large.mp4',
    category: 'UI/UX',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Framer Motion'],
    codeUrl: 'https://github.com/corniceandquery/animated-login-ui',
    liveUrl: 'https://animated-login-ui.demo.cq.dev',
    socialUrl: 'https://instagram.com/p/cq_login_ui_demo',
    featured: true,
    publishedDate: '2026-09-01',
    duration: '0:45',
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
  return PROJECTS.find((p) => p.slug === slug);
}

export function getFeaturedProject(): Project {
  return PROJECTS.find((p) => p.featured) || PROJECTS[0];
}

export function getRelatedProjects(currentSlug: string, limit = 3): Project[] {
  const current = getProjectBySlug(currentSlug);
  if (!current) return PROJECTS.slice(0, limit);
  
  return PROJECTS
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit);
}
