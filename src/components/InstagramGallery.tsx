import { Instagram } from 'lucide-react';
import { InstagramPost } from '../types';

interface Props {
  posts: InstagramPost[];
}

export const InstagramGallery = ({ posts }: Props) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <Instagram className="h-8 w-8 mb-4 text-gray-800" />
        <h2 className="text-2xl md:text-3xl font-serif font-medium mb-2">Shop Our Instagram</h2>
        <a href="#" className="text-sm tracking-widest text-gray-500 hover:text-black hover:underline underline-offset-4 transition-colors">
          @MOKKAHFABRICS
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
        {posts.map((post) => (
          <a key={post.id} href={post.link} className="group relative aspect-square block overflow-hidden bg-gray-100">
            <img 
              src={post.imageUrl || undefined} 
              alt="Instagram post" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <Instagram className="h-8 w-8 text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
