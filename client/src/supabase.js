// "Client" Supabase itu kayak koneksi database kamu dari sisi React.
// URL & anon key-nya diambil dari Supabase Dashboard > Project Settings > API.
// Taruh nilainya di file .env (copy dari .env.example), JANGAN di-commit ke git.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
