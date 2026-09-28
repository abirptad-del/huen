export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Manager' | 'Editor';
  avatar: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  bnName: string;
  desc: string;
  bnDesc: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery?: string[];
  categoryIndex: number;
  categoryName: string;
  stock: number;
  sku: string;
  status: 'Published' | 'Draft' | 'Out of Stock';
  isPopular?: boolean;
  isNewest?: boolean;
  features?: string[];
  specs?: Record<string, string>;
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  index: number;
  name: string;
  bnName: string;
  image: string;
  desc: string;
  productCount: number;
  status: 'Active' | 'Hidden';
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  city: string;
  area: string;
  postalCode?: string;
  items: {
    productId: string;
    name: string;
    bnName?: string;
    image: string;
    price: number;
    quantity: number;
    variant?: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  city: string;
  joinedAt: string;
  lastOrderAt: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minSpend: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

export interface AdminReview {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  verifiedPurchase: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  currency: string;
  insideDhakaDelivery: number;
  outsideDhakaDelivery: number;
  freeShippingAbove: number;
  maintenanceMode: boolean;
  allowCashOnDelivery: boolean;
  showAdminTestButton: boolean;
}

// Initial Data
export const INITIAL_CATEGORIES: AdminCategory[] = [
  {
    id: 'cat-0',
    index: 0,
    name: 'Handy Gadgets',
    bnName: 'হ্যান্ডি গ্যাজেটস',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80',
    desc: 'Smart and useful gadgets designed to make everyday life easier.',
    productCount: 14,
    status: 'Active',
  },
  {
    id: 'cat-1',
    index: 1,
    name: 'Home Helpers',
    bnName: 'হোম হেলপার্স',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&auto=format&fit=crop&q=80',
    desc: 'Clever household utilities and tools to elevate your living space.',
    productCount: 18,
    status: 'Active',
  },
  {
    id: 'cat-2',
    index: 2,
    name: 'Kitchen Finds',
    bnName: 'কিচেন ফাইন্ডস',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80',
    desc: 'Innovative kitchenware and accessories for smart, modern cooking.',
    productCount: 22,
    status: 'Active',
  },
  {
    id: 'cat-3',
    index: 3,
    name: 'Smart Utility',
    bnName: 'স্মার্ট ইউটিলিটি',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80',
    desc: 'Practical high-tech utilities to automate and simplify tasks.',
    productCount: 11,
    status: 'Active',
  },
  {
    id: 'cat-4',
    index: 4,
    name: 'Travel & Daily Carry',
    bnName: 'ট্রাভেল ও ডেইলি ক্যারি',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80',
    desc: 'Compact, lightweight essentials for active travels and commutes.',
    productCount: 9,
    status: 'Active',
  },
  {
    id: 'cat-5',
    index: 5,
    name: 'Car & Lifestyle',
    bnName: 'কার ও লাইফস্টাইল',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80',
    desc: 'Premium accessories to organize and enrich your car and daily drive.',
    productCount: 15,
    status: 'Active',
  },
  {
    id: 'cat-6',
    index: 6,
    name: 'Personal Care',
    bnName: 'পার্সোনাল কেয়ার',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    desc: 'Advanced grooming, health, and personal care solutions.',
    productCount: 12,
    status: 'Active',
  },
  {
    id: 'cat-7',
    index: 7,
    name: 'Home Organization',
    bnName: 'হোম অর্গানাইজেশন',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
    desc: 'Intelligent space-savers and drawer organizers for a tidy home.',
    productCount: 16,
    status: 'Active',
  },
  {
    id: 'cat-8',
    index: 8,
    name: 'Cleaning Tools',
    bnName: 'ক্লিনিং টুলস',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80',
    desc: 'Powerful scrubbing, dusting, and automated cleaning equipment.',
    productCount: 13,
    status: 'Active',
  },
];

export const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod-1',
    name: 'Portable Neck Fan',
    bnName: 'পোর্টেবল নেক ফ্যান',
    desc: 'Hands-free cooling with leafless design & 3 adjustable speed modes.',
    bnDesc: 'ব্লেডহীন ও নিরাপদ হ্যান্ডস-ফ্রি ঠান্ডা ফ্যান।',
    price: 890,
    oldPrice: 1200,
    image: 'https://images.unsplash.com/photo-1618944847823-380f84d67842?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 0,
    categoryName: 'Handy Gadgets',
    stock: 45,
    sku: 'HNV-FAN-001',
    status: 'Published',
    isPopular: true,
    isNewest: false,
    features: ['360° Surround Airflow', 'Bladeless & Hair-Safe', '4000mAh Long Battery Life', 'Ultra Lightweight 220g'],
    specs: { 'Battery': '4000mAh', 'Charging Port': 'Type-C Fast Charge', 'Runtime': '4-8 Hours', 'Weight': '220g' },
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Compact USB Rechargeable Fan',
    bnName: 'কমপ্যাক্ট ইউএসবি রিচার্জেবল ফ্যান',
    desc: 'Cool breeze on-the-go with quiet motor & foldable kickstand.',
    bnDesc: 'সহজে বহনযোগ্য শান্ত ও শক্তিশালী ঠান্ডা ফ্যান।',
    price: 850,
    oldPrice: 1100,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 0,
    categoryName: 'Handy Gadgets',
    stock: 28,
    sku: 'HNV-FAN-002',
    status: 'Published',
    isPopular: false,
    isNewest: true,
    features: ['Quiet brushless motor', 'Multi-angle tilt head', 'Built-in phone stand'],
    specs: { 'Speed Levels': '3', 'Battery': '2000mAh', 'Interface': 'USB-C' },
    createdAt: '2026-09-22T14:30:00Z',
  },
  {
    id: 'prod-3',
    name: 'Portable Mini Garment Steamer',
    bnName: 'পোর্টেবল মিনি গার্মেন্ট স্টিমার',
    desc: 'Remove wrinkles effortlessly anywhere with quick 20s heat-up.',
    bnDesc: 'সহজেই যেকোনো স্থানে কাপড়ের কুঁচকানো ভাব দূর করুন।',
    price: 950,
    oldPrice: 1250,
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 1,
    categoryName: 'Home Helpers',
    stock: 19,
    sku: 'HNV-STM-010',
    status: 'Published',
    isPopular: true,
    isNewest: true,
    features: ['1000W Rapid Heating', 'Dry & Steam Dual Mode', 'Foldable Compact Travel Design', 'Anti-Leak Tech'],
    specs: { 'Power': '1000W', 'Water Tank': '100ml', 'Voltage': '220V BD Standard' },
    createdAt: '2026-09-18T09:15:00Z',
  },
  {
    id: 'prod-4',
    name: 'Rechargeable Motion Sensor Light',
    bnName: 'রিচার্জেবল মোশন সেন্সর লাইট',
    desc: 'Smart magnetic LED light for closets, stairs and under-cabinets.',
    bnDesc: 'আলমারি ও সিঁড়ির জন্য স্মার্ট ম্যাগনেটিক লাইট।',
    price: 680,
    oldPrice: 850,
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 1,
    categoryName: 'Home Helpers',
    stock: 64,
    sku: 'HNV-LED-004',
    status: 'Published',
    isPopular: true,
    isNewest: false,
    features: ['PIR Motion Sensing 120°', 'Strong Magnetic Mounting', 'Warm White / Cool White', 'Type-C Rechargeable'],
    specs: { 'Length': '30cm', 'Battery': '1200mAh', 'Sensor Range': '3-5 Meters' },
    createdAt: '2026-09-15T11:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Mini Portable Food Sealer',
    bnName: 'মিনি পোর্টেবল ফুড সিলার',
    desc: 'Keep snacks fresh with airtight 2-in-1 thermal sealing & cutter.',
    bnDesc: 'খাবার সতেজ রাখতে এয়ারটাইট সিলিং সিলার।',
    price: 490,
    oldPrice: 650,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 2,
    categoryName: 'Kitchen Finds',
    stock: 82,
    sku: 'HNV-KT-005',
    status: 'Published',
    isPopular: true,
    isNewest: false,
    features: ['Instant heat seal in 3 seconds', 'Hidden express bag cutter', 'Magnetic back for fridge sticking'],
    specs: { 'Power Source': '2x AA Batteries / USB', 'Material': 'Food Grade ABS' },
    createdAt: '2026-09-12T16:45:00Z',
  },
  {
    id: 'prod-6',
    name: 'Mini Electric Garlic Chopper',
    bnName: 'মিনি ইলেকট্রিক রসুন চপার',
    desc: 'Chop garlic, ginger, chilies & herbs in seconds with 3-blade stainless steel.',
    bnDesc: 'সেকেন্ডেই রসুন, আদা এবং মসলা চপ করুন।',
    price: 590,
    oldPrice: 790,
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 2,
    categoryName: 'Kitchen Finds',
    stock: 50,
    sku: 'HNV-KT-006',
    status: 'Published',
    isPopular: false,
    isNewest: true,
    features: ['One-button wireless operation', 'Stainless steel 304 blades', 'BPA-free waterproof container'],
    specs: { 'Capacity': '250ml', 'Power': '45W', 'Battery': '1200mAh' },
    createdAt: '2026-09-24T18:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Multifunctional Kitchen Cutter',
    bnName: 'মাল্টিফাংশনাল কিচেন কাটার',
    desc: 'Premium multi-blade vegetable slicer, grater and drain basket.',
    bnDesc: 'প্রিমিয়াম মাল্টি-ব্লেড বিশিষ্ট ভেজিটেবল স্লাইসার।',
    price: 750,
    oldPrice: 1050,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 2,
    categoryName: 'Kitchen Finds',
    stock: 35,
    sku: 'HNV-KT-007',
    status: 'Published',
    isPopular: true,
    isNewest: true,
    features: ['6 interchangeable blades', 'Rotating drain basket included', 'Hand protector safety guard'],
    specs: { 'Material': 'Food grade ABS & Stainless Steel', 'Capacity': '2000ml' },
    createdAt: '2026-09-21T08:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Multifunctional Car Organizer',
    bnName: 'মাল্টিফাংশনাল কার অর্গানাইজার',
    desc: 'Keep backseat clutter-free with tablet holder, cup pockets & tissue box.',
    bnDesc: 'গাড়ির ব্যাকসিট গুছিয়ে রাখার প্রিমিয়াম ক্যারিয়ার।',
    price: 780,
    oldPrice: 990,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 5,
    categoryName: 'Car & Lifestyle',
    stock: 22,
    sku: 'HNV-CAR-008',
    status: 'Published',
    isPopular: true,
    isNewest: true,
    features: ['Premium PU waterproof leather', 'Touchscreen tablet holder', 'Universal fit for all vehicles'],
    specs: { 'Material': 'PU Leather', 'Dimensions': '60 x 40 cm' },
    createdAt: '2026-09-17T13:20:00Z',
  },
  {
    id: 'prod-9',
    name: 'Foldable Storage Organizer',
    bnName: 'ফোল্ডেবল স্টোরেজ অর্গানাইজার',
    desc: 'Space-saving fabric cubes with reinforced handles and clear viewing window.',
    bnDesc: 'জায়গা সাশ্রয়ী চমৎকার ফেব্রিক স্টোরেজ কিউব।',
    price: 450,
    oldPrice: 600,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 7,
    categoryName: 'Home Organization',
    stock: 55,
    sku: 'HNV-ORG-009',
    status: 'Published',
    isPopular: true,
    isNewest: false,
    features: ['Breathable non-woven fabric', 'Two-way heavy duty zippers', 'Foldable when not in use'],
    specs: { 'Capacity': '66L', 'Dimensions': '50 x 40 x 33 cm' },
    createdAt: '2026-09-14T10:10:00Z',
  },
  {
    id: 'prod-10',
    name: 'Rechargeable Electric Cleaning Brush',
    bnName: 'রিচার্জেবল ইলেকট্রিক ক্লিনিং ব্রাশ',
    desc: 'Power scrub tough tile, bathroom & kitchen grease stains with 3 spin heads.',
    bnDesc: 'কঠিন দাগ দূর করার শক্তিশালী স্ক্রাবার ব্রাশ।',
    price: 1100,
    oldPrice: 1450,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 8,
    categoryName: 'Cleaning Tools',
    stock: 14,
    sku: 'HNV-CLN-010',
    status: 'Published',
    isPopular: true,
    isNewest: true,
    features: ['IPX7 Waterproof rating', '3 interchangeable brush heads', 'Powerful 350 RPM motor', 'Cordless convenience'],
    specs: { 'Battery': '2000mAh', 'Speed': '350 RPM', 'Charging': 'Type-C' },
    createdAt: '2026-09-23T11:40:00Z',
  },
  {
    id: 'prod-11',
    name: 'Portable Mini Vacuum Cleaner',
    bnName: 'পোর্টেবল মিনি ভ্যাকুয়াম ক্লিনার',
    desc: 'Powerful handheld wireless car & desk cleaner with HEPA washable filter.',
    bnDesc: 'শক্তিশালী হ্যান্ডহেল্ড ওয়্যারলেস ক্লিনার।',
    price: 990,
    oldPrice: 1350,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    categoryIndex: 8,
    categoryName: 'Cleaning Tools',
    stock: 8,
    sku: 'HNV-CLN-011',
    status: 'Published',
    isPopular: false,
    isNewest: true,
    features: ['6000PA Strong Suction Power', 'Washable High-Density HEPA Filter', 'Blower & Vacuum 2-in-1 Mode'],
    specs: { 'Suction': '6000PA', 'Battery': '2000mAh x2', 'Weight': '380g' },
    createdAt: '2026-09-25T15:00:00Z',
  },
];

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'HNV-89241',
    customerName: 'Tanvir Ahmed',
    customerPhone: '01712-345678',
    customerEmail: 'tanvir.ahmed@gmail.com',
    customerAddress: 'House 42, Road 11, Block D, Banani',
    city: 'Dhaka',
    area: 'Banani',
    postalCode: '1213',
    items: [
      {
        productId: 'prod-1',
        name: 'Portable Neck Fan',
        bnName: 'পোর্টেবল নেক ফ্যান',
        image: 'https://images.unsplash.com/photo-1618944847823-380f84d67842?w=600&auto=format&fit=crop&q=80',
        price: 890,
        quantity: 2,
        variant: 'White',
      },
      {
        productId: 'prod-4',
        name: 'Rechargeable Motion Sensor Light',
        image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&auto=format&fit=crop&q=80',
        price: 680,
        quantity: 1,
        variant: 'Warm Light',
      },
    ],
    subtotal: 2460,
    deliveryCharge: 60,
    discount: 100,
    total: 2420,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    status: 'Processing',
    notes: 'Please call before delivery after 2 PM.',
    createdAt: '2026-09-27T08:15:00Z',
  },
  {
    id: 'ord-1002',
    orderNumber: 'HNV-89240',
    customerName: 'Nusrat Jahan',
    customerPhone: '01844-987654',
    customerEmail: 'nusrat.jahan@yahoo.com',
    customerAddress: 'Apt 5B, Green View Tower, Nasirabad',
    city: 'Chittagong',
    area: 'Nasirabad',
    postalCode: '4000',
    items: [
      {
        productId: 'prod-3',
        name: 'Portable Mini Garment Steamer',
        image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&auto=format&fit=crop&q=80',
        price: 950,
        quantity: 1,
      },
      {
        productId: 'prod-6',
        name: 'Mini Electric Garlic Chopper',
        image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80',
        price: 590,
        quantity: 1,
      },
    ],
    subtotal: 1540,
    deliveryCharge: 120,
    discount: 0,
    total: 1660,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    status: 'Pending',
    createdAt: '2026-09-27T07:40:00Z',
  },
  {
    id: 'ord-1003',
    orderNumber: 'HNV-89239',
    customerName: 'Mehedi Hasan',
    customerPhone: '01911-223344',
    customerEmail: 'mehedi.h@outlook.com',
    customerAddress: 'Flat 3A, House 15, Sector 4, Uttara',
    city: 'Dhaka',
    area: 'Uttara',
    postalCode: '1230',
    items: [
      {
        productId: 'prod-10',
        name: 'Rechargeable Electric Cleaning Brush',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
        price: 1100,
        quantity: 1,
      },
    ],
    subtotal: 1100,
    deliveryCharge: 60,
    discount: 0,
    total: 1160,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '2026-09-26T14:20:00Z',
  },
  {
    id: 'ord-1004',
    orderNumber: 'HNV-89238',
    customerName: 'Farhana Akter',
    customerPhone: '01678-554433',
    customerEmail: 'farhana.akter@gmail.com',
    customerAddress: 'Holding 88, Shibganj Main Road',
    city: 'Sylhet',
    area: 'Shibganj',
    postalCode: '3100',
    items: [
      {
        productId: 'prod-7',
        name: 'Multifunctional Kitchen Cutter',
        image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80',
        price: 750,
        quantity: 2,
      },
      {
        productId: 'prod-5',
        name: 'Mini Portable Food Sealer',
        image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
        price: 490,
        quantity: 1,
      },
    ],
    subtotal: 1990,
    deliveryCharge: 120,
    discount: 50,
    total: 2060,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
    status: 'Shipped',
    createdAt: '2026-09-25T19:10:00Z',
  },
  {
    id: 'ord-1005',
    orderNumber: 'HNV-89237',
    customerName: 'Shakil Mahmud',
    customerPhone: '01799-887766',
    customerEmail: 'shakil.m@gmail.com',
    customerAddress: '45 Dhanmondi 27, Old Rangs building',
    city: 'Dhaka',
    area: 'Dhanmondi',
    postalCode: '1209',
    items: [
      {
        productId: 'prod-11',
        name: 'Portable Mini Vacuum Cleaner',
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
        price: 990,
        quantity: 1,
      },
    ],
    subtotal: 990,
    deliveryCharge: 60,
    discount: 0,
    total: 1050,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    status: 'Cancelled',
    notes: 'Customer requested cancellation due to duplicate order.',
    createdAt: '2026-09-25T11:05:00Z',
  },
];

