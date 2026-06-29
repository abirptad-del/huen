import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const CategoryGrid = () => {
  const { categories } = useAppContext();
  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll ? categories : categories.slice(0, 10);

  return (
    <section className="pt-6 md:pt-8 pb-4 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {displayedCategories.map((cat, idx) => (
            <Link 
              to={`/shop?category=${encodeURIComponent(cat.title.toLowerCase().replace(/\s+/g, '-'))}`}
              key={`${cat.id}-${idx}`} 
              className="relative flex flex-col bg-white border border-gray-100 rounded-[1.25rem] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-gray-200 transition-all duration-300 cursor-pointer group aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-[400px]"
            >
              
              {/* Image Container */}
              <div className="w-full flex-grow relative z-10 overflow-hidden bg-gray-50">
                <img 
                  src={cat.imageUrl || undefined} 
                  alt={cat.title} 
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.05] transition-transform duration-700 ease-in-out" 
                  loading="lazy"
                />
              </div>

              {/* Dedicated Bottom Title Section */}
              <div className="w-full text-center py-4 bg-white relative z-20 shrink-0 border-t border-transparent group-hover:border-gray-50 transition-colors">
                <h3 className="text-[10px] md:text-xs font-bold text-gray-800 tracking-wider inline-block">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        {categories.length > 10 && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 text-[11px] md:text-xs font-semibold text-[#b8616b] hover:text-white hover:bg-[#b8616b] px-4 py-1.5 rounded-full transition-all duration-300 group cursor-pointer"
            >
              {showAll ? 'Show Less' : 'Show More'} 
              {showAll ? (
                <ChevronUp className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
