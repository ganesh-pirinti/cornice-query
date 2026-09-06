export type ProjectCategory = 
  | 'ALL'
  | 'WEB'
  | 'UI/UX'
  | 'JAVASCRIPT'
  | 'REACT'
  | 'CSS'
  | 'ANIMATIONS'
  | 'MINI PROJECTS';

export interface Project {
  id: string;
  slug: string;
  projectNumber?: string; // Optional — e.g. "01", "02". If omitted, automatically generated from array position
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  videoUrl?: string; // Optional — Direct video link (.mp4 or stream URL)
  category: ProjectCategory;
  technologies: string[];
  codeUrl?: string; // Optional — GitHub or source code repository link
  liveUrl?: string; // Optional — Live website demo URL
  socialUrl?: string; // Optional — Link to original Instagram / YouTube / X post or reel
  featured: boolean; // Set to true for the main spotlight hero build
  publishedDate: string; // e.g. "2026-09-01"
  duration?: string; // Optional — Video duration string e.g. "0:45"
  highlights?: string[]; // Optional — Bullet points of key technical features
}
