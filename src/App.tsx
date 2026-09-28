/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShoppingCart, User, Truck, X, Search, PackageCheck, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Wallet, Plus, Minus, MoreVertical, Heart, HelpCircle, Settings } from 'lucide-react';
import heroBanner1 from './assets/images/grocery_hero_banner_1790504581230.jpg';
import heroBanner2 from './assets/images/grocery_carousel_fruits_1790505957594.jpg';
import heroBanner3 from './assets/images/grocery_carousel_dairy_1790505972747.jpg';
import heroBanner4 from './assets/images/grocery_carousel_bakery_1790505987837.jpg';

// Category Images
import catHandyGadgets from './assets/images/cat_handy_gadgets_1790507172888.jpg';
import catHomeHelpers from './assets/images/cat_home_helpers_1790507189387.jpg';
import catKitchenFinds from './assets/images/cat_kitchen_finds_1790507205171.jpg';
import catSmartUtility from './assets/images/cat_smart_utility_1790507230016.jpg';
import catTravelDaily from './assets/images/cat_travel_daily_1790507243171.jpg';
import catCarLifestyle from './assets/images/cat_car_lifestyle_1790507257114.jpg';
import catPersonalCare from './assets/images/cat_personal_care_1790507880011.jpg';
import catHomeOrg from './assets/images/cat_home_org_1790507894435.jpg';
import catCleaningTools from './assets/images/cat_cleaning_tools_1790507907307.jpg';
import catLightingUtility from './assets/images/cat_lighting_utility_1790507920599.jpg';
import catOutdoorCamping from './assets/images/cat_outdoor_camping_1790507932895.jpg';
import catDeskOffice from './assets/images/cat_desk_office_1790507944801.jpg';

// Product Images for Trending Finds
import prodMiniSteamer from './assets/images/prod_mini_steamer_1790509344278.jpg';
import prodElectricBrush from './assets/images/prod_electric_brush_1790509359995.jpg';
import prodFoodSealer from './assets/images/prod_food_sealer_1790509377703.jpg';
import prodCarOrganizer from './assets/images/prod_car_organizer_1790509390330.jpg';
import prodRechargeableFan from './assets/images/prod_rechargeable_fan_1790509418832.jpg';

// Product Images for Featured Products
import prodGarlicChopper from './assets/images/prod_garlic_chopper_1790509855381.jpg';
import prodNeckFan from './assets/images/prod_neck_fan_1790509870716.jpg';
import prodFoldableOrganizer from './assets/images/prod_foldable_organizer_1790509884684.jpg';
import prodSensorLight from './assets/images/prod_sensor_light_1790509896900.jpg';
import prodKitchenCutter from './assets/images/prod_kitchen_cutter_1790509909326.jpg';
import prodMiniVacuum from './assets/images/prod_mini_vacuum_1790509921867.jpg';

import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderCompletePage } from './components/OrderCompletePage';
import { OrderData, DEFAULT_DELIVERY_CHARGE } from './types/order';
import { getStoreSettings, getAdminProducts, getAdminCategories } from './admin/adminStore';
import { openAdminPortal } from './admin/adminRouting';
import { fetchProductsFromDb, fetchCategoriesFromDb, fetchStoreSettingsFromDb } from './lib/supabaseService';

export type Language = 'en' | 'bn';

export interface ProductItem {
  name: string;
  bnName: string;
  desc: string;
  bnDesc: string;
  price: number;
  oldPrice: number;
  image: string;
  categoryIndex: number;
  isPopular?: boolean;
  isNewest?: boolean;
}

const categoryDescriptions = {
  en: [
    'Smart and useful gadgets designed to make everyday life easier.', // Handy Gadgets
    'Clever household utilities and tools to elevate your living space.', // Home Helpers
    'Innovative kitchenware and accessories for smart, modern cooking.', // Kitchen Finds
    'Practical high-tech utilities to automate and simplify tasks.', // Smart Utility
    'Compact, lightweight essentials for active travels and commutes.', // Travel & Daily Carry
    'Premium accessories to organize and enrich your car and daily drive.', // Car & Lifestyle
    'Advanced grooming, health, and personal care solutions.', // Personal Care
    'Intelligent space-savers and drawer organizers for a tidy home.', // Home Organization
    'Powerful scrubbing, dusting, and automated cleaning equipment.', // Cleaning Tools
  ],
  bn: [
    'দৈনন্দিন জীবনকে অনেক সহজ এবং আনন্দদায়ক করার জন্য অসাধারণ সব গ্যাজেট।', // Handy Gadgets
    'আপনার ঘরকে আরো সুন্দর ও ব্যবহার উপযোগী করার স্মার্ট হোম গ্যাজেট।', // Home Helpers
    'রান্নাঘরের কাজকে সহজ ও দ্রুত করার অভিনব স্মার্ট কিচেন এক্সেসরিজ।', // Kitchen Finds
    'বাস্তবমুখী কাজকে স্বয়ংক্রিয় ও সহজ করার দরকারি স্মার্ট ইউটিলিটি।', // Smart Utility
    'ভ্রমণ এবং প্রতিদিনের যাতায়াত সহজ করার হালকা ও বহনযোগ্য পণ্য।', // Travel & Daily Carry
    'আপনার গাড়ি এবং দৈনন্দিন যাতায়াত গুছিয়ে রাখার দুর্দান্ত সব পণ্য।', // Car & Lifestyle
    'উন্নত গ্রুমিং, স্বাস্থ্য এবং নিজের যত্ন নেওয়ার প্রিমিয়াম পণ্যসমূহ।', // Personal Care
    'ঘরদোর গোছগাছ এবং পরিপাটি রাখার জন্য স্মার্ট অর্গানাইজারস।', // Home Organization
    'ঘর ও চারপাশ নিমিষেই পরিষ্কার করার জন্য চমৎকার সব কুইক ক্লিনিং টুলস।', // Cleaning Tools
  ],
};

const DEMO_PRODUCTS: ProductItem[] = [
  // Category 0: Handy Gadgets (হ্যান্ডি গ্যাজেটস)
  {
    name: 'Portable Neck Fan',
    bnName: 'পোর্টেবল নেক ফ্যান',
    desc: 'Hands-free cooling with leafless design.',
    bnDesc: 'ব্লেডহীন ও নিরাপদ হ্যান্ডস-ফ্রি ঠান্ডা ফ্যান।',
    price: 890,
    oldPrice: 1200,
    image: prodNeckFan,
    categoryIndex: 0,
    isPopular: true,
    isNewest: false,
  },
  {
    name: 'Compact USB Rechargeable Fan',
    bnName: 'কমপ্যাক্ট ইউএসবি রিচার্জেবল ফ্যান',
    desc: 'Cool breeze on-the-go with quiet motor.',
    bnDesc: 'সহজে বহনযোগ্য শান্ত ও শক্তিশালী ঠান্ডা ফ্যান।',
    price: 850,
    oldPrice: 1100,
    image: prodRechargeableFan,
    categoryIndex: 0,
    isPopular: false,
    isNewest: true,
  },
  // Category 1: Home Helpers (হোম হেলপার্স)
  {
    name: 'Portable Mini Garment Steamer',
    bnName: 'পোর্টেবল মিনি গার্মেন্ট স্টিমার',
    desc: 'Remove wrinkles effortlessly anywhere.',
    bnDesc: 'সহজেই যেকোনো স্থানে কাপড়ের কুঁচকানো ভাব দূর করুন।',
    price: 950,
    oldPrice: 1250,
    image: prodMiniSteamer,
    categoryIndex: 1,
    isPopular: true,
    isNewest: true,
  },
  {
    name: 'Rechargeable Motion Sensor Light',
    bnName: 'রিচার্জেবল মোশন সেন্সর লাইট',
    desc: 'Smart magnetic LED light for closets.',
    bnDesc: 'আলমারি ও সিঁড়ির জন্য স্মার্ট ম্যাগনেটিক লাইট।',
    price: 680,
    oldPrice: 850,
    image: prodSensorLight,
    categoryIndex: 1,
    isPopular: true,
    isNewest: false,
  },
  // Category 2: Kitchen Finds (কিচেন ফাইন্ডস)
  {
    name: 'Mini Portable Food Sealer',
    bnName: 'মিনি পোর্টেবল ফুড সিলার',
    desc: 'Keep snacks fresh with airtight seals.',
    bnDesc: 'খাবার সতেজ রাখতে এয়ারটাইট সিলিং সিলার।',
    price: 490,
    oldPrice: 650,
    image: prodFoodSealer,
    categoryIndex: 2,
    isPopular: true,
    isNewest: false,
  },
  {
    name: 'Mini Electric Garlic Chopper',
    bnName: 'মিনি ইলেকট্রিক রসুন চপার',
    desc: 'Chop garlic, ginger & herbs in seconds.',
    bnDesc: 'সেকেন্ডেই রসুন, আদা এবং মসলা চপ করুন।',
    price: 590,
    oldPrice: 790,
    image: prodGarlicChopper,
    categoryIndex: 2,
    isPopular: false,
    isNewest: true,
  },
  {
    name: 'Multifunctional Kitchen Cutter',
    bnName: 'মাল্টিফাংশনাল কিচেন কাটার',
    desc: 'Premium multi-blade vegetable slicer.',
    bnDesc: 'প্রিমিয়াম মাল্টি-ব্লেড বিশিষ্ট ভেজিটেবল স্লাইসার।',
    price: 750,
    oldPrice: 1050,
    image: prodKitchenCutter,
    categoryIndex: 2,
    isPopular: true,
    isNewest: true,
  },
  // Category 3: Smart Utility (স্মার্ট ইউটিলিটি)
  {
    name: 'Rechargeable Motion Sensor Light',
    bnName: 'রিচার্জেবল মোশন সেন্সর লাইট',
    desc: 'Smart magnetic LED light for closets.',
    bnDesc: 'আলমারি ও সিঁড়ির জন্য স্মার্ট ম্যাগনেটিক লাইট।',
    price: 680,
    oldPrice: 850,
    image: prodSensorLight,
    categoryIndex: 3,
    isPopular: true,
    isNewest: false,
  },
  // Category 5: Car & Lifestyle (কার ও লাইফস্টাইল)
  {
    name: 'Multifunctional Car Organizer',
    bnName: 'মাল্টিফাংশনাল কার অর্গানাইজার',
    desc: 'Keep backseat clutter-free and tidy.',
    bnDesc: 'গাড়ির ব্যাকসিট গুছিয়ে রাখার প্রিমিয়াম ক্যারিয়ার।',
    price: 780,
    oldPrice: 990,
    image: prodCarOrganizer,
    categoryIndex: 5,
    isPopular: true,
    isNewest: true,
  },
  // Category 7: Home Organization (হোম অর্গানাইজেশন)
  {
    name: 'Foldable Storage Organizer',
    bnName: 'ফোল্ডেবল স্টোরেজ অর্গানাইজার',
    desc: 'Space-saving fabric cubes for storage.',
    bnDesc: 'জায়গা সাশ্রয়ী চমৎকার ফেব্রিক স্টোরেজ কিউব।',
    price: 450,
    oldPrice: 600,
    image: prodFoldableOrganizer,
    categoryIndex: 7,
    isPopular: true,
    isNewest: false,
  },
  // Category 8: Cleaning Tools (ক্লিনিং টুলস)
  {
    name: 'Rechargeable Electric Cleaning Brush',
    bnName: 'রিচার্জেবল ইলেকট্রিক ক্লিনিং ব্রাশ',
    desc: 'Power scrub tough stains instantly.',
    bnDesc: 'কঠিন দাগ দূর করার শক্তিশালী স্ক্রাবার ব্রাশ।',
    price: 1100,
    oldPrice: 1450,
    image: prodElectricBrush,
    categoryIndex: 8,
    isPopular: true,
    isNewest: true,
  },
  {
    name: 'Portable Mini Vacuum Cleaner',
    bnName: 'পোর্টেবল মিনি ভ্যাকুয়াম ক্লিনার',
    desc: 'Powerful handheld wireless car cleaner.',
    bnDesc: 'শক্তিশালী হ্যান্ডহেল্ড ওয়্যারলেস ক্লিনার।',
    price: 990,
    oldPrice: 1350,
    image: prodMiniVacuum,
    categoryIndex: 8,
    isPopular: false,
    isNewest: true,
  },
];

interface ProductExtra {
  rating: number;
  reviewCount: number;
  fullDesc: string;
  features: string[];
  specs: Record<string, string>;
  isStock: boolean;
  images: string[];
  colors?: string[];
  sizes?: string[];
}

