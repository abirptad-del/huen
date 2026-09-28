import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Phone, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import {
  authenticateWithPhoneAndPassword,
  normalizeBdPhone,
  CustomerProfile,
} from '../lib/customerAuthService';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: CustomerProfile) => void;
  lang?: 'en' | 'bn';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang = 'en',
}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEn = lang === 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const norm = normalizeBdPhone(phone);
    if (!norm.valid) {
      setErrorMessage(
        norm.error ||
          (isEn
            ? 'Please enter a valid 11-digit phone number (e.g. 017XXXXXXXX)'
            : 'অনুগ্রহ করে সঠিক ১১ ডিজিটের ফোন নম্বর লিখুন (যেমন: 017XXXXXXXX)')
      );
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage(
        isEn
          ? 'Password must be at least 6 characters.'
          : 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticateWithPhoneAndPassword(
        norm.local,
        password,
        fullName.trim() || undefined
      );

      if (result.success && result.profile) {
        onSuccess(result.profile);
        onClose();
      } else {
        setErrorMessage(
          result.error ||
            (isEn
              ? 'Could not sign in. Please verify your phone and password.'
              : 'লগইন সম্ভব হয়নি। ফোন ও পাসওয়ার্ড আবার পরীক্ষা করুন।')
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isEn
            ? 'An unexpected error occurred. Please try again.'
            : 'একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[14px] shadow-2xl border border-gray-100 overflow-hidden z-10">
        {/* Top Accent Header */}
        <div className="bg-[#1299E8] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {isEn ? 'Sign In / Register' : 'লগইন / রেজিস্ট্রেশন'}
              </h3>
              <p className="text-xs text-white/80 font-normal">
                {isEn
                  ? 'Access your orders, wishlist & profile'
                  : 'আপনার অর্ডার, উইশলিস্ট ও প্রোফাইল অ্যাক্সেস করুন'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[8px] text-red-600 text-xs font-medium leading-relaxed animate-in fade-in duration-150">
              {errorMessage}
            </div>
          )}

          {/* Phone Number Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {isEn ? 'Phone Number *' : 'ফোন নম্বর *'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isEn ? '017XXXXXXXX' : '০১৭১২৩৪৫৬৭৮'}
                className="w-full h-[44px] pl-9 pr-3 text-sm bg-gray-50/50 border border-gray-200 rounded-[8px] focus:bg-white focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8] outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {isEn
                ? 'Enter any active 11-digit Bangladesh phone number'
                : 'যেকোনো সচল ১১ ডিজিটের বাংলাদেশি নম্বর দিন'}
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {isEn ? 'Password *' : 'পাসওয়ার্ড *'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEn ? 'Enter password (min 6 characters)' : 'পাসওয়ার্ড লিখুন (কমপক্ষে ৬ অক্ষর)'}
                className="w-full h-[44px] pl-9 pr-10 text-sm bg-gray-50/50 border border-gray-200 rounded-[8px] focus:bg-white focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8] outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Optional Full Name Field (for new signups or profile updates) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {isEn ? 'Full Name (Optional)' : 'সম্পূর্ণ নাম (ঐচ্ছিক)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isEn ? 'Your full name' : 'আপনার সম্পূর্ণ নাম'}
                className="w-full h-[44px] pl-9 pr-3 text-sm bg-gray-50/50 border border-gray-200 rounded-[8px] focus:bg-white focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8] outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] bg-[#1299E8] hover:bg-[#0e8cd6] active:bg-[#0b78b9] text-white text-sm font-bold rounded-[8px] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors focus:outline-none disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? 'Authenticating...' : 'যাচাই করা হচ্ছে...'}</span>
                </>
              ) : (
                <>
                  <span>{isEn ? 'Continue with Phone' : 'ফোন নম্বর দিয়ে চালিয়ে যান'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Notice info */}
          <div className="flex items-center gap-2 justify-center pt-2 text-[11px] text-gray-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              {isEn
                ? 'Instant login with phone & password. No OTP required.'
                : 'ফোন ও পাসওয়ার্ড দিয়ে দ্রুত লগইন। কোনো ওটিপি প্রয়োজন নেই।'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
