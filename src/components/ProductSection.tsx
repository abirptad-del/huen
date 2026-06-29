import React from 'react';
import { Product } from '../types';
import { Heart, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface Props {
  title: string;
  products: Product[];
  theme?: 'purple' | 'rose';
  viewMoreUrl?: string;
}

export const ProductSection: React.FC<Props> = ({ title, products, theme = 'purple', viewMoreUrl }) => {
  const { settings } = useAppContext();
  
  const getDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const isRose = theme === 'rose';
  const defaultBgHex = isRose ? '#b8616b' : (settings.buttonBgColor || '#1a1105');
  const defaultTextHex = isRose ? '#ffffff' : (settings.buttonTextColor || '#c9b79b');
  
  const initialCount = 5;
  const displayedProducts = products.slice(0, initialCount);
  const hasMore = products.length > initialCount;

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm md:text-base font-bold uppercase border-b-2 pb-1 inline-block tracking-wide" style={{ color: settings.primaryColor || '#1a1105', borderColor: settings.primaryColor || '#1a1105' }}>{title}</h2>
        </div>
        {hasMore && viewMoreUrl && (
          <Link 
            to={viewMoreUrl}
            className="text-[10px] md:text-xs font-medium px-4 py-1.5 md:py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 hover:opacity-80"
            style={{ backgroundColor: defaultBgHex, color: defaultTextHex }}
          >
            See More
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-6 sm:gap-x-4">
        {displayedProducts.map((product, idx) => (
          <div key={`${product.id}-${idx}`} className="group relative cursor-pointer">
            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative mb-4 cursor-pointer">
              {/* Main Image */}
              <img
                src={product.imageUrl || undefined}
                alt={product.title}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 cursor-pointer ${product.hoverImageUrl ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
              />
              
              {/* Hover Image Effect */}
              {product.hoverImageUrl && (
                <img
                  src={product.hoverImageUrl || undefined}
                  alt={`${product.title} alternate view`}
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105 cursor-pointer"
                />
              )}

              {/* Discount Badge */}
              {product.originalPrice && (
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  <span className="bg-red-600 text-white text-[10px] font-bold tracking-widest px-2 py-1 uppercase shadow-sm">
                    -{getDiscount(product.price, product.originalPrice)}%
                  </span>
                </div>
              )}

              {/* Wishlist Icon */}
              <button className="absolute top-3 right-3 p-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black text-gray-900 hover:text-white shadow-sm z-10 translate-y-2 group-hover:translate-y-0 cursor-pointer">
                <Heart className="h-4 w-4" />
              </button>
              
              {/* Quick View Button */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <button className="w-full bg-white/95 text-black text-xs font-medium tracking-widest py-3 uppercase shadow-md flex justify-center items-center gap-2 hover:bg-black hover:text-white transition-colors cursor-pointer">
                  <Eye className="h-4 w-4" />
                  Quick View
                </button>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="text-left">
              {product.brand && (
                <p className="text-[10px] sm:text-xs text-gray-500 tracking-[0.15em] uppercase mb-1">{product.brand}</p>
              )}
              <h3 className="text-sm md:text-base text-gray-900 mb-1.5 transition-colors group-hover:text-gray-600 line-clamp-1">
                <Link to={`/product/${product.id}`}>
                  <span aria-hidden="true" className="absolute inset-0 z-0" />
                  {product.title}
                </Link>
              </h3>
              <div className="flex items-center justify-start gap-2.5 text-sm md:text-base">
                <span className="font-bold text-gray-900">৳ {product.price.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-xs font-medium">৳ {product.originalPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
