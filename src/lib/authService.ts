import { supabase, isSupabaseConfigured } from './supabase';

export interface CustomerProfile {
  id?: string;
  auth_user_id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  area?: string;
  created_at?: string;
}

export interface UserOrderHistoryItem {
  id: string;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveryAddress: string;
  deliveryCity: string;
  deliveryArea: string;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

/**
 * Normalize Bangladesh Phone Numbers to 13-digit standard e.g. "88017XXXXXXXX"
 */
export function normalizeBDPhone(rawPhone: string): {
  normalized: string;
  displayPhone: string;
  valid: boolean;
} {
  const digits = rawPhone.replace(/\D/g, '');
  let normDigits = digits;

  if (digits.startsWith('880')) {
    normDigits = digits;
  } else if (digits.startsWith('0')) {
    normDigits = '880' + digits.slice(1);
  } else if (digits.startsWith('1') && digits.length === 10) {
    normDigits = '880' + digits;
  }

  // Valid BD number: starts with 8801[3-9] and total 13 digits
  const valid = /^8801[3-9]\d{8}$/.test(normDigits);
  const localPhone = normDigits.startsWith('880') ? '0' + normDigits.slice(3) : normDigits;
  const displayPhone = valid
    ? `${localPhone.slice(0, 5)}-${localPhone.slice(5)}`
    : rawPhone.trim();

  return { normalized: normDigits, displayPhone, valid };
}

/**
 * Generate synthetic email for Supabase Auth to enable Phone+Password auth without OTP
 */
export function getSyntheticEmail(normalizedDigits: string): string {
  return `${normalizedDigits}@phone.huenvibes.xyz`;
}

/**
 * Log in existing customer with Phone + Password
 */
export async function loginCustomer({
  phone,
  password,
}: {
  phone: string;
  password: string;
}): Promise<{ user: any; profile: CustomerProfile }> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { normalized, displayPhone, valid } = normalizeBDPhone(phone);
  if (!valid) {
    throw new Error('Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678)');
  }

  const syntheticEmail = getSyntheticEmail(normalized);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: syntheticEmail,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('ACCOUNT_NOT_FOUND');
    }
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Login failed. Please try again.');
  }

  const profile = await ensureCustomerProfile(data.user.id, displayPhone, data.user.user_metadata?.full_name);
  return { user: data.user, profile };
}

/**
 * Sign up new customer with Phone + Password
 */
