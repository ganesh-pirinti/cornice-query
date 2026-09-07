import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { CQLoginReveal } from '../components/login/CQLoginReveal';
import { useSetDocumentTitle } from '../utils/seo';

export const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignUp = location.pathname.includes('signup');

  useSetDocumentTitle({
    title: isSignUp ? 'Cornice & Query — Create Account' : 'Cornice & Query — Sign In',
    description: 'Sign in or create an account to access custom builds, boost points, and referral dashboard.',
  });

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
      <CQLoginReveal>
        <LoginForm initialMode={isSignUp ? 'signup' : 'login'} onSuccess={handleAuthSuccess} />
      </CQLoginReveal>
    </div>
  );
};
