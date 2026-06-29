export const Newsletter = () => {
  return (
    <section className="py-20 md:py-28 bg-[#f9f9f9] border-t border-gray-200">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-medium mb-4 text-black">Join The Mokkah Community</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sign up to receive 10% off your first order, plus exclusive access to new arrivals, sales, and styling tips.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 bg-white border border-gray-300 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:border-black text-sm transition-colors"
            required
          />
          <button 
            type="submit" 
            className="bg-black text-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors uppercase whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4">
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
};