export async function signupCustomer({
  phone,
  password,
  fullName,
}: {
  phone: string;
  password: string;
  fullName: string;
}): Promise<{ user: any; profile: CustomerProfile }> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  const { normalized, displayPhone, valid } = normalizeBDPhone(phone);
  if (!valid) {
    throw new Error('Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678)');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (!fullName || !fullName.trim()) {
    throw new Error('Please enter your full name.');
  }

  const syntheticEmail = getSyntheticEmail(normalized);

  const { data, error } = await supabase.auth.signUp({
    email: syntheticEmail,
    password,
    options: {
      data: {
        phone: displayPhone,
        full_name: fullName.trim(),
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = data.user || data.session?.user;
  if (!user) {
    throw new Error('Signup failed. Please try again.');
  }

  // If session wasn't started automatically, try signing in
  if (!data.session) {
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password,
    });

    const activeUser = signInData?.user || user;
    const profile = await ensureCustomerProfile(activeUser.id, displayPhone, fullName.trim());
    return { user: activeUser, profile };
  }

  const profile = await ensureCustomerProfile(user.id, displayPhone, fullName.trim());
  return { user, profile };
}

/**
 * Unified Login / Signup function
 */
export async function loginOrSignupCustomer({
  phone,
  password,
  fullName,
  mode,
}: {
  phone: string;
  password: string;
  fullName?: string;
  mode: 'login' | 'signup' | 'auto';
}): Promise<{ user: any; profile: CustomerProfile; isNewAccount: boolean }> {
  if (mode === 'signup') {
    const res = await signupCustomer({ phone, password, fullName: fullName || 'Customer' });
    return { ...res, isNewAccount: true };
  }

  try {
    const res = await loginCustomer({ phone, password });
    return { ...res, isNewAccount: false };
  } catch (err: any) {
    if (err.message === 'ACCOUNT_NOT_FOUND' && (mode === 'auto' || mode === 'login')) {
      // If logging in fails because account doesn't exist, try auto-signing up if fullName is provided or ask user
      if (fullName && fullName.trim().length > 0) {
        const res = await signupCustomer({ phone, password, fullName });
        return { ...res, isNewAccount: true };
      } else {
        throw new Error('ACCOUNT_NOT_FOUND');
      }
    }
    throw err;
  }
}

/**
 * Get or Create Customer Record in database for an Auth User ID
 */
export async function ensureCustomerProfile(
  authUserId: string,
  displayPhone: string,
  nameHint?: string
): Promise<CustomerProfile> {
  if (!isSupabaseConfigured()) {
    return {
      auth_user_id: authUserId,
      name: nameHint || 'Valued Customer',
      phone: displayPhone,
    };
  }

  try {
    // 1. Check by auth_user_id
    const { data: existing } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', authUserId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return {
        id: existing.id,
        auth_user_id: existing.auth_user_id,
        name: existing.name,
        phone: existing.phone,
        email: existing.email || '',
        address: existing.address || '',
        city: existing.city || '',
        area: existing.area || '',
        created_at: existing.created_at,
      };
    }

    // 2. Check by phone number
    const { data: existingByPhone } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', displayPhone)
      .limit(1)
      .maybeSingle();

    if (existingByPhone) {
      // Link existing customer row to this auth_user_id
      const { data: updated } = await supabase
        .from('customers')
        .update({ auth_user_id: authUserId, updated_at: new Date().toISOString() })
        .eq('id', existingByPhone.id)
        .select()
        .single();

      if (updated) {
        return {
          id: updated.id,
          auth_user_id: updated.auth_user_id,
          name: updated.name,
          phone: updated.phone,
          email: updated.email || '',
          address: updated.address || '',
          city: updated.city || '',
          area: updated.area || '',
          created_at: updated.created_at,
        };
      }
    }

    // 3. Create new customer profile
    const newProfile = {
      auth_user_id: authUserId,
      name: nameHint || 'Valued Customer',
      phone: displayPhone,
      address: '',
      city: 'Dhaka',
      area: '',
    };

    const { data: created, error: createErr } = await supabase
      .from('customers')
      .insert([newProfile])
      .select()
      .single();

    if (created) {
      return {
        id: created.id,
        auth_user_id: created.auth_user_id,
        name: created.name,
        phone: created.phone,
        email: created.email || '',
        address: created.address || '',
        city: created.city || '',
        area: created.area || '',
        created_at: created.created_at,
      };
    }

    if (createErr) {
      console.warn('Customer creation error:', createErr);
    }

    return {
      auth_user_id: authUserId,
      name: nameHint || 'Valued Customer',
      phone: displayPhone,
    };
  } catch (err) {
    console.error('ensureCustomerProfile error:', err);
    return {
      auth_user_id: authUserId,
      name: nameHint || 'Valued Customer',
      phone: displayPhone,
    };
  }
}

/**
 * Get current logged in customer profile
 */
export async function getCurrentCustomerProfile(): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const user = userData.user;
    const userPhone = user.user_metadata?.phone || user.phone || '01700000000';
    const userName = user.user_metadata?.full_name || 'Valued Customer';

    return await ensureCustomerProfile(user.id, userPhone, userName);
  } catch (err) {
    console.warn('getCurrentCustomerProfile error:', err);
    return null;
  }
}

/**
 * Update Customer Profile (Name, Address, City, Area)
 */
export async function updateCustomerProfile(
  authUserId: string,
  updates: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    area?: string;
  }
): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('auth_user_id', authUserId)
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { data: updated } = await supabase
        .from('customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updated) {
        return {
          id: updated.id,
          auth_user_id: updated.auth_user_id,
          name: updated.name,
          phone: updated.phone,
          email: updated.email || '',
          address: updated.address || '',
          city: updated.city || '',
          area: updated.area || '',
          created_at: updated.created_at,
        };
      }
    }
    return null;
  } catch (err) {
    console.error('updateCustomerProfile error:', err);
    return null;
  }
}

/**
 * Fetch Order History for a Customer
 */
export async function fetchCustomerOrders(authUserId: string): Promise<UserOrderHistoryItem[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    // 1. Get customer ID
    const { data: customer } = await supabase
      .from('customers')
      .select('id, phone')
      .eq('auth_user_id', authUserId)
      .limit(1)
      .maybeSingle();

    if (!customer) return [];

    // 2. Query orders for customer
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false });

    if (error || !orders) return [];

    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      subtotal: Number(o.subtotal),
      deliveryFee: Number(o.delivery_fee),
      discount: Number(o.discount || 0),
      total: Number(o.total),
      paymentMethod: o.payment_method || 'Cash on Delivery',
      orderStatus: o.order_status || 'Pending',
      deliveryAddress: o.delivery_address || '',
      deliveryCity: o.delivery_city || 'Dhaka',
      deliveryArea: o.delivery_area || '',
      createdAt: o.created_at,
      items: (o.order_items || []).map((item: any) => ({
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        total: Number(item.total),
      })),
    }));
  } catch (err) {
    console.error('fetchCustomerOrders error:', err);
    return [];
  }
}

/**
 * Log Out
 */
export async function logoutCustomer(): Promise<void> {
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }
}
