import { supabase, isSupabaseConfigured } from './supabase';
import {
  AdminCategory,
  AdminProduct,
  AdminOrder,
  AdminCustomer,
  AdminCoupon,
  AdminReview,
  StoreSettings,
  getAdminCategories,
  saveAdminCategories,
  getAdminProducts,
  saveAdminProducts,
  getAdminOrders,
  saveAdminOrders,
  getAdminCustomers,
  saveAdminCustomers,
  getAdminCoupons,
  saveAdminCoupons,
  getAdminReviews,
  saveAdminReviews,
  getStoreSettings,
  saveStoreSettings,
} from '../admin/adminStore';

// ==============================================================================
// 1. CATEGORIES SERVICE
// ==============================================================================
export async function fetchCategoriesFromDb(): Promise<AdminCategory[]> {
  if (!isSupabaseConfigured()) {
    return getAdminCategories();
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetchCategories error:', error);
      return [];
    }

    if (!data) return [];

    const mapped: AdminCategory[] = data.map((c, idx) => ({
      id: c.id,
      index: c.sort_order ?? idx,
      name: c.name,
      bnName: c.bengali_name || c.name,
      image: c.image_url || '',
      desc: c.description || '',
      productCount: 0,
      status: c.is_active ? 'Active' : 'Hidden',
    }));

    saveAdminCategories(mapped);
    return mapped;
  } catch (err) {
    console.error('Supabase fetchCategories exception:', err);
    return [];
  }
}

export async function saveCategoryToDb(category: AdminCategory): Promise<void> {
  const current = getAdminCategories();
  const idx = current.findIndex((c) => c.id === category.id || c.index === category.index);
  let updatedList: AdminCategory[];
  if (idx >= 0) {
    updatedList = [...current];
    updatedList[idx] = category;
  } else {
    updatedList = [...current, category];
  }
  saveAdminCategories(updatedList);

  if (!isSupabaseConfigured()) return;

  try {
    const payload = {
      name: category.name,
      bengali_name: category.bnName,
      description: category.desc,
      image_url: category.image,
      sort_order: category.index,
      is_active: category.status === 'Active',
      updated_at: new Date().toISOString(),
    };

    if (category.id && category.id.length > 20) {
      await supabase.from('categories').upsert({ id: category.id, ...payload });
    } else {
      await supabase.from('categories').insert([payload]);
    }
  } catch (err) {
    console.error('Failed to sync category to Supabase:', err);
  }
}

// ==============================================================================
// 2. PRODUCTS SERVICE
// ==============================================================================
export async function fetchProductsFromDb(): Promise<AdminProduct[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please check your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).');
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, sort_order)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProducts error:', error);
      throw new Error(`Failed to query database: ${error.message}`);
    }

    if (!data) return [];

    const mapped: AdminProduct[] = data.map((p) => {
      const cat = p.categories;
      return {
        id: p.id,
        name: p.name,
        bnName: p.bengali_name || p.name,
        desc: p.description || '',
        bnDesc: p.description || '',
        price: Number(p.price),
        oldPrice: p.sale_price ? Number(p.sale_price) : undefined,
        image: p.image_url || '',
        categoryIndex: cat?.sort_order ?? 0,
        categoryName: cat?.name || 'General',
        stock: p.stock ?? 0,
        sku: p.sku || `HNV-${p.id.slice(0, 6).toUpperCase()}`,
        status: (p.status as AdminProduct['status']) || 'Published',
        isPopular: Boolean(p.is_trending),
        isNewest: Boolean(p.is_featured),
        createdAt: p.created_at || new Date().toISOString(),
      };
    });

    saveAdminProducts(mapped);
    return mapped;
  } catch (err: any) {
    console.error('Supabase fetchProducts exception:', err);
    throw err;
  }
}

