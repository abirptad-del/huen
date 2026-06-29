import { Category, InstagramPost, Product, Review } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', title: 'LIMITED DROPS', imageUrl: 'https://images.unsplash.com/photo-1515347619362-72b38b1f5f3e?w=800&q=80', order: 1 },
  { id: '2', title: 'COTTON STITCHED', imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', order: 2 },
  { id: '3', title: 'COTTON UNSTITCHED', imageUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80', order: 3 },
  { id: '4', title: 'PARTY WEAR STITCHED', imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80', order: 4 },
  { id: '5', title: 'SILK STITCHED', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80', order: 5 },
  { id: '6', title: 'PK GEORGETTE STITCHED', imageUrl: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&q=80', order: 6 },
  { id: '7', title: '2PCS DRESSES', imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80', order: 7 },
  { id: '8', title: 'PREMIUM SILK SAREE', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', order: 8 },
  { id: '9', title: '1PIECE DRESSES', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80', order: 9 },
  { id: '10', title: 'SLUB COTTON', imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268738cb004?w=800&q=80', order: 10 },
];

export const PRODUCTS_TRENDING: Product[] = [
  { id: 't1', title: 'Linen Blend Midi Dress', price: 89.00, imageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1515347619362-e67406a461e5?w=600&q=80', brand: 'MOKKAH' },
  { id: 't2', title: 'Satin Slip Skirt', price: 65.00, originalPrice: 85.00, imageUrl: 'https://images.unsplash.com/photo-1583391733958-d25e07fac04f?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=600&q=80', brand: 'MOKKAH' },
  { id: 't3', title: 'Ribbed Knit Tank', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', brand: 'MOKKAH' },
  { id: 't4', title: 'Tailored Wide Leg Pants', price: 95.00, imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1550614000-4b95d4edae1c?w=600&q=80', brand: 'MOKKAH' },
];

export const PRODUCTS_NEW: Product[] = [
  { id: 'n1', title: 'Silk Wrap Blouse', price: 110.00, imageUrl: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&q=80', brand: 'MOKKAH' },
  { id: 'n2', title: 'Cotton Poplin Shirt', price: 75.00, imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1604689598793-b6ea107b198c?w=600&q=80', brand: 'MOKKAH' },
  { id: 'n3', title: 'Pleated Midi Trousers', price: 105.00, originalPrice: 130.00, imageUrl: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', brand: 'MOKKAH' },
  { id: 'n4', title: 'Cashmere Blend Cardigan', price: 145.00, imageUrl: 'https://images.unsplash.com/photo-1538329972958-465d6d2144ed?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1434389678369-184ac4f8c985?w=600&q=80', brand: 'MOKKAH' },
];

export const PRODUCTS_ESSENTIALS: Product[] = [
  { id: 'e1', title: 'Classic White Tee', price: 30.00, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80', brand: 'MOKKAH' },
  { id: 'e2', title: 'Everyday Denim Jacket', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80', brand: 'MOKKAH' },
  { id: 'e3', title: 'High-Rise Straight Jeans', price: 98.00, originalPrice: 128.00, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1584328627361-4191fe7847ea?w=600&q=80', brand: 'MOKKAH' },
  { id: 'e4', title: 'Layering Turtleneck', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80', hoverImageUrl: 'https://images.unsplash.com/photo-1574212555547-0b1a03e1e2ad?w=600&q=80', brand: 'MOKKAH' },
];

export const REVIEWS: Review[] = [
  { id: '1', author: 'Sarah J.', rating: 5, text: 'The quality of these fabrics is unparalleled. I always get compliments when I wear my Mokkah pieces.', date: 'May 12, 2026' },
  { id: '2', author: 'Emily R.', rating: 5, text: 'Fast shipping and beautiful packaging. The dresses fit perfectly true to size.', date: 'April 28, 2026' },
  { id: '3', author: 'Jessica M.', rating: 4, text: 'Love the minimalist designs. Great staples for my capsule wardrobe.', date: 'April 15, 2026' },
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1485230895905-efd542bde9fb?w=400&q=80', link: '#' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80', link: '#' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80', link: '#' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1502716115624-b56ef31409e5?w=400&q=80', link: '#' },
  { id: '5', imageUrl: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=400&q=80', link: '#' },
];
