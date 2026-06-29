export interface ProductSize {
  name: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hoverImageUrl?: string;
  images?: string[];
  brand?: string;
  stock?: number;
  sizes?: ProductSize[] | string[];
  colors?: string[];
  category?: string;
  categoryId?: string;
  description?: string;
  isTrending?: boolean;
  isNew?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface Category {
  id: string;
  title: string;
  imageUrl: string;
  order?: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
}

export interface SiteSettings {
  storeName: string;
  logoText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  announcementText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  customCss?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  link: string;
}

export interface HomepageSection {
  id: string;
  title: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface HomepageSectionProduct {
  id: string;
  section_id: string;
  product_id: string;
  display_order: number;
}