export const INITIAL_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'cust-1',
    name: 'Tanvir Ahmed',
    phone: '01712-345678',
    email: 'tanvir.ahmed@gmail.com',
    totalOrders: 4,
    totalSpent: 6840,
    city: 'Dhaka (Banani)',
    joinedAt: '2026-07-15',
    lastOrderAt: '2026-09-27',
  },
  {
    id: 'cust-2',
    name: 'Nusrat Jahan',
    phone: '01844-987654',
    email: 'nusrat.jahan@yahoo.com',
    totalOrders: 2,
    totalSpent: 3120,
    city: 'Chittagong (Nasirabad)',
    joinedAt: '2026-08-01',
    lastOrderAt: '2026-09-27',
  },
  {
    id: 'cust-3',
    name: 'Mehedi Hasan',
    phone: '01911-223344',
    email: 'mehedi.h@outlook.com',
    totalOrders: 5,
    totalSpent: 7490,
    city: 'Dhaka (Uttara)',
    joinedAt: '2026-06-10',
    lastOrderAt: '2026-09-26',
  },
  {
    id: 'cust-4',
    name: 'Farhana Akter',
    phone: '01678-554433',
    email: 'farhana.akter@gmail.com',
    totalOrders: 3,
    totalSpent: 4560,
    city: 'Sylhet',
    joinedAt: '2026-07-28',
    lastOrderAt: '2026-09-25',
  },
  {
    id: 'cust-5',
    name: 'Shakil Mahmud',
    phone: '01799-887766',
    email: 'shakil.m@gmail.com',
    totalOrders: 1,
    totalSpent: 1050,
    city: 'Dhaka (Dhanmondi)',
    joinedAt: '2026-09-25',
    lastOrderAt: '2026-09-25',
  },
];

