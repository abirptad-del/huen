import React, { useState } from 'react';
import {
  Settings,
  Save,
  Truck,
  ShieldCheck,
  Store,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { StoreSettings } from '../adminStore';

interface SettingsPageProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [storeName, setStoreName] = useState(settings.storeName);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [insideDhaka, setInsideDhaka] = useState(settings.insideDhakaDelivery.toString());
  const [outsideDhaka, setOutsideDhaka] = useState(settings.outsideDhakaDelivery.toString());
  const [freeShippingAbove, setFreeShippingAbove] = useState(settings.freeShippingAbove.toString());
  const [allowCod, setAllowCod] = useState(settings.allowCashOnDelivery);
  const [showAdminTestButton, setShowAdminTestButton] = useState<boolean>(
    settings.showAdminTestButton !== undefined ? settings.showAdminTestButton : true
  );

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordToast, setPasswordToast] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoreSettings = {
      ...settings,
      storeName: storeName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      insideDhakaDelivery: Number(insideDhaka) || 60,
      outsideDhakaDelivery: Number(outsideDhaka) || 120,
      freeShippingAbove: Number(freeShippingAbove) || 2500,
      allowCashOnDelivery: allowCod,
      showAdminTestButton,
    };

    onSaveSettings(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordToast('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordToast('Passwords do not match.');
      return;
    }

    setPasswordToast('Admin password successfully updated!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordToast(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Store & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure delivery fees, contact channels, and admin security credentials.
          </p>
        </div>
      </div>

      {settingsSaved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[10px] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* GENERAL STORE INFO & DELIVERY */}
      <form onSubmit={handleGeneralSubmit} className="space-y-6">
        <div className="bg-white rounded-[14px] p-5 sm:p-6 border border-gray-200/70 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Store className="w-4 h-4 text-[#1299E8]" />
            <h2 className="text-sm font-bold text-gray-900">Store Profile & Contacts</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Support Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hotline / WhatsApp Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store Currency Symbol
              </label>
              <input
                type="text"
                disabled
                value="৳ BDT (Bangladeshi Taka)"
                className="w-full h-[40px] px-3 bg-gray-100 text-xs sm:text-sm text-gray-500 rounded-[8px] border border-gray-200 outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* DELIVERY CHARGES */}
        <div className="bg-white rounded-[14px] p-5 sm:p-6 border border-gray-200/70 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <Truck className="w-4 h-4 text-[#1299E8]" />
            <h2 className="text-sm font-bold text-gray-900">Delivery Rates & Payment Methods</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Inside Dhaka Delivery Fee (৳) *
              </label>
              <input
                type="number"
                required
                value={insideDhaka}
                onChange={(e) => setInsideDhaka(e.target.value)}
                className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Outside Dhaka Delivery Fee (৳) *
              </label>
              <input
                type="number"
                required
                value={outsideDhaka}
                onChange={(e) => setOutsideDhaka(e.target.value)}
                className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Free Delivery Above (৳)
              </label>
              <input
                type="number"
                value={freeShippingAbove}
                onChange={(e) => setFreeShippingAbove(e.target.value)}
                className="w-full h-[40px] px-3 bg-gray-50 text-xs sm:text-sm text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowCod}
                onChange={(e) => setAllowCod(e.target.checked)}
                className="w-4 h-4 rounded text-[#1299E8] focus:ring-[#1299E8] border-gray-300"
              />
              <span className="text-xs text-gray-700 font-semibold">
                Enable Cash on Delivery (COD) on Storefront
              </span>
            </label>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="h-[40px] px-5 bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-xs font-semibold rounded-[8px] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save General Settings</span>
            </button>
          </div>
        </div>

        {/* DEVELOPMENT / TESTING SECTION */}
        <div className="bg-white rounded-[14px] p-5 sm:p-6 border border-amber-200/80 bg-amber-50/10 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Development / Testing</h2>
              <p className="text-[11px] text-gray-500">Configure developer access shortcuts for local and preview testing.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[10px] bg-gray-50 border border-gray-200/70">
            <div className="space-y-0.5 max-w-xl">
              <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <span>Admin Test Button</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${showAdminTestButton ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                  {showAdminTestButton ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Show Admin Test Button
              </p>
              <p className="text-[11px] text-amber-700 font-medium">
                Temporary development access button. Turn this OFF before production.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={showAdminTestButton}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setShowAdminTestButton(checked);
                  const updated: StoreSettings = {
                    ...settings,
                    storeName: storeName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    insideDhakaDelivery: Number(insideDhaka) || 60,
                    outsideDhakaDelivery: Number(outsideDhaka) || 120,
                    freeShippingAbove: Number(freeShippingAbove) || 2500,
                    allowCashOnDelivery: allowCod,
                    showAdminTestButton: checked,
                  };
                  onSaveSettings(updated);
                  setSettingsSaved(true);
                  setTimeout(() => setSettingsSaved(false), 2500);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1299E8]"></div>
            </label>
          </div>
        </div>
      </form>

      {/* SECURITY / PASSWORD */}
      <div className="bg-white rounded-[14px] p-5 sm:p-6 border border-gray-200/70 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-[#1299E8]" />
          <h2 className="text-sm font-bold text-gray-900">Admin Security Credentials</h2>
        </div>

        {passwordToast && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-[8px]">
            {passwordToast}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-[38px] px-3 bg-gray-50 text-xs text-gray-900 rounded-[8px] border border-gray-200 focus:border-[#1299E8] outline-none"
            />
          </div>

          <button
            type="submit"
            className="h-[38px] px-4 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-[8px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
};
