import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthPageProps {
  setCurrentView: (view: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ setCurrentView }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, setAdminSessionKey } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'adminKey'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        setCurrentView('account');
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName);
        setCurrentView('account');
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMessage('Password reset instructions sent to your email.');
      } else if (mode === 'adminKey') {
        setAdminSessionKey(adminKeyInput);
        setMessage('Admin security passkey applied successfully.');
        setTimeout(() => {
          setCurrentView('admin');
        }, 800);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setCurrentView('account');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-[#e8dfd3] shadow-lg space-y-6">
        {/* Top Branding */}
        <div className="text-center space-y-2">
          <span className="font-display text-2xl font-extrabold tracking-[0.2em] text-[#1b3022]">
            MINAL KHAN
          </span>
          <h2 className="font-display text-xl font-bold text-stone-900">
            {mode === 'signin' && t('btnSignIn')}
            {mode === 'signup' && t('btnSignUp')}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'adminKey' && 'Admin Security Passkey'}
          </h2>
          <p className="text-xs text-stone-500">
            {mode === 'adminKey'
              ? 'Enter the admin key to access the store management dashboard.'
              : 'Sign in to track orders, save gift preferences, and checkout faster.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ayesha Khan"
                  className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#1b3022] outline-none"
                />
              </div>
            </div>
          )}

          {mode !== 'adminKey' ? (
            <>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('formEmail')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#1b3022] outline-none"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-stone-700">Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-[#8b7355] hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#1b3022] outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Admin Passkey</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-[#d4af37]" />
                <input
                  type="password"
                  required
                  value={adminKeyInput}
                  onChange={(e) => setAdminKeyInput(e.target.value)}
                  placeholder="Enter admin secret key"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#d4af37] rounded-xl focus:ring-2 focus:ring-[#1b3022] outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Use your master key to manage products, categories, occasions, orders, and WhatsApp settings.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1b3022] hover:bg-[#25422f] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>{loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Authorize Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode !== 'adminKey' && (
          <div className="space-y-4">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-2 text-stone-400 text-[11px] uppercase">Or</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 flex items-center justify-center gap-2 shadow-2xs transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Footer Mode Switchers */}
        <div className="pt-2 border-t border-stone-100 flex flex-col items-center gap-2 text-xs text-stone-600 text-center">
          {mode === 'signin' && (
            <>
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-[#1b3022] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
              <button
                onClick={() => setMode('adminKey')}
                className="text-[11px] text-stone-400 hover:text-[#8b7355] flex items-center gap-1 mt-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Store Owner / Admin Login</span>
              </button>
            </>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-[#1b3022] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}

          {(mode === 'forgot' || mode === 'adminKey') && (
            <button
              onClick={() => setMode('signin')}
              className="text-[#1b3022] font-bold hover:underline"
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
