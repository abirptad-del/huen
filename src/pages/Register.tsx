import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAppContext } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import { Header } from '../components/Header';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const navigate = useNavigate();
  const { settings } = useAppContext();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const mockEmail = `${phone.replace(/\s+/g, '')}@user.mokkahfabrics.com`;
      const { data, error } = await supabase.auth.signUp({ 
        email: mockEmail, 
        password,
      });
      if (error) throw error;

      // Update users table with displayName
      if (data?.user) {
        await supabase.from('users').upsert({
          uid: data.user.id,
          email: mockEmail,
          displayName: fullName,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }, { onConflict: 'uid' });
      }

      navigate(-1); // go back
    } catch (err: any) {
      setError(err.message);
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
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#111827' }}>Create Account</h2>
            <p className="text-[#888888] text-sm">Sign up to get started</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm transition-colors focus:border-[#5c3cbe]"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm transition-colors focus:border-[#5c3cbe]"
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none text-sm transition-colors focus:border-[#5c3cbe]"
                  placeholder="Create a password"
                  minLength={6}
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

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none text-sm transition-colors focus:border-[#5c3cbe]"
                  placeholder="Confirm your password"
                  minLength={6}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 text-sm">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#5c3cbe] focus:ring-[#5c3cbe]" 
              />
              <span className="text-gray-600">
                I agree to the <a href="#" className="hover:underline" style={{ color: settings.primaryColor || '#5c3cbe' }}>Terms of Service</a> and <a href="#" className="hover:underline" style={{ color: settings.primaryColor || '#5c3cbe' }}>Privacy Policy</a>
              </span>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 mt-4 disabled:opacity-50"
              style={{ backgroundColor: settings.primaryColor || '#5c3cbe' }}
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500">
              Already have an account? <Link to="/login" className="font-medium hover:underline" style={{ color: settings.primaryColor || '#5c3cbe' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