export const INITIAL_COUPONS: AdminCoupon[] = [
  {
    id: 'coup-1',
    code: 'VIBES10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 1000,
    usageLimit: 200,
    usedCount: 47,
    expiresAt: '2026-12-31',
    status: 'Active',
  },
  {
    id: 'coup-2',
    code: 'SAVE100',
    discountType: 'flat',
    discountValue: 100,
    minSpend: 1500,
    usageLimit: 100,
    usedCount: 31,
    expiresAt: '2026-11-30',
    status: 'Active',
  },
  {
    id: 'coup-3',
    code: 'ECOM25',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 2000,
    usageLimit: 50,
    usedCount: 50,
    expiresAt: '2026-09-01',
    status: 'Expired',
  },
];

export const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: 'rev-1',
    productName: 'Portable Neck Fan',
    customerName: 'Tanvir Ahmed',
    rating: 5,
    comment: 'Awesome neck fan! Very strong airflow and really quiet. Battery easily lasted full day during outdoor commute.',
    date: '2026-09-24',
    status: 'Approved',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    productName: 'Rechargeable Motion Sensor Light',
    customerName: 'Mehedi Hasan',
    rating: 5,
    comment: 'Magnet is strong and sensor responds instantly. Perfect for my closet and staircase.',
    date: '2026-09-22',
    status: 'Approved',
    verifiedPurchase: true,
  },
  {
    id: 'rev-3',
    productName: 'Portable Mini Garment Steamer',
    customerName: 'Nusrat Jahan',
    rating: 4,
    comment: 'Heats up in seconds and removes wrinkles from shirts smoothly. Great for traveling.',
    date: '2026-09-20',
    status: 'Approved',
    verifiedPurchase: true,
  },
  {
    id: 'rev-4',
    productName: 'Mini Electric Garlic Chopper',
    customerName: 'Sadia Rahman',
    rating: 5,
    comment: 'Roshun and ada chop kora khub shohoj hoye geche. Highly recommended!',
    date: '2026-09-19',
    status: 'Approved',
    verifiedPurchase: true,
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'hue n vibes',
  tagline: 'Smart Gadgets & Modern Lifestyle Store',
  email: 'ecommercemanagement25@gmail.com',
  phone: '+880 1700-000000',
  currency: '৳',
  insideDhakaDelivery: 60,
  outsideDhakaDelivery: 120,
  freeShippingAbove: 2500,
  maintenanceMode: false,
  allowCashOnDelivery: true,
  showAdminTestButton: true,
};

