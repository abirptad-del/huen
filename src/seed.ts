import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const categories = [
    { id: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781', title: 'Limited Drops', order: 0 },
    { id: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6', title: 'Cotton Stitched', order: 0 },
    { id: '878a3aa8-5639-4a62-a36c-5e5dfc8ea66b', title: 'Cotton Unstitched', order: 0 },
    { id: '3f98d533-5087-453d-bf02-7bc2b9bf5768', title: 'Party Wear Stitched', order: 0 },
    { id: 'a35b5650-08c4-4101-8283-c5b5687214db', title: 'Silk Stitched', order: 0 },
    { id: 'ce299307-97db-414c-b8d4-4dcb43ae2d66', title: 'PK Georgette Stitched', order: 0 },
    { id: 'e8462178-6f94-463b-a64a-d9480e89d825', title: '2pcs Dresses', order: 0 },
    { id: '57527e40-8e5c-44e3-8bc8-646d365144ae', title: 'Premium Silk Saree', order: 0 },
    { id: '2d6c417b-afb6-4feb-b83c-72a88cf44b21', title: '1piece Dresses', order: 0 },
    { id: 'e5ba0002-394e-4494-a3d8-1ce30d2d8f34', title: 'Slub Cotton 1 Piece', order: 0 },
    { id: 'afd7e9ac-d5c3-4d35-9671-b153cfa98458', title: 'KID\'s Casual Outfits', order: 0 }
  ];

  for (const c of categories) {
    const { error } = await supabase.from('categories').upsert({ ...c, createdAt: Date.now() });
    if (error) console.error('Error inserting category', c.id, error);
  }

  const productsRaw = [
    { id: '9101cf2a-2993-4ede-9fbc-cb22aa98fb6a', title: 'Amber Marble', price: 750, original_price: 2500, category_id: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2F5120f67b-f672-4292-8318-8809b6f1c1d0.jpeg&w=3840&q=75'] },
    { id: '1e972650-d96b-4183-acda-dd788de27cf1', title: 'Amethyst Marble', price: 750, original_price: 2500, category_id: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2Fd35c2708-73dd-48a7-92e0-5c13742c8862.webp&w=3840&q=75'] },
    { id: '159b5851-4073-40fb-8c1e-0a1285906f4b', title: 'Violet Marble', price: 750, original_price: 2500, category_id: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2F1b50de1f-e734-4f35-bac0-b65ea09e5c30.webp&w=3840&q=75'] },
    { id: '1810202f-6164-443b-ab64-967dcaa26112', title: 'Charcoal Marble', price: 750, original_price: 2500, category_id: '8ad1619a-85ba-43f8-b81b-f7e28bcd7781', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2F8136cf0a-c67a-4050-95e6-99380cf87877.webp&w=3840&q=75'] },
    { id: '8d862915-c491-4349-9691-b83ed3927ae7', title: 'Fariya TF White', price: 1550, original_price: null, category_id: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2F862fe36b-15cb-4ba6-ab7a-12843ab24435.webp&w=3840&q=75'] },
    { id: '788d1c11-03d9-41b0-97b2-000c6f47fce2', title: 'Parul SadaBahar', price: 1550, original_price: null, category_id: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2F648adc0a-5f7e-4e6f-9f05-ff2c3af4e254.webp&w=3840&q=75'] },
    { id: '219f4bb4-1de0-48f8-a2dc-61cd2b67b263', title: 'Charcoal Floral', price: 1350, original_price: null, category_id: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2Fbc48e041-02f2-4617-8e7d-2dc0d012990f.webp&w=3840&q=75'] },
    { id: '6c8ddc4b-b969-4c8e-8e98-1b82ead2acfd', title: 'Floral Muse', price: 950, original_price: null, category_id: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2Fcecc2995-a09b-4030-bd6a-4eccd7cf62ae.webp&w=3840&q=75'] },
    { id: '7deb7279-50b6-452c-bae7-6169ea507cc3', title: 'Floral Lattice', price: 950, original_price: null, category_id: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2Fd20f7422-84d1-478a-b9d7-baffeb243ca6.webp&w=3840&q=75'] },
    { id: '1ca31cd2-796f-40aa-9a17-a3915cc0d1db', title: 'Laced Arrowhead', price: 950, original_price: null, category_id: '528b5632-c8c0-4c29-a582-2e8acd3a1fd6', images: ['https://mokkahfabrics.com/_next/image?url=https%3A%2F%2Fd38ry6e5iuvq8e.cloudfront.net%2Fuploads%2F13c3eaf6-8d29-404a-9b45-78855296a891.webp&w=3840&q=75'] }
  ];

  for (const p of productsRaw) {
    const product = {
      id: p.id,
      title: p.title,
      price: p.price,
      originalPrice: p.original_price,
      categoryId: p.category_id,
      imageUrl: p.images[0],
      createdAt: Date.now()
    };
    const { error } = await supabase.from('products').upsert(product);
    if (error) console.error('Error inserting product', p.id, error);
  }
  
  console.log('Seeded categories and products successfully.');
}

seed().catch(console.error);
