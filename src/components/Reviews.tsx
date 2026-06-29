import { Star } from 'lucide-react';
import { Review } from '../types';

interface Props {
  reviews: Review[];
}

export const Reviews = ({ reviews }: Props) => {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-medium mb-4">Loved By You</h2>
          <div className="flex justify-center items-center gap-1 text-black">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500 font-medium tracking-wider">BASED ON 1,500+ REVIEWS</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 shadow-sm">
              <div className="flex justify-center items-center gap-1 text-black mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed italic">"{review.text}"</p>
              <div className="text-xs tracking-widest font-medium uppercase text-gray-900 border-t border-gray-100 pt-4">
                {review.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