// Store Helper Functions with LocalStorage Persistence
export function getAdminProducts(): AdminProduct[] {
  try {
    const data = localStorage.getItem('huen_admin_products');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_PRODUCTS;
}

export function saveAdminProducts(products: AdminProduct[]) {
  localStorage.setItem('huen_admin_products', JSON.stringify(products));
}

export function getAdminCategories(): AdminCategory[] {
  try {
    const data = localStorage.getItem('huen_admin_categories');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CATEGORIES;
}

export function saveAdminCategories(categories: AdminCategory[]) {
  localStorage.setItem('huen_admin_categories', JSON.stringify(categories));
}

export function getAdminOrders(): AdminOrder[] {
  try {
    const data = localStorage.getItem('huen_admin_orders');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ORDERS;
}

export function saveAdminOrders(orders: AdminOrder[]) {
  localStorage.setItem('huen_admin_orders', JSON.stringify(orders));
}

export function getAdminCustomers(): AdminCustomer[] {
  try {
    const data = localStorage.getItem('huen_admin_customers');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CUSTOMERS;
}

export function saveAdminCustomers(customers: AdminCustomer[]) {
  localStorage.setItem('huen_admin_customers', JSON.stringify(customers));
}

export function getAdminCoupons(): AdminCoupon[] {
  try {
    const data = localStorage.getItem('huen_admin_coupons');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_COUPONS;
}

export function saveAdminCoupons(coupons: AdminCoupon[]) {
  localStorage.setItem('huen_admin_coupons', JSON.stringify(coupons));
}

export function getAdminReviews(): AdminReview[] {
  try {
    const data = localStorage.getItem('huen_admin_reviews');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_REVIEWS;
}

export function saveAdminReviews(reviews: AdminReview[]) {
  localStorage.setItem('huen_admin_reviews', JSON.stringify(reviews));
}

export function getStoreSettings(): StoreSettings {
  try {
    const data = localStorage.getItem('huen_admin_settings');
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        showAdminTestButton: parsed.showAdminTestButton !== undefined ? parsed.showAdminTestButton : true,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_SETTINGS;
}

export function saveStoreSettings(settings: StoreSettings) {
  localStorage.setItem('huen_admin_settings', JSON.stringify(settings));
}

export function getAdminAuthUser(): AdminUser | null {
  try {
    const data = localStorage.getItem('huen_admin_session');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function setAdminAuthUser(user: AdminUser | null) {
  if (user) {
    localStorage.setItem('huen_admin_session', JSON.stringify(user));
  } else {
    localStorage.removeItem('huen_admin_session');
  }
}
