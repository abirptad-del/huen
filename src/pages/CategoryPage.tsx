import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import { Product } from "../types";
import { Link } from "react-router-dom";
import { Heart, Eye, Filter, Tag } from "lucide-react";
import { useState, useMemo } from "react";

export const CategoryPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categorySlug = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  const { allProducts, categories, homepageSections, topCategories, sectionProducts, settings } = useAppContext();

  // Find the title matching this slug
  const titleMatcher = (t: string) => t.toLowerCase().replace(/\s+/g, '-') === categorySlug;

  const getDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const categoryName = useMemo(() => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    const tc = topCategories.find(c => titleMatcher(c.title));
    if (tc) return tc.title;
    const sec = homepageSections.find(s => titleMatcher(s.title));
    if (sec) return sec.title;
    const cat = categories.find(c => titleMatcher(c.title));
    if (cat) return cat.title;
    return categorySlug.replace(/-/g, ' ').toUpperCase();
  }, [categorySlug, searchQuery, topCategories, homepageSections, categories]);

  const rawProducts = useMemo(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return allProducts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        categories.find(c => c.id === p.categoryId)?.title.toLowerCase().includes(q)
      );
    }

    let matchedProducts: Product[] = [];
    
    // Check if it matches a categories item
    const cat = categories.find(c => titleMatcher(c.title));
    if (cat) {
      const catProds = allProducts.filter(p => p.categoryId === cat.id);
      matchedProducts = [...matchedProducts, ...catProds];
    }

    // Check if it matches a homepageSection
    const sec = homepageSections.find(s => titleMatcher(s.title));
    if (sec) {
      const productMappings = sectionProducts
        .filter((sp) => sp.section_id === sec.id)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      const secProds = productMappings.map((sp) => allProducts.find((p) => p.id === sp.product_id)).filter(Boolean) as Product[];
      matchedProducts = [...matchedProducts, ...secProds];
    }

    // Check if it matches topCategories
    const tc = topCategories.find(c => titleMatcher(c.title));
    if (tc) {
      const productIds: string[] = tc.data?.productIds || [];
      const tcProds = productIds
        .map((id) => allProducts.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      matchedProducts = [...matchedProducts, ...tcProds];
    }

    if (matchedProducts.length > 0) {
      // Deduplicate by ID
      const uniqueIds = new Set();
      return matchedProducts.filter(p => {
        if (!uniqueIds.has(p.id)) {
          uniqueIds.add(p.id);
          return true;
        }
        return false;
      });
    }
    
    // 3. Last resort fallback by similarity
    return allProducts.filter(p => 
      p.category?.toLowerCase().replace(/\s+/g, '-') === categorySlug || 
      p.categoryId?.toLowerCase().replace(/\s+/g, '-') === categorySlug
    );
  }, [categorySlug, allProducts, topCategories, homepageSections, categories, sectionProducts]);

  const [sortOption, setSortOption] = useState('recommended');
  const [visibleCount, setVisibleCount] = useState(12);
  const [priceRange, setPriceRange] = useState({ min: 350, max: 3750 });
  const [filters, setFilters] = useState({
    bestPrice: false,
    hotDeals: false,
    newArrival: false,
    trending: false
  });
  
  const displayedProducts = useMemo(() => {
    let sorted = [...rawProducts];

    // Apply strict filters based on data layout
    if (filters.trending) {
      sorted = sorted.filter(p => p.isTrending);
    }
    if (filters.newArrival) {
      sorted = sorted.filter(p => p.isNew);
    }
    // "Best Price" and "Hot Deals" can be mock logic or rely on discounts:
    if (filters.bestPrice || filters.hotDeals) {
      sorted = sorted.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Apply sorting
    if (sortOption === 'price-low-high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'newest') {
      sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    return sorted;
  }, [rawProducts, sortOption, filters]);

  const currentProducts = displayedProducts.slice(0, visibleCount);
  const totalProducts = displayedProducts.length;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-gray-900" style={{ color: settings.primaryColor || '#1a1105' }}>
              {categoryName}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{totalProducts} Products</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0 lg:hidden">
            <div className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 cursor-pointer">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-sm border-gray-200 border rounded-md px-3 py-1.5 focus:ring-1 focus:ring-[#1a1105] outline-none bg-white cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest Arrival</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Optional Sidebar hidden on mobile */}
          <aside className="hidden lg:block w-[15rem] shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                 <Filter className="w-5 h-5" style={{ color: settings.primaryColor || '#5c3cbe' }} />
                 <h3 className="font-bold text-gray-900 text-lg">
                   Filters 
                   {Object.values(filters).filter(Boolean).length > 0 && (
                     <span style={{ backgroundColor: settings.primaryColor || '#5c3cbe' }} className="text-white rounded-full px-2 py-0.5 text-xs ml-2">
                       {Object.values(filters).filter(Boolean).length}
                     </span>
                   )}
                 </h3>
              </div>
              
              {/* Sort By */}
              <div className="mb-6">
                <label className="text-sm text-gray-500 mb-2 block">Sort By</label>
                <div className="relative">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 outline-none appearance-none cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="newest">New Arrival</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span className="text-red-500 font-bold">$</span> Price Range (৳)
                </h4>
                <div className="relative pt-1">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div className="absolute h-1 rounded-full" style={{ left: '10%', right: '20%', backgroundColor: settings.primaryColor || '#5c3cbe' }}></div>
                  </div>
                  <div className="absolute top-0 w-3 h-3 bg-white border-2 rounded-full -mt-1 cursor-pointer" style={{ left: '10%', borderColor: settings.primaryColor || '#5c3cbe' }}></div>
                  <div className="absolute top-0 w-3 h-3 bg-white border-2 rounded-full -mt-1 cursor-pointer" style={{ left: '80%', borderColor: settings.primaryColor || '#5c3cbe' }}></div>
                </div>
                <div className="flex justify-between items-center mt-5">
                  <div className="text-xs font-medium px-4 py-1.5 rounded" style={{ backgroundColor: '#fdf4f4', color: settings.primaryColor || '#5c3cbe', border: '1px solid #f6e2e2' }}>৳350</div>
                  <div className="text-xs font-medium px-4 py-1.5 rounded" style={{ backgroundColor: '#fdf4f4', color: settings.primaryColor || '#5c3cbe', border: '1px solid #f6e2e2' }}>৳3750</div>
                </div>
              </div>

              {/* Offers */}
              <div className="mb-8">
                 <h4 className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                   <Tag className="w-4 h-4 text-red-500" /> Offers
                 </h4>
                 <div className="space-y-3">
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input type="checkbox" checked={filters.bestPrice} onChange={e => setFilters({...filters, bestPrice: e.target.checked})} className="w-4 h-4 rounded border-gray-300 focus:ring-opacity-50" style={{ accentColor: settings.primaryColor || '#5c3cbe' }} />
                     <span className="text-sm text-gray-700">Best Price</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input type="checkbox" checked={filters.hotDeals} onChange={e => setFilters({...filters, hotDeals: e.target.checked})} className="w-4 h-4 rounded border-gray-300 focus:ring-opacity-50" style={{ accentColor: settings.primaryColor || '#5c3cbe' }} />
                     <span className="text-sm text-gray-700">Hot Deals</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input type="checkbox" checked={filters.newArrival} onChange={e => setFilters({...filters, newArrival: e.target.checked})} className="w-4 h-4 rounded border-gray-300 focus:ring-opacity-50" style={{ accentColor: settings.primaryColor || '#5c3cbe' }} />
                     <span className="text-sm text-gray-700">New Arrival</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                     <input type="checkbox" checked={filters.trending} onChange={e => setFilters({...filters, trending: e.target.checked})} className="w-4 h-4 rounded border-gray-300 focus:ring-opacity-50" style={{ accentColor: settings.primaryColor || '#5c3cbe' }} />
                     <span className="text-sm text-gray-700">Trending Products</span>
                   </label>
                 </div>
              </div>

              <div className="space-y-3">
                <button className="w-full text-white py-2 rounded-md font-medium text-sm hover:opacity-90 transition-opacity" style={{ backgroundColor: settings.primaryColor || '#5c3cbe' }}>Apply Filters</button>
                <button 
                  onClick={() => setFilters({ bestPrice: false, hotDeals: false, newArrival: false, trending: false })}
                  className="w-full border text-red-500 bg-white py-2 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors" 
                  style={{ borderColor: '#f6e2e2' }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 md:grid-cols-3">
              {currentProducts.map((product, idx) => (
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

            {totalProducts === 0 && (
              <div className="py-20 text-center">
                <p className="text-gray-500">No products found in this category.</p>
              </div>
            )}

            {visibleCount < totalProducts && (
              <div className="mt-12 flex justify-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors cursor-pointer"
                  style={{ backgroundColor: settings.primaryColor || '#1a1105' }}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
