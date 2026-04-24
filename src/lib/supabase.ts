import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Prevent @supabase/supabase-js from throwing error if URL is empty string.
// This allows the app to boot so the developer can see the dashboard while they configure the secrets.
const finalUrl = supabaseUrl || 'https://your-project.supabase.co';
const finalKey = supabaseKey || 'placeholder-key';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your secrets panel to enable live database features.');
}

export const supabase = createClient(finalUrl, finalKey);
