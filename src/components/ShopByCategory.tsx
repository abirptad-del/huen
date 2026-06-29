import { Category } from '../types';

interface Props {
  categories: Category[];
}

export const ShopByCategory = ({ categories }: Props) => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-serif font-medium mb-4">Shop By Category</h2>
        <div className="w-16 h-0.5 bg-black mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {categories.map((category, idx) => (
          <a key={`${category.id}-${idx}`} href="#" className="group block relative overflow-hidden">
            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100">
              <img 
                src={category.imageUrl || undefined} 
                alt={category.title} 
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="inline-block px-6 py-2 bg-white text-black text-sm font-medium tracking-widest leading-none shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
                {category.title.toUpperCase()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