export async function saveProductToDb(product: AdminProduct, categoryId?: string): Promise<AdminProduct> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Cannot save product.');
  }

  try {
    let resolvedCategoryId = categoryId || null;

    // 1. Resolve categoryIndex to Supabase category UUID if not passed
    if (!resolvedCategoryId) {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('sort_order', product.categoryIndex)
        .limit(1)
        .maybeSingle();

      if (catData) {
        resolvedCategoryId = catData.id;
      } else {
        // fallback to name matching
        const { data: catByName } = await supabase
          .from('categories')
          .select('id')
          .eq('name', product.categoryName)
          .limit(1)
          .maybeSingle();
        if (catByName) {
          resolvedCategoryId = catByName.id;
        }
      }
    }

    // Identify if cover image has been replaced to clean up old one
    let oldImageUrlToClean: string | null = null;
    if (product.id && product.id.length > 20 && !product.id.startsWith('prod-')) {
      const { data: currentProd } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', product.id)
        .limit(1)
        .maybeSingle();

      if (currentProd && currentProd.image_url && currentProd.image_url !== product.image) {
        oldImageUrlToClean = currentProd.image_url;
      }
    }

    const payload = {
      name: product.name,
      bengali_name: product.bnName,
      description: product.desc,
      price: product.price,
      sale_price: product.oldPrice || null,
      sku: product.sku,
      stock: product.stock,
      image_url: product.image,
      is_featured: product.isNewest ?? false,
      is_trending: product.isPopular ?? false,
      status: product.status,
      updated_at: new Date().toISOString(),
      ...(resolvedCategoryId ? { category_id: resolvedCategoryId } : {}),
    };

    let savedRow: any = null;

    if (product.id && product.id.length > 20 && !product.id.startsWith('prod-')) {
      // It's an existing UUID product update
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
        .select('*, categories(id, name, sort_order)')
        .single();
      if (error) throw error;
      savedRow = data;
    } else {
      // It's a new product insert
      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select('*, categories(id, name, sort_order)')
        .single();
      if (error) throw error;
      savedRow = data;
    }

    // Perform safe image cleanups if previous cover was replaced
    if (oldImageUrlToClean) {
      await deleteImageFromSupabase('product-images', oldImageUrlToClean);
    }

    const savedProduct: AdminProduct = {
      id: savedRow.id,
      name: savedRow.name,
      bnName: savedRow.bengali_name || savedRow.name,
      desc: savedRow.description || '',
      bnDesc: savedRow.description || '',
      price: Number(savedRow.price),
      oldPrice: savedRow.sale_price ? Number(savedRow.sale_price) : undefined,
      image: savedRow.image_url || '',
      categoryIndex: savedRow.categories?.sort_order ?? product.categoryIndex,
      categoryName: savedRow.categories?.name || product.categoryName,
      stock: savedRow.stock ?? 0,
      sku: savedRow.sku || `HNV-${savedRow.id.slice(0, 6).toUpperCase()}`,
      status: (savedRow.status as AdminProduct['status']) || 'Published',
      isPopular: Boolean(savedRow.is_trending),
      isNewest: Boolean(savedRow.is_featured),
      createdAt: savedRow.created_at || new Date().toISOString(),
    };

    // Dispatch lightweight sync event for storefront inside same session
    window.dispatchEvent(new CustomEvent('hue_products_updated'));

    return savedProduct;
  } catch (err) {
    console.error('Failed to save product to Supabase:', err);
    throw err;
  }
}

export async function deleteProductFromDb(productId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Cannot delete product.');
  }

  try {
    // 1. Fetch current image URL to clean up safely
    const { data: prod } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', productId)
      .limit(1)
      .maybeSingle();

    // 2. Perform DB delete
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      throw error;
    }

    // 3. Clean up cover image file safely
    if (prod?.image_url) {
      await deleteImageFromSupabase('product-images', prod.image_url);
    }

    // Dispatch lightweight sync event for storefront again after successful deletion
    window.dispatchEvent(new CustomEvent('hue_products_updated'));
  } catch (err) {
    console.error('Failed to delete product from Supabase:', err);
    throw err;
  }
}

// ==============================================================================
// 3. ORDERS SERVICE
// ==============================================================================
export async function fetchOrdersFromDb(): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) {
    return getAdminOrders();
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customers(name, phone, email), order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      saveAdminOrders([]);
      return [];
    }

    const mapped: AdminOrder[] = data.map((o) => {
      const cust = o.customers;
      const items = (o.order_items || []).map((item: any) => ({
        productId: item.product_id || '',
        name: item.product_name || 'Store Item',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80',
        price: Number(item.unit_price),
        quantity: item.quantity,
      }));

      return {
        id: o.id,
        orderNumber: o.order_number,
        customerName: cust?.name || 'Store Customer',
        customerPhone: cust?.phone || '',
        customerEmail: cust?.email || '',
        customerAddress: o.delivery_address || '',
        city: o.delivery_city || 'Dhaka',
        area: o.delivery_area || 'Dhaka City',
        items,
        subtotal: Number(o.subtotal),
        deliveryCharge: Number(o.delivery_fee),
        discount: Number(o.discount || 0),
        total: Number(o.total),
        paymentMethod: (o.payment_method as any) || 'Cash on Delivery',
        paymentStatus: o.order_status === 'Delivered' ? 'Paid' : 'Unpaid',
        status: (o.order_status as AdminOrder['status']) || 'Pending',
        notes: o.customer_note || undefined,
        createdAt: o.created_at || new Date().toISOString(),
      };
    });

    saveAdminOrders(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchOrders exception:', err);
    return [];
  }
}

