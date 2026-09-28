import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { AdminUser, setAdminAuthUser } from './adminStore';
import { navigateAdmin, formatAdminHref } from './adminRouting';

interface AdminLayoutProps {
  currentPath: string;
  user: AdminUser;
  children: React.ReactNode;
  pendingOrdersCount?: number;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  user,
  children,
  pendingOrdersCount = 2,
  onLogout,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Products', icon: Package, path: '/products', matchPrefix: '/products' },
    { label: 'Categories', icon: FolderTree, path: '/categories' },
    { label: 'Orders', icon: ShoppingBag, path: '/orders', matchPrefix: '/orders', badge: pendingOrdersCount },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Coupons', icon: Tag, path: '/coupons' },
    { label: 'Reviews', icon: Star, path: '/reviews' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleNavClick = (path: string) => {
    navigateAdmin(path);
    setMobileSidebarOpen(false);
  };

  const handleLogoutClick = () => {
    setAdminAuthUser(null);
    onLogout();
    navigateAdmin('/');
  };

  const isCurrentActive = (item: { path: string; matchPrefix?: string }) => {
    if (currentPath === item.path) return true;
    if (item.matchPrefix && currentPath.startsWith(item.matchPrefix)) return true;
    if (item.path === '/dashboard' && (currentPath === '/' || currentPath === '')) return true;
    return false;
  };

  const notificationsList = [
    {
      id: 1,
      title: 'New Order Received',
      desc: 'Order #HNV-89241 by Tanvir Ahmed (৳2,420)',
      time: '12 mins ago',
      unread: true,
      onClick: () => {
        navigateAdmin('/orders');
        setShowNotifications(false);
      }
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      desc: 'Portable Mini Vacuum Cleaner has only 8 items left',
      time: '1 hour ago',
      unread: true,
      onClick: () => {
        navigateAdmin('/products');
        setShowNotifications(false);
      }
    },
    {
      id: 3,
      title: 'New Customer Registered',
      desc: 'Shakil Mahmud joined from Dhaka',
      time: '4 hours ago',
      unread: false,
      onClick: () => {
        navigateAdmin('/customers');
        setShowNotifications(false);
      }
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-gray-800">
      {/* MOBILE SIDEBAR BACKDROP */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR COMPONENT */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-[#0F172A] text-white z-50 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out select-none ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div>
          <div className="h-[72px] px-5 flex items-center justify-between border-b border-slate-800">
            <div
              onClick={() => handleNavClick('/dashboard')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="bg-[#1299E8] px-2.5 py-1 rounded-[7px] flex items-center justify-center shadow-xs">
                <span className="font-extrabold text-white text-base tracking-tight">H&V</span>
              </div>
              <div>
                <div className="font-bold text-sm text-white tracking-tight leading-none flex items-center gap-1.5">
                  <span>hue n vibes</span>
                  <span className="bg-[#1299E8] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-[4px]">
                    360
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">Admin Management</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* DOMAIN BADGE */}
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Portal</span>
              </span>
              <span className="font-mono text-slate-300 font-medium">admin360</span>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
              Menu
            </div>
            {navItems.map((item) => {
              const active = isCurrentActive(item);
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[9px] text-[13.5px] font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1299E8] text-white font-semibold shadow-[0_2px_8px_rgba(18,153,232,0.3)]'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        active
                          ? 'bg-white text-[#1299E8]'
                          : 'bg-[#1299E8] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR BOTTOM / USER PROFILE */}
        <div className="p-3 border-t border-slate-800 bg-[#0B1120]">
          <div className="flex items-center justify-between p-2 rounded-[9px] bg-slate-800/50 hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogoutClick}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-md transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* TOPBAR */}
        <header className="h-[72px] bg-white border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          {/* LEFT: Mobile toggle & Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="text-gray-400 font-medium hidden sm:inline">Admin 360</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 hidden sm:inline" />
              <span className="text-gray-900 font-bold capitalize">
                {currentPath.replace(/^\//, '').replace(/\/new$/, ' / New').replace(/\/edit$/, ' / Edit') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Quick Add Product Button */}
            <button
              type="button"
              onClick={() => navigateAdmin('/products/new')}
              className="hidden sm:flex items-center gap-1.5 h-[38px] px-3.5 bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-xs font-semibold rounded-[8px] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>

            {/* Live Subdomain Indicator Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-mono text-[#1299E8]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>admin360.huenvibes.xyz</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative cursor-pointer focus:outline-none transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-[320px] sm:w-[350px] bg-white rounded-[14px] shadow-xl border border-gray-100 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                      <div className="font-bold text-sm text-gray-900">Notifications</div>
                      <span className="text-[11px] text-[#1299E8] font-semibold bg-[#1299E8]/10 px-2 py-0.5 rounded-full">
                        2 New
                      </span>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                      {notificationsList.map((item) => (
                        <div
                          key={item.id}
                          onClick={item.onClick}
                          className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                            item.unread ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-xs font-semibold text-gray-900">{item.title}</div>
                            <span className="text-[10px] text-gray-400">{item.time}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-100 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          navigateAdmin('/orders');
                          setShowNotifications(false);
                        }}
                        className="text-xs font-semibold text-[#1299E8] hover:underline"
                      >
                        View all orders
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar / Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-[220px] bg-white rounded-[12px] shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-xs font-bold text-gray-900">{user.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigateAdmin('/settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-400" />
                      <span>Admin Settings</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogoutClick();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
