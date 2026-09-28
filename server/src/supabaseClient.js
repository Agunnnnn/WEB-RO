import 'dotenv/config';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env');
}

// service_role key = bypass RLS sepenuhnya. Cuma boleh dipakai di server ini,
// JANGAN PERNAH dikirim ke frontend / commit ke git.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  // Node < 22 belum punya WebSocket native yang dibutuhin @supabase/realtime-js
  // (walau kita gak pakai fitur realtime sama sekali, client-nya tetap coba
  // inisialisasi ini). Kasih transport dari paket "ws" biar gak error.
  realtime: { transport: ws },
});