export async function createOrderInDb(newOrder: {
  orderNumber: string;
  authUserId?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    area: string;
  };
  items: {
    productId?: string;
    name: string;
    bnName?: string;
    image: string;
    price: number;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  discount?: number;
  total: number;
  notes?: string;
}): Promise<AdminOrder> {
  const localOrder: AdminOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: newOrder.orderNumber,
    customerName: newOrder.customer.name,
    customerPhone: newOrder.customer.phone,
    customerEmail: newOrder.customer.email || '',
    customerAddress: newOrder.customer.address,
    city: newOrder.customer.city,
    area: newOrder.customer.area,
    items: newOrder.items.map((i) => ({
      productId: i.productId || '',
      name: i.name,
      bnName: i.bnName,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
    })),
    subtotal: newOrder.subtotal,
    deliveryCharge: newOrder.deliveryCharge,
    discount: newOrder.discount || 0,
    total: newOrder.total,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    status: 'Pending',
    notes: newOrder.notes,
    createdAt: new Date().toISOString(),
  };

  const existingOrders = getAdminOrders();
  saveAdminOrders([localOrder, ...existingOrders]);

  if (!isSupabaseConfigured()) {
    return localOrder;
  }

  try {
    // 1. Insert/find customer
    let customerId: string | null = null;

    if (newOrder.authUserId) {
      const { data: existingCust } = await supabase
        .from('customers')
        .select('id')
        .eq('auth_user_id', newOrder.authUserId)
        .limit(1)
        .maybeSingle();

      if (existingCust) {
        customerId = existingCust.id;
        // Update profile address and name
        await supabase
          .from('customers')
          .update({
            name: newOrder.customer.name,
            address: newOrder.customer.address,
            city: newOrder.customer.city,
            area: newOrder.customer.area,
            phone: newOrder.customer.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', customerId);
      }
    }

    if (!customerId) {
      // Check by phone
      const { data: phoneCust } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', newOrder.customer.phone)
        .limit(1)
        .maybeSingle();

      if (phoneCust) {
        customerId = phoneCust.id;
        if (newOrder.authUserId) {
          await supabase
            .from('customers')
            .update({
              auth_user_id: newOrder.authUserId,
              name: newOrder.customer.name,
              address: newOrder.customer.address,
              city: newOrder.customer.city,
              area: newOrder.customer.area,
              updated_at: new Date().toISOString(),
            })
            .eq('id', customerId);
        }
      } else {
        const { data: customerData } = await supabase
          .from('customers')
          .insert([
            {
              auth_user_id: newOrder.authUserId || null,
              name: newOrder.customer.name,
              phone: newOrder.customer.phone,
              email: newOrder.customer.email || null,
              address: newOrder.customer.address,
              city: newOrder.customer.city,
              area: newOrder.customer.area,
            },
          ])
          .select('id')
          .single();

        if (customerData) {
          customerId = customerData.id;
        }
      }
    }

    // 2. Insert order
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert([
        {
          order_number: newOrder.orderNumber,
          customer_id: customerId,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryCharge,
          discount: newOrder.discount || 0,
          total: newOrder.total,
          payment_method: 'Cash on Delivery',
          order_status: 'Pending',
          delivery_address: newOrder.customer.address,
          delivery_city: newOrder.customer.city,
          delivery_area: newOrder.customer.area,
          customer_note: newOrder.notes || null,
        },
      ])
      .select('id')
      .single();

    if (orderErr || !orderData) {
      console.warn('Failed to insert order into Supabase:', orderErr);
      return localOrder;
    }

    const orderId = orderData.id;

    // 3. Insert order items (this will also trigger stock auto-decrease via DB trigger)
    const itemsToInsert = newOrder.items.map((item) => ({
      order_id: orderId,
      product_id: item.productId && item.productId.length > 20 ? item.productId : null,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total: item.price * item.quantity,
    }));

    await supabase.from('order_items').insert(itemsToInsert);

    localOrder.id = orderId;
    return localOrder;
  } catch (err) {
    console.error('Error in createOrderInDb:', err);
    return localOrder;
  }
}

export async function updateOrderStatusInDb(
  orderId: string,
  newStatus: AdminOrder['status']
): Promise<void> {
  const currentOrders = getAdminOrders().map((o) => {
    if (o.id === orderId || o.orderNumber === orderId) {
      return {
        ...o,
        status: newStatus,
        paymentStatus: newStatus === 'Delivered' ? ('Paid' as const) : o.paymentStatus,
      };
    }
    return o;
  });
  saveAdminOrders(currentOrders);

  if (!isSupabaseConfigured()) return;

  try {
    await supabase
      .from('orders')
      .update({
        order_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .or(`id.eq.${orderId},order_number.eq.${orderId}`);
  } catch (err) {
    console.error('Failed to update order status in Supabase:', err);
  }
}

// ==============================================================================
// 4. CUSTOMERS SERVICE
// ==============================================================================
export async function fetchCustomersFromDb(): Promise<AdminCustomer[]> {
  if (!isSupabaseConfigured()) {
    return getAdminCustomers();
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*, orders(id, total, created_at)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchCustomers error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      saveAdminCustomers([]);
      return [];
    }

    const mapped: AdminCustomer[] = data.map((c) => {
      const orders = c.orders || [];
      const totalSpent = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
      const lastOrder = orders.sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || '',
        totalOrders: orders.length,
        totalSpent,
        city: `${c.city || 'Dhaka'}${c.area ? ` (${c.area})` : ''}`,
        joinedAt: c.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        lastOrderAt: lastOrder?.created_at?.slice(0, 10) || c.created_at?.slice(0, 10),
      };
    });

    saveAdminCustomers(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchCustomers exception:', err);
    return [];
  }
}

// ==============================================================================
// 5. COUPONS SERVICE
// ==============================================================================
export async function fetchCouponsFromDb(): Promise<AdminCoupon[]> {
  if (!isSupabaseConfigured()) {
    return getAdminCoupons();
  }

  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchCoupons error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      saveAdminCoupons([]);
      return [];
    }

    const mapped: AdminCoupon[] = data.map((c) => ({
      id: c.id,
      code: c.code,
      discountType: (c.discount_type as 'percentage' | 'flat') || 'percentage',
      discountValue: Number(c.discount_value),
      minSpend: Number(c.minimum_spend || 0),
      usageLimit: c.usage_limit || 100,
      usedCount: c.used_count || 0,
      expiresAt: c.expires_at || '2026-12-31',
      status: c.is_active ? 'Active' : 'Disabled',
    }));

    saveAdminCoupons(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchCoupons exception:', err);
    return [];
  }
}

export async function saveCouponToDb(coupon: AdminCoupon): Promise<void> {
  const current = getAdminCoupons();
  const updatedList = [coupon, ...current.filter((c) => c.id !== coupon.id)];
  saveAdminCoupons(updatedList);

  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from('coupons').upsert({
      id: coupon.id && coupon.id.length > 20 ? coupon.id : undefined,
      code: coupon.code,
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
      minimum_spend: coupon.minSpend,
      usage_limit: coupon.usageLimit,
      used_count: coupon.usedCount,
      expires_at: coupon.expiresAt,
      is_active: coupon.status === 'Active',
    });
  } catch (err) {
    console.error('Failed to save coupon to Supabase:', err);
  }
}

