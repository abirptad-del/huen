/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wimkfpegvvljmgmkrusd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OMCm-A5g6BNK3TkcXUCmwA_bNVv7_TB';

export const supabase = createClient(supabaseUrl, supabaseKey);
