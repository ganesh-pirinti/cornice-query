import React from 'react';
import { Hero } from '../components/Hero';
import { CQJourney } from '../components/CQJourney';
import { FeaturedBuild } from '../components/FeaturedBuild';
import { ProjectGrid } from '../components/ProjectGrid';
import { CustomiseSection } from '../components/customise/CustomiseSection';
import { PROJECTS, getFeaturedProject } from '../data/projects';
import type { Project } from '../types/project';

interface HomePageProps {
  onOpenVideo: (project: Project) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenVideo }) => {
  const featured = getFeaturedProject();

  return (
    <div className="w-full space-y-12">
      {/* Homepage Hero */}
      <Hero featuredProject={featured} onOpenVideo={onOpenVideo} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Watch -> Explore -> Build Timeline */}
        <CQJourney />

        {/* Featured Build Spotlight */}
        <FeaturedBuild project={featured} onOpenVideo={onOpenVideo} />

        {/* Customise Service Editorial Section */}
        <CustomiseSection />

        {/* Main Project Library Gallery */}
        <ProjectGrid
          projects={PROJECTS}
          title="Explore the Builds"
          subtitle="Discover all projects featured on Cornice & Query reels and posts."
          onOpenVideo={onOpenVideo}
        />
      </div>
    </div>
  );
};
