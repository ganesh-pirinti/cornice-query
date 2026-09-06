import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { PostLoginCreditsModal } from '../components/auth/PostLoginCreditsModal';
import { CQLoginReveal } from '../components/login/CQLoginReveal';
import { useSetDocumentTitle } from '../utils/seo';
import { getCurrentUser, type UserProfile } from '../services/authService';

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignUp = location.pathname.includes('signup');

  const [activeStep, setActiveStep] = useState<'login' | 'credits'>('login');
  const [authenticatedUser, setAuthenticatedUser] = useState<UserProfile | null>(null);

  useSetDocumentTitle({
    title: activeStep === 'credits'
      ? 'Cornice & Query — Boost Points Credits'
      : isSignUp ? 'Cornice & Query — Create Account' : 'Cornice & Query — Sign In',
    description: 'Sign in or create an account to access custom builds, boost points, and referral dashboard.',
  });

  const handleAuthSuccess = (user?: UserProfile) => {
    const targetUser = user || getCurrentUser();
    if (targetUser) {
      setAuthenticatedUser(targetUser);
      setActiveStep('credits');
    } else {
      navigate('/');
    }
  };

  const handleContinueToHome = () => {
    sessionStorage.setItem('cq_seen_credits_intro', 'true');
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
      <CQLoginReveal>
        {activeStep === 'credits' && authenticatedUser ? (
          <PostLoginCreditsModal user={authenticatedUser} onContinue={handleContinueToHome} />
        ) : (
          <LoginForm initialMode={isSignUp ? 'signup' : 'login'} onSuccess={handleAuthSuccess} />
        )}
      </CQLoginReveal>
    </div>
  );
};