export async function deleteCouponFromDb(couponId: string): Promise<void> {
  const current = getAdminCoupons().filter((c) => c.id !== couponId);
  saveAdminCoupons(current);

  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from('coupons').delete().eq('id', couponId);
  } catch (err) {
    console.error('Failed to delete coupon from Supabase:', err);
  }
}

// ==============================================================================
// 6. REVIEWS SERVICE
// ==============================================================================
export async function fetchReviewsFromDb(): Promise<AdminReview[]> {
  if (!isSupabaseConfigured()) {
    return getAdminReviews();
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, products(name), customers(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchReviews error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      saveAdminReviews([]);
      return [];
    }

    const mapped: AdminReview[] = data.map((r) => ({
      id: r.id,
      productName: r.products?.name || 'Store Product',
      customerName: r.customers?.name || 'Verified Customer',
      rating: r.rating,
      comment: r.review,
      date: r.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      status: (r.status as AdminReview['status']) || 'Approved',
      verifiedPurchase: true,
    }));

    saveAdminReviews(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchReviews exception:', err);
    return [];
  }
}

export async function updateReviewStatusInDb(
  reviewId: string,
  status: AdminReview['status']
): Promise<void> {
  const current = getAdminReviews().map((r) => (r.id === reviewId ? { ...r, status } : r));
  saveAdminReviews(current);

  if (!isSupabaseConfigured()) return;

  try {
    await supabase
      .from('reviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reviewId);
  } catch (err) {
    console.error('Failed to update review status in Supabase:', err);
  }
}

// ==============================================================================
// 7. STORE SETTINGS SERVICE
// ==============================================================================
export async function fetchStoreSettingsFromDb(): Promise<StoreSettings> {
  if (!isSupabaseConfigured()) {
    return getStoreSettings();
  }

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return getStoreSettings();
    }

    const mapped: StoreSettings = {
      storeName: data.store_name || 'hue n vibes',
      tagline: 'Smart Gadgets & Modern Lifestyle Store',
      email: data.support_email || 'ecommercemanagement25@gmail.com',
      phone: data.hotline || '+880 1700-000000',
      currency: data.currency_symbol || '৳',
      insideDhakaDelivery: Number(data.inside_dhaka_fee ?? 60),
      outsideDhakaDelivery: Number(data.outside_dhaka_fee ?? 120),
      freeShippingAbove: Number(data.free_delivery_above ?? 2500),
      maintenanceMode: false,
      allowCashOnDelivery: Boolean(data.cod_enabled ?? true),
      showAdminTestButton: Boolean(data.show_admin_test_button ?? true),
    };

    saveStoreSettings(mapped);
    return mapped;
  } catch (err) {
    console.warn('Supabase fetchStoreSettings error, using local fallback:', err);
    return getStoreSettings();
  }
}