function getProductExtraInfo(productName: string, lang: Language): ProductExtra {
  const isEn = lang === 'en';
  // Standard defaults
  const extra: ProductExtra = {
    rating: 4.8,
    reviewCount: 24,
    isStock: true,
    images: [],
    fullDesc: isEn 
      ? 'This is a premium high-quality imported item designed to bring efficiency and comfort to your daily routine. Extremely durable, user-friendly, and portable for modern lifestyles.'
      : 'এটি একটি প্রিমিয়াম উচ্চ-মানের আমদানিকৃত পণ্য যা আপনার প্রতিদিনের কাজে গতি এবং আরাম যোগ করবে। এটি অত্যন্ত টেকসই, সহজে ব্যবহারযোগ্য এবং বহনযোগ্য।',
    features: isEn
      ? ['Premium build quality with food-grade safety materials', 'Compact, lightweight and highly portable design', 'Rechargeable long-lasting battery capacity', 'Ergonomic smart operations with one-click settings']
      : ['খাদ্য-নিরাপদ ও পরিবেশ-বান্ধব উন্নত উপাদান', 'সহজে বহনযোগ্য এবং চমৎকার হালকা ডিজাইন', 'দীর্ঘস্থায়ী চার্জ ধরে রাখার মতো শক্তিশালী ব্যাটারি', 'এক ক্লিকেই নিয়ন্ত্রণ করার সহজ ও চমৎকার সিস্টেম'],
    specs: isEn
      ? { 'Material': 'ABS + Food Grade PC', 'Power Source': 'USB Charging Cable', 'Charging Time': '2-3 Hours', 'Origin': 'Imported' }
      : { 'উপাদান': 'এবিএস প্লাস ফুড গ্রেড পিসি', 'পাওয়ার সোর্স': 'ইউএসবি চার্জিং ক্যাবল', 'চার্জিং সময়': '২-৩ ঘণ্টা', 'উৎস': 'আমদানিকৃত' }
  };

  const lowerName = productName.toLowerCase();
  if (lowerName.includes('steamer') || lowerName.includes('স্টিমার')) {
    extra.rating = 4.9;
    extra.reviewCount = 38;
    extra.fullDesc = isEn
      ? 'Steam and refresh your clothes effortlessly on the go with this Portable Mini Garment Steamer. Heats up in 30 seconds and outputs powerful continuous steam to flatten stubborn wrinkles instantly. Perfect for travels and busy mornings.'
      : 'ভ্রমণে বা ব্যস্ত সকালে কাপড়ের কুঁচকানো ভাব ঝটপট দূর করতে ব্যবহার করুন এই পোর্টেবল স্টিমার। মাত্র ৩০ সেকেন্ডে হিটিং সম্পন্ন হয়ে শক্তিশালী ও একটানা বাষ্প তৈরি করে কাপড়কে করে তোলে নিখুঁত ইস্ত্রি করা ও সতেজ।';
    extra.features = isEn
      ? ['Rapid 30-second preheating with steam output', 'Safe for all fabric types including silk and wool', 'Leak-proof design with horizontal and vertical steaming', 'Lightweight compact body ideal for travel storage']
      : ['দ্রুত ৩০-সেকেন্ড প্রিটেনিং ও মসৃণ স্টিম আউটপুট', 'রেশম এবং পশম সহ সব ধরনের কাপড়ের জন্য নিরাপদ', 'লিক-প্রুফ ডিজাইনে খাড়া ও শোয়ানো উভয়ভাবেই স্টিম করা যায়', 'ভ্রমণে সহজে বহনের জন্য চমৎকার হালকা বডি'];
    extra.specs = isEn
      ? { 'Water Tank Capacity': '120ml', 'Power Rated': '800W', 'Weight': '650g', 'Voltage': '220V' }
      : { 'ওয়াটার ট্যাংক ক্যাপাসিটি': '১২০ মিলি', 'পাওয়ার রেটিং': '৮০০ ওয়াট', 'ওজন': '৬৫০ গ্রাম', 'ভোল্টেজ': '২২০ ভোল্ট' };
  } else if (lowerName.includes('brush') || lowerName.includes('ব্রাশ')) {
    extra.rating = 4.7;
    extra.reviewCount = 19;
    extra.fullDesc = isEn
      ? 'Power scrub away tough stains, grime, and grease with this Rechargeable Electric Cleaning Brush. Equipped with multiple interchangeable brush heads for bathrooms, tiles, dishes, and kitchen corners. Waterproof design ensures safety.'
      : 'শক্তিশালী রিচার্জেবল ইলেকট্রিক স্ক্রাবার দিয়ে বাথরুম, কিচেন টাইলস বা জানালার গ্রিলের কঠিন দাগ সহজেই দূর করুন। বিভিন্ন কাজের জন্য রয়েছে পরিবর্তনযোগ্য আলাদা ব্রাশ হেড এবং সম্পূর্ণ ওয়াটারপ্রুফ নিরাপত্তা।';
    extra.features = isEn
      ? ['Powerful 360-degree rotation speed for high torque scrubbing', 'IPX7 certified waterproof body for safe wet cleaning', '3 interchangeable brush heads for diverse usage surfaces', 'Ergonomic handle grip for fatigue-free operation']
      : ['উচ্চ ঘূর্ণন গতি বিশিষ্ট ৩৬০-ডিগ্রি পাওয়ার স্ক্রাবিং', 'নিরাপদ ভেজা ক্লিনিংয়ের জন্য আইপিএক্স৭ ওয়াটারপ্রুফ সার্টিফাইড', 'বিভিন্ন কাজের জন্য ৩টি পরিবর্তনযোগ্য আলাদা ব্রাশ হেড', 'ক্লান্তিহীন দীর্ঘক্ষণ ব্যবহারের জন্য আরামদায়ক হ্যান্ডেল গ্রিপ'];
    extra.specs = isEn
      ? { 'Battery Type': '1500mAh Lithium-ion', 'Charging Speed': 'Fast Type-C Charging', 'Working Time': 'Up to 90 Mins', 'IP Rating': 'IPX7' }
      : { 'ব্যাটারি টাইপ': '১৫০০ এমএএইচ লিথিয়াম-আয়ন', 'চার্জিং পোর্ট': 'ফাস্ট টাইপ-সি পোর্ট', 'কার্যকাল': 'প্রায় ৯০ মিনিট', 'ওয়াটারপ্রুফ রেটিং': 'আইপিএক্স৭' };
  } else if (lowerName.includes('sealer') || lowerName.includes('সিলার')) {
    extra.rating = 4.6;
    extra.reviewCount = 15;
    extra.fullDesc = isEn
      ? 'Keep your snacks, chips, and foods fresh in their original bags with this Mini Portable Food Sealer. Create airtight seals in seconds. Battery operated with double sealing mechanism.'
      : 'খোলা চিপস, চানাচুর বা অন্যান্য খাবার সতেজ রাখতে ব্যবহার করুন এই মিনি ফুড সিলার। সেকেন্ডের মধ্যে প্যাকেটের মুখ বাতাস নিরোধক (এয়ারটাইট) সিল করে খাবার মচমচে রাখে।';
    extra.features = isEn
      ? ['Creates continuous airtight seal to preserve food freshness', 'Dual function: Seals bags airtight and cuts open easily', 'Magnetic bottom back for easy refrigerator storage', 'Instant heat activation with high-durability heating element']
      : ['খাবার সতেজ রাখতে দ্রুত বায়ুরোধী বা এয়ারটাইট সিলিং', 'ডুয়াল মোড: প্যাকেটের মুখ সিল করা এবং সহজে কাটার ব্যবস্থা', 'ফ্রিজের গায়ে আটকে রাখার জন্য চুম্বকীয় ব্যাক পার্ট', 'অত্যন্ত নিরাপদ ও দ্রুত হিটিং অ্যাক্টিভেশন প্রযুক্তি'];
    extra.specs = isEn
      ? { 'Material': 'High-Quality ABS Resin', 'Battery Operated': '2 AA Batteries (Not Included)', 'Heating Delay': '3 Seconds', 'Compact Width': '4 cm' }
      : { 'উপাদান': 'উচ্চ মানের এবিএস প্লাস্টিক', 'ব্যাটারি': '২টি এএ ব্যাটারি (উদ্বৃত্ত)', 'হিটিং সময়': '৩ সেকেন্ড', 'প্রস্থ': '৪ সেমি' };
  } else if (lowerName.includes('organizer') || lowerName.includes('অর্গানাইজার')) {
    extra.rating = 4.8;
    extra.reviewCount = 28;
    extra.fullDesc = isEn
      ? 'Tidy up your car backseat clutter or closet closets with this ultra-durable storage solutions. Crafted from heavy-duty oxford fabric, with multi-pockets, tablet display viewing window, and solid stitching.'
      : 'গাড়ির ব্যাকসিট বা ঘরের কাপড়চোপড় গুছিয়ে রাখার দারুণ সমাধান। প্রিমিয়াম অক্সফোর্ড কাপড়ে তৈরি এই মাল্টি-পকেট অর্গানাইজারটিতে রয়েছে পানি রাখার জায়গা, ফোন হোল্ডার এবং চমৎকার টেকসই ফিনিশিং।';
    extra.features = isEn
      ? ['Premium double-stitched 600D Oxford heavy-duty fabric', 'Adjustable quick-release straps to securely fit standard seats', 'Deep pockets for bottles, iPads, power banks, and tissues', 'Collapsible space-saving construction when not in use']
      : ['টেকসই ও দীর্ঘস্থায়ী ডাবল-স্টিচড ৬০০ডি অক্সফোর্ড ফেব্রিক', 'সব ধরনের সিটের সাথে মানানসই অ্যাডজাস্টেবল লক স্ট্র্যাপ', 'আইপ্যাড, পানির বোতল, পাওয়ার ব্যাংক ও টিস্যুর জন্য আলাদা ড্রয়ার', 'ব্যবহার না করার সময় ভাজ করে রাখার সুবিধা'];
    extra.specs = isEn
      ? { 'Fabric Material': '600D Heavy Duty Oxford', 'Dimensions': '60cm x 45cm', 'Pockets Count': '8 Storage Compartments', 'Color': 'Elite Black' }
      : { 'ফেব্রিক উপাদান': '৬০০ডি প্রিমিয়াম অক্সফোর্ড ফেব্রিক', 'মাপ': '৬০ সেমি x ৪৫ সেমি', 'পকেট সংখ্যা': '৮টি ভিন্ন স্টোরেজ পকেট', 'রং': 'এলিট ব্ল্যাক' };
  } else if (lowerName.includes('fan') || lowerName.includes('ফ্যান')) {
    extra.rating = 4.9;
    extra.reviewCount = 42;
    extra.fullDesc = isEn
      ? 'Beat the hot summer heat with these portable fans. Silent motor technology paired with high capacity USB rechargeable batteries to provide refreshing continuous airflow during travels or daily commutes.'
      : 'প্রচণ্ড গরমে স্বস্তির জন্য ব্যবহার করুন এই পোর্টেবল রিচার্জেবল কুলিং ফ্যান। শক্তিশালী সাইলেন্ট মোটর এবং দীর্ঘস্থায়ী ইউএসবি ব্যাটারি আপনাকে ট্রাভেলিংয়ে বা লোডশেডিংয়ের সময় দিবে একটানা চমৎকার ঠান্ডা বাতাস।';
    extra.features = isEn
      ? ['Multi-speed adjustable settings (Low, Medium, High)', 'Hands-free lightweight wearable neck brace or desk mount', 'Ultra-silent motor with quiet 25dB decibel airflow', 'Fast USB Type-C charging support for universal adapters']
      : ['পছন্দমতো নিয়ন্ত্রণ করার জন্য ৩টি ভিন্ন বাতাস স্পিড সেটিং', 'সহজে গলায় ঝুলিয়ে রাখা বা টেবিল মাউন্টে বসানোর সুবিধা', 'শব্দহীন সাইলেন্ট মোটর প্রযুক্তি (মাত্র ২৫ ডেসিবেল)', 'যেকোনো টাইপ-সি ক্যাবল দিয়ে দ্রুত রিচার্জ করার সুবিধা'];
    extra.specs = isEn
      ? { 'Battery Capacity': '2000mAh Lithium-Polymer', 'Speed Modes': '3 Level Adjustments', 'Noise Level': 'Under 25dB', 'Interface': 'USB Type-C' }
      : { 'ব্যাটারি ক্ষমতা': '২০০০ এমএএইচ লিথিয়াম পলিমার', 'স্পিড মোড': '৩টি লেভেল অ্যাডজাস্টমেন্ট', 'শব্দ মাত্রা': '২৫ ডেসিবেলের নিচে', 'ইন্টারফেস': 'ইউএসবি টাইপ-সি' };
  } else if (lowerName.includes('chopper') || lowerName.includes('চপার')) {
    extra.rating = 4.7;
    extra.reviewCount = 21;
    extra.fullDesc = isEn
      ? 'Chop garlic, ginger, pepper, or herbs in under 5 seconds with this USB Rechargeable Garlic Chopper. One-touch operation with razor-sharp food-grade stainless steel blades.'
      : 'রসুন, আদা, কাঁচামরিচ বা ধনেপাতা সেকেন্ডের মধ্যে কুচি করুন এই রিচার্জেবল মিনি চপারে। মাত্র একবার প্রেস করলেই ক্ষুরধার ফুড-গ্রেড স্টিল ব্লেড কাজ সম্পন্ন করে দেয়।';
    extra.features = isEn
      ? ['One-button press-to-chop operation for zero hassle', 'Food-grade premium BPA-free plastic bowl storage cup', 'Rechargeable wireless operation with USB adapter cable', 'Waterproof detachable blades for effortless rinsing']
      : ['একটি বোতাম চেপেই চোখের পলকে কাটার ও কুচি করার জাদুকরী সিস্টেম', 'সম্পূর্ণ বিপিএ-মুক্ত ফুড গ্রেড প্রিমিয়াম প্লাস্টিক কাপ', 'ওয়্যারলেস কাজের জন্য বিল্ট-ইন রিচার্জেবল ব্যাটারি', 'সহজে ধুয়ে পরিষ্কার করার জন্য ওয়াটারপ্রুফ ডিজাইন'];
    extra.specs = isEn
      ? { 'Bowl Capacity': '250ml', 'Blades Material': '304 Stainless Steel', 'Battery Power': '3.7V Input', 'Safety Lock': 'Automatic Shut-off' }
      : { 'বাটি ধারণক্ষমতা': '২৫০ মিলি', 'ব্লেড উপাদান': '৩০৪ স্টেইনলেস স্টিল', 'ব্যাটারি ভোল্টেজ': '৩.৭ ভোল্ট', 'নিরাপত্তা লক': 'অটো শাট-অফ প্রোটেকশন' };
  } else if (lowerName.includes('light') || lowerName.includes('লাইট')) {
    extra.rating = 4.8;
    extra.reviewCount = 31;
    extra.fullDesc = isEn
      ? 'Light up dark closets, staircases, and bedsides automatically with this USB Rechargeable Motion Sensor Light. Smart magnetic bracket lets you stick it anywhere instantly.'
      : 'ঘরের অন্ধকার আলমারি, সিঁড়ি বা ওয়াকওয়ে আলোকিত করুন এই স্মার্ট মোশন সেন্সর লাইটে। অন্ধকার ঘরে কাউকে শনাক্ত করলেই এটি স্বয়ংক্রিয়ভাবে জ্বলে ওঠে এবং ৩০ সেকেন্ড পর নিভে যায়।';
    extra.features = isEn
      ? ['Dual modes: Intelligent Auto Motion Sensor and Always-On', '120-degree detection angle within 3-meter distance range', 'Easy magnetic mount installation with 3M adhesive tapes', 'Soft anti-glare LED illumination protecting eyes at night']
      : ['ডুয়াল মোড: অটো মোশন ডিটেকশন মোড এবং অলওয়েজ-অন মোড', '৩ মিটার দূরত্ব এবং ১২০-ডিগ্রি রেঞ্জে কাজ করা মোশন সেন্সর', '৩এম আঠা যুক্ত ম্যাগনেটিক মাউন্ট দিয়ে সহজে দেয়াল বা কাঠে স্থাপন', 'চোখের জন্য আরামদায়ক সফট আই-প্রোটেক্টিভ ওয়ার্ম এলইডি আলো'];
    extra.specs = isEn
      ? { 'Luminous Intensity': '150 Lumens', 'Auto Timer': '30 Seconds Turn-Off Delay', 'Sensor Range': '3 Meters / 120 Degrees', 'Battery Type': 'Built-in Lithium' }
      : { 'আলোর তীব্রতা': '১৫০ লুমেন', 'অটো অফ টাইমার': '৩০ সেকেন্ড শাটডাউন ডিলে', 'সেন্সর দূরত্ব': '৩ মিটার / ১২০ ডিগ্রি', 'ব্যাটারি': 'বিল্ট-ইন রিচার্জেবল লিথিয়াম' };
  } else if (lowerName.includes('cutter') || lowerName.includes('কাটার')) {
    extra.rating = 4.8;
    extra.reviewCount = 27;
    extra.fullDesc = isEn
      ? 'Slice, shred, and dice vegetables, fruits, and cheese flawlessly with this Multifunctional Kitchen Cutter. Crafted with high-grade multi-blades for safety and speed.'
      : 'আলু, গাজর, শসা বা সালাদের উপকরণ নিখুঁত স্লাইস ও কুচি করার প্রিমিয়াম কিচেন কাটার। এর শক্তিশালী হ্যান্ড-গার্ড আপনার হাতকে ব্লেডের আঘাত থেকে সম্পূর্ণ নিরাপদে রাখে।';
    extra.features = isEn
      ? ['Multi-blade configurations for slicing, julienning, and dicing', 'Enhanced safety hand-guard protecting fingers during cutting', 'Anti-slip rubberized feet to provide sturdy base on counter', 'Premium stainless steel and BPA-free food grade ABS']
      : ['কুচি ও স্লাইস করার জন্য চমৎকার পরিবর্তনযোগ্য মাল্টি-ব্লেড সেট', 'হাতকে ব্লেডের ক্ষুরধার স্পর্শ থেকে বাঁচাতে বিশেষ সেফটি গার্ড', 'ব্যবহারের সময় চমৎকার গ্রিপ ধরে রাখার জন্য অ্যান্টি-স্লিপ রাবার বেইস', 'জং-রোধী প্রিমিয়াম স্টেইনলেস স্টিল এবং ফুড-গ্রেড প্লাস্টিক'];
    extra.specs = isEn
      ? { 'Blades Included': '5 Interchangeable Steel Blades', 'Safe Material': 'BPA-Free ABS Plastic', 'Base Grip': 'Anti-Skid Footing', 'Container': 'Built-in Prep Bowl' }
      : { 'মোট ব্লেড সংখ্যা': '৫টি ভিন্ন পরিবর্তনযোগ্য স্টিল ব্লেড', 'উপাদান মান': 'সম্পূর্ণ বিপিএ-মুক্ত ফুড গ্রেড এবিএস', 'বেইজ গ্রিপ': 'অ্যান্টি-স্কিড রাবার গ্রিপ', 'স্টোরেজ বক্স': 'বিল্ট-ইন কাটিং সংগ্রহ বাটি' };
  } else if (lowerName.includes('vacuum') || lowerName.includes('ভ্যাকুয়াম')) {
    extra.rating = 4.9;
    extra.reviewCount = 35;
    extra.fullDesc = isEn
      ? 'Suck up dust, hair, crumbs, and gravel inside your car seat crevices, computer keyboards, and corners with this wireless vacuum. Compact, quiet, and powerful rechargeable motor.'
      : 'আপনার গাড়ির সিট, সোফা বা কম্পিউটারের কিবোর্ডের জমে থাকা ধুলাবালি ও ময়লা চোখের পলকে পরিষ্কার করুন এই ওয়্যারলেস ভ্যাকুয়াম ক্লিনারে। এর শক্তিশালী সাকশন প্রতি কোণা নিখুঁত রাখে।';
    extra.features = isEn
      ? ['High-suction turbine motor pulling tough dirt in seconds', 'Cordless rechargeable design with Type-C fast charge', 'Dual extension nozzles to reach deep spaces and keyboard caps', 'Washable HEPA filtration system traps micro-particles']
      : ['সেকেন্ডের মধ্যে ময়লা শুষে নেওয়ার জন্য হাই-পাওয়ার টারবাইন মোটর', 'যেকোনো স্থানে তারহীন ব্যবহারের জন্য রিচার্জেবল দীর্ঘস্থায়ী ব্যাটারি', 'সরু কোণ ও কিবোর্ডের জন্য বিশেষ ব্রাশ ও চিকন সাকশন নজল', 'পুনরায় ব্যবহারযোগ্য ও ওয়াশযোগ্য উন্নত হেপা (HEPA) ফিল্টার'];
    extra.specs = isEn
      ? { 'Suction Power': '6000 Pa Rated Vacuum', 'Battery Spec': '2000mAh Battery Pack', 'Dust Cup': '120ml Detachable Cup', 'Filter': 'Washable HEPA Filter' }
      : { 'সাকশন পাওয়ার': '৬০০০ প্যাসকেল (Pa)', 'ব্যাটারি': '২০০০ এমএএইচ রিচার্জেবল ব্যাটারি', 'ডাস্ট কাপ': '১২০ মিলি পোর্টেবল কাপ', 'ফিল্টার': 'ওয়াশযোগ্য রিইউজেবল হেপা ফিল্টার' };
  }

  // Dynamically assign optional colors and sizes
  if (lowerName.includes('steamer') || lowerName.includes('স্টিমার')) {
    extra.colors = isEn ? ['Emerald Green', 'Soft Pink', 'Classic White'] : ['সবুজ', 'গোলাপি', 'সাদা'];
  } else if (lowerName.includes('brush') || lowerName.includes('ব্রাশ')) {
    extra.colors = isEn ? ['Mint Green', 'Pearl White'] : ['মিন্ট গ্রিন', 'সাদা'];
  } else if (lowerName.includes('organizer') || lowerName.includes('অর্গানাইজার')) {
    extra.colors = isEn ? ['Elite Black', 'Charcoal Gray'] : ['কালো', 'ধূসর'];
    extra.sizes = isEn ? ['Medium', 'Large'] : ['মাঝারি', 'বড়'];
  } else if (lowerName.includes('fan') || lowerName.includes('ফ্যান')) {
    extra.colors = isEn ? ['Sky Blue', 'Pearl White', 'Pale Pink'] : ['আকাশি নীল', 'সাদা', 'গোলাপি'];
  } else if (lowerName.includes('chopper') || lowerName.includes('চপার')) {
    extra.colors = isEn ? ['Mint Green', 'Classic White'] : ['সবুজ', 'সাদা'];
    extra.sizes = isEn ? ['250ml', '500ml'] : ['২৫০ মিলি', '৫০০ মিলি'];
  } else if (lowerName.includes('light') || lowerName.includes('লাইট')) {
    extra.colors = isEn ? ['Warm White (3000K)', 'Cool White (6000K)'] : ['ওয়ার্ম হোয়াইট (৩০০০K)', 'কুল হোয়াইট (৬০০০K)'];
    extra.sizes = isEn ? ['10cm', '20cm', '30cm'] : ['১০ সেমি', '২০ সেমি', '৩০ সেমি'];
  } else if (lowerName.includes('cutter') || lowerName.includes('কাটার')) {
    extra.colors = isEn ? ['Crimson Red', 'Emerald Green'] : ['লাল', 'সবুজ'];
  }

  // Generate thumbnail set using the main image and some Fallbacks
  extra.images = [productName.includes('sensor') ? prodSensorLight : extra.specs['Material'] ? extra.specs['Bowl Capacity'] ? prodGarlicChopper : prodMiniSteamer : prodMiniSteamer];
  
  return extra;
}

