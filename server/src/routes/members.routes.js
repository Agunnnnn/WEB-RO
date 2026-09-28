import { Router } from 'express';
import { supabase } from '../supabaseClient.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Publik: buat halaman utama yang cuma nampilin roster/party
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('members').select('*').order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(toClientMember));
});

// ---- Semua route di bawah ini khusus admin (butuh Bearer token) ----

router.post('/', requireAdmin, async (req, res) => {
  const { nickname, gear, jobId } = req.body || {};
  if (!nickname || typeof nickname !== 'string' || !nickname.trim()) {
    return res.status(400).json({ error: 'Nickname wajib diisi' });
  }

  const { data, error } = await supabase
    .from('members')
    .insert({ nickname: nickname.trim(), gear: Number(gear) || 0, job_id: jobId })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(toClientMember(data));
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const { nickname, gear, jobId } = req.body || {};
  const patch = {};
  if (nickname !== undefined) patch.nickname = String(nickname).trim();
  if (gear !== undefined) patch.gear = Number(gear) || 0;
  if (jobId !== undefined) patch.job_id = jobId;

  const { data, error } = await supabase
    .from('members')
    .update(patch)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toClientMember(data));
});

// Dipanggil pas drag & drop selesai. partyId = null artinya balik ke roster.
router.patch('/:id/party', requireAdmin, async (req, res) => {
  const { partyId } = req.body || {};
  const { data, error } = await supabase
    .from('members')
    .update({ party_id: partyId ?? null })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toClientMember(data));
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('members').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

function toClientMember(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    gear: row.gear,
    jobId: row.job_id,
    partyId: row.party_id,
  };
}

export default router;
