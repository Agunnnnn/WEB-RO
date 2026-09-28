import { Router } from 'express';
import { supabase } from '../supabaseClient.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('teams').select('*').order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', requireAdmin, async (req, res) => {
  const { name, type } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Nama tim wajib diisi' });
  }

  const { data, error } = await supabase
    .from('teams')
    .insert({ name: name.trim(), type: type === 'secondary' ? 'secondary' : 'main' })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const { name } = req.body || {};
  const { data, error } = await supabase
    .from('teams')
    .update({ name: String(name).trim() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Hapus tim + balikin semua anggotanya ke roster (party_id -> null).
// Format partyId di frontend: `${teamId}_p${index}` (lihat constants/jobs.js),
// jadi pattern-nya harus cocok sama itu.
router.delete('/:id', requireAdmin, async (req, res) => {
  const teamId = req.params.id;

  const { error: memberErr } = await supabase
    .from('members')
    .update({ party_id: null })
    .like('party_id', `${teamId}_p%`);
  if (memberErr) return res.status(500).json({ error: memberErr.message });

  const { error } = await supabase.from('teams').delete().eq('id', teamId);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

export default router;
