import { createClient } from '@supabase/supabase-js';

// Initialisation de Supabase
// Assurez-vous d'avoir défini NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY 
// dans vos variables d'environnement (Vercel ou localement).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
