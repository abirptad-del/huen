import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { useAppContext } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import { Header } from '../components/Header';

export const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { settings } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mocking phone number login using supabase email auth
      const mockEmail = `${phone.replace(/\s+/g, '')}@user.mokkahfabrics.com`;
      const { error } = await supabase.auth.signInWithPassword({ email: mockEmail, password });
      if (error) throw error;
      navigate(-1); // go back
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid phone number or password. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fc]">
      <Header />
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="bg-white p-8 md:p-10 rounded-2xl w-full max-w-[420px] shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#d34b56' }}>Sign In</h2>
            <p className="text-[#888888] text-sm">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#d34b56' }}>Phone Number</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm transition-colors focus:border-[#5c3cbe]"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#d34b56' }}>Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none text-sm transition-colors focus:border-[#5c3cbe]"
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#5c3cbe] focus:ring-[#5c3cbe]" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="font-medium hover:underline" style={{ color: settings.primaryColor || '#5c3cbe' }}>Forgot password?</a>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 mt-2 disabled:opacity-50"
              style={{ backgroundColor: settings.primaryColor || '#5c3cbe' }}
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500 mb-6">
              Don't have an account? <Link to="/register" className="font-medium hover:underline" style={{ color: settings.primaryColor || '#5c3cbe' }}>Create one now</Link>
            </p>
            <p className="text-xs text-gray-400">
              By signing in, you agree to our <a href="#" className="hover:underline">Terms of Service</a> and <a href="#" className="hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