const carouselImages = [
  { src: heroBanner1, alt: 'Fresh organic groceries' },
  { src: heroBanner2, alt: 'Fresh fruits and berries' },
  { src: heroBanner3, alt: 'Fresh dairy products' },
  { src: heroBanner4, alt: 'Fresh bakery and bread' },
];

const translations = {
  en: {
    searchPlaceholder: 'Search For Products (E.G. Oil, Rice, Eggs)',
    trackOrder: 'Track Order',
    login: 'Log in',
    cart: 'Cart',
    trackModalTitle: 'Track Your Order',
    trackModalDesc: 'Enter your order ID or phone number to check the current delivery status.',
    orderIdPlaceholder: 'e.g. ORD-849201 or 01700000000',
    trackBtn: 'Search Order',
    close: 'Close',
    orderStatusSample: 'Order #ORD-849201 is currently Out for Delivery.',
    estimatedDelivery: 'Estimated Delivery: Today by 6:00 PM',

    // Hero Section
    heroHeadline: 'Fresh Groceries Delivered to Your Doorstep',
    heroSubtext: 'Shop daily essentials, fresh produce, and household items with fast and reliable delivery.',
    heroCta: 'Shop Now',

    // Popular Categories Section
    categoriesTitle: 'Popular Categories',
    categoriesSubtitle: 'Explore handy, clever, and problem-solving imported items',
    categories: [
      { name: 'Handy Gadgets', image: catHandyGadgets },
      { name: 'Home Helpers', image: catHomeHelpers },
      { name: 'Kitchen Finds', image: catKitchenFinds },
      { name: 'Smart Utility', image: catSmartUtility },
      { name: 'Travel & Daily Carry', image: catTravelDaily },
      { name: 'Car & Lifestyle', image: catCarLifestyle },
      { name: 'Personal Care', image: catPersonalCare },
      { name: 'Home Organization', image: catHomeOrg },
      { name: 'Cleaning Tools', image: catCleaningTools },
    ],

    // Trending Finds Section
    trendingTitle: 'Trending Finds',
    trendingSubtitle: 'Smart, useful products you’ll love to discover.',
    addToCart: 'Add to Cart',
    trendingProducts: [
      {
        name: 'Portable Mini Garment Steamer',
        desc: 'Remove wrinkles effortlessly anywhere.',
        price: 950,
        oldPrice: 1250,
        image: prodMiniSteamer,
      },
      {
        name: 'Rechargeable Electric Cleaning Brush',
        desc: 'Power scrub tough stains instantly.',
        price: 1100,
        oldPrice: 1450,
        image: prodElectricBrush,
      },
      {
        name: 'Mini Portable Food Sealer',
        desc: 'Keep snacks fresh with airtight seals.',
        price: 490,
        oldPrice: 650,
        image: prodFoodSealer,
      },
      {
        name: 'Multifunctional Car Organizer',
        desc: 'Keep backseat clutter-free and tidy.',
        price: 780,
        oldPrice: 990,
        image: prodCarOrganizer,
      },
      {
        name: 'Compact USB Rechargeable Fan',
        desc: 'Cool breeze on-the-go with quiet motor.',
        price: 850,
        oldPrice: 1100,
        image: prodRechargeableFan,
      },
    ],

    // Featured Products Section
    featuredTitle: 'Featured Products',
    featuredSubtitle: 'Practical finds, picked for everyday life.',
    featuredProducts: [
      {
        name: 'Mini Electric Garlic Chopper',
        desc: 'Chop garlic, ginger & herbs in seconds.',
        price: 590,
        oldPrice: 790,
        image: prodGarlicChopper,
      },
      {
        name: 'Portable Neck Fan',
        desc: 'Hands-free cooling with leafless design.',
        price: 890,
        oldPrice: 1200,
        image: prodNeckFan,
      },
      {
        name: 'Foldable Storage Organizer',
        desc: 'Space-saving fabric cubes for storage.',
        price: 450,
        oldPrice: 600,
        image: prodFoldableOrganizer,
      },
      {
        name: 'Rechargeable Motion Sensor Light',
        desc: 'Smart magnetic LED light for closets.',
        price: 680,
        oldPrice: 850,
        image: prodSensorLight,
      },
      {
        name: 'Multifunctional Kitchen Cutter',
        desc: 'Premium multi-blade vegetable slicer.',
        price: 750,
        oldPrice: 1050,
        image: prodKitchenCutter,
      },
      {
        name: 'Portable Mini Vacuum Cleaner',
        desc: 'Powerful handheld wireless car cleaner.',
        price: 990,
        oldPrice: 1350,
        image: prodMiniVacuum,
      },
    ],

    // Why Shop With Us Section
    whyShopTitle: 'Why Shop With Us?',
    whyShopSubtitle: 'Simple reasons to make your everyday shopping better.',
    whyShopFeatures: [
      {
        title: 'Unique Finds',
        desc: 'Discover useful products you don’t see everywhere.',
        icon: 'Sparkles',
      },
      {
        title: 'Quality Checked',
        desc: 'We focus on practical products worth bringing home.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Fast Delivery',
        desc: 'Get your order delivered quickly across Bangladesh.',
        icon: 'Truck',
      },
      {
        title: 'Cash on Delivery',
        desc: 'Pay conveniently when your order arrives.',
        icon: 'Wallet',
      },
    ],

    // How It Works Section
    howTitle: 'How It Works',
    howSubtitle: 'Find it. Order it. Enjoy it.',
    howSteps: [
      {
        num: '01',
        title: 'Discover',
        desc: 'Explore unique and useful finds made for everyday life.',
        icon: 'Search',
      },
      {
        num: '02',
        title: 'Order',
        desc: 'Choose your favorite product and place your order easily.',
        icon: 'ShoppingCart',
      },
      {
        num: '03',
        title: 'Receive',
        desc: 'Get your order delivered right to your doorstep.',
        icon: 'PackageCheck',
      },
    ],

    // Frequently Asked Questions Section
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know before ordering.',
    faqItems: [
      {
        q: 'What type of products do you sell?',
        a: 'We offer unique, useful and practical products designed to make everyday life easier.',
      },
      {
        q: 'Do you deliver across Bangladesh?',
        a: 'Yes, we offer delivery across Bangladesh.',
      },
      {
        q: 'Can I pay when I receive my order?',
        a: 'Yes, Cash on Delivery is available.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Delivery time depends on your location and the delivery service used for your order.',
      },
      {
        q: 'Are the products imported?',
        a: 'We source many of our unique products internationally, including products from China.',
      },
      {
        q: 'How can I place an order?',
        a: 'Choose a product, add it to your cart, provide your delivery details, and place your order.',
      },
    ],
    loadMore: 'Load More',
    footerAbout: 'We bring you unique, high-quality, and useful life-hacking gadgets and everyday products across Bangladesh.',
    footerLinksTitle: 'Quick Links',
    footerContactTitle: 'Contact Us',
    footerRights: 'All rights reserved.',
    cartTitle: 'Your Cart',
    cartEmptyTitle: 'Your cart is empty',
    cartEmptyDesc: 'Looks like you haven’t added anything yet.',
    continueShopping: 'Continue Shopping',
  },
  bn: {
    searchPlaceholder: 'পণ্য অনুসন্ধান করুন (যেমন: মিনি ভ্যাকুয়াম, কিচেন টুলস)',
    trackOrder: 'অর্ডার ট্র্যাক করুন',
    login: 'লগইন',
    cart: 'কার্ট',
    trackModalTitle: 'আপনার অর্ডার ট্র্যাক করুন',
    trackModalDesc: 'বর্তমান ডেলিভারি স্ট্যাটাস দেখতে আপনার অর্ডার আইডি বা ফোন নম্বর দিন।',
    orderIdPlaceholder: 'যেমন: ORD-849201 অথবা 01700000000',
    trackBtn: 'অর্ডার খুঁজুন',
    close: 'বন্ধ করুন',
    orderStatusSample: 'অর্ডার #ORD-849201 বর্তমানে ডেলিভারির জন্য রওয়ানা হয়েছে।',
    estimatedDelivery: 'আনুমানিক ডেলিভারি সময়: আজ বিকেল ৬:০০ টার মধ্যে',

    // Hero Section
    heroHeadline: 'টাটকা মুদি পণ্য আপনার দরগোড়ায় পৌঁছে দেওয়া হবে',
    heroSubtext: 'দ্রুত ও নির্ভরযোগ্য ডেলিভারির মাধ্যমে আপনার দৈনন্দিন প্রয়োজনীয় পণ্য, তাজা সবজি ও গৃহস্থালী সামগ্রী কেনাকাটা করুন।',
    heroCta: 'এখনই কেনাকাটা করুন',

    // Popular Categories Section
    categoriesTitle: 'জনপ্রিয় ক্যাটাগরি',
    categoriesSubtitle: 'আমদানিকৃত নিত্যনতুন, স্মার্ট এবং বাস্তবমুখী কাজের গ্যাজেটসমূহ',
    categories: [
      { name: 'হ্যান্ডি গ্যাজেটস', image: catHandyGadgets },
      { name: 'হোম হেলপার্স', image: catHomeHelpers },
      { name: 'কিচেন ফাইন্ডস', image: catKitchenFinds },
      { name: 'স্মার্ট ইউটিলিটি', image: catSmartUtility },
      { name: 'ট্রাভেল ও ডেইলি ক্যারি', image: catTravelDaily },
      { name: 'কার ও লাইফস্টাইল', image: catCarLifestyle },
      { name: 'পার্সোনাল কেয়ার', image: catPersonalCare },
      { name: 'হোম অর্গানাইজেশন', image: catHomeOrg },
      { name: 'ক্লিনিং টুলস', image: catCleaningTools },
    ],

    // Trending Finds Section
    trendingTitle: 'ট্রেন্ডিং ফাইন্ডস',
    trendingSubtitle: 'স্মার্ট ও দরকারী সব অনন্য প্রোডাক্ট আপনার জন্য।',
    addToCart: 'কার্টে যোগ করুন',
    trendingProducts: [
      {
        name: 'পোর্টেবল মিনি গার্মেন্ট স্টিমার',
        desc: 'সহজেই যেকোনো স্থানে কাপড়ের কুঁচকানো ভাব দূর করুন।',
        price: 950,
        oldPrice: 1250,
        image: prodMiniSteamer,
      },
      {
        name: 'রিচার্জেবল ইলেকট্রিক ক্লিনিং ব্রাশ',
        desc: 'কঠিন দাগ দূর করার শক্তিশালী স্ক্রাবার ব্রাশ।',
        price: 1100,
        oldPrice: 1450,
        image: prodElectricBrush,
      },
      {
        name: 'মিনি পোর্টেবল ফুড সিলার',
        desc: 'খাবার সতেজ রাখতে এয়ারটাইট সিলিং সিলার।',
        price: 490,
        oldPrice: 650,
        image: prodFoodSealer,
      },
      {
        name: 'মাল্টিফাংশনাল কার অর্গানাইজার',
        desc: 'গাড়ির ব্যাকসিট গুছিয়ে রাখার প্রিমিয়াম ক্যারিয়ার।',
        price: 780,
        oldPrice: 990,
        image: prodCarOrganizer,
      },
      {
        name: 'কমপ্যাক্ট ইউএসবি রিচার্জেবল ফ্যান',
        desc: 'সহজে বহনযোগ্য শান্ত ও শক্তিশালী ঠান্ডা ফ্যান।',
        price: 850,
        oldPrice: 1100,
        image: prodRechargeableFan,
      },
    ],

    // Featured Products Section
    featuredTitle: 'ফিচার্ড প্রোডাক্টস',
    featuredSubtitle: 'দৈনন্দিন জীবনের প্রয়োজনীয় এবং বাস্তবমুখী প্রোডাক্টস।',
    featuredProducts: [
      {
        name: 'মিনি ইলেকট্রিক রসুন চপার',
        desc: 'সেকেন্ডেই রসুন, আদা এবং মসলা চপ করুন।',
        price: 590,
        oldPrice: 790,
        image: prodGarlicChopper,
      },
      {
        name: 'পোর্টেবল নেক ফ্যান',
        desc: 'ব্লেডহীন ও নিরাপদ হ্যান্ডস-ফ্রি ঠান্ডা ফ্যান।',
        price: 890,
        oldPrice: 1200,
        image: prodNeckFan,
      },
      {
        name: 'ফোল্ডেবল স্টোরেজ অর্গানাইজার',
        desc: 'জায়গা সাশ্রয়ী চমৎকার ফেব্রিক স্টোরেজ কিউব।',
        price: 450,
        oldPrice: 600,
        image: prodFoldableOrganizer,
      },
      {
        name: 'রিচার্জেবল মোশন সেন্সর লাইট',
        desc: 'আলমারি ও সিঁড়ির জন্য স্মার্ট ম্যাগনেটিক লাইট।',
        price: 680,
        oldPrice: 850,
        image: prodSensorLight,
      },
      {
        name: 'মাল্টিফাংশনাল কিচেন কাটার',
        desc: 'প্রিমিয়াম মাল্টি-ব্লেড বিশিষ্ট ভেজিটেবল স্লাইসার।',
        price: 750,
        oldPrice: 1050,
        image: prodKitchenCutter,
      },
      {
        name: 'পোর্টেবল মিনি ভ্যাকুয়াম ক্লিনার',
        desc: 'শক্তিশালী হ্যান্ডহেল্ড ওয়্যারলেস ক্লিনার।',
        price: 990,
        oldPrice: 1350,
        image: prodMiniVacuum,
      },
    ],

    // Why Shop With Us Section
    whyShopTitle: 'আমাদের থেকে কেন কেনাকাটা করবেন?',
    whyShopSubtitle: 'দৈনন্দিন কেনাকাটাকে আরও সহজ এবং নির্ভরযোগ্য করার কিছু কারণ।',
    whyShopFeatures: [
      {
        title: 'অনন্য প্রোডাক্টস',
        desc: 'এমন সব দরকারি প্রোডাক্ট যা সাধারণত অন্য কোথাও পাওয়া যায় না।',
        icon: 'Sparkles',
      },
      {
        title: 'মান যাচাইকৃত',
        desc: 'আমরা প্রতিটি প্রোডাক্টের গুণগত মান নিশ্চিত করে আপনার কাছে পাঠাই।',
        icon: 'ShieldCheck',
      },
      {
        title: 'দ্রুত ডেলিভারি',
        desc: 'সমগ্র বাংলাদেশ জুড়ে অত্যন্ত দ্রুততায় অর্ডার ডেলিভারি করা হয়।',
        icon: 'Truck',
      },
      {
        title: 'ক্যাশ অন ডেলিভারি',
        desc: 'প্রোডাক্ট হাতে পেয়ে সম্পূর্ণ নিশ্চিন্তে পেমেন্ট করুন।',
        icon: 'Wallet',
      },
    ],

    // How It Works Section
    howTitle: 'কিভাবে কাজ করে',
    howSubtitle: 'খুঁজুন। অর্ডার করুন। উপভোগ করুন।',
    howSteps: [
      {
        num: '০১',
        title: 'খুঁজুন',
        desc: 'দৈনন্দিন জীবনের প্রয়োজনীয় চমৎকার সব ইউনিক গ্যাজেট আবিষ্কার করুন।',
        icon: 'Search',
      },
      {
        num: '০২',
        title: 'অর্ডার করুন',
        desc: 'পছন্দের পণ্যটি বেছে নিয়ে অত্যন্ত সহজে অর্ডার সম্পন্ন করুন।',
        icon: 'ShoppingCart',
      },
      {
        num: '০৩',
        title: 'বুঝে নিন',
        desc: 'কোনো ঝামেলা ছাড়াই দ্রুততম সময়ে আপনার ঠিকানায় পণ্য বুঝে নিন।',
        icon: 'PackageCheck',
      },
    ],

    // Frequently Asked Questions Section
    faqTitle: 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী',
    faqSubtitle: 'অর্ডার করার পূর্বে আপনার প্রয়োজনীয় সব তথ্য জেনে নিন।',
    faqItems: [
      {
        q: 'আপনারা কী ধরনের প্রোডাক্ট বিক্রি করেন?',
        a: 'আমরা দৈনন্দিন জীবনকে সহজ করার জন্য চমৎকার, অনন্য এবং অত্যন্ত বাস্তবমুখী কাজের প্রোডাক্ট বিক্রি করি।',
      },
      {
        q: 'আপনারা কি সমগ্র বাংলাদেশে ডেলিভারি দেন?',
        a: 'হ্যাঁ, আমরা সমগ্র বাংলাদেশ জুড়ে অত্যন্ত বিশ্বস্ততার সাথে প্রোডাক্ট ডেলিভারি দিয়ে থাকি।',
      },
      {
        q: 'পণ্য হাতে পাওয়ার পর পেমেন্ট করতে পারব?',
        a: 'হ্যাঁ, আমাদের প্রতিটি প্রোডাক্টে ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা রয়েছে।',
      },
      {
        q: 'ডেলিভারি পেতে কতদিন সময় লাগে?',
        a: 'ডেলিভারি সময় আপনার অবস্থান এবং আমাদের লজিস্টিক পার্টনার সার্ভিসের উপর নির্ভর করে।',
      },
      {
        q: 'প্রোডাক্টগুলো কি আমদানিকৃত?',
        a: 'হ্যাঁ, আমরা চীনসহ বিভিন্ন আন্তর্জাতিক বাজার থেকে চমৎকার ও কার্যকর প্রোডাক্টগুলো সংগ্রহ করে থাকি।',
      },
      {
        q: 'আমি কিভাবে অর্ডার করতে পারি?',
        a: 'সহজেই পছন্দের প্রোডাক্টটি সিলেক্ট করে আপনার ডেলিভারি ডিটেইলস পূরণ করে অর্ডার সম্পন্ন করুন।',
      },
    ],
    loadMore: 'আরো দেখুন',
    footerAbout: 'আমরা সমগ্র বাংলাদেশ জুড়ে দৈনন্দিন জীবনকে সহজ করার জন্য চমৎকার, অনন্য এবং প্রয়োজনীয় স্মার্ট গ্যাজেটস পৌঁছে দিই।',
    footerLinksTitle: 'গুরুত্বপূর্ণ লিংক',
    footerContactTitle: 'যোগাযোগ করুন',
    footerRights: 'সর্বস্বত্ব সংরক্ষিত।',
    cartTitle: 'আপনার কার্ট',
    cartEmptyTitle: 'আপনার কার্টটি খালি',
    cartEmptyDesc: 'মনে হচ্ছে আপনি এখনও কোনো প্রোডাক্ট যোগ করেননি।',
    continueShopping: 'কেনাকাটা চালিয়ে যান',
  },
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_language');
      if (saved === 'en' || saved === 'bn') return saved;
    }
    return 'en';
  });

  const [showTrackModal, setShowTrackModal] = useState(false);
  const [orderQuery, setOrderQuery] = useState('');
  const [trackedResult, setTrackedResult] = useState<boolean | null>(null);

  // Hero Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Active Category state
  const [selectedCat, setSelectedCat] = useState<number>(0);

  // Dynamic Category Page state
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('popular');

  // Dynamic Product Details Page state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [productQty, setProductQty] = useState<number>(1);
  const [mainProductImage, setMainProductImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Dynamic shopping cart state
  const [cart, setCart] = useState<Array<{ 
    product: ProductItem; 
    quantity: number; 
    selectedColor?: string; 
    selectedSize?: string; 
  }>>([]);

  // Navigation / Page Routing state
  const getInitialView = (): 'shop' | 'cart' | 'checkout' | 'order-complete' => {
    if (typeof window === 'undefined') return 'shop';
    const path = window.location.pathname;
    if (path === '/cart') return 'cart';
    if (path === '/checkout') return 'checkout';
    if (path === '/order-complete') return 'order-complete';
    return 'shop';
  };

  const [currentView, setCurrentView] = useState<'shop' | 'cart' | 'checkout' | 'order-complete'>(getInitialView);
  const [latestOrder, setLatestOrder] = useState<OrderData | null>(() => {
    try {
      const saved = localStorage.getItem('hue_latest_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dynamic products and settings from Supabase / Central Store
  const [dbProducts, setDbProducts] = useState<ProductItem[]>(() => {
    try {
      const prods = getAdminProducts();
      if (prods && prods.length > 0) {
        return prods.map((p) => ({
          name: p.name,
          bnName: p.bnName || p.name,
          desc: p.desc || '',
          bnDesc: p.bnDesc || p.desc || '',
          price: p.price,
          oldPrice: p.oldPrice || 0,
          image: p.image,
          categoryIndex: p.categoryIndex,
          isPopular: p.isPopular,
          isNewest: p.isNewest,
        }));
      }
    } catch {
      // ignore
    }
    return DEMO_PRODUCTS;
  });

  const [storeDeliveryFee, setStoreDeliveryFee] = useState<number>(() => {
    try {
      return getStoreSettings().insideDhakaDelivery || DEFAULT_DELIVERY_CHARGE;
    } catch {
      return DEFAULT_DELIVERY_CHARGE;
    }
  });

  // Dynamic Admin Test Button Visibility State from central StoreSettings
  const [showAdminTestButton, setShowAdminTestButton] = useState<boolean>(() => {
    try {
      return getStoreSettings().showAdminTestButton !== false;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    let isMounted = true;
    fetchProductsFromDb().then((prods) => {
      if (isMounted && prods && prods.length > 0) {
        setDbProducts(
          prods.map((p) => ({
            name: p.name,
            bnName: p.bnName || p.name,
            desc: p.desc || '',
            bnDesc: p.bnDesc || p.desc || '',
            price: p.price,
            oldPrice: p.oldPrice || 0,
            image: p.image,
            categoryIndex: p.categoryIndex,
            isPopular: p.isPopular,
            isNewest: p.isNewest,
          }))
        );
      }
    });

    fetchStoreSettingsFromDb().then((settings) => {
      if (isMounted && settings) {
        setShowAdminTestButton(settings.showAdminTestButton !== false);
        setStoreDeliveryFee(settings.insideDhakaDelivery || DEFAULT_DELIVERY_CHARGE);
      }
    });

    const handleStorageChange = () => {
      try {
        setShowAdminTestButton(getStoreSettings().showAdminTestButton !== false);
        setStoreDeliveryFee(getStoreSettings().insideDhakaDelivery || DEFAULT_DELIVERY_CHARGE);
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleOpenAdminTest = () => {
    openAdminPortal();
  };

  const navigateTo = (view: 'shop' | 'cart' | 'checkout' | 'order-complete') => {
    setCurrentView(view);
    const path = view === 'shop' ? '/' : `/${view}`;
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    if (view === 'shop') {
      setSelectedProduct(null);
      setSelectedCategoryIndex(null);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/cart') setCurrentView('cart');
      else if (path === '/checkout') setCurrentView('checkout');
      else if (path === '/order-complete') setCurrentView('order-complete');
      else setCurrentView('shop');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    setCart((prev) => {
      const updated = [...prev];
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], quantity: newQty };
      }
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleOrderSuccess = (order: OrderData) => {
    setLatestOrder(order);
    setCart([]);
    navigateTo('order-complete');
  };

  const handleOpenProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setProductQty(1);
    setMainProductImage(null);
    setCurrentView('shop');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (
    product: ProductItem, 
    qty: number = 1, 
    color?: string | null, 
    size?: string | null
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => 
        item.product.name === product.name && 
        item.selectedColor === (color || undefined) && 
        item.selectedSize === (size || undefined)
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [...prev, { 
          product, 
          quantity: qty, 
          selectedColor: color || undefined, 
          selectedSize: size || undefined 
        }];
      }
    });
    setShowCartDrawer(true);
  };

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Cart Drawer state
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Dropdown Menu state
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  // Close drawers/modals/dropdowns on Escape keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCartDrawer(false);
        setShowMenuDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Disable scroll when drawer is active
  useEffect(() => {
    if (showCartDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCartDrawer]);

  useEffect(() => {
    localStorage.setItem('app_language', lang);
  }, [lang]);

  // Autoplay: changes slide every 4.5 seconds with horizontal scroll
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    if (selectedProduct) {
      const extra = getProductExtraInfo(selectedProduct.name, lang);
      setSelectedColor(extra.colors && extra.colors.length > 0 ? extra.colors[0] : null);
      setSelectedSize(extra.sizes && extra.sizes.length > 0 ? extra.sizes[0] : null);
    } else {
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [selectedProduct, lang]);

  const t = translations[lang];

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch active product's extra details if selected
  const activeProductExtra = selectedProduct ? getProductExtraInfo(selectedProduct.name, lang) : null;

  // Filter and Sort Products
  const filteredProducts = dbProducts.filter(
    (prod) => prod.categoryIndex === selectedCategoryIndex
  );

  if (sortBy === 'low-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'high-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => (b.isNewest ? 1 : 0) - (a.isNewest ? 1 : 0));
  } else {
    filteredProducts.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  }

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuery.trim().length > 0) {
      setTrackedResult(true);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] w-full font-sans">
      {/* TOPBAR */}
      <header className="w-full lg:h-[80px] bg-[#1299E8] px-3.5 sm:px-6 lg:px-8 py-2.5 lg:py-0 flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-4 xl:gap-5 border-none shadow-none sticky top-0 z-40">
        {/* TOP ROW (Mobile) / ENTIRE BAR (Desktop) */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-2 sm:gap-3 lg:gap-4 shrink-0">
          {/* HAMBURGER ICON */}
          <div className="relative shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              aria-label="Open Menu"
              className="flex items-center justify-center p-1 sm:p-1.5 focus:outline-none cursor-pointer hover:bg-white/10 rounded-[6px] transition-colors shrink-0"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px]"
              >
                <path
                  d="M3 6H21M3 12H21M3 18H21"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {showMenuDropdown && (
              <>
                {/* Invisible backdrop overlay to close the dropdown on click outside */}
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setShowMenuDropdown(false)}
                />

                {/* Dropdown Card */}
                <div className="absolute left-0 top-[40px] sm:top-[44px] mt-[8px] w-[210px] bg-white rounded-[12px] py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#E8EDF2] z-50 animate-in fade-in slide-in-from-top-2 duration-150 select-none">
                  <button
                    type="button"
                    onClick={() => setShowMenuDropdown(false)}
                    className="w-full h-[38px] px-4 flex items-center gap-3 text-left text-[14px] font-medium text-[#25313C] hover:bg-[#F0F8FD] transition-colors cursor-default focus:outline-none"
                  >
                    <User className="w-[16px] h-[16px] text-[#1299E8] shrink-0 stroke-[2]" />
                    <span>{t.login}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMenuDropdown(false)}
                    className="w-full h-[38px] px-4 flex items-center gap-3 text-left text-[14px] font-medium text-[#25313C] hover:bg-[#F0F8FD] transition-colors cursor-default focus:outline-none"
                  >
                    <PackageCheck className="w-[16px] h-[16px] text-[#1299E8] shrink-0 stroke-[2]" />
                    <span>My Orders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenuDropdown(false);
                      setShowTrackModal(true);
                      setTrackedResult(null);
                    }}
                    className="w-full h-[38px] px-4 flex items-center gap-3 text-left text-[14px] font-medium text-[#25313C] hover:bg-[#F0F8FD] transition-colors cursor-pointer focus:outline-none"
                  >
                    <Truck className="w-[16px] h-[16px] text-[#1299E8] shrink-0 stroke-[2]" />
                    <span>Track Order</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMenuDropdown(false)}
                    className="w-full h-[38px] px-4 flex items-center gap-3 text-left text-[14px] font-medium text-[#25313C] hover:bg-[#F0F8FD] transition-colors cursor-default focus:outline-none"
                  >
                    <Heart className="w-[16px] h-[16px] text-[#1299E8] shrink-0 stroke-[2]" />
                    <span>Wishlist</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMenuDropdown(false)}
                    className="w-full h-[38px] px-4 flex items-center gap-3 text-left text-[14px] font-medium text-[#25313C] hover:bg-[#F0F8FD] transition-colors cursor-default focus:outline-none"
                  >
                    <HelpCircle className="w-[16px] h-[16px] text-[#1299E8] shrink-0 stroke-[2]" />
                    <span>Help & Support</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMenuDropdown(false)}
                    className="w-full h-[38px] px-4 flex items-center gap-3 text-left text-[14px] font-medium text-[#25313C] hover:bg-[#F0F8FD] transition-colors cursor-default focus:outline-none"
                  >
                    <Settings className="w-[16px] h-[16px] text-[#1299E8] shrink-0 stroke-[2]" />
                    <span>Settings</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* BRAND LOGO: Uploaded white "hue n vibes" SVG directly on topbar */}
          <div
            onClick={() => navigateTo('shop')}
            className="flex items-center shrink-0 cursor-pointer"
          >
            <img
              src="/hue_n_vibes_white_tight.svg"
              alt="hue n vibes"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== '/logo.svg') {
                  target.src = '/logo.svg';
                }
              }}
              className="h-[32px] sm:h-[40px] lg:h-[48px] w-auto object-contain max-w-[130px] sm:max-w-[190px] lg:max-w-[235px]"
            />
          </div>

          {/* MOBILE RIGHT ACTIONS: Language switcher & Cart */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* MOBILE LANGUAGE SWITCHER */}
            <div className="flex items-center bg-white/15 p-0.5 rounded-[6px] gap-0.5 select-none shrink-0">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-[4px] transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-[#1299E8] shadow-xs font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-[4px] transition-all cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-white text-[#1299E8] shadow-xs font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                বাং
              </button>
            </div>

            {/* MOBILE CART BUTTON */}
            <button
              type="button"
              onClick={() => setShowCartDrawer(true)}
              className="h-[36px] sm:h-[40px] bg-white/15 active:bg-white/25 text-white text-xs font-semibold rounded-[6px] border-none px-2.5 sm:px-3 flex items-center gap-1.5 cursor-pointer select-none transition-colors focus:outline-none shrink-0"
            >
              <ShoppingCart className="w-[18px] h-[18px] text-white shrink-0" />
              <span className="bg-white text-[#1299E8] text-[11px] font-bold w-[19px] h-[19px] rounded-full flex items-center justify-center ml-0.5 shrink-0 shadow-xs">
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>

        {/* SEARCH BAR (Inlined on Desktop, Full-width 2nd row on Mobile) */}
        <div className="w-full lg:flex-1 lg:max-w-[700px] lg:min-w-[200px]">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full h-[40px] sm:h-[44px] lg:h-[50px] bg-[#FFFFFF] text-[#222222] placeholder-[#54708F] text-[13px] sm:text-[14px] lg:text-[15px] rounded-[10px] lg:rounded-[13px] pl-4 pr-10 lg:px-5 border-none outline-none focus:outline-none focus:ring-0 shadow-xs lg:shadow-none"
            />
            <div className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 text-[#54708F] pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* DESKTOP-ONLY ACTIONS (Track Order, Language Switcher, Login, Cart) */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-5 shrink-0">
          {/* TRACK ORDER BUTTON */}
          <button
            type="button"
            onClick={() => {
              setShowTrackModal(true);
              setTrackedResult(null);
            }}
            className="h-[50px] bg-[#1299E8] hover:bg-[#0e8cd6] active:bg-[#0b78b9] text-white text-[15px] font-semibold rounded-[6px] border-none px-4 sm:px-5 flex items-center gap-2.5 cursor-pointer shrink-0 transition-colors focus:outline-none select-none"
          >
            <Truck className="w-[22px] h-[22px] text-white shrink-0" />
            <span className="text-white whitespace-nowrap">{t.trackOrder}</span>
          </button>

          {/* LANGUAGE SWITCHER */}
          <div className="flex items-center bg-white/15 p-1 rounded-[8px] gap-1.5 select-none shrink-0">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-[#1299E8] shadow-xs font-bold'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all cursor-pointer ${
                lang === 'bn'
                  ? 'bg-white text-[#1299E8] shadow-xs font-bold'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="button"
            className="h-[50px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-[15px] font-semibold rounded-[6px] border-none px-4 sm:px-5 flex items-center gap-2.5 cursor-pointer select-none transition-colors focus:outline-none shrink-0"
          >
            <User className="w-[22px] h-[22px] text-white shrink-0" />
            <span className="text-white text-[15px] font-semibold">{t.login}</span>
          </button>

          {/* CART BUTTON */}
          <button
            type="button"
            onClick={() => setShowCartDrawer(true)}
            className="h-[50px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white text-[15px] font-semibold rounded-[6px] border-none px-4 sm:px-5 flex items-center gap-2.5 cursor-pointer select-none transition-colors focus:outline-none shrink-0"
          >
            <ShoppingCart className="w-[22px] h-[22px] text-white shrink-0" />
            <span className="text-white text-[15px] font-semibold">{t.cart}</span>
            <span className="bg-white text-[#1299E8] text-[12px] font-bold w-[22px] h-[22px] rounded-full flex items-center justify-center ml-0.5 shrink-0">
              {cartItemCount}
            </span>
          </button>
        </div>
      </header>

      {currentView === 'cart' ? (
        <CartPage
          cart={cart}
          lang={lang}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={() => navigateTo('checkout')}
          onContinueShopping={() => navigateTo('shop')}
          deliveryCharge={DEFAULT_DELIVERY_CHARGE}
        />
      ) : currentView === 'checkout' ? (
        <CheckoutPage
          cart={cart}
          lang={lang}
          deliveryCharge={DEFAULT_DELIVERY_CHARGE}
          onPlaceOrder={handleOrderSuccess}
          onReturnToCart={() => navigateTo('cart')}
          onContinueShopping={() => navigateTo('shop')}
        />
      ) : currentView === 'order-complete' ? (
        <OrderCompletePage
          order={latestOrder}
          lang={lang}
          onTrackOrder={(orderId) => {
            setOrderQuery(orderId);
            setShowTrackModal(true);
            setTrackedResult(true);
          }}
          onContinueShopping={() => navigateTo('shop')}
        />
      ) : selectedProduct !== null ? (
        /* PRODUCT DETAILS PAGE */
        <div className="w-full flex flex-col min-h-[60vh] bg-[#FFFFFF] animate-in fade-in duration-300">
          {/* BREADCRUMB */}
          <div className="w-full bg-gray-50 border-b border-gray-100 py-3.5 px-5 sm:px-8 lg:px-10">
            <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500 font-medium select-none">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedCategoryIndex(null);
                }}
                className="hover:text-[#1299E8] transition-colors cursor-pointer focus:outline-none font-bold"
              >
                {lang === 'en' ? 'Home' : 'হোম'}
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => {
                  setSelectedCategoryIndex(selectedProduct.categoryIndex);
                  setSelectedProduct(null);
                }}
                className="hover:text-[#1299E8] transition-colors cursor-pointer focus:outline-none font-bold"
              >
                {t.categories[selectedProduct.categoryIndex].name}
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-gray-800 font-semibold truncate max-w-[150px] sm:max-w-none">
                {lang === 'en' ? selectedProduct.name : selectedProduct.bnName}
              </span>
            </div>
          </div>

          {/* MAIN PRODUCT BODY */}
          <div className="w-full px-5 sm:px-8 lg:px-10 py-8 lg:py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* LEFT COLUMN: Image & Thumbnails */}
              <div className="lg:col-span-5 flex flex-col items-start">
                <div className="w-full aspect-square sm:max-h-[480px] rounded-[12px] border border-gray-200/80 overflow-hidden bg-gray-50 flex items-center justify-center relative shadow-xs">
                  <img
                    src={mainProductImage || selectedProduct.image}
                    alt={lang === 'en' ? selectedProduct.name : selectedProduct.bnName}
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct.oldPrice && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider select-none shadow-xs">
                      {lang === 'en' ? 'Sale' : 'অফারের পণ্য'}
                    </span>
                  )}
                </div>

                {/* Thumbnails row */}
                <div className="flex flex-wrap gap-2.5 mt-4 select-none">
                  {[selectedProduct.image, ...getProductExtraInfo(selectedProduct.name, lang).images].map((thumb, tIdx) => (
                    <button
                      key={tIdx}
                      onClick={() => setMainProductImage(thumb)}
                      className={`w-[64px] h-[64px] rounded-[8px] border overflow-hidden transition-all bg-white cursor-pointer focus:outline-none ${
                        (mainProductImage || selectedProduct.image) === thumb 
                          ? 'border-[#1299E8] ring-2 ring-[#1299E8]/10' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Info & Actions */}
              <div className="lg:col-span-7 flex flex-col space-y-5 lg:space-y-6">
                <div>
                  {/* Category Link Tag */}
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1299E8] select-none">
                    {t.categories[selectedProduct.categoryIndex].name}
                  </span>
                  
                  {/* Product Title */}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight mt-1">
                    {lang === 'en' ? selectedProduct.name : selectedProduct.bnName}
                  </h1>

                  {/* Rating placeholder */}
                  <div className="flex items-center gap-2 mt-2 select-none">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, rI) => (
                        <svg key={rI} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-semibold pt-0.5">
                      ({getProductExtraInfo(selectedProduct.name, lang).reviewCount} {lang === 'en' ? 'reviews' : 'রিভিউ'})
                    </span>
                  </div>
                </div>

                {/* Short Desc */}
                <p className="text-sm text-gray-500 leading-relaxed font-normal">
                  {lang === 'en' ? selectedProduct.desc : selectedProduct.bnDesc}
                </p>

                {/* Price Block */}
                <div className="border-y border-gray-100 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1299E8] tracking-tight">
                      ৳{selectedProduct.price}
                    </span>
                    {selectedProduct.oldPrice && (
                      <>
                        <span className="text-sm sm:text-base font-normal text-gray-400 line-through">
                          ৳{selectedProduct.oldPrice}
                        </span>
                        <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-0.5 rounded border border-red-100">
                          {lang === 'en' 
                            ? `Save ${Math.round(((selectedProduct.oldPrice - selectedProduct.price) / selectedProduct.oldPrice) * 100)}%`
                            : `${Math.round(((selectedProduct.oldPrice - selectedProduct.price) / selectedProduct.oldPrice) * 100)}% ছাড়`}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock tag */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      {lang === 'en' ? 'In Stock' : 'স্টকে রয়েছে'}
                    </span>
                  </div>
                </div>

                {/* COLOR & SIZE SELECTORS */}
                {(activeProductExtra?.colors || activeProductExtra?.sizes) && (
                  <div className="flex flex-col space-y-4 border-b border-gray-100 pb-5 select-none">
                    {/* Colors */}
                    {activeProductExtra?.colors && activeProductExtra.colors.length > 0 && (
                      <div className="flex flex-col space-y-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {lang === 'en' ? 'Select Color:' : 'রং নির্বাচন করুন:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeProductExtra.colors.map((color, cIdx) => (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => setSelectedColor(color)}
                              className={`h-[34px] px-4 rounded-[6px] text-xs font-bold transition-all whitespace-nowrap cursor-pointer focus:outline-none ${
                                selectedColor === color
                                  ? 'bg-[#1299E8] text-white shadow-xs'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sizes */}
                    {activeProductExtra?.sizes && activeProductExtra.sizes.length > 0 && (
                      <div className="flex flex-col space-y-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {lang === 'en' ? 'Select Size:' : 'সাইজ নির্বাচন করুন:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeProductExtra.sizes.map((size, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => setSelectedSize(size)}
                              className={`h-[34px] px-4 rounded-[6px] text-xs font-bold transition-all whitespace-nowrap cursor-pointer focus:outline-none ${
                                selectedSize === size
                                  ? 'bg-[#1299E8] text-white shadow-xs'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity Control & Cart Buttons */}
                <div className="space-y-4">
                  {/* Quantity title */}
                  <div className="flex items-center gap-3 select-none">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {lang === 'en' ? 'Quantity:' : 'পরিমাণ:'}
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-[6px] bg-white h-[36px] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setProductQty(prev => Math.max(1, prev - 1))}
                        className="px-3 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors font-bold cursor-pointer focus:outline-none"
                      >
                        −
                      </button>
                      <span className="w-[36px] text-center text-xs font-bold select-none">
                        {productQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setProductQty(prev => prev + 1)}
                        className="px-3 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors font-bold cursor-pointer focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Checkout buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {/* Add to Cart button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(selectedProduct, productQty, selectedColor, selectedSize)}
                      className="h-[52px] bg-[#1299E8]/10 hover:bg-[#1299E8]/15 text-[#1299E8] font-bold text-base rounded-[8px] border-none flex items-center justify-center gap-2.5 cursor-pointer transition-colors focus:outline-none select-none shadow-xs"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>{lang === 'en' ? 'Add to Cart' : 'কার্টে যোগ করুন'}</span>
                    </button>

                    {/* Buy Now button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleAddToCart(selectedProduct, productQty, selectedColor, selectedSize);
                        setShowCartDrawer(false);
                        navigateTo('checkout');
                      }}
                      className="h-[52px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-bold text-base rounded-[8px] border-none flex items-center justify-center gap-2.5 cursor-pointer transition-colors focus:outline-none select-none shadow-xs"
                    >
                      <span>{lang === 'en' ? 'Buy Now' : 'এখনই কিনুন'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT SPECIFICATIONS, KEY FEATURES, DELIVERY INFO */}
            <div className="max-w-7xl mx-auto border-t border-gray-100 mt-10 pt-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* Left side: Description, Features & Specs */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Full Description */}
                  <div>
                    <h2 className="text-lg font-bold text-[#222222] mb-3">
                      {lang === 'en' ? 'Product Description' : 'প্রোডাক্ট বিবরণী'}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {getProductExtraInfo(selectedProduct.name, lang).fullDesc}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h2 className="text-lg font-bold text-[#222222] mb-3.5">
                      {lang === 'en' ? 'Key Features' : 'মূল বৈশিষ্ট্যসমূহ'}
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 font-normal">
                      {getProductExtraInfo(selectedProduct.name, lang).features.map((feat, fI) => (
                        <li key={fI} className="flex items-start gap-2">
                          <span className="text-[#1299E8] font-bold text-base line-height-[1] select-none">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h2 className="text-lg font-bold text-[#222222] mb-3.5">
                      {lang === 'en' ? 'Specifications' : 'টেকনিক্যাল স্পেসিফিকেশন'}
                    </h2>
                    <div className="border border-gray-200/80 rounded-[8px] overflow-hidden">
                      {Object.entries(getProductExtraInfo(selectedProduct.name, lang).specs).map(([label, val], sI) => (
                        <div key={sI} className={`grid grid-cols-3 text-sm font-normal py-3 px-4 ${sI % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} ${sI > 0 ? 'border-t border-gray-100' : ''}`}>
                          <span className="col-span-1 text-gray-500 font-semibold">{label}</span>
                          <span className="col-span-2 text-gray-800 font-bold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Delivery Information */}
                <div className="lg:col-span-4 bg-gray-50/40 border border-gray-200/60 rounded-[12px] p-5 h-fit select-none">
                  <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200/80 pb-2">
                    {lang === 'en' ? 'Delivery Information' : 'ডেলিভারি তথ্য'}
                  </h3>
                  <div className="space-y-4">
                    {/* COD Info */}
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-emerald-50 rounded-full h-fit border border-emerald-100 shrink-0 text-emerald-600">
                        <svg className="w-5 h-5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">
                          {lang === 'en' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি'}
                        </h4>
                        <p className="text-xs text-gray-500 font-normal leading-relaxed mt-0.5">
                          {lang === 'en' ? 'Available all across Bangladesh. Check your product before paying.' : 'সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। পণ্য দেখে মূল্য পরিশোধ করুন।'}
                        </p>
                      </div>
                    </div>

                    {/* Express Delivery */}
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-blue-50 rounded-full h-fit border border-blue-100 shrink-0 text-[#1299E8]">
                        <svg className="w-5 h-5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">
                          {lang === 'en' ? 'Super Fast Delivery' : 'দ্রুত ডেলিভারি'}
                        </h4>
                        <p className="text-xs text-gray-500 font-normal leading-relaxed mt-0.5">
                          {lang === 'en' ? 'Dhaka: 24-48 Hours. Outside Dhaka: 2-3 Days.' : 'ঢাকা সিটি: ২৪-৪৮ ঘণ্টা। ঢাকার বাইরে: ২-৩ দিন।'}
                        </p>
                      </div>
                    </div>

                    {/* Exchange policy */}
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-amber-50 rounded-full h-fit border border-amber-100 shrink-0 text-amber-600">
                        <svg className="w-5 h-5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H19" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">
                          {lang === 'en' ? 'Easy Return Policy' : 'সহজ রিটার্ন পলিসি'}
                        </h4>
                        <p className="text-xs text-gray-500 font-normal leading-relaxed mt-0.5">
                          {lang === 'en' ? 'Hassle-free 7-day exchange or refund if any defect is found.' : 'পণ্য কোনো ত্রুটিপূর্ণ হলে ৭ দিনের মধ্যে সহজে রিটার্ন বা পরিবর্তন করুন।'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS SECTION */}
          <div className="w-full bg-[#FFFFFF] px-5 sm:px-8 lg:px-10 py-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {lang === 'en' ? 'Related Products' : 'সম্পর্কিত অন্যান্য প্রোডাক্টস'}
              </h2>
              {dbProducts.filter(p => p.categoryIndex === selectedProduct.categoryIndex && p.name !== selectedProduct.name).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {dbProducts.filter(p => p.categoryIndex === selectedProduct.categoryIndex && p.name !== selectedProduct.name).map((relProd, relIdx) => (
                    <div
                      key={relIdx}
                      onClick={() => handleOpenProduct(relProd)}
                      className="bg-white rounded-[10px] border border-gray-200/80 hover:border-[#1299E8]/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden select-none cursor-pointer"
                    >
                      {/* Product Image Area */}
                      <div className="w-full h-[140px] sm:h-[150px] lg:h-[160px] overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100 relative">
                        <img
                          src={relProd.image}
                          alt={lang === 'en' ? relProd.name : relProd.bnName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details Container */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Product Name */}
                          <h3 className="text-[13px] sm:text-[13.5px] font-semibold text-gray-800 line-clamp-1 mb-1">
                            {lang === 'en' ? relProd.name : relProd.bnName}
                          </h3>
                          {/* Short Description */}
                          <p className="text-[11.5px] font-normal text-gray-500 line-clamp-1 mb-2.5">
                            {lang === 'en' ? relProd.desc : relProd.bnDesc}
                          </p>
                        </div>

                        <div>
                          {/* Price Block */}
                          <div className="flex items-baseline gap-1.5 mb-3">
                            <span className="text-[15px] sm:text-[16px] font-bold text-[#1299E8] tracking-tight">
                              ৳{relProd.price}
                            </span>
                            {relProd.oldPrice && (
                              <span className="text-[11px] sm:text-[11.5px] font-normal text-gray-400 line-through">
                                ৳{relProd.oldPrice}
                              </span>
                            )}
                          </div>

                          {/* Add to Cart */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(relProd, 1);
                            }}
                            className="w-full h-[32px] bg-[#1299E8]/10 text-[#1299E8] hover:bg-[#1299E8] hover:text-white font-semibold text-[11px] rounded-[5px] border-none flex items-center justify-center gap-1.5 cursor-pointer transition-colors focus:outline-none"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{t.addToCart}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 font-normal italic">
                  {lang === 'en' ? 'No related products found.' : 'অন্য কোনো সম্পর্কিত প্রোডাক্ট পাওয়া যায়নি।'}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : selectedCategoryIndex !== null ? (
        /* CATEGORY PRODUCTS PAGE */
        <div className="w-full flex flex-col min-h-[60vh] bg-white animate-in fade-in duration-300">
          {/* BREADCRUMB */}
          <div className="w-full bg-gray-50 border-b border-gray-100 py-3.5 px-5 sm:px-8 lg:px-10">
            <div className="w-full flex items-center gap-2 text-xs text-gray-500 font-medium select-none">
              <button
                onClick={() => setSelectedCategoryIndex(null)}
                className="hover:text-[#1299E8] transition-colors cursor-pointer focus:outline-none font-bold"
              >
                {lang === 'en' ? 'Home' : 'হোম'}
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-gray-400">{lang === 'en' ? 'Categories' : 'ক্যাটাগরি'}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-800 font-semibold">{t.categories[selectedCategoryIndex].name}</span>
            </div>
          </div>

          {/* CATEGORY HEADER */}
          <div className="w-full bg-[#FFFFFF] px-5 sm:px-8 lg:px-10 pt-8 pb-4">
            <div className="w-full flex flex-col space-y-4">
              {/* Back button */}
              <button
                onClick={() => setSelectedCategoryIndex(null)}
                className="self-start flex items-center gap-1.5 text-xs text-[#1299E8] font-bold hover:underline cursor-pointer focus:outline-none select-none"
              >
                <span>←</span>
                <span>{lang === 'en' ? 'Back to Shopping' : 'কেনাকাটায় ফিরে যান'}</span>
              </button>

              {/* Category Info */}
              <div className="pt-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#222222] tracking-tight">
                  {t.categories[selectedCategoryIndex].name}
                </h1>
                <p className="text-[14px] sm:text-base text-[#54708F] font-normal leading-relaxed max-w-2xl mt-2">
                  {categoryDescriptions[lang][selectedCategoryIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* FILTER / SORT AREA */}
          <div className="w-full bg-[#FFFFFF] px-5 sm:px-8 lg:px-10 py-5 border-y border-gray-100">
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left side info */}
              <div className="text-sm font-bold text-gray-700">
                {lang === 'en' 
                  ? `Showing all ${filteredProducts.length} products` 
                  : `সবগুলো (${filteredProducts.length}টি) প্রোডাক্ট দেখানো হচ্ছে`}
              </div>

              {/* Right side Sort dropdown */}
              <div className="flex items-center gap-2 select-none shrink-0">
                <span className="text-[13px] font-bold text-gray-500">
                  {lang === 'en' ? 'Sort By:' : 'সাজান:'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-[36px] bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-[6px] px-3 outline-none focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8] cursor-pointer"
                >
                  <option value="popular">{lang === 'en' ? 'Popular' : 'জনপ্রিয়'}</option>
                  <option value="newest">{lang === 'en' ? 'Newest' : 'নতুন সংযোজন'}</option>
                  <option value="low-high">{lang === 'en' ? 'Price: Low to High' : 'দাম: কম থেকে বেশি'}</option>
                  <option value="high-low">{lang === 'en' ? 'Price: High to Low' : 'দাম: বেশি থেকে কম'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Horizontal category quick switcher pills */}
          <div className="w-full bg-gray-50/40 px-5 sm:px-8 lg:px-10 py-3 border-b border-gray-100 overflow-x-auto custom-scrollbar flex items-center">
            <div className="w-full flex items-center gap-2 shrink-0 select-none">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase shrink-0 mr-1.5">
                {lang === 'en' ? 'Explore Categories:' : 'ক্যাটাগরি ব্রাউজ করুন:'}
              </span>
              {t.categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategoryIndex(idx)}
                  className={`h-[30px] px-3.5 rounded-[6px] text-xs font-bold transition-all whitespace-nowrap cursor-pointer focus:outline-none ${
                    selectedCategoryIndex === idx
                      ? 'bg-[#1299E8] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:text-[#1299E8] hover:border-[#1299E8]/30'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="w-full bg-[#FFFFFF] px-5 sm:px-8 lg:px-10 py-10">
            <div className="w-full">
              {filteredProducts.length > 0 ? (
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {filteredProducts.map((prod, idx) => {
                    return (
                      <div
                        key={idx}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.closest('button')) return;
                          const match = DEMO_PRODUCTS.find(p => p.name === prod.name || p.bnName === prod.name);
                          if (match) handleOpenProduct(match);
                        }}
                        className="bg-white rounded-[10px] border border-gray-200/80 hover:border-[#1299E8]/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden select-none cursor-pointer"
                      >
                        {/* Product Image Area */}
                        <div className="w-full h-[140px] sm:h-[150px] lg:h-[160px] overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100 relative">
                          <img
                            src={prod.image}
                            alt={lang === 'en' ? prod.name : prod.bnName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details Container */}
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Product Name */}
                            <h3 className="text-[13px] sm:text-[13.5px] font-semibold text-gray-800 line-clamp-1 mb-1">
                              {lang === 'en' ? prod.name : prod.bnName}
                            </h3>
                            {/* Short Description */}
                            <p className="text-[11.5px] font-normal text-gray-500 line-clamp-1 mb-2.5">
                              {lang === 'en' ? prod.desc : prod.bnDesc}
                            </p>
                          </div>

                          <div>
                            {/* Price Block */}
                            <div className="flex items-baseline gap-1.5 mb-3">
                              <span className="text-[15px] sm:text-[16px] font-bold text-[#1299E8] tracking-tight">
                                ৳{prod.price}
                              </span>
                              {prod.oldPrice && (
                                <span className="text-[11px] sm:text-[11.5px] font-normal text-gray-400 line-through">
                                  ৳{prod.oldPrice}
                                </span>
                              )}
                            </div>

                            {/* Dynamic Add to Cart button */}
                            <button
                              type="button"
                              onClick={() => {
                                const match = DEMO_PRODUCTS.find(p => p.name === prod.name || p.bnName === prod.name);
                                if (match) handleAddToCart(match, 1);
                              }}
                              className="w-full h-[32px] bg-[#1299E8]/10 text-[#1299E8] hover:bg-[#1299E8] hover:text-white font-semibold text-[11px] rounded-[5px] border-none flex items-center justify-center gap-1.5 cursor-pointer select-none transition-colors focus:outline-none"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{t.addToCart}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* EMPTY STATE */
                <div className="w-full flex flex-col items-center justify-center text-center py-20 select-none">
                  <div className="w-[80px] h-[80px] bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-5 shadow-xs">
                    <ShoppingCart className="w-8 h-8 text-gray-300 stroke-[1.5]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {lang === 'en' ? 'No products found' : 'কোনো প্রোডাক্ট পাওয়া যায়নি'}
                  </h2>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed max-w-sm mb-8">
                    {lang === 'en' 
                      ? 'Products from this category will appear here soon.' 
                      : 'এই ক্যাটাগরির প্রোডাক্টগুলো খুব শীঘ্রই এখানে যোগ করা হবে।'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryIndex(null)}
                    className="h-[46px] px-8 bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-semibold text-sm rounded-[6px] shadow-xs flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
                  >
                    {lang === 'en' ? 'Back to Shopping' : 'কেনাকাটায় ফিরে যান'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* FULL-WIDTH HERO SECTION */}
        <section className="w-full bg-[#FFFFFF] px-4 sm:px-8 lg:px-16 xl:px-20 pt-6 pb-2 sm:pt-8 sm:pb-3 lg:pt-12 lg:pb-3 flex items-center border-none overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#222222] leading-[1.2] lg:leading-[1.15] tracking-tight">
              {t.heroHeadline}
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-[#54708F] leading-relaxed max-w-xl">
              {t.heroSubtext}
            </p>
            <div className="pt-1 sm:pt-3 w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto h-[50px] sm:h-[56px] bg-[#1299E8] hover:bg-[#0e8cd6] active:bg-[#0b78b9] text-white text-[16px] sm:text-[18px] font-semibold rounded-[8px] px-8 sm:px-10 border-none flex items-center justify-center cursor-pointer transition-colors focus:outline-none select-none shadow-xs"
              >
                {t.heroCta}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: FULL-WIDTH SMOOTH HORIZONTAL CAROUSEL */}
          <div className="lg:col-span-7 flex items-center justify-center w-full">
            <div
              className="group relative w-full h-[220px] xs:h-[260px] sm:h-[380px] lg:h-[500px] xl:h-[550px] overflow-hidden rounded-[14px] sm:rounded-[20px] shadow-xs select-none bg-gray-50"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* HORIZONTAL SLIDE TRACK */}
              <div
                className="flex w-full h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselImages.map((image, index) => (
                  <div key={index} className="w-full h-full flex-shrink-0 relative">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-[14px] sm:rounded-[20px]"
                    />
                  </div>
                ))}
              </div>

              {/* HOVER NAVIGATION ARROWS */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-2.5 rounded-full cursor-pointer shadow-md focus:outline-none"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-2.5 rounded-full cursor-pointer shadow-md focus:outline-none"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* PAGINATION DOTS */}
              <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`transition-all duration-300 cursor-pointer focus:outline-none ${
                      index === currentSlide
                        ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-[#1299E8] rounded-full'
                        : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-300 hover:bg-gray-400 rounded-full'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES SECTION */}
      <section className="w-full bg-[#FFFFFF] px-4 sm:px-8 lg:px-10 pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-16">
        {/* HEADING WITH THIN HORIZONTAL DIVIDER LINE BEHIND */}
        <div className="relative flex items-center justify-center mb-6 sm:mb-10 w-full">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-[#FFFFFF] px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#222222] tracking-tight text-center">
              {t.categoriesTitle}
            </h2>
          </div>
        </div>

        {/* RESPONSIVE 3-COLUMN GRID ON MOBILE / 9-COLUMN ROW ON DESKTOP */}
        <div className="w-full grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3 lg:gap-3 xl:gap-4">
          {t.categories.map((cat, idx) => {
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCategoryIndex(idx);
                  setSelectedProduct(null);
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full h-[125px] sm:h-[145px] lg:h-[165px] flex flex-col items-center justify-between p-1.5 sm:p-2.5 rounded-[8px] border border-gray-200 lg:hover:border-[#1299E8] bg-white select-none shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer transition-all"
              >
                {/* Image container */}
                <div className="w-full h-[78px] sm:h-[95px] lg:h-[112px] overflow-hidden rounded-[6px] bg-gray-50 flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Bold, black name directly below, truncated with ellipsis */}
                <span className="w-full text-center text-[11px] sm:text-[12.5px] lg:text-[13.5px] font-bold text-[#222222] truncate px-0.5 mt-0.5 sm:mt-1">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRENDING FINDS SECTION */}
      <section className="w-full bg-[#FFFFFF] px-4 sm:px-8 lg:px-10 pt-6 pb-12 sm:pb-16 border-t border-gray-50">
        {/* HEADING WITH THIN HORIZONTAL DIVIDER LINE BEHIND */}
        <div className="relative flex items-center justify-center mb-2 w-full">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-[#FFFFFF] px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight text-center">
              {t.trendingTitle}
            </h2>
          </div>
        </div>
        
        {/* SUBTITLE */}
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            {t.trendingSubtitle}
          </p>
        </div>

        {/* RESPONSIVE 2-COLUMN GRID ON MOBILE / 5-COLUMN ON DESKTOP */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
          {t.trendingProducts.map((prod, idx) => {
            return (
              <div
                key={idx}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button')) return;
                  const match = DEMO_PRODUCTS.find(p => p.name === prod.name || p.bnName === prod.name);
                  if (match) handleOpenProduct(match);
                }}
                className="bg-white rounded-[10px] sm:rounded-[12px] border border-gray-200/80 hover:border-[#1299E8]/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden select-none cursor-pointer"
              >
                {/* Product Image Area */}
                <div className="w-full h-[135px] sm:h-[170px] lg:h-[200px] overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100 relative">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details Container */}
                <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Product Name */}
                    <h3 className="text-[13px] sm:text-[14px] lg:text-[14.5px] font-semibold text-gray-800 line-clamp-1 mb-0.5 sm:mb-1">
                      {prod.name}
                    </h3>
                    {/* Short Description */}
                    <p className="text-[11px] sm:text-[12px] font-normal text-gray-500 line-clamp-1 mb-2 sm:mb-3">
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    {/* Price Block */}
                    <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                      <span className="text-[14px] sm:text-[16px] lg:text-[17px] font-bold text-[#1299E8] tracking-tight">
                        ৳{prod.price}
                      </span>
                      {prod.oldPrice && (
                        <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-normal text-gray-400 line-through">
                          ৳{prod.oldPrice}
                        </span>
                      )}
                    </div>

                    {/* Dynamic Add to Cart button */}
                    <button
                      type="button"
                      onClick={() => {
                        const match = dbProducts.find(p => p.name === prod.name || p.bnName === prod.name);
                        if (match) handleAddToCart(match, 1);
                      }}
                      className="w-full h-[34px] sm:h-[36px] bg-[#1299E8]/10 text-[#1299E8] hover:bg-[#1299E8] hover:text-white font-semibold text-[11px] sm:text-xs rounded-[6px] border-none flex items-center justify-center gap-1.5 cursor-pointer transition-colors focus:outline-none"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="w-full bg-[#FFFFFF] px-4 sm:px-8 lg:px-10 pt-6 pb-12 sm:pb-16 border-t border-gray-50">
        {/* HEADING WITH THIN HORIZONTAL DIVIDER LINE BEHIND */}
        <div className="relative flex items-center justify-center mb-2 w-full">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-[#FFFFFF] px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight text-center">
              {t.featuredTitle}
            </h2>
          </div>
        </div>

        {/* SUBTITLE */}
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            {t.featuredSubtitle}
          </p>
        </div>

        {/* 2-COLUMN GRID ON MOBILE / 6-COLUMN GRID ON DESKTOP */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {t.featuredProducts.map((prod, idx) => {
            return (
              <div
                key={idx}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button')) return;
                  const match = dbProducts.find(p => p.name === prod.name || p.bnName === prod.name);
                  if (match) handleOpenProduct(match);
                }}
                className="bg-white rounded-[10px] border border-gray-200/80 hover:border-[#1299E8]/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden select-none cursor-pointer"
              >
                {/* Product Image Area */}
                <div className="w-full h-[130px] sm:h-[150px] lg:h-[160px] overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100 relative">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details Container */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Product Name */}
                    <h3 className="text-[12.5px] sm:text-[13.5px] font-semibold text-gray-800 line-clamp-1 mb-0.5 sm:mb-1">
                      {prod.name}
                    </h3>
                    {/* Short Description */}
                    <p className="text-[11px] sm:text-[11.5px] font-normal text-gray-500 line-clamp-1 mb-2 sm:mb-2.5">
                      {prod.desc}
                    </p>
                  </div>

                  <div>
                    {/* Price Block */}
                    <div className="flex items-baseline gap-1.5 mb-2.5 sm:mb-3">
                      <span className="text-[14px] sm:text-[15px] lg:text-[16px] font-bold text-[#1299E8] tracking-tight">
                        ৳{prod.price}
                      </span>
                      {prod.oldPrice && (
                        <span className="text-[10px] sm:text-[11px] lg:text-[11.5px] font-normal text-gray-400 line-through">
                          ৳{prod.oldPrice}
                        </span>
                      )}
                    </div>

                    {/* Dynamic Add to Cart button */}
                    <button
                      type="button"
                      onClick={() => {
                        const match = dbProducts.find(p => p.name === prod.name || p.bnName === prod.name);
                        if (match) handleAddToCart(match, 1);
                      }}
                      className="w-full h-[32px] sm:h-[34px] bg-[#1299E8]/10 text-[#1299E8] hover:bg-[#1299E8] hover:text-white font-semibold text-[11px] rounded-[5px] border-none flex items-center justify-center gap-1.5 cursor-pointer transition-colors focus:outline-none"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>{t.addToCart}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* LOAD MORE BUTTON AREA */}
        <div className="w-full flex justify-center pt-8 sm:pt-10 pb-4 sm:pb-6">
          <button
            type="button"
            className="w-[140px] h-[40px] bg-white border border-[#1299E8] text-[#1299E8] font-semibold text-xs rounded-[6px] shadow-none flex items-center justify-center cursor-default select-none transition-none"
          >
            {t.loadMore}
          </button>
        </div>
      </section>
        </>
      )}

      {/* FOOTER SECTION */}
      <footer className="w-full bg-gray-50 border-t border-gray-100 px-5 sm:px-10 lg:px-14 xl:px-16 pt-14 pb-8 select-none">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/hue_n_vibes_blue_tight.svg"
                alt="hue n vibes"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/logo.svg') {
                    target.src = '/logo.svg';
                  }
                }}
                className="h-[42px] w-auto object-contain max-w-[200px]"
              />
            </div>
            <p className="text-[13px] text-gray-500 font-normal leading-relaxed max-w-xs pt-1">
              {lang === 'en'
                ? 'Unique, useful and practical products for everyday life, delivered across Bangladesh.'
                : 'দৈনন্দিন জীবনের জন্য চমৎকার, দরকারী এবং বাস্তবমুখী সব ইউনিক গ্যাজেট, সমগ্র বাংলাদেশে ডেলিভারি সহ।'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-gray-800 tracking-wider uppercase">
              {lang === 'en' ? 'Quick Links' : 'গুরুত্বপূর্ণ লিংক'}
            </h3>
            <ul className="space-y-2.5 text-[13px] text-gray-500 font-normal">
              <li>
                <a href="#" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Home' : 'হোম'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Popular Categories' : 'জনপ্রিয় ক্যাটাগরি'}
                </a>
              </li>
              <li>
                <a href="#trending" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Trending Finds' : 'ট্রেন্ডিং প্রোডাক্টস'}
                </a>
              </li>
              <li>
                <a href="#featured" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Featured Products' : 'ফিচার্ড প্রোডাক্টস'}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setShowTrackModal(true)}
                  className="hover:text-[#1299E8] transition-colors cursor-pointer text-left focus:outline-none"
                >
                  {t.trackOrder}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-gray-800 tracking-wider uppercase">
              {lang === 'en' ? 'Customer Service' : 'গ্রাহক সেবা'}
            </h3>
            <ul className="space-y-2.5 text-[13px] text-gray-500 font-normal">
              <li>
                <span className="hover:text-[#1299E8] transition-colors cursor-default">
                  {lang === 'en' ? 'Contact Us' : 'যোগাযোগ করুন'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#1299E8] transition-colors cursor-default">
                  {lang === 'en' ? 'Shipping & Delivery' : 'শিপিং এবং ডেলিভারি'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#1299E8] transition-colors cursor-default">
                  {lang === 'en' ? 'Return & Refund Policy' : 'রিটার্ন ও রিফান্ড পলিসি'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#1299E8] transition-colors cursor-default">
                  {lang === 'en' ? 'Privacy Policy' : 'প্রাইভেসি পলিসি'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#1299E8] transition-colors cursor-default">
                  {lang === 'en' ? 'Terms & Conditions' : 'শর্তাবলী'}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Shop */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-gray-800 tracking-wider uppercase">
              {lang === 'en' ? 'Shop' : 'শপ ক্যাটাগরি'}
            </h3>
            <ul className="space-y-2.5 text-[13px] text-gray-500 font-normal">
              <li>
                <a href="#categories" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Handy Gadgets' : 'হ্যান্ডি গ্যাজেটস'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Home Helpers' : 'হোম হেল্পার্স'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Kitchen Finds' : 'কিচেন ফাইন্ডস'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Smart Utility' : 'স্মার্ট ইউটিলিটি'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Personal Care' : 'পার্সোনাল কেয়ার'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#1299E8] transition-colors">
                  {lang === 'en' ? 'Cleaning Tools' : 'ক্লিনিং টুলস'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-gray-800 tracking-wider uppercase">
              {lang === 'en' ? 'Contact' : 'যোগাযোগ'}
            </h3>
            <div className="space-y-3 text-[13px] text-gray-500 font-normal">
              <p>
                <span className="font-semibold text-gray-700">{lang === 'en' ? 'Helpline' : 'হেল্পলাইন'}:</span>
                <span className="block mt-0.5 font-medium text-gray-800">+880 1700-000000</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="block mt-0.5">support@huenvibes.com</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">{lang === 'en' ? 'Address' : 'ঠিকানা'}:</span>
                <span className="block mt-0.5">Dhaka, Bangladesh</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row with fine line, Copyright and payment trust badges */}
        <div className="w-full border-t border-gray-200/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <p className="text-[12px] text-gray-400 font-normal text-center sm:text-left">
              &copy; 2026 hue n vibes. {t.footerRights}
            </p>
            {showAdminTestButton && (
              <button
                type="button"
                onClick={handleOpenAdminTest}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-[#1299E8] text-[11px] font-medium transition-colors cursor-pointer border border-gray-200"
                title="Temporary development access button for Admin 360"
              >
                <ShieldCheck className="w-3 h-3 text-[#1299E8]" />
                <span>Admin Test</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-500 text-[10.5px] font-medium rounded-[4px] shadow-xs select-none">
              bKash
            </span>
            <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-500 text-[10.5px] font-medium rounded-[4px] shadow-xs select-none">
              Nagad
            </span>
            <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-500 text-[10.5px] font-medium rounded-[4px] shadow-xs select-none">
              Visa / MasterCard
            </span>
            <span className="px-2.5 py-1 bg-[#1299E8]/8 border border-[#1299E8]/20 text-[#1299E8] text-[10.5px] font-semibold rounded-[4px] shadow-xs select-none">
              Cash On Delivery
            </span>
          </div>
        </div>
      </footer>

      {/* ORDER TRACKING MODAL */}
      {showTrackModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3.5 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-[12px] p-5 sm:p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setShowTrackModal(false)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 sm:p-2.5 bg-[#1299E8]/10 rounded-full">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#1299E8]" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t.trackModalTitle}</h2>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5">{t.trackModalDesc}</p>

            <form onSubmit={handleTrackSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder={t.orderIdPlaceholder}
                  className="w-full h-[44px] sm:h-[48px] px-3.5 sm:px-4 rounded-[8px] border border-gray-300 focus:border-[#1299E8] focus:ring-1 focus:ring-[#1299E8] outline-none text-xs sm:text-sm text-gray-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-[44px] sm:h-[48px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-semibold text-xs sm:text-sm rounded-[8px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t.trackBtn}</span>
              </button>
            </form>

            {trackedResult && (() => {
              let matchedOrder: OrderData | null = null;
              try {
                const orders: OrderData[] = JSON.parse(localStorage.getItem('hue_orders') || '[]');
                const qClean = orderQuery.trim().toLowerCase().replace('#', '');
                matchedOrder = orders.find(o => 
                  o.orderId.toLowerCase().replace('#', '').includes(qClean) ||
                  o.customer.phone.includes(qClean)
                ) || null;
              } catch {
                matchedOrder = null;
              }

              if (matchedOrder) {
                return (
                  <div className="mt-5 p-4 bg-blue-50/80 border border-blue-200 rounded-[10px] text-sm text-gray-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                      <div className="flex items-center gap-2 font-bold text-[#1299E8]">
                        <PackageCheck className="w-5 h-5" />
                        <span>{matchedOrder.orderId}</span>
                      </div>
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                        {matchedOrder.orderStatus}
                      </span>
                    </div>
                    <div className="text-xs space-y-1 text-gray-600">
                      <p><span className="font-semibold text-gray-700">{lang === 'en' ? 'Customer: ' : 'গ্রাহক: '}</span>{matchedOrder.customer.fullName} ({matchedOrder.customer.phone})</p>
                      <p><span className="font-semibold text-gray-700">{lang === 'en' ? 'Delivery Address: ' : 'ঠিকানা: '}</span>{matchedOrder.customer.address}, {matchedOrder.customer.area}</p>
                      <p><span className="font-semibold text-gray-700">{lang === 'en' ? 'Total: ' : 'মোট: '}</span>৳{matchedOrder.total} ({matchedOrder.paymentMethod})</p>
                      <p><span className="font-semibold text-gray-700">{lang === 'en' ? 'Items: ' : 'পণ্য: '}</span>{matchedOrder.items.map(i => `${lang === 'en' ? i.name : i.bnName} (×${i.quantity})`).join(', ')}</p>
                    </div>
                    <p className="text-[#1299E8] pt-1 text-xs font-semibold">{t.estimatedDelivery}</p>
                  </div>
                );
              }

              return (
                <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-[8px] text-sm text-blue-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#1299E8]">
                    <PackageCheck className="w-5 h-5" />
                    <span>{t.orderStatusSample}</span>
                  </div>
                  <p className="text-gray-600 pt-1 text-xs">{t.estimatedDelivery}</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-none">
        {/* Semi-transparent Backdrop Overlay */}
        <div
          onClick={() => setShowCartDrawer(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out cursor-pointer pointer-events-auto ${
            showCartDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Sliding Drawer Container */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-[100vw] sm:max-w-[400px] bg-white h-screen shadow-[-10px_0_30px_rgba(0,0,0,0.08)] flex flex-col transform transition-transform duration-300 ease-out pointer-events-auto ${
            showCartDrawer ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* HEADER */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">{t.cartTitle}</h2>
              <span className="bg-[#1299E8]/10 text-[#1299E8] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCartDrawer(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* INNER WRAPPER FOR SCROLLING */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between">
            {cart.length === 0 ? (
              /* INITIAL EMPTY STATE */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-[80px] h-[80px] bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-5 shadow-xs">
                  <ShoppingCart className="w-8 h-8 text-gray-300 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">
                  {t.cartEmptyTitle}
                </h3>
                <p className="text-xs text-gray-500 font-normal leading-relaxed max-w-[240px] mb-8">
                  {t.cartEmptyDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowCartDrawer(false);
                    navigateTo('shop');
                  }}
                  className="w-full h-[46px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-semibold text-sm rounded-[6px] shadow-xs flex items-center justify-center cursor-pointer transition-colors focus:outline-none"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              /* POPULATED STATE */
              <div className="flex flex-col h-full justify-between">
                {/* List of items */}
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
                  {cart.map((item, idx) => {
                    const prodName = lang === 'en' ? item.product.name : item.product.bnName;
                    return (
                      <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-100">
                        {/* Image container */}
                        <div className="w-16 h-16 bg-gray-50 rounded-[6px] overflow-hidden border border-gray-200/60 shrink-0">
                          <img
                            src={item.product.image}
                            alt={prodName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-bold text-gray-800 truncate">{prodName}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 select-none">
                            <p className="text-[12px] text-[#1299E8] font-extrabold">৳{item.product.price}</p>
                            {item.selectedColor && (
                              <span className="text-[9.5px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[9.5px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold">
                                {item.selectedSize}
                              </span>
                            )}
                          </div>
                          
                          {/* Quantity control */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...cart];
                                if (updated[idx].quantity > 1) {
                                  updated[idx].quantity -= 1;
                                  setCart(updated);
                                } else {
                                  updated.splice(idx, 1);
                                  setCart(updated);
                                }
                              }}
                              className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 font-bold select-none cursor-pointer focus:outline-none"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold px-1 select-none">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...cart];
                                updated[idx].quantity += 1;
                                setCart(updated);
                              }}
                              className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 font-bold select-none cursor-pointer focus:outline-none"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...cart];
                            updated.splice(idx, 1);
                            setCart(updated);
                          }}
                          className="text-gray-400 hover:text-red-500 text-xs font-bold transition-colors cursor-pointer select-none focus:outline-none"
                        >
                          {lang === 'en' ? 'Remove' : 'মুছে ফেলুন'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal & checkout */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                    <span>{lang === 'en' ? 'Subtotal' : 'মোট উপ-যোগ'}</span>
                    <span className="text-[#1299E8] text-base font-extrabold">
                      ৳{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}
                    </span>
                  </div>
                  
                  {/* Checkout & View Cart Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCartDrawer(false);
                        navigateTo('checkout');
                      }}
                      className="w-full h-[48px] bg-[#1299E8] hover:bg-[#0e8cd6] text-white font-bold text-sm rounded-[8px] shadow-xs flex items-center justify-center cursor-pointer transition-colors focus:outline-none select-none"
                    >
                      {lang === 'en' ? 'Proceed to Checkout' : 'চেকআউটে যান'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowCartDrawer(false);
                        navigateTo('cart');
                      }}
                      className="w-full h-[42px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-[8px] flex items-center justify-center cursor-pointer transition-colors focus:outline-none select-none"
                    >
                      {lang === 'en' ? 'View Cart' : 'কার্ট দেখুন'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
