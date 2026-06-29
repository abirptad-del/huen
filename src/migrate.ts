import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = `
  create table if not exists top_categories (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    image_url text,
    display_order integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default now()
  );

  create table if not exists top_category_products (
    id uuid primary key default gen_random_uuid(),
    top_category_id uuid references top_categories(id) on delete cascade,
    product_id uuid references products(id) on delete cascade,
    display_order integer default 0
  );

  alter table top_categories enable row level security;
  alter table top_category_products enable row level security;

  create policy "Anyone can read top_categories_new" on top_categories for select using (true);
  create policy "Admins can manage top_categories_new" on top_categories for all using (true);
  
  create policy "Anyone can read top_category_products_new" on top_category_products for select using (true);
  create policy "Admins can manage top_category_products_new" on top_category_products for all using (true);
  `;
  
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) {
    if (error.message.includes('function "exec_sql" does not exist')) {
        console.log("exec_sql does not exist, can't run DDL via client easily. Let's create from frontend?");
    }
    console.error(error);
  } else {
    console.log("Success:", data);
  }
}

run();
