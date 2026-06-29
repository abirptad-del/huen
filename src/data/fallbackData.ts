export interface FallbackCategory {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
}

export interface FallbackProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  hoverImageUrl?: string;
  brand: string;
  stock: number;
  categoryId: string;
  category: string;
  description: string;
  isTrending: boolean;
  isNew: boolean;
  sizes: string[];
  colors: string[];
  createdAt: number;
  updatedAt: number;
}

export interface FallbackHomepageSection {
  id: string;
  title: string;
  is_active: boolean;
  display_order: number;
}

export interface FallbackHomepageSectionProduct {
  id: string;
  section_id: string;
  product_id: string;
  display_order: number;
}

export interface FallbackTopCategory {
  id: string;
  sectionType: string;
  title: string;
  subtitle: string;
  order: number;
  isActive: boolean;
  data: {
    productIds: string[];
  };
}

export const fallbackCategories: FallbackCategory[] = [
  {
    id: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781',
    title: 'Limited Drops',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    order: 0,
  },
  {
    id: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6',
    title: 'Cotton Stitched',
    imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop&q=80',
    order: 1,
  },
  {
    id: '878a3aa8-5639-4a62-a36c-5e5dfc8ea66b',
    title: 'Cotton Unstitched',
    imageUrl: 'https://images.unsplash.com/photo-1524250502761-136f2507bfcf?w=800&auto=format&fit=crop&q=80',
    order: 2,
  },
  {
    id: '3f98d533-5087-453d-bf02-7bc2b9bf5768',
    title: 'Party Wear Stitched',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    order: 3,
  },
  {
    id: 'a35b5650-08c4-4101-8283-c5b5687214db',
    title: 'Silk Stitched',
    imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80',
    order: 4,
  },
  {
    id: 'ce299307-97db-414c-b8d4-4dcb43ae2d66',
    title: 'PK Georgette Stitched',
    imageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&auto=format&fit=crop&q=80',
    order: 5,
  },
  {
    id: 'e8462178-6f94-463b-a64a-d9480e89d825',
    title: '2pcs Dresses',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    order: 6,
  },
  {
    id: '57527e40-8e5c-44e3-8bc8-646d365144ae',
    title: 'Premium Silk Saree',
    imageUrl: 'https://images.unsplash.com/photo-1610030470298-3ce8e0078028?w=800&auto=format&fit=crop&q=80',
    order: 7,
  }
];

export const fallbackProducts: FallbackProduct[] = [
  {
    id: '9101cf2a-2993-4ede-9fbc-cb22aa98fb6a',
    title: 'Amber Marble',
    price: 750,
    originalPrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    hoverImageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    brand: 'Mokkah',
    stock: 12,
    categoryId: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781',
    category: 'Limited Drops',
    description: 'Beautiful Amber Marble patterned unstitched premium luxury collection, perfect for everyday or occasion wear.',
    isTrending: true,
    isNew: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Amber', 'Gold'],
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now()
  },
  {
    id: '1e972650-d96b-4183-acda-dd788de27cf1',
    title: 'Amethyst Marble',
    price: 750,
    originalPrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1524250502761-136f2507bfcf?w=800&auto=format&fit=crop&q=80',
    hoverImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    brand: 'Mokkah',
    stock: 8,
    categoryId: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781',
    category: 'Limited Drops',
    description: 'Gorgeously detailed Amethyst print on premium quality linen material. Comfortable and lightweight fabric.',
    isTrending: true,
    isNew: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Purple', 'Indigo'],
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now()
  },
  {
    id: '159b5851-4073-40fb-8c1e-0a1285906f4b',
    title: 'Violet Marble',
    price: 750,
    originalPrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80',
    hoverImageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop&q=80',
    brand: 'Mokkah',
    stock: 5,
    categoryId: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781',
    category: 'Limited Drops',
    description: 'Beautifully printed premium fabrics in rich violet shade, perfect for formal outings and gatherings.',
    isTrending: true,
    isNew: true,
    sizes: ['M', 'L'],
    colors: ['Violet'],
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now()
  },
  {
    id: '8d862915-c491-4349-9691-b83ed3927ae7',
    title: 'Fariya TF White',
    price: 1550,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop&q=80',
    hoverImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    brand: 'Mokkah',
    stock: 15,
    categoryId: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6',
    category: 'Cotton Stitched',
    description: 'Elegant pure cotton stitched outfit featuring delicate traditional lace work and premium finishes.',
    isTrending: true,
    isNew: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Off-White', 'White'],
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now()
  },
  {
    id: '788d1c11-03d9-41b0-97b2-000c6f47fce2',
    title: 'Parul SadaBahar',
    price: 1550,
    originalPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    hoverImageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&auto=format&fit=crop&q=80',
    brand: 'Mokkah',
    stock: 10,
    categoryId: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6',
    category: 'Cotton Stitched',
    description: 'Bright and traditional colors of cotton fabric for a comfortable daytime wear.',
    isTrending: false,
    isNew: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Red', 'Pink'],
    createdAt: Date.now() - 3600000 * 30,
    updatedAt: Date.now()
  }
];

export const fallbackHomepageSections: FallbackHomepageSection[] = [
  {
    id: 'sec-limited',
    title: 'Limited Drops',
    is_active: true,
    display_order: 1
  },
  {
    id: 'sec-cotton',
    title: 'Cotton Stitched',
    is_active: true,
    display_order: 2
  }
];

export const fallbackHomepageSectionProducts: FallbackHomepageSectionProduct[] = [
  {
    id: 'm1',
    section_id: 'sec-limited',
    product_id: '9101cf2a-2993-4ede-9fbc-cb22aa98fb6a',
    display_order: 1
  },
  {
    id: 'm2',
    section_id: 'sec-limited',
    product_id: '1e972650-d96b-4183-acda-dd788de27cf1',
    display_order: 2
  },
  {
    id: 'm3',
    section_id: 'sec-limited',
    product_id: '159b5851-4073-40fb-8c1e-0a1285906f4b',
    display_order: 3
  },
  {
    id: 'm4',
    section_id: 'sec-cotton',
    product_id: '8d862915-c491-4349-9691-b83ed3927ae7',
    display_order: 1
  },
  {
    id: 'm5',
    section_id: 'sec-cotton',
    product_id: '788d1c11-03d9-41b0-97b2-000c6f47fce2',
    display_order: 2
  }
];

export const fallbackTopCategories: FallbackTopCategory[] = [
  {
    id: 'tc-1',
    sectionType: 'top_category',
    title: 'Featured Collection',
    subtitle: 'Our top choices of the season',
    order: 1,
    isActive: true,
    data: {
      productIds: ['9101cf2a-2993-4ede-9fbc-cb22aa98fb6a', '1e972650-d96b-4183-acda-dd788de27cf1']
    }
  }
];
