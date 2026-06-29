import { Facebook, Instagram, Youtube, Heart, MapPin, Phone, Mail } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Footer = () => {
  const { categories, settings } = useAppContext();

  return (
    <footer className="border-t flex flex-col" style={{ backgroundColor: settings.footerBgColor || '#1a1105', color: settings.footerTextColor || '#c9b79b', borderColor: settings.footerBgColor || '#1a1105' }}>
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-12 lg:px-20 py-6 md:py-16">
        <div className="flex flex-col md:grid md:grid-cols-4 md:gap-8 gap-y-6">
          
          {/* Column 1: Logo & About */}
          <div className="flex flex-col lg:pr-8">
            <div className="flex items-center cursor-pointer mb-3 md:mb-6">
               <div className="font-serif text-2xl md:text-3xl leading-none">
                 <span style={{ color: settings.primaryColor || '#ffffff' }}>{settings.logoText.split(' ')[0]}</span>
                 <span style={{ color: settings.secondaryColor || '#c9b79b' }} className="ml-1.5">{settings.logoText.split(' ').slice(1).join(' ')}</span>
               </div>
            </div>
            
            <p className="text-[13px] md:text-sm text-[#c9b79b]/70 leading-snug md:leading-relaxed mb-4 md:mb-6 font-sans max-w-sm">
              Discover premium quality with {settings.storeName}. We bring you the finest collection of trending styles and comfortable wear.
            </p>
            
            <div className="flex space-x-2 md:space-x-3">
               <a href={settings.facebookUrl} className="h-8 w-8 md:h-9 md:w-9 border border-[#c9b79b]/20 flex items-center justify-center text-[#c9b79b]/70 hover:text-white hover:border-[#c9b79b]/50 transition-all cursor-pointer">
                 <Facebook className="h-3.5 w-3.5 md:h-4 md:w-4" />
               </a>
               <a href={settings.instagramUrl} className="h-8 w-8 md:h-9 md:w-9 border border-[#c9b79b]/20 flex items-center justify-center text-[#c9b79b]/70 hover:text-white hover:border-[#c9b79b]/50 transition-all cursor-pointer">
                 <Instagram className="h-3.5 w-3.5 md:h-4 md:w-4" />
               </a>
               <a href="#" className="h-8 w-8 md:h-9 md:w-9 border border-[#c9b79b]/20 flex items-center justify-center text-[#c9b79b]/70 hover:text-white hover:border-[#c9b79b]/50 transition-all cursor-pointer">
                 <svg className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current" viewBox="0 0 24 24">
                   <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.96-.5 3.96-1.6 5.4-1.28 1.69-3.2 2.71-5.32 2.92-2.14.22-4.38-.2-6.1-1.48-1.78-1.33-2.9-3.37-3.13-5.58-.2-1.92.21-3.9 1.25-5.5 1.05-1.6 2.67-2.69 4.6-3.08 1.4-.28 2.87-.24 4.18.25v4.06c-.84-.26-1.76-.23-2.58.1-.8.32-1.46.96-1.84 1.73-.38.77-.44 1.68-.17 2.48.27.8.84 1.48 1.58 1.84.73.36 1.61.43 2.4.19.78-.24 1.44-.81 1.78-1.55.33-.72.38-1.55.15-2.31V0l1.24.02z"/>
                 </svg>
               </a>
               <a href="#" className="h-8 w-8 md:h-9 md:w-9 border border-[#c9b79b]/20 flex items-center justify-center text-[#c9b79b]/70 hover:text-white hover:border-[#c9b79b]/50 transition-all cursor-pointer">
                 <Youtube className="h-3.5 w-3.5 md:h-4 md:w-4" />
               </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:hidden">
            {/* Quick Links (Mobile) */}
            <div>
              <h3 className="text-[15px] font-serif text-white mb-2 font-medium">Quick Links</h3>
              <ul className="space-y-1.5 text-[13px] font-sans text-white/70">
                <li><a href="#" className="inline-block hover:text-white transition-colors cursor-pointer">About Us</a></li>
                <li><a href="#" className="inline-block hover:text-white transition-colors cursor-pointer">Contact Us</a></li>
                <li><a href="#" className="inline-block hover:text-white transition-colors cursor-pointer">FAQ</a></li>
                <li><a href="#" className="inline-block hover:text-white transition-colors cursor-pointer">Tracking</a></li>
              </ul>
            </div>

            {/* Get In Touch (Mobile) */}
            <div>
              <h3 className="text-[15px] font-serif text-white mb-2 font-medium">Contact</h3>
              <ul className="space-y-2 text-[13px] font-sans text-[#c9b79b]/70">
                <li className="flex items-start gap-2 group">
                  <MapPin className="h-3.5 w-3.5 shrink-0 mt-[1px] opacity-60" />
                  <p className="leading-tight text-[12px]">{settings.address}</p>
                </li>
                <li className="flex items-center gap-2 group">
                  <Phone className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>
                </li>
                <li className="flex items-start gap-2 group">
                  <Mail className="h-3.5 w-3.5 shrink-0 opacity-60 mt-[2px]" />
                  <a href={`mailto:${settings.contactEmail}`} className="break-all leading-tight text-[12px]">{settings.contactEmail}</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Quick Links (Desktop) */}
          <div className="hidden md:block">
            <h3 className="text-[17px] font-serif text-white mb-6 font-medium">Quick Links</h3>
            <ul className="space-y-4 text-sm font-sans text-white/70">
              <li><a href="#" className="inline-block hover:text-white transition-colors cursor-pointer">About Us</a></li>
              <li><a href="#" className="inline-block hover:text-white transition-colors cursor-pointer">Contact Us</a></li>
              <li><a href="#" className="inline-block hover:text-white transition-colors cursor-pointer">FAQ</a></li>
              <li><a href="#" className="inline-block hover:text-white transition-colors cursor-pointer">Order Tracking</a></li>
            </ul>
          </div>

          {/* Column 3: Categories (Hidden on mobile) */}
          {categories.length > 0 && (
          <div className="hidden md:block">
            <h3 className="text-[17px] font-serif text-white mb-6 font-medium">Categories</h3>
            <ul className="space-y-4 text-sm font-sans text-white/70">
              {categories.slice(0, 5).map((c, idx) => (
                <li key={`${c.id}-${idx}`}>
                  <a href="#" className="inline-block hover:text-white transition-colors cursor-pointer line-clamp-1">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          )}

          {/* Column 4: Get In Touch (Desktop) */}
          <div className="hidden md:block">
            <h3 className="text-[17px] font-serif text-white mb-6 font-medium">Get In Touch</h3>
            <ul className="space-y-4 text-sm font-sans text-[#c9b79b]/70">
              <li className="flex items-start gap-3 group">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[#c9b79b]/50 group-hover:text-[#c9b79b] transition-all" />
                <p className="leading-relaxed hover:text-white transition-colors cursor-pointer">{settings.address}</p>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="h-4 w-4 shrink-0 text-[#c9b79b]/50 group-hover:text-[#c9b79b] transition-all" />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition-colors block">{settings.contactPhone}</a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="h-4 w-4 shrink-0 text-[#c9b79b]/50 group-hover:text-[#c9b79b] transition-all" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors break-all block">{settings.contactEmail}</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-current/10" style={{ backgroundColor: settings.primaryColor || '#1a1105' }}>
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-12 lg:px-20 py-3 md:py-6 flex flex-col md:flex-row justify-between items-center text-[11px] md:text-sm font-sans opacity-70">
          <p className="text-center md:text-left md:mb-0" style={{ color: settings.buttonTextColor || '#ffffff' }}>&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="hidden md:flex items-center gap-1.5" style={{ color: settings.buttonTextColor || '#ffffff' }}>
            Made with <Heart className="h-3 w-3 md:h-3.5 md:w-3.5 text-red-500 fill-current" /> in Bangladesh
          </div>
        </div>
      </div>
    </footer>
  );
};

