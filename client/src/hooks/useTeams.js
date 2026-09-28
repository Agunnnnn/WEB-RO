import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAdmin } from '../context/AdminContext';

function rowToTeam(row) {
  return {
    id: row.id, name: row.name, type: row.type, createdAt: row.created_at,
  };
}

export function useTeams() {
  const { authFetch } = useAdmin();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && isMounted) setTeams(data.map(rowToTeam));
      if (isMounted) setLoading(false);
    }
    loadInitial();

    const channel = supabase
      .channel('teams-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        (payload) => {
          setTeams((prev) => {
            if (payload.eventType === 'INSERT') return [...prev, rowToTeam(payload.new)];
            if (payload.eventType === 'UPDATE') {
              return prev.map((t) => (t.id === payload.new.id ? rowToTeam(payload.new) : t));
            }
            if (payload.eventType === 'DELETE') return prev.filter((t) => t.id !== payload.old.id);
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

  async function addTeam({ name, type }) {
    const res = await authFetch('/teams', {
      method: 'POST',
      body: JSON.stringify({ name, type }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('addTeam error:', body.error || res.statusText);
    }
  }

  async function renameTeam(id, name) {
    const res = await authFetch(`/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('renameTeam error:', body.error || res.statusText);
    }
  }

  // Hapus tim: server otomatis balikin semua anggotanya ke roster
  // (party_id -> null) sebelum menghapus baris tim-nya.
  async function deleteTeam(id) {
    const res = await authFetch(`/teams/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) {
      const body = await res.json().catch(() => ({}));
      console.error('deleteTeam error:', body.error || res.statusText);
    }
  }

  return {
    teams, loading, addTeam, renameTeam, deleteTeam,
  };
}
