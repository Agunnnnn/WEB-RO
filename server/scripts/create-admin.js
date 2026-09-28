import 'dotenv/config';
import readline from 'node:readline/promises';
import bcrypt from 'bcryptjs';
import { supabase } from '../src/supabaseClient.js';

// Sengaja bikin admin lewat CLI, bukan endpoint register publik, biar orang
// luar gak bisa daftar jadi admin sendiri.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const username = (await rl.question('Username admin: ')).trim();
const displayName = (await rl.question('Nama tampilan (boleh kosong): ')).trim() || null;
const password = await rl.question('Password: ');
rl.close();

if (!username || !password) {
  console.error('Username dan password wajib diisi.');
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 10);

const { error } = await supabase
  .from('admin_users')
  .insert({ username, password_hash: passwordHash, display_name: displayName });

if (error) {
  console.error('Gagal bikin admin:', error.message);
  process.exit(1);
}

console.log(`Admin "${username}" berhasil dibuat.`);
process.exit(0);
