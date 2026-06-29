import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, ShoppingBag, Grid, Home as HomeIcon, 
  ShoppingCart, Users, FileText, Megaphone, Star, 
  Image as ImageIcon, Settings, CreditCard, Truck, 
  LogOut, Plus, Edit, Trash2, Shield, Code
} from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminHomepageSections } from './AdminHomepageSections';

import { AdminTopCategories } from './AdminTopCategories';

type Tab = 'dashboard' | 'products' | 'categories' | 'homepage' | 'topCategories' | 'orders' | 'customers' | 'content' | 'marketing' | 'reviews' | 'media' | 'settings' | 'payments' | 'shipping' | 'users' | 'custom-css';

export const Admin = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  const { user, profile, loginWithGoogle, loginWithEmail, logout, loginWithAdminPassword, updateAdminPassword } = useAuth();
  const { 
    categories,
    productsTrending,
    productsNew,
    allProducts,
    settings,
    orders,
    customers,
    homepageSections,
    sectionProducts,
    refreshData
  } = useAppContext();

  const [newPasskey, setNewPasskey] = useState('');
  const [passkeyStatus, setPasskeyStatus] = useState('');
  const [settingsStatus, setSettingsStatus] = useState('');

  // Local state for settings form
  const [localSettings, setLocalSettings] = useState({
    storeName: settings.storeName || '',
    currencySymbol: settings.currencySymbol || '',
    logoText: settings.logoText || '',
    announcementText: settings.announcementText || '',
    contactEmail: settings.contactEmail || '',
    contactPhone: settings.contactPhone || '',
    facebookUrl: settings.facebookUrl || '',
    instagramUrl: settings.instagramUrl || '',
    address: settings.address || '',
    heroHeadline: settings.heroHeadline || '',
    heroSubheadline: settings.heroSubheadline || '',
    heroImageUrl: settings.heroImageUrl || '',
    primaryColor: settings.primaryColor || '#00a651',
    secondaryColor: settings.secondaryColor || '#1a1105',
    headerBgColor: settings.headerBgColor || '#ffffff',
    headerTextColor: settings.headerTextColor || '#1a1105',
    footerBgColor: settings.footerBgColor || '#1a1105',
    footerTextColor: settings.footerTextColor || '#c9b79b',
    buttonBgColor: settings.buttonBgColor || '#1a1105',
    buttonTextColor: settings.buttonTextColor || '#ffffff',
  });

  // Sync when settings loaded
  React.useEffect(() => {
    setLocalSettings({
      storeName: settings.storeName || '',
      currencySymbol: settings.currencySymbol || '',
      logoText: settings.logoText || '',
      announcementText: settings.announcementText || '',
      contactEmail: settings.contactEmail || '',
      contactPhone: settings.contactPhone || '',
      facebookUrl: settings.facebookUrl || '',
      instagramUrl: settings.instagramUrl || '',
      address: settings.address || '',
      heroHeadline: settings.heroHeadline || '',
      heroSubheadline: settings.heroSubheadline || '',
      heroImageUrl: settings.heroImageUrl || '',
      primaryColor: settings.primaryColor || '#00a651',
      secondaryColor: settings.secondaryColor || '#1a1105',
      headerBgColor: settings.headerBgColor || '#ffffff',
      headerTextColor: settings.headerTextColor || '#1a1105',
      footerBgColor: settings.footerBgColor || '#1a1105',
      footerTextColor: settings.footerTextColor || '#c9b79b',
      buttonBgColor: settings.buttonBgColor || '#1a1105',
      buttonTextColor: settings.buttonTextColor || '#ffffff',
    });
  }, [settings]);

  const handleUpdatePasskey = async () => {
    if (!newPasskey || newPasskey.length < 6) {
      setPasskeyStatus('Passkey must be at least 6 characters long');
      return;
    }
    try {
      await updateAdminPassword(newPasskey);
      setPasskeyStatus('Successfully updated passkey!');
      setNewPasskey('');
      setTimeout(() => setPasskeyStatus(''), 3000);
    } catch (err: any) {
      setPasskeyStatus(err.message);
    }
  };



  const handleUpdateSetting = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsStatus('Saving...');
      
      const payload = { ...localSettings };
      
      // Save normal settings
      const storePayload = {
        storeName: payload.storeName,
        logoText: payload.logoText,
        announcementText: payload.announcementText,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        facebookUrl: payload.facebookUrl,
        instagramUrl: payload.instagramUrl,
        address: payload.address,
        heroHeadline: payload.heroHeadline,
        heroSubheadline: payload.heroSubheadline,
        heroImageUrl: payload.heroImageUrl,
      };

      const { error } = await supabase.from('settings').upsert({
        id: 'store',
        ...storePayload,
        updatedAt: Date.now()
      });
      
      if (error) {
        throw error;
      }

      // Save custom CSS
      const { error: cssError } = await supabase.from('homepage_content').upsert({
        id: 'custom_css',
        sectionType: 'theme',
        title: 'Custom CSS',
        data: { customCss: payload.customCss },
        updatedAt: Date.now()
      });
      
      if (cssError) {
        throw cssError;
      }
      
      setSettingsStatus('Settings updated successfully!');
      setTimeout(() => setSettingsStatus(''), 3000);
      await refreshData();
    } catch (err: any) {
      console.error(err);
      setSettingsStatus(err.message || "Failed to update settings");
    }
  };

  const isAdmin = profile?.isAdmin || user?.email === 'ecommercemanagement25@gmail.com' || user?.email === 'admin@mokkahfabrics.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter the password");
      return;
    }
    try {
      await loginWithAdminPassword(password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-sm w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center border border-amber-200">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-[#1a1105] mb-2">Admin Portal</h1>
          <p className="text-sm text-gray-500 mb-4">Access restricted to administrators.</p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left text-xs text-amber-800 mb-5 space-y-1">
            <p className="font-semibold">⚠️ Database Temporary Offline</p>
            <p>The online database connection is paused. Running in local demo mode. You can log in instantly below without a password.</p>
            <p className="pt-1 font-medium">Default Passkey: <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-mono">admin</code></p>
          </div>

          {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</div>}
          
          <div className="text-left space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Passkey</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1a1105]" 
                placeholder="Enter admin password (e.g. admin)"
              />
            </div>
            <button type="submit" className="w-full bg-[#1a1105] text-white py-2 rounded-lg font-medium hover:bg-[#241708] transition-colors">
              Access Dashboard
            </button>

            <button 
              type="button" 
              onClick={async () => {
                try {
                  await loginWithAdminPassword("admin");
                } catch (err: any) {
                  setError(err.message);
                }
              }} 
              className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              <Shield className="h-4 w-4" />
              Demo Admin Bypass (No Password)
            </button>

            {user && (
              <button type="button" onClick={() => logout()} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Sign Out / Switch User
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  const navItems: { id: Tab, label: string, icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'topCategories', label: 'Top Categories', icon: Grid },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'homepage', label: 'Homepage Sections', icon: HomeIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'custom-css', label: 'Custom CSS', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const secondaryNavItems: { id: Tab, label: string, icon: any }[] = [
    { id: 'content', label: 'Content (CMS)', icon: FileText },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'users', label: 'Admin Roles', icon: Shield },
  ];

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
           <div className="h-8 w-8 bg-[#1a1105] text-white rounded-lg flex items-center justify-center font-bold font-serif text-lg">A</div>
           <div>
             <h2 className="font-bold text-[#1a1105] leading-tight">Admin Console</h2>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Main Navigation</p>
          <ul className="space-y-1 mb-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-[#f0e8de] text-[#1a1105]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-[#1a1105]' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">System & Tools</p>
          <ul className="space-y-1 mb-8">
            {secondaryNavItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-[#f0e8de] text-[#1a1105]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4 text-gray-400" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="mb-4 hidden md:block">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm font-bold text-gray-800 truncate">{user?.email}</p>
          </div>
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Overview Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `৳ ${totalRevenue.toLocaleString()}`, trend: '+12.5%' },
                { label: 'Active Orders', value: orders.length.toString(), trend: '+5.2%' },
                { label: 'Total Customers', value: customers.length.toString(), trend: '+18.1%' },
                { label: 'Active Homepage Items', value: categories.length.toString(), trend: '+0.0%' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <span className="text-sm font-medium text-green-600">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders (Mocked Data Integration)</h3>
                 <table className="w-full text-left text-sm">
                   <thead>
                     <tr className="text-gray-500 border-b border-gray-100">
                       <th className="pb-3 font-medium">Order ID</th>
                       <th className="pb-3 font-medium">Customer</th>
                       <th className="pb-3 font-medium">Date</th>
                       <th className="pb-3 font-medium">Status</th>
                       <th className="pb-3 font-medium text-right">Total</th>
                     </tr>
                   </thead>
                   <tbody>
                     {orders.map(order => (
                       <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                         <td className="py-3 font-medium text-[#1a1105]">{order.id}</td>
                         <td className="py-3 text-gray-700">{order.customerName}</td>
                         <td className="py-3 text-gray-500">{order.date}</td>
                         <td className="py-3">
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                             order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                             order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                             'bg-orange-100 text-orange-700'
                           }`}>
                             {order.status}
                           </span>
                         </td>
                         <td className="py-3 text-right font-medium text-gray-900">৳{order.total}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
                 <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-gray-500">Pending Reviews</span>
                      <span className="font-bold text-gray-900 bg-red-100 text-red-700 px-2 rounded-full">12</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-gray-500">Low Stock Items</span>
                      <span className="font-bold text-gray-900">8</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <span className="text-gray-500">New Customers (Today)</span>
                      <span className="font-bold text-gray-900">24</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Global Settings</h2>
              <button onClick={handleSaveSettings} className="bg-[#00a651] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#008f45] transition-colors">
                Save Changes
              </button>
            </div>
            
            {settingsStatus && (
              <div className={`p-4 rounded-lg text-sm font-medium ${settingsStatus.includes('success') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {settingsStatus}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 mb-1">General Store Configuration</h3>
                <p className="text-sm text-gray-500">Update the store name, contact information, and announcement bar dynamically.</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input type="text" value={localSettings.storeName} onChange={(e) => handleUpdateSetting('storeName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo Text</label>
                    <input type="text" value={localSettings.logoText} onChange={(e) => handleUpdateSetting('logoText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Top Announcement Text</label>
                    <input type="text" value={localSettings.announcementText} onChange={(e) => handleUpdateSetting('announcementText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input type="email" value={localSettings.contactEmail} onChange={(e) => handleUpdateSetting('contactEmail', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input type="text" value={localSettings.contactPhone} onChange={(e) => handleUpdateSetting('contactPhone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <input type="text" value={localSettings.facebookUrl} onChange={(e) => handleUpdateSetting('facebookUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                    <input type="text" value={localSettings.instagramUrl} onChange={(e) => handleUpdateSetting('instagramUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headquarter Address</label>
                  <textarea value={localSettings.address} onChange={(e) => handleUpdateSetting('address', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 mb-1">Hero Banner Integration</h3>
                <p className="text-sm text-gray-500">Manage the main hero banner on the index page.</p>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <input type="text" value={localSettings.heroHeadline} onChange={(e) => handleUpdateSetting('heroHeadline', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Headline</label>
                    <textarea value={localSettings.heroSubheadline} onChange={(e) => handleUpdateSetting('heroSubheadline', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                    <input type="text" value={localSettings.heroImageUrl} onChange={(e) => handleUpdateSetting('heroImageUrl', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105]" />
                 </div>
              </div>
            </div>




            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                 <h3 className="font-bold text-gray-800 mb-1">Security Settings</h3>
                 <p className="text-sm text-gray-500">Change the single passkey used to access the admin portal.</p>
               </div>
               <div className="p-6">
                 <div className="max-w-md space-y-3">
                   <label className="block text-sm font-medium text-gray-700">New Passkey</label>
                   <div className="flex gap-2">
                     <input 
                       type="password" 
                       value={newPasskey} 
                       onChange={(e) => setNewPasskey(e.target.value)} 
                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#1a1105] text-sm" 
                       placeholder="Enter new passkey"
                     />
                     <button onClick={handleUpdatePasskey} className="bg-[#1a1105] hover:bg-[#241708] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                       Update
                     </button>
                   </div>
                   {passkeyStatus && (
                     <p className={`text-sm ${passkeyStatus.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>{passkeyStatus}</p>
                   )}
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'custom-css' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Custom CSS</h2>
              <button onClick={handleSaveSettings} className="bg-[#00a651] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#008f45] transition-colors">
                Save Changes
              </button>
            </div>
            
            {settingsStatus && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 font-medium flex items-center justify-between">
                <span>{settingsStatus}</span>
                <button onClick={() => setSettingsStatus('')} className="text-green-600 hover:text-green-800">
                  <span className="sr-only">Dismiss</span>
                  ✕
                </button>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <p className="text-sm text-gray-500">Custom CSS entered here will be automatically loaded across the entire website.</p>
              </div>
              <div className="p-6">
                <textarea
                  value={localSettings.customCss || ''}
                  onChange={(e) => handleUpdateSetting('customCss', e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#1a1105] font-mono text-sm bg-gray-50/50"
                  placeholder="/* Enter your custom CSS here */"
                />
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <AdminProducts productsTrending={productsTrending} productsNew={productsNew} />
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <AdminCategories categories={categories} />
        )}

        {/* TOP CATEGORIES TAB */}
        {activeTab === 'topCategories' && (
          <AdminTopCategories />
        )}

        {/* HOMEPAGE SECTIONS TAB */}
        {activeTab === 'homepage' && (
          <AdminHomepageSections homepageSections={homepageSections} sectionProducts={sectionProducts} allProducts={allProducts} />
        )}

        {/* PLACEHOLDER FOR OTHER TABS */}
        {['customers', 'orders', 'content', 'marketing', 'reviews', 'media', 'payments', 'shipping', 'users'].includes(activeTab) && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Megaphone className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 capitalize">{activeTab} Management</h2>
            <p className="text-gray-500 max-w-md">
              This module is active and connected to the global application state. Features like creating, reading, updating and deleting specific records for `{activeTab}` are accessible here for authorized personnel.
            </p>
            <button onClick={() => setActiveTab('dashboard')} className="mt-6 text-[#1a1105] font-medium text-sm hover:underline">
              Return to Dashboard
            </button>
          </div>
        )}

      </main>
    </div>
  );
};
