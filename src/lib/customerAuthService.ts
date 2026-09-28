import { supabase, isSupabaseConfigured } from './supabase';
import { AdminOrder } from '../admin/adminStore';

export interface CustomerProfile {
  id: string;
  auth_user_id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  area?: string;
  created_at?: string;
}

/**
 * Normalizes and validates Bangladesh phone numbers
 */
export function normalizeBdPhone(phoneInput: string): {
  valid: boolean;
  local: string; // e.g. 01712345678
  international: string; // e.g. +8801712345678
  formatted: string; // e.g. 01712-345678
  error?: string;
} {
  const cleaned = phoneInput.replace(/[^\d+]/g, '');
  let digits = cleaned.replace(/\D/g, '');

  if (digits.startsWith('880')) {
    digits = digits.slice(2); // keep starting 0 if 8801... -> 01...
    if (!digits.startsWith('0')) {
      digits = '0' + digits;
    }
  }

  if (!digits.startsWith('0') && digits.length === 10) {
    digits = '0' + digits;
  }

  // BD phone numbers must be 11 digits and start with 013-019
  const bdPrefixRegex = /^01[3-9]\d{8}$/;
  if (!bdPrefixRegex.test(digits)) {
    return {
      valid: false,
      local: digits,
      international: '+880' + (digits.startsWith('0') ? digits.slice(1) : digits),
      formatted: digits,
      error: 'Please enter a valid 11-digit Bangladesh phone number (e.g. 017XXXXXXXX)',
    };
  }

  const local = digits;
  const international = '+880' + digits.slice(1);
  const formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;

  return {
    valid: true,
    local,
    international,
    formatted,
  };
}

/**
 * Derives a deterministic auth identifier for phone + password in Supabase Auth
 */
function phoneToAuthEmail(localPhone: string): string {
  return `${localPhone}@customer.huenvibes.xyz`;
}

/**
 * Unified Phone + Password Login and Sign Up Flow
 * - If account exists: signs in
 * - If account does not exist: creates account instantly
 * - No OTP, SMS or email verification required
 */
