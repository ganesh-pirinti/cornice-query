export interface CategoryItem {
  id: string;
  label: string;
  description?: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'ALL', label: 'ALL', description: 'Browse all Cornice & Query builds' },
  { id: 'ACTORS / CELEBRITIES', label: 'ACTORS / CELEBRITIES', description: 'Fan pages, celebrity showcases, and entertainment profiles' },
  { id: 'STARTUPS', label: 'STARTUPS', description: 'SaaS landing pages, product launchpads, and pitch demos' },
  { id: 'E-COMMERCE', label: 'E-COMMERCE', description: 'Product storefronts, cart flows, and modern commerce UIs' },
  { id: 'BUSINESS', label: 'BUSINESS', description: 'Corporate portals, agency landing pages, and business hubs' },
  { id: 'PORTFOLIO', label: 'PORTFOLIO', description: 'Developer portfolios, design studios, and creative showcases' },
  { id: 'DEVOTIONAL', label: 'DEVOTIONAL', description: 'Cultural, temple, and devotional web experiences' },
  { id: 'ANIME', label: 'ANIME', description: 'Anime portals, character vaults, and kinetic fan experiences' },
  { id: 'CINEMATIC', label: 'CINEMATIC', description: 'Movie trailers, film landing pages, and theatrical visual UIs' },
  { id: 'ENTERTAINMENT', label: 'ENTERTAINMENT', description: 'Media hubs, streaming site concepts, and music apps' },
  { id: 'EDUCATION', label: 'EDUCATION', description: 'LMS dashboards, course landing pages, and learning hubs' },
  { id: 'TECH', label: 'TECH', description: 'Developer tools, API docs, and tech product interfaces' },
  { id: 'AI', label: 'AI', description: 'AI prompt studios, LLM chat interfaces, and generator dashboards' },
  { id: 'CYBERSECURITY', label: 'CYBERSECURITY', description: 'Terminal UIs, security command centers, and threat monitors' },
  { id: 'GAMING', label: 'GAMING', description: 'Esports portals, game landing pages, and gaming hubs' },
  { id: '3D / WEBGL', label: '3D / WEBGL', description: 'Three.js canvas nodes, GLSL shaders, and 3D scenes' },
  { id: 'UI/UX', label: 'UI/UX', description: 'Glassmorphism cards, form controls, and UI widgets' },
  { id: 'LOGIN INTERFACES', label: 'LOGIN INTERFACES', description: 'Auth screens, login cards, and onboarding morphing states' },
  { id: 'DASHBOARDS', label: 'DASHBOARDS', description: 'Analytics dashboards, data visualization grids, and panels' },
  { id: 'LANDING PAGES', label: 'LANDING PAGES', description: 'High-converting marketing pages and kinetic hero reveals' },
  { id: 'EVENTS', label: 'EVENTS', description: 'Conference landing pages, hackathons, and event registration' },
  { id: 'COLLEGE / STUDENT', label: 'COLLEGE / STUDENT', description: 'Student projects, campus portals, and project showcases' },
  { id: 'PERSONAL BRAND', label: 'PERSONAL BRAND', description: 'Creator bio links, personal brand hubs, and link-in-bio UIs' },
  { id: 'EXPERIMENTAL', label: 'EXPERIMENTAL', description: 'Shader experiments, WebAudio synths, and kinetic motion canvas' },
  { id: 'OTHER', label: 'OTHER', description: 'Custom miscellaneous digital builds' },
];
