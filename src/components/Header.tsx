import { ShoppingCart, Heart, User, Search, Menu, ChevronDown, X, ChevronRight, LogOut, Zap } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const ResponsiveCategoryNav = ({ categories }: { categories: any[] }) => {
  const { settings } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current || !measureRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const items = Array.from(measureRef.current.children) as HTMLElement[];
      
      let currentWidth = 0;
      let count = 0;
      const moreButtonWidth = 80; // approximate width for "More"
      const gap = 16; 

      for (let i = 0; i < items.length; i++) {
        const itemWidth = items[i].offsetWidth;
        const widthToAdd = itemWidth + (i > 0 ? gap : 0);
        
        // If adding this item exceeds the container width (minus space for "More" button if it's not the last item)
        if (currentWidth + widthToAdd + (i < items.length - 1 ? gap + moreButtonWidth : 0) > containerWidth) {
          break;
        }
        
        currentWidth += widthToAdd;
        count++;
      }
      
      // Safety check to at least show 1 item if possible, or 0
      setVisibleCount(count);
    };

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    // Also run once initially
    updateSize();

    return () => observer.disconnect();
  }, [categories]);

  const visibleCategories = categories.slice(0, visibleCount);
  const hiddenCategories = categories.slice(visibleCount);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Invisible Measuring Container Wrapper */}
      <div className="absolute top-0 left-0 h-0 overflow-hidden opacity-0 pointer-events-none">
        <ul 
          ref={measureRef} 
          className="flex items-center gap-4 whitespace-nowrap text-[12px] font-medium w-max"
        >
          {categories.map((item, index) => {
            const isLimited = item.title.toLowerCase().includes('limit') || item.title.toLowerCase().includes('drop');
            return (
             <li key={`measure-${item.id}-${index}`} className="flex items-center gap-1.5 h-10 uppercase tracking-[0.05em]">
               {isLimited && <span>🔥</span>}
               {item.title}
             </li>
           );
          })}
        </ul>
      </div>

      {/* Visible Nav */}
      <ul className="flex justify-center items-center gap-4 whitespace-nowrap text-[12px] font-medium w-full">
        {visibleCategories.map((item, index) => {
          const isLimited = item.title.toLowerCase().includes('limit') || item.title.toLowerCase().includes('drop');
          const isActive = index === 1; // Example preview styling

          return (
            <li key={`visible-${item.id}-${index}`} className="relative group flex items-center h-10">
              <Link 
                to={`/shop?category=${encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, '-'))}`}
                className={`flex items-center gap-1.5 h-full relative z-10 transition-colors uppercase tracking-[0.05em]
                  ${isLimited ? 'text-red-600' : 'group-hover:opacity-75'}`}
                style={{ color: isLimited ? undefined : (isActive ? (settings.headerTextColor || '#1a1105') : undefined) }}
              >
                {isLimited && <span>🔥</span>}
                {item.title}
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: settings.headerTextColor || '#1a1105' }}></div>}
                {!isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" style={{ backgroundColor: settings.headerTextColor || '#1a1105' }}></div>}
              </Link>
            </li>
          );
        })}

        {hiddenCategories.length > 0 && (
          <li 
            ref={dropdownRef}
            className="relative group flex items-center h-10"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 uppercase tracking-[0.05em] text-gray-600 hover:text-[#1a1105] transition-colors h-full"
            >
              More <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`absolute top-full right-0 w-48 bg-white border border-gray-100 shadow-lg transition-all duration-200 py-2 z-50 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <ul className="flex flex-col text-[12px] font-medium text-gray-600 uppercase tracking-[0.05em]">
                {hiddenCategories.map((item, idx) => (
                  <li key={`hidden-${item.id}-${idx}`}>
                    <Link to={`/shop?category=${encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, '-'))}`} className="block px-5 py-2 hover:bg-gray-50 hover:text-[#1a1105] transition-colors">{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [liveSearchQuery, setLiveSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { categories, settings, cart, allProducts } = useAppContext();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);
  
  const activeCategories = categories
    .sort((a,b) => (a.order || 0) - (b.order || 0));

  const liveSearchResults = [...allProducts]
    .filter(p => {
      const q = liveSearchQuery.toLowerCase();
      if (!q) return false;
      return p.title.toLowerCase().includes(q) || 
             p.description?.toLowerCase().includes(q) ||
             p.category?.toLowerCase().includes(q);
    }).slice(0, 5);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query?.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setIsMobileSearchOpen(false);
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-[100]" style={{ backgroundColor: settings.headerBgColor || '#ffffff', color: settings.headerTextColor || '#1a1105' }}>
      {/* Main Header Area */}
      <div className="border-b border-gray-100 py-2" style={{ backgroundColor: settings.headerBgColor || '#ffffff' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center w-full md:gap-8 relative">
            
            <div className="flex items-center gap-2 md:w-auto w-1/3">
              {/* Mobile Menu Toggle */}
              <div className="flex items-center md:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-1 -ml-1 hover:bg-black/5 rounded-full transition-all active:scale-90 duration-200"
                  style={{ color: settings.headerTextColor || '#1a1105' }}
                >
                  <Menu className="h-6 w-6" strokeWidth={2} />
                </button>
              </div>

              {/* Logo (Desktop Positioned) */}
              <Link to="/" className="hidden md:flex flex-col items-center justify-center shrink-0 cursor-pointer">
                 <div className="font-serif flex flex-col items-center justify-center">
                   <div className="flex items-baseline leading-none mb-0.5">
                     <span className="font-bold text-3xl font-sans text-[22px]" style={{ color: settings.primaryColor || '#3b2b85' }}>{settings.logoText?.[0] || 'm'}</span>
                     <span className="font-bold text-3xl font-sans text-[22px] -ml-0.5" style={{ color: settings.secondaryColor || '#e23072', marginTop: '-2px' }}>&nbsp;{settings.logoText?.[1] || 'f'}</span>
                   </div>
                   <div className="flex flex-col items-center justify-center">
                     <div className="leading-none mb-0.5">
                       <span className="font-bold font-sans tracking-tight text-[1.3rem]" style={{ color: settings.primaryColor || '#3b2b85' }}>{settings.storeName || 'Mokkah Fabrics'}</span>
                     </div>
                     <span className="text-[0.45rem] uppercase tracking-[0.2em] leading-none" style={{ color: settings.secondaryColor || '#b3b3b3' }}>{settings.announcementText || 'Quality That Speaks'}</span>
                   </div>
                 </div>
              </Link>
            </div>

            {/* Logo (Mobile Abs-Centered) */}
            <Link to="/" className="md:hidden absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center shrink-0 cursor-pointer pt-0">
               <div className="font-serif flex flex-col items-center justify-center">
                 <div className="flex items-baseline leading-none mb-0.5">
                   <span className="font-bold text-xl font-sans text-[22px]" style={{ color: settings.primaryColor || '#3b2b85' }}>{settings.logoText?.[0] || 'm'}</span>
                   <span className="font-bold text-xl font-sans text-[22px] -ml-0.5" style={{ color: settings.secondaryColor || '#e23072', marginTop: '-2px' }}>&nbsp;{settings.logoText?.[1] || 'f'}</span>
                 </div>
                 <div className="flex flex-col items-center justify-center">
                   <div className="leading-none mb-0.5">
                     <span className="font-bold font-sans tracking-tight text-[1.05rem]" style={{ color: settings.primaryColor || '#3b2b85' }}>{settings.storeName || 'Mokkah Fabrics'}</span>
                   </div>
                   <span className="text-[0.38rem] uppercase tracking-[0.2em] leading-none" style={{ color: settings.secondaryColor || '#b3b3b3' }}>{settings.announcementText || 'Quality That Speaks'}</span>
                 </div>
               </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer z-10">
                  <Search className="h-4 w-4 text-[#5c3cbe] hover:text-[#3b2b85]" style={{ color: settings.primaryColor || '#5c3cbe' }} />
                </button>
                <input 
                  name="search"
                  type="text" 
                  autoComplete="off"
                  value={liveSearchQuery}
                  onChange={(e) => {
                    setLiveSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for anything..." 
                  className={`w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-[#5c3cbe] focus:ring-1 focus:ring-[#5c3cbe] ${isSearchFocused && liveSearchQuery.trim() ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-full"}`}
                />
              </form>

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {isSearchFocused && liveSearchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 shadow-lg rounded-b-2xl overflow-hidden z-50 pb-2"
                  >
                    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-50">
                      <Zap className="h-3 w-3 text-red-500 fill-red-500" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Results</span>
                    </div>
                    {liveSearchResults.length > 0 ? (
                      <ul className="py-1">
                        {liveSearchResults.map((product) => (
                          <li key={product.id}>
                            <Link 
                              to={`/product/${product.id}`}
                              onClick={() => {
                                setIsSearchFocused(false);
                                setLiveSearchQuery('');
                              }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
                            >
                              <div className="h-10 w-10 shrink-0 bg-gray-100 rounded overflow-hidden">
                                <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-medium text-gray-900 truncate transition-colors" style={{ color: settings.primaryColor || '#5c3cbe' }}>{product.title}</h4>
                                <p className="text-[12px] font-bold" style={{ color: settings.primaryColor || '#5c3cbe' }}>৳{product.price.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0})}</p>
                              </div>
                              <ChevronRight className="h-3 w-3 text-gray-300 transition-colors" style={{ color: settings.primaryColor || '#5c3cbe' }} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No products found for "{liveSearchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Icons */}
            <div className="flex items-center justify-end gap-5 md:gap-6 shrink-0 md:w-auto w-1/3">
              {/* Search (Mobile Only) */}
               <button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} className="md:hidden flex flex-col items-center gap-1 cursor-pointer">
                 <Search className="h-[22px] w-[22px] text-gray-700" strokeWidth={1.5} />
               </button>

              {user ? (
                <div className="flex flex-col items-center gap-1 cursor-pointer group relative">
                  <User className="h-[22px] w-[22px] md:h-5 md:w-5 text-gray-700 group-hover:text-[#1a1105] transition-colors" strokeWidth={1.5} />
                  <span className="hidden md:inline text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-[#1a1105] font-medium">Account</span>
                  
                  {/* User Dropdown */}
                  <div className="absolute top-full right-1/2 translate-x-[20%] md:translate-x-1/2 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#1a1105]">My Profile</Link>
                      </li>
                      <li>
                        <Link to="/orders" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#1a1105]">Order History</Link>
                      </li>
                      <div className="border-t border-gray-100 my-1"></div>
                      <li>
                        <button onClick={() => logout()} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="flex flex-col items-center gap-1 cursor-pointer group">
                  <User className="h-[22px] w-[22px] md:h-5 md:w-5 text-gray-700 group-hover:text-[#1a1105] transition-colors" strokeWidth={1.5} />
                  <span className="hidden md:inline text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-[#1a1105] font-medium">Account</span>
                </Link>
              )}

              <button className="hidden md:flex flex-col items-center gap-1 cursor-pointer group">
                <Heart className="h-5 w-5 text-gray-700 group-hover:text-[#1a1105] transition-colors" strokeWidth={1.5} />
                <span className="text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-[#1a1105] font-medium">Wishlist</span>
              </button>
              
              <button className="hidden md:flex flex-col items-center gap-1 cursor-pointer relative group">
                <div className="relative">
                  <ShoppingCart className="h-[22px] w-[22px] sm:h-5 sm:w-5 text-gray-700 group-hover:text-[#1a1105] transition-colors" strokeWidth={1.5} />
                  {cart && cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-[#3b2b85] text-white text-[9px] sm:text-[10px] font-bold border border-white">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-[#1a1105] font-medium">Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-b border-gray-100 bg-white overflow-visible relative"
          >
            <div className="px-4 py-3 relative z-50">
              <form onSubmit={handleSearch} className="relative">
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer z-10">
                  <Search className="h-4 w-4 hover:text-[#3b2b85]" style={{ color: settings.primaryColor || '#5c3cbe' }} />
                </button>
                <input 
                  name="search"
                  type="text" 
                  autoComplete="off"
                  value={liveSearchQuery}
                  onChange={(e) => {
                    setLiveSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for anything..." 
                  className={`w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-[#5c3cbe] ${isSearchFocused && liveSearchQuery.trim() ? "rounded-t-xl rounded-b-none border-b-0" : "rounded-full"}`}
                  autoFocus
                />
                <button type="button" onClick={() => setIsMobileSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </form>

              {/* Mobile Autocomplete Dropdown */}
              <AnimatePresence>
                {isSearchFocused && liveSearchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-4 right-4 bg-white border border-gray-200 border-t-0 shadow-lg rounded-b-xl overflow-hidden z-50 pb-2"
                  >
                    <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-50">
                      <Zap className="h-3 w-3 text-red-500 fill-red-500" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Results</span>
                    </div>
                    {liveSearchResults.length > 0 ? (
                      <ul className="py-1">
                        {liveSearchResults.map((product) => (
                          <li key={product.id}>
                            <Link 
                              to={`/product/${product.id}`}
                              onClick={() => {
                                setIsSearchFocused(false);
                                setLiveSearchQuery('');
                                setIsMobileSearchOpen(false);
                              }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
                            >
                              <div className="h-10 w-10 shrink-0 bg-gray-100 rounded overflow-hidden">
                                <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[13px] font-medium text-gray-900 truncate transition-colors" style={{ color: settings.primaryColor || '#5c3cbe' }}>{product.title}</h4>
                                <p className="text-[12px] font-bold" style={{ color: settings.primaryColor || '#5c3cbe' }}>৳{product.price.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0})}</p>
                              </div>
                              <ChevronRight className="h-3 w-3 text-gray-300 transition-colors" style={{ color: settings.primaryColor || '#5c3cbe' }} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No products found for "{liveSearchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Menu (Desktop) */}
      <nav className="hidden md:flex border-b border-gray-100 relative z-30 bg-white shadow-sm h-10 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full items-center">
         <ResponsiveCategoryNav categories={activeCategories} />
      </nav>
      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div key="mobile-drawer" className="md:hidden fixed inset-0 z-[100] flex">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50" 
              onClick={() => setIsMenuOpen(false)} 
            >
              <style>{`
                .mobile-bottom-nav { display: none !important; }
                body { overflow: hidden; }
              `}</style>
            </motion.div>
            
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-[85vw] max-w-sm bg-white shadow-xl flex flex-col h-[100dvh]"
            >
               {/* Drawer Header */}
               <div className="flex justify-between items-center shrink-0 px-4 py-3 border-b" style={{ backgroundColor: settings.footerBgColor || '#1a1105', color: settings.footerTextColor || '#c9b79b', borderColor: settings.primaryColor || '#1a1105' }}>
                  <span className="font-bold text-lg tracking-wide">Menu</span>
                  <button onClick={() => setIsMenuOpen(false)} className="hover:opacity-75 transition-transform active:rotate-90 duration-300">
                    <X className="h-6 w-6" strokeWidth={2} />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto pb-6">
                 {/* Login / Signup */}
                 {!user && <div className="px-4 pt-4 pb-2 flex gap-3">
                   <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 border bg-white font-bold py-2 rounded-[2rem] text-[13px] transition-colors text-center" style={{ borderColor: settings.primaryColor || '#5C32CC', color: settings.primaryColor || '#5C32CC' }}>Log In</Link>
                   <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex-1 text-white font-bold py-2 rounded-[2rem] text-[13px] shadow-sm text-center" style={{ backgroundColor: settings.primaryColor || '#5C32CC' }}>Sign Up</Link>
                 </div>}

                 {/* Categories */}
                 <div className="px-4 py-1">
                   <h3 className="text-[11px] text-gray-400 font-bold tracking-[0.05em] uppercase mb-1 mt-2">SHOP CATEGORIES</h3>
                   <ul className="flex flex-col text-[14.5px] font-[500] text-[#333333]">
                     {activeCategories.map((item, idx) => (
                       <li key={`${item.id}-${idx}`}>
                         <Link 
                           to={`/shop?category=${encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, '-'))}`}
                           className="flex justify-between items-center py-3 border-b border-gray-100 hover:text-[#5C32CC]"
                           onClick={() => setIsMenuOpen(false)}
                         >
                           <span>{item.title}</span>
                           <ChevronRight className="h-3.5 w-3.5 text-[#b0b0b0]" strokeWidth={2.5} />
                         </Link>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </header>
  );
};
