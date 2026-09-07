import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { VideoPreviewModal } from './components/VideoPreviewModal';
import { FloatingCustomiseButton } from './components/customise/FloatingCustomiseButton';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { CustomisePage } from './pages/CustomisePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UserCustomisationsPage } from './pages/UserCustomisationsPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { CQScene } from './components/3d/CQScene';
import { CursorBloom } from './components/effects/CursorBloom';
import type { Project } from './types/project';
import { useSetDocumentTitle } from './utils/seo';

export function App() {
  const [activeVideoProject, setActiveVideoProject] = useState<Project | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const location = useLocation();

  // Dynamic SEO metadata based on location route
  useSetDocumentTitle({
    title: location.pathname.startsWith('/project/')
      ? 'Cornice & Query — Build Detail'
      : location.pathname === '/projects'
      ? 'Cornice & Query — Project Library Archive'
      : location.pathname === '/categories'
      ? 'Cornice & Query — Build Categories'
      : location.pathname === '/about'
      ? 'Cornice & Query — About Platform'
      : location.pathname === '/customise'
      ? 'Cornice & Query — Customise Your Build'
      : location.pathname === '/dashboard'
      ? 'Cornice & Query — User Dashboard'
      : location.pathname === '/login' || location.pathname === '/signup'
      ? 'Cornice & Query — Account Access'
      : 'Cornice & Query — Explore. Build. Query.',
  });

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-slate-950 relative overflow-x-hidden">
        {/* Cinematic Studio Cursor Light Bloom & Trail */}
        <CursorBloom />

        {/* 3D Immersive Global Scene Canvas Background */}
        <CQScene />
        {/* Permanent Fixed Floating Action Button (Viewport Bottom-Right) */}
        <FloatingCustomiseButton />

        {/* Top Navbar Header */}
        <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Main Page Body */}
        <main className="flex-1 relative z-10">
          <Routes>
            <Route
              path="/"
              element={<HomePage onOpenVideo={(proj: Project) => setActiveVideoProject(proj)} />}
            />
            <Route
              path="/projects"
              element={<ProjectsPage onOpenVideo={(proj: Project) => setActiveVideoProject(proj)} />}
            />
            <Route
              path="/project/:slug"
              element={<ProjectDetailPage onOpenVideo={(proj: Project) => setActiveVideoProject(proj)} />}
            />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/customise" element={<CustomisePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/customisations"
              element={
                <ProtectedRoute>
                  <UserCustomisationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/referrals"
              element={
                <ProtectedRoute>
                  <ReferralsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Video Modal Preview */}
        <VideoPreviewModal
          project={activeVideoProject}
          onClose={() => setActiveVideoProject(null)}
        />

        {/* Global Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onOpenVideo={(proj: Project) => setActiveVideoProject(proj)}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
