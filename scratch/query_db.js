import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env file manually
const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
let supabaseUrl = '';
let supabaseAnonKey = '';
for (const line of lines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.split('=')[1].trim();
  }
}

console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('Products in Database:');
  console.table(data.map(p => ({ id: p.id, name: p.name, category: p.category, image_url: p.image_url?.substring(0, 80) })));
}

async function checkMerchants() {
  const { data, error } = await supabase.from('merchants').select('*');
  if (error) {
    console.error('Error fetching merchants:', error);
    return;
  }
  console.log('Merchants in Database:');
  console.table(data.map(m => ({ id: m.id, name: m.name, category: m.category, image_url: m.image_url?.substring(0, 80) })));
}

async function run() {
  await checkProducts();
  await checkMerchants();
}

run();
