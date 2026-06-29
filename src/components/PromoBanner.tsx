export const PromoBanner = () => {
  return (
    <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden bg-gray-900 group">
        <div className="flex flex-col md:flex-row items-stretch">
          
          <div className="w-full md:w-1/2 relative h-64 md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" 
              alt="Promo collection" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left bg-[#f8f5f0]">
            <h3 className="text-sm font-semibold tracking-[0.2em] text-gray-500 mb-3 uppercase">Exclusively Yours</h3>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-6">The Capsule Collection</h2>
            <p className="text-gray-600 mb-8 max-w-md">Discover premium fabrics and timeless silhouettes designed for the modern wardrobe. Limited quantities available.</p>
            <a href="#" className="inline-block px-8 py-3 bg-black text-white text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors cursor-pointer">
              DISCOVER NOW
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
