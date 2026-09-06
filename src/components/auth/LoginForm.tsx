import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCurrentUser, type UserProfile } from '../../services/authService';
import { savePendingReferralCode } from '../../services/referralService';
import { ArrowRight, Lock, Mail, User as UserIcon, Loader2 } from 'lucide-react';
import { InteractiveCard3D } from '../3d/InteractiveCard3D';
import { CQLogo } from '../brand/CQLogo';

interface LoginFormProps {
  initialMode?: 'login' | 'signup';
  onSuccess?: (user?: UserProfile) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ initialMode = 'login', onSuccess }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Capture referral code if present in URL
  const refCode = searchParams.get('ref');
  if (refCode) {
    savePendingReferralCode(refCode);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signup') {
        const { error } = await signUpWithEmail(email, displayName || email.split('@')[0], password);
        if (error) {
          setErrorMsg(error.message || 'Unable to create your CQ account right now. Please try again.');
          setLoading(false);
          return;
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message || 'Unable to sign you in right now. Please check your credentials.');
          setLoading(false);
          return;
        }
      }

      const currentUser = getCurrentUser();
      if (onSuccess && currentUser) onSuccess(currentUser);
      else navigate('/dashboard');
    } catch {
      setErrorMsg('Authentication error occurred. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message || 'Unable to sign you in with Google right now. Please try again.');
        setLoading(false);
      } else {
        const currentUser = getCurrentUser();
        if (onSuccess && currentUser) onSuccess(currentUser);
        else navigate('/dashboard');
      }
    } catch {
      setErrorMsg('Google login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <InteractiveCard3D depth={6}>
        {/* PREMIUM SMOKED SILVER GLASS LOGIN CARD - 8% TRANSLUCENT FILL */}
        <div
          className="p-8 sm:p-10 rounded-3xl space-y-6 transition-all duration-300 backdrop-blur-xl border hover:border-[rgba(255,140,40,0.85)] [&:focus-within]:border-[rgba(255,140,40,0.85)]"
          style={{
            backgroundColor: 'rgba(220, 220, 220, 0.08)',
            borderColor: 'rgba(255, 140, 40, 0.70)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 50px rgba(0, 0, 0, 0.65)',
          }}
        >
          {/* Header Logo */}
          <div className="text-center space-y-3">
            <CQLogo variant="mark" className="w-16 h-16 mx-auto drop-shadow-2xl" />
            <h2 className="font-display text-2xl font-bold text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {mode === 'signup' ? 'CREATE CQ ACCOUNT' : 'WELCOME BACK TO CQ'}
            </h2>
            <p className="text-xs text-zinc-200 font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              "Sign in to manage your custom builds, boost points and referrals."
            </p>
            {refCode && (
              <div className="inline-block px-3 py-1 rounded-full bg-slate-950/70 border border-orange-400/50 text-orange-300 text-xs font-mono font-bold shadow-sm">
                ✦ REFERRAL LINK DETECTED: {refCode}
              </div>
            )}
          </div>

          {/* Error Feedback Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono text-center">
              {errorMsg}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleAuth}
            className="w-full py-3 px-4 rounded-xl bg-[#07070a]/90 hover:bg-[#121218] text-white border border-white/20 hover:border-orange-400/50 font-mono font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-3 transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.4-.7-.6-1.5-.6-2.3z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 23z"
                />
              </svg>
            )}
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0b0b0f] px-3 text-[10px] font-mono text-zinc-400 uppercase tracking-widest absolute">
              OR EMAIL
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-zinc-100 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  Display Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Developer"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07070a]/85 border border-orange-500/30 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-400/80 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-zinc-100 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@cq-builds.dev"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07070a]/85 border border-orange-500/30 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-400/80 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-zinc-100 uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07070a]/85 border border-orange-500/30 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-orange-400/80 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signup' ? 'CREATE ACCOUNT' : 'LOGIN TO DASHBOARD'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="pt-4 border-t border-orange-500/25 text-center text-xs text-zinc-200 font-medium">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-white font-bold underline underline-offset-2 hover:text-orange-200 cursor-pointer ml-1"
                >
                  LOG IN
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-white font-bold underline underline-offset-2 hover:text-orange-200 cursor-pointer ml-1"
                >
                  CREATE ACCOUNT
                </button>
              </p>
            )}
          </div>
        </div>
      </InteractiveCard3D>
    </div>
  );
};
