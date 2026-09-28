import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi' });
  }

  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('id, username, password_hash, display_name')
    .eq('username', username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Gagal cek akun admin' });
  if (!admin) return res.status(401).json({ error: 'Username atau password salah' });

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.status(401).json({ error: 'Username atau password salah' });

  const token = jwt.sign(
    { sub: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
  );

  res.json({
    token,
    admin: { id: admin.id, username: admin.username, displayName: admin.display_name },
  });
});

export default router;
