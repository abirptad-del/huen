import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Home, Store, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { settings, cart } = useAppContext();

  const navItems: { label: string; icon: any; href: string; isExternal: boolean; badge?: number | false }[] = [
    {
      label: 'Phone',
      icon: Phone,
      href: `tel:${settings?.contactPhone || '+8809639279024'}`,
      isExternal: true
    },
    {
      label: 'Messenger',
      icon: MessageCircle,
      href: settings?.facebookUrl || 'https://m.me/mokkahfabrics',
      isExternal: true
    },
    {
      label: 'Home',
      icon: Home,
      href: '/',
      isExternal: false
    },
    {
      label: 'Shop',
      icon: Store,
      href: '/#shop',
      isExternal: false
    },
    {
      label: 'Cart',
      icon: ShoppingCart,
      href: '/cart',
      isExternal: false,
      badge: cart && cart.length > 0 ? cart.length : false
    }
  ];

  return (
    <div className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center w-full px-1 sm:px-2 py-1.5 pb-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          const content = (
            <div className="flex flex-col items-center justify-center group flex-1 py-1">
              <div className="relative mb-0.5">
                <Icon strokeWidth={1.5} className={`h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] transition-colors duration-200 ${isActive ? 'text-black' : 'text-gray-600 group-hover:text-black'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${isActive ? 'text-black' : 'text-gray-600 group-hover:text-black'}`}>
                {item.label}
              </span>
            </div>
          );

          if (item.isExternal) {
            return (
              <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="flex-1">
                {content}
              </a>
            );
          }

          return (
            <Link key={index} to={item.href} className="flex-1">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
