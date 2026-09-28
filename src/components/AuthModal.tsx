import React, { useState } from 'react';
import { X, Phone, Lock, User, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { loginCustomer, signupCustomer, CustomerProfile } from '../lib/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: CustomerProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        try {
          const { profile } = await loginCustomer({ phone, password });
          setLoading(false);
          onSuccess(profile);
          onClose();
        } catch (err: any) {
          if (err.message === 'ACCOUNT_NOT_FOUND') {
            // Account not found - offer quick signup
            setErrorMessage('No account found with this phone number. Please click "Sign Up" above or enter your name below to register.');
            setMode('signup');
            setLoading(false);
          } else {
            setErrorMessage(err.message || 'Invalid phone number or password.');
            setLoading(false);
          }
        }
      } else {
        const { profile } = await signupCustomer({
          phone,
          password,
          fullName: fullName.trim(),
        });
        setLoading(false);
        onSuccess(profile);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#1299E8] to-[#0d7bc2] px-6 py-6 text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-2.5 backdrop-blur-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-white/90 mt-1 font-medium">
            {mode === 'login'
              ? 'Sign in to access your orders and account settings'
              : 'Sign up with your phone number for instant access'}
          </p>

          {/* Mode Tabs */}
          <div className="flex bg-black/15 p-1 rounded-xl mt-4 max-w-xs mx-auto border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1299E8] shadow-xs'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#1299E8] shadow-xs'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2.5 text-red-700 text-xs leading-relaxed animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Full Name field (Sign Up mode) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1299E8] focus:ring-2 focus:ring-[#1299E8]/20 outline-none transition-all font-medium text-gray-900"
                />
              </div>
            </div>
          )}

          {/* Phone Number Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 font-bold text-xs">
                <Phone className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-gray-400 font-normal mr-1">🇧🇩</span>
              </div>
              <input
                type="tel"
                required
                placeholder="01712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 pl-16 pr-4 text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1299E8] focus:ring-2 focus:ring-[#1299E8]/20 outline-none transition-all font-medium text-gray-900"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1 pl-1">
              Supports 017, 018, 019, 016, 013 (Bangladesh)
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1299E8] focus:ring-2 focus:ring-[#1299E8]/20 outline-none transition-all font-medium text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-sm font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === 'login' ? (
              <span>Log In to Account</span>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Bottom Switch Footer */}
          <div className="pt-2 text-center text-xs text-gray-500 font-medium">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="text-[#1299E8] font-bold hover:underline cursor-pointer focus:outline-none"
                >
                  Sign Up Now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-[#1299E8] font-bold hover:underline cursor-pointer focus:outline-none"
                >
                  Log In Here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
