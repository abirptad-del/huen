import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Share, Heart, Minus, Plus, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allProducts, settings } = useAppContext();
  
  const product = allProducts.find(p => p.id === id);
  // Default fallback if not found by exact ID, maybe it's title
  const foundProduct = product || allProducts.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImage, setActiveImage] = useState<string>('');

  // Setup images array from product (images + imageUrl + hoverImageUrl)
  const images = foundProduct?.images?.length ? [...foundProduct.images] : [];
  if (images.length === 0) {
    if (foundProduct?.imageUrl) images.push(foundProduct.imageUrl);
    if (foundProduct?.hoverImageUrl) images.push(foundProduct.hoverImageUrl);
  }

  React.useEffect(() => {
    if (images.length > 0 && !activeImage) {
      setActiveImage(images[0]);
    }
  }, [images, activeImage]);

  if (!foundProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24 pb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-2 rounded-md hover:opacity-90 transition-colors"
              style={{ backgroundColor: settings.buttonBgColor || '#1a1105', color: settings.buttonTextColor || '#ffffff' }}
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const img = target.querySelector('img');
    if (!img) return;

    const x = (e.nativeEvent.offsetX / target.offsetWidth) * 100;
    const y = (e.nativeEvent.offsetY / target.offsetHeight) * 100;

    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = 'scale(2)';
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const img = target.querySelector('img');
    if (!img) return;

    img.style.transformOrigin = 'center center';
    img.style.transform = 'scale(1)';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-10 md:pt-16 pb-16 mt-20 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div 
              className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-gray-100 cursor-zoom-in"
              onMouseMove={handleZoom}
              onMouseLeave={handleLeave}
            >
              <img 
                src={activeImage || foundProduct.imageUrl || undefined} 
                alt={foundProduct.title} 
                className="w-full h-full object-cover transition-transform duration-200 ease-out"
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-[#1a1105]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img || undefined} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <div>
              <div className="flex justify-between items-start">
                {foundProduct.category && (
                  <span className="text-xs text-gray-500 uppercase tracking-widest">{foundProduct.category}</span>
                )}
                <div className="flex gap-4 text-xs text-gray-500 ml-auto">
                  <button className="flex items-center gap-1 hover:text-gray-900"><Share className="w-3 h-3"/> Share</button>
                  <button className="flex items-center gap-1 hover:text-gray-900"><Heart className="w-3 h-3"/> Wishlist</button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{foundProduct.title}</h1>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">৳{foundProduct.price.toFixed(2)}</span>
                {foundProduct.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through text-lg">৳{foundProduct.originalPrice.toFixed(2)}</span>
                    <span className="text-red-500 text-sm font-medium">
                      {Math.round(((foundProduct.originalPrice - foundProduct.price) / foundProduct.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>
              {foundProduct.originalPrice && (
                <div className="text-sm text-green-600 mt-1">
                  You save ৳{(foundProduct.originalPrice - foundProduct.price).toFixed(2)}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size:</h3>
              <div className="flex gap-3 flex-wrap">
                {(foundProduct.sizes && foundProduct.sizes.length > 0 ? foundProduct.sizes : ['S', 'M', 'L']).map((sizeItem, idx) => {
                  let sizeName = "Unknown";
                  let stock: number | null = null;
                  
                  if (typeof sizeItem === 'string') {
                    if (sizeItem.startsWith('{')) {
                      try {
                        const parsed = JSON.parse(sizeItem);
                        sizeName = parsed.name;
                        stock = parsed.stock;
                      } catch {
                        sizeName = sizeItem;
                      }
                    } else {
                      sizeName = sizeItem;
                    }
                  } else {
                    sizeName = (sizeItem as any).name;
                    stock = (sizeItem as any).stock;
                  }
                  
                  const isOutOfStock = stock !== null && stock <= 0;
                  const isActive = selectedSize === sizeName;
                  return (
                  <button 
                    key={idx}
                    onClick={() => {
                      if (!isOutOfStock) setSelectedSize(sizeName);
                    }}
                    disabled={isOutOfStock}
                    className={`min-w-10 px-2 h-10 border rounded flex flex-col items-center justify-center text-sm font-medium transition-colors ${
                      isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-100 line-through text-gray-400' :
                      isActive 
                        ? 'bg-gray-50' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                    style={isActive && !isOutOfStock ? { borderColor: settings.primaryColor || '#1a1105', color: settings.primaryColor || '#1a1105' } : undefined}
                    title={isOutOfStock ? "Out of stock" : stock !== null ? `${stock} in stock` : ""}
                  >
                    <span>{sizeName}</span>
                  </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm mt-2">
              <span className="text-gray-500">SKU:</span>
              <span className="px-2 py-0.5 border border-red-200 text-red-600 rounded text-xs bg-red-50">MFB-{foundProduct.id?.substring(0,4) || '614'}</span>
              <span className="text-gray-500 text-xs ml-2">Select your preference</span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded w-max">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 hover:bg-gray-100"><Minus className="w-4 h-4"/></button>
                <div className="px-4 py-1 border-x border-gray-300 font-medium text-sm">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-gray-100"><Plus className="w-4 h-4"/></button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button 
                className="w-full py-3 rounded font-medium flex justify-center items-center gap-2 transition-colors hover:opacity-90"
                style={{ backgroundColor: settings.buttonBgColor || '#00a651', color: settings.buttonTextColor || '#ffffff' }}
              >
                ক্যাশ অন ডেলিভারিতে অর্ডার করুন
              </button>
              <div className="flex gap-3">
                <button 
                  className="flex-1 py-3 border hover:opacity-90 rounded font-medium transition-colors"
                  style={{ borderColor: settings.primaryColor || '#6b21a8', color: settings.primaryColor || '#6b21a8', backgroundColor: 'transparent' }}
                >
                  Add to Cart
                </button>
                <button 
                  className="flex-1 py-3 rounded font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: settings.primaryColor || '#6b21a8', color: '#ffffff' }}
                >
                  Buy Now
                </button>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-2">
              40 people are viewing this product
            </div>

            <div className="flex justify-between items-center py-6 mt-4 border-t border-b border-gray-100">
              <div className="flex flex-col items-center gap-2 flex-1">
                <Truck className="w-6 h-6 text-[#6b21a8]"/>
                <div className="text-xs text-center font-medium">Fast Shipping</div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <ShieldCheck className="w-6 h-6 text-[#6b21a8]"/>
                <div className="text-xs text-center font-medium">Secure Payment<br/><span className="text-[10px] text-gray-400 font-normal">100% Protected</span></div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <RefreshCw className="w-6 h-6 text-[#6b21a8]"/>
                <div className="text-xs text-center font-medium">Easy Returns<br/><span className="text-[10px] text-gray-400 font-normal">7 Days Return Policy</span></div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Product Description</h3>
              <div className="text-sm text-gray-600 space-y-4">
                <p><strong>New Arrival Of Premium LX Georgette 3piece Collection 🍃</strong></p>
                <p>Stay Fresh & Relaxed All Day Long — Perfect For Daily Use.</p>
                {foundProduct.description && (
                  <p>{foundProduct.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
