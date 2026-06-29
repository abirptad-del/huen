import React from 'react';
import { useAppContext } from '../context/AppContext';

export const Hero = () => {
  const { settings } = useAppContext();

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] md:h-[70vh] lg:h-[80vh] md:min-h-[500px] flex flex-col bg-gray-900 overflow-hidden">
      {/* Background Image (dynamic from settings) */}
      <div 
        className="absolute inset-0 bg-cover bg-center md:bg-top bg-no-repeat"
        style={{ backgroundImage: `url('${settings.heroImageUrl || 'https://images.unsplash.com/photo-1583391733958-c7e63ef2b1b5?w=1600&q=80'}')` }}
      />
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-12 lg:px-20 h-full flex flex-col justify-center">
        <div className="max-w-xl text-left mt-0 md:mt-0">
          
          <p className="text-[#c9b79b] text-[10px] md:text-sm tracking-[0.2em] uppercase font-bold mb-2 md:mb-6">
            NEW COLLECTION 2025
          </p>

          <h2 className="text-[1.7rem] leading-tight md:text-5xl lg:text-[4rem] font-serif text-white md:leading-[1.1] mb-2 md:mb-6">
            {/* Simple trick to italicize "Elegance," for preview, or render normally */}
            {(settings.heroHeadline || 'Draped in Elegance, Woven with Grace').split(/(Elegance,)/).map((part, i) => 
               part === 'Elegance,' ? <span key={i} className="italic text-[#c9b79b]">{part}</span> : part
            )}
          </h2>
          
          <p className="text-gray-200 text-[10px] sm:text-xs md:text-base mb-4 md:mb-8 md:max-w-md line-clamp-2 md:line-clamp-none md:leading-relaxed">
            {settings.heroSubheadline || 'Discover our curated collection of premium fabrics — from delicate silks to luxurious cottons, each piece tells a story.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
            <button className="px-4 py-2 md:px-8 md:py-3 outline-none hover:opacity-90 transition-all text-[10px] md:text-sm tracking-wider font-semibold" style={{ backgroundColor: settings.buttonBgColor || '#1a1105', color: settings.buttonTextColor || '#c9b79b' }}>
              SHOP COLLECTION
            </button>
            <button className="bg-transparent border px-4 py-2 md:px-8 md:py-3 outline-none hover:opacity-90 transition-all text-[10px] md:text-sm tracking-wider font-semibold" style={{ color: settings.buttonTextColor || '#c9b79b', borderColor: settings.buttonTextColor || '#c9b79b' }}>
              LIMITED DROPS
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};


