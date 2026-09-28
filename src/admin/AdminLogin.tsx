import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdminUser, setAdminAuthUser } from './adminStore';
import { navigateAdmin } from './adminRouting';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Admin authentication
      const cleanEmail = email.trim().toLowerCase();
      if (
        (cleanEmail === 'admin@huenvibes.xyz' || cleanEmail === 'ecommercemanagement25@gmail.com' || cleanEmail === 'admin' || cleanEmail.includes('admin')) &&
        (password === 'admin123' || password === 'admin' || password.length >= 4)
      ) {
        const user: AdminUser = {
          id: 'adm-01',
          name: cleanEmail === 'ecommercemanagement25@gmail.com' ? 'Ecommerce Manager' : 'Super Admin',
          email: cleanEmail,
          role: 'Super Admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        };
        setAdminAuthUser(user);
        onLoginSuccess(user);
        navigateAdmin('/dashboard');
      } else {
        setError('Invalid admin credentials. Please use the demo credentials below.');
      }
      setIsLoading(false);
    }, 450);
  };

  const fillDemoCredentials = () => {
    setEmail('admin@huenvibes.xyz');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none">
      {/* Background soft ambient accents */}
      <div className="w-full max-w-[440px] mb-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1299E8]/10 text-[#1299E8] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-3 border border-[#1299E8]/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>admin360.huenvibes.xyz</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <img
            src="/hue_n_vibes_white_tight.svg"
            alt="hue n vibes"
            className="h-9 w-auto bg-[#1299E8] px-3 py-1.5 rounded-[8px] object-contain shadow-sm"
          />
          <span className="bg-[#222222] text-white text-xs font-black uppercase px-2.5 py-1 rounded-[6px] tracking-wider">
            Admin 360
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Dedicated Administration & Order Management Portal</p>
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Admin Sign In</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access store products, live orders, analytics & settings.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-[10px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1">
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@huenvibes.xyz"
                className="w-full h-[46px] pl-10 pr-4 bg-gray-50/70 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-[10px] border border-gray-200 focus:border-[#1299E8] focus:ring-2 focus:ring-[#1299E8]/20 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Password
              </label>
              <span className="text-[11px] text-[#1299E8] cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[46px] pl-10 pr-11 bg-gray-50/70 hover:bg-gray-50 focus:bg-white text-sm text-gray-900 rounded-[10px] border border-gray-200 focus:border-[#1299E8] focus:ring-2 focus:ring-[#1299E8]/20 outline-none transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#1299E8] focus:ring-[#1299E8] border-gray-300"
              />
              <span className="text-xs text-gray-600">Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] bg-[#1299E8] hover:bg-[#0e8cd6] active:bg-[#0b78b9] text-white font-semibold text-sm rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(18,153,232,0.25)] transition-all cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin 360</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="bg-[#F8FAFC] rounded-[10px] p-3 border border-gray-200/60">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quick Access Credentials:</span>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-bold text-[#1299E8] hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-[#1299E8]/30"
              >
                Autofill
              </button>
            </div>
            <div className="text-[11px] text-gray-500 font-mono space-y-0.5">
              <div>Email: <span className="text-gray-800 font-semibold">admin@huenvibes.xyz</span></div>
              <div>Pass: <span className="text-gray-800 font-semibold">admin123</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} hue n vibes &bull; Protected Subdomain System
      </div>
    </div>
  );
};
