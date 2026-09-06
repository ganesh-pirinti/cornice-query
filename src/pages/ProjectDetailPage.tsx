import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Terminal, Sparkles, CheckCircle } from 'lucide-react';
import { getProjectBySlug, getRelatedProjects } from '../data/projects';
import { CQFlowTimeline } from '../components/CQFlowTimeline';
import { ResourceButtons } from '../components/ResourceButtons';
import { MediaFallback } from '../components/MediaFallback';
import { ProjectCard } from '../components/ProjectCard';
import type { Project } from '../types/project';

interface ProjectDetailPageProps {
  onOpenVideo: (project: Project) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ onOpenVideo }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center pt-32 px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Terminal className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Project Not Found</h1>
        <p className="text-sm text-zinc-400 max-w-md">
          The build project slug "<code className="text-amber-400 font-mono">{slug}</code>" could not be located in our repository archive.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Project Library
        </Link>
      </div>
    );
  }

  const relatedProjects = getRelatedProjects(project.slug, 3);
  const formattedNumber = project.projectNumber || '01';

  return (
    <div className="w-full pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Breadcrumb / Back Link */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO GALLERY</span>
          </button>
          <span className="text-xs font-mono text-amber-400 font-bold px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
            BUILD #{formattedNumber}
          </span>
        </div>

        {/* Project Header Title & Description */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-zinc-200 uppercase tracking-wider">
              {project.category}
            </span>
            {project.duration && (
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {project.duration} VIDEO DEMO
              </span>
            )}
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {project.publishedDate}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* LARGE VIDEO / PROJECT PREVIEW FRAME */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl group">
          {project.videoUrl ? (
            <video
              src={project.videoUrl}
              controls
              autoPlay
              muted
              loop
              playsInline
              poster={project.thumbnail}
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <MediaFallback
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full"
            />
          )}
        </div>

        {/* COMPACT VISUAL FLOW BAR: WATCH -> EXPLORE -> BUILD */}
        <CQFlowTimeline compact={true} />

        {/* Main Content Grid: About Build + Resource Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
          
          {/* Left Column: Detailed Description & Highlights */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ABOUT THIS BUILD */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-4">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>ABOUT THIS BUILD</span>
              </h2>
              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-3">
                {project.description}
              </div>
            </div>

            {/* KEY TECHNICAL HIGHLIGHTS */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>KEY ARCHITECTURAL HIGHLIGHTS</span>
                </h3>
                <ul className="space-y-3">
                  {project.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TECH STACK BREAKDOWN */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>TECH STACK USED</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.technologies.map((tech) => (
                  <div
                    key={tech}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center"
                  >
                    <span className="text-xs font-mono font-bold text-white block">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Resource Action Hub */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-6 sticky top-28 shadow-xl">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold block mb-1">
                  BUILD RESOURCES
                </span>
                <h3 className="font-display text-xl font-bold text-white">Access Source & Demo</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Get full repository access, test the live site demo, or view the original reel.
                </p>
              </div>

              {/* STRICT CONDITIONAL RESOURCE BUTTONS */}
              <div className="space-y-3 pt-2">
                <ResourceButtons project={project} size="large" className="flex-col !items-stretch" />
              </div>
            </div>
          </div>

        </div>

        {/* RELATED PROJECTS */}
        {relatedProjects.length > 0 && (
          <div className="pt-12 border-t border-white/10 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
                  KEEP EXPLORING
                </span>
                <h3 className="font-display text-2xl font-bold text-white">Related CQ Builds</h3>
              </div>
              <Link
                to="/projects"
                className="text-xs font-mono text-amber-400 hover:text-amber-300 font-bold"
              >
                VIEW ALL BUILDS →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((rel, idx) => (
                <ProjectCard key={rel.id} project={rel} onOpenVideo={onOpenVideo} index={idx} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
