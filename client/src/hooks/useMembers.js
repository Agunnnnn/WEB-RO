import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAdmin } from '../context/AdminContext';

// Postgres/Supabase konvensinya snake_case (job_id, party_id),
// sedangkan di komponen React kita pake camelCase (jobId, partyId).
function rowToMember(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    gear: row.gear,
    jobId: row.job_id,
    partyId: row.party_id,
  };
}

export function useMembers() {
  const { authFetch } = useAdmin();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Baca data awal & subscribe realtime TETAP langsung ke Supabase (anon key).
    // Ini aman walau anon key ke-expose di browser, karena RLS di database cuma
    // ngasih izin SELECT ke publik — gak ada policy insert/update/delete buat anon.
    async function loadInitial() {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && isMounted) setMembers(data.map(rowToMember));
      if (isMounted) setLoading(false);
    }
    loadInitial();

    const channel = supabase
      .channel('members-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        (payload) => {
          setMembers((prev) => {
            if (payload.eventType === 'INSERT') return [...prev, rowToMember(payload.new)];
            if (payload.eventType === 'UPDATE') {
              return prev.map((m) => (m.id === payload.new.id ? rowToMember(payload.new) : m));
            }
            if (payload.eventType === 'DELETE') return prev.filter((m) => m.id !== payload.old.id);
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Semua tulis (insert/update/delete) sekarang lewat server Express, BUKAN
  // langsung ke Supabase — server yang pegang service_role key & cek token admin.
  // State lokal gak perlu di-update manual di sini: subscription realtime di atas
  // yang bakal nangkep perubahannya otomatis, termasuk buat tab admin sendiri.

  async function addMember({ nickname, gear, jobId }) {
    const res = await authFetch('/members', {
      method: 'POST',
      body: JSON.stringify({ nickname, gear, jobId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('addMember error:', body.error || res.statusText);
    }
  }

  async function updateMember(id, data) {
    const res = await authFetch(`/members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('updateMember error:', body.error || res.statusText);
    }
  }

  async function deleteMember(id) {
    const res = await authFetch(`/members/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => ({}));
      console.error('deleteMember error:', body.error || res.statusText);
    }
  }

  async function moveMember(id, newPartyId) {
    const res = await authFetch(`/members/${id}/party`, {
      method: 'PATCH',
      body: JSON.stringify({ partyId: newPartyId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('moveMember error:', body.error || res.statusText);
    }
  }

  return {
    members, loading, addMember, updateMember, deleteMember, moveMember,
  };
}
