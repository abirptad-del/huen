import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
// For schema modification, anon key might not work if not admin but since we have service role equivalent or postgres access? Wait. Supabase anon key cannot be used to run DDL! It does not have permission to `ALTER TABLE`.

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@mokkahfabrics.com',
    password: 'mokkah123'
  });
  if (authError) {
    console.error('Auth Error:', authError);
    return;
  }
  
  console.log('Logged in!', authData.user?.email);

  const testId = 'test-top-cat-' + Date.now();
  
  const { data: insertData, error: insertError } = await supabase.from('homepage_content').insert({
    id: testId,
    sectionType: 'top_category',
    title: 'Test Cat'
  }).select();
  
  console.log('Insert Error:', insertError);
  console.log('Insert Data:', insertData);
  
  if (!insertError && insertData) {
    const { data: delData, error: delError } = await supabase.from('homepage_content').delete().eq('id', testId).select();
    console.log('Delete Error:', delError);
    console.log('Delete Data:', delData);
  }
}
run();