export async function updateStoreSettingsInDb(settings: StoreSettings): Promise<void> {
  saveStoreSettings(settings);

  if (!isSupabaseConfigured()) return;

  try {
    const payload = {
      store_name: settings.storeName,
      support_email: settings.email,
      hotline: settings.phone,
      currency_symbol: settings.currency,
      inside_dhaka_fee: settings.insideDhakaDelivery,
      outside_dhaka_fee: settings.outsideDhakaDelivery,
      free_delivery_above: settings.freeShippingAbove,
      cod_enabled: settings.allowCashOnDelivery,
      show_admin_test_button: settings.showAdminTestButton,
      updated_at: new Date().toISOString(),
    };

    // Update first row
    const { data: existing } = await supabase.from('store_settings').select('id').limit(1).single();
    if (existing?.id) {
      await supabase.from('store_settings').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('store_settings').insert([payload]);
    }
  } catch (err) {
    console.error('Failed to update store settings in Supabase:', err);
  }
}

// ==============================================================================
// 8. STORAGE IMAGE UPLOAD HELPER
// ==============================================================================
export async function uploadImageToSupabase(
  bucket: 'product-images' | 'category-images',
  file: File
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Failed to upload image to Supabase storage:', err);
    return null;
  }
}

export async function deleteImageFromSupabase(
  bucket: 'product-images' | 'category-images',
  imageUrl: string
): Promise<void> {
  if (!isSupabaseConfigured() || !imageUrl) return;

  try {
    const searchStr = `/storage/v1/object/public/${bucket}/`;
    const idx = imageUrl.indexOf(searchStr);
    if (idx === -1) return; // Not our bucket file or external placeholder

    const filePath = imageUrl.substring(idx + searchStr.length);
    if (!filePath) return;

    // Check if this image URL is still used by other products before deleting
    if (bucket === 'product-images') {
      const { data: others } = await supabase
        .from('products')
        .select('id')
        .eq('image_url', imageUrl);
      if (others && others.length > 1) {
        // Still used by another product (or same product if editing/not updated yet)
        return;
      }
    }

    const { error: deleteError } = await supabase.storage.from(bucket).remove([filePath]);
    if (deleteError) {
      console.warn('Failed to delete storage file:', deleteError);
    }
  } catch (err) {
    console.error('deleteImageFromSupabase error:', err);
  }
}