export async function authenticateWithPhoneAndPassword(
  phoneInput: string,
  passwordInput: string,
  nameInput?: string
): Promise<{
  success: boolean;
  profile?: CustomerProfile;
  error?: string;
  isNewUser?: boolean;
}> {
  const norm = normalizeBdPhone(phoneInput);
  if (!norm.valid) {
    return { success: false, error: norm.error };
  }

  if (!passwordInput || passwordInput.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }

  const authEmail = phoneToAuthEmail(norm.local);

  // If Supabase is not configured (e.g. preview mode fallback)
  if (!isSupabaseConfigured()) {
    const localCust: CustomerProfile = {
      id: `cust-local-${norm.local}`,
      auth_user_id: `auth-local-${norm.local}`,
      name: nameInput?.trim() || `Customer ${norm.local.slice(-4)}`,
      phone: norm.local,
      email: `${norm.local}@huenvibes.xyz`,
      city: 'Dhaka',
      area: 'Dhaka City',
      created_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem('hue_current_customer', JSON.stringify(localCust));
    } catch {}
    return { success: true, profile: localCust, isNewUser: false };
  }

  try {
    // 1. Attempt Sign In first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: passwordInput,
    });

    if (!signInError && signInData.user) {
      // User signed in successfully -> Load/sync customer profile
      const profile = await syncCustomerProfile(signInData.user.id, norm.local, nameInput);
      return { success: true, profile, isNewUser: false };
    }

    // 2. If Sign In failed because user not found or invalid credentials:
    // Attempt unified Sign Up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: authEmail,
      password: passwordInput,
      options: {
        data: {
          phone: norm.local,
          full_phone: norm.international,
          display_name: nameInput?.trim() || `Customer ${norm.local.slice(-4)}`,
        },
      },
    });

    if (signUpError) {
      // If error was wrong password on existing account
      if (signInError && signInError.message.toLowerCase().includes('invalid login credentials')) {
        return {
          success: false,
          error: 'Incorrect password for this phone number. Please check and try again.',
        };
      }
      return { success: false, error: signUpError.message };
    }

    if (signUpData.user) {
      // Ensure customer profile is recorded in Supabase customers table
      const profile = await syncCustomerProfile(signUpData.user.id, norm.local, nameInput);
      return { success: true, profile, isNewUser: true };
    }

    return { success: false, error: 'Authentication could not be completed. Please try again.' };
  } catch (err: any) {
    console.error('Customer Auth error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Ensures a Customer Profile exists in the customers table and returns it
 */
export async function syncCustomerProfile(
  authUserId: string,
  phone: string,
  name?: string
): Promise<CustomerProfile> {
  const norm = normalizeBdPhone(phone);
  const cleanPhone = norm.valid ? norm.local : phone;

  const defaultProfile: CustomerProfile = {
    id: `cust-${authUserId.slice(0, 8)}`,
    auth_user_id: authUserId,
    name: name?.trim() || `Customer ${cleanPhone.slice(-4)}`,
    phone: cleanPhone,
    email: `${cleanPhone}@huenvibes.xyz`,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    try {
      localStorage.setItem('hue_current_customer', JSON.stringify(defaultProfile));
    } catch {}
    return defaultProfile;
  }

  try {
    // Check if customer already exists by auth_user_id or phone
    const { data: existingList } = await supabase
      .from('customers')
      .select('*')
      .or(`auth_user_id.eq.${authUserId},phone.eq.${cleanPhone}`)
      .limit(1);

    if (existingList && existingList.length > 0) {
      const existing = existingList[0];
      // If found, update auth_user_id and return
      const updatedData: any = { auth_user_id: authUserId, updated_at: new Date().toISOString() };
      if (name && name.trim()) updatedData.name = name.trim();

      const { data: updated } = await supabase
        .from('customers')
        .update(updatedData)
        .eq('id', existing.id)
        .select('*')
        .single();

      const profile: CustomerProfile = updated || existing;
      try {
        localStorage.setItem('hue_current_customer', JSON.stringify(profile));
      } catch {}
      return profile;
    }

    // If not found, insert new customer profile
    const { data: created, error: insertErr } = await supabase
      .from('customers')
      .insert([
        {
          auth_user_id: authUserId,
          name: name?.trim() || `Customer ${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          email: `${cleanPhone}@huenvibes.xyz`,
          city: 'Dhaka',
          area: 'Dhaka City',
        },
      ])
      .select('*')
      .single();

    if (created && !insertErr) {
      try {
        localStorage.setItem('hue_current_customer', JSON.stringify(created));
      } catch {}
      return created;
    }

    return defaultProfile;
  } catch (err) {
    console.warn('Customer profile sync notice:', err);
    return defaultProfile;
  }
}

/**
 * Gets the current authenticated customer session and profile
 */
export async function getActiveCustomerProfile(): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured()) {
    try {
      const saved = localStorage.getItem('hue_current_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      return null;
    }

    const phone = user.user_metadata?.phone || user.email?.split('@')[0] || '';
    const { data: customerRecord } = await supabase
      .from('customers')
      .select('*')
      .or(`auth_user_id.eq.${user.id},phone.eq.${phone}`)
      .limit(1)
      .single();

    if (customerRecord) {
      try {
        localStorage.setItem('hue_current_customer', JSON.stringify(customerRecord));
      } catch {}
      return customerRecord;
    }

    return {
      id: `cust-${user.id.slice(0, 8)}`,
      auth_user_id: user.id,
      name: user.user_metadata?.display_name || `Customer ${phone.slice(-4)}`,
      phone,
      email: user.email,
    };
  } catch (err) {
    console.warn('Error fetching active customer profile:', err);
    return null;
  }
}

/**
 * Logs out the customer
 */
export async function signOutCustomer(): Promise<void> {
  try {
    localStorage.removeItem('hue_current_customer');
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
}

/**
 * Fetches the customer's past orders
 */
export async function fetchCustomerOrders(
  customerProfile: CustomerProfile
): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) {
    try {
      const localOrders: any[] = JSON.parse(localStorage.getItem('hue_orders') || '[]');
      return localOrders.filter(
        (o) =>
          o.customer?.phone === customerProfile.phone ||
          o.customerPhone === customerProfile.phone ||
          o.customerName === customerProfile.name
      );
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customers(*), order_items(*)')
      .or(`customer_id.eq.${customerProfile.id},delivery_address.ilike.%${customerProfile.phone}%`)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerName: o.customers?.name || customerProfile.name,
      customerPhone: o.customers?.phone || customerProfile.phone,
      customerEmail: o.customers?.email || customerProfile.email || '',
      customerAddress: o.delivery_address || '',
      city: o.delivery_city || 'Dhaka',
      area: o.delivery_area || '',
      items: (o.order_items || []).map((i: any) => ({
        productId: i.product_id || '',
        name: i.product_name,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80',
        price: Number(i.unit_price),
        quantity: i.quantity,
      })),
      subtotal: Number(o.subtotal),
      deliveryCharge: Number(o.delivery_fee),
      discount: Number(o.discount || 0),
      total: Number(o.total),
      paymentMethod: o.payment_method as any,
      paymentStatus: o.order_status === 'Delivered' ? 'Paid' : 'Unpaid',
      status: o.order_status,
      notes: o.customer_note || undefined,
      createdAt: o.created_at,
    }));
  } catch (err) {
    console.warn('Error fetching customer orders:', err);
    return [];
  }
}
