import { useEffect, useMemo, useState } from 'react';
import { PARTIES_PER_TEAM, PARTY_SIZE, partyId } from '../constants/jobs';
import PartyBox from './PartyBox';
import { useAdmin } from '../context/AdminContext';

export default function TeamCard({ team, members, renameTeam, deleteTeam, onReturn }) {
  const { isAdmin } = useAdmin();
  const [name, setName] = useState(team.name);

  useEffect(() => { setName(team.name); }, [team.name]);

  const partyIds = useMemo(
    () => Array.from({ length: PARTIES_PER_TEAM }, (_, i) => partyId(team.id, i)),
    [team.id],
  );

  const teamMembers = useMemo(
    () => members.filter((m) => partyIds.includes(m.partyId)),
    [members, partyIds],
  );

  const totalSlots = PARTIES_PER_TEAM * PARTY_SIZE;
  const avgGear = teamMembers.length
    ? Math.round(teamMembers.reduce((acc, m) => acc + (Number(m.gear) || 0), 0) / teamMembers.length)
    : null;

  function handleNameBlur() {
    const v = name.trim();
    if (v && v !== team.name) renameTeam(team.id, v);
    else setName(team.name);
  }

  return (
    <div className={`team-card ${team.type === 'secondary' ? 'secondary' : 'main'}`}>
      <div className="team-card-head">
        <input
          className="team-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          readOnly={!isAdmin}
        />
        {isAdmin && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            title="Hapus tim"
            onClick={() => {
              if (window.confirm(`Hapus "${team.name}"? Semua anggotanya bakal balik ke roster.`)) {
                deleteTeam(team.id, partyIds);
              }
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div className="team-summary">
        <b>{teamMembers.length}</b>/{totalSlots} slot terisi
        {avgGear !== null && <> &nbsp;·&nbsp; GS rata&sup2; <b>{avgGear}</b></>}
      </div>

      <div className="party-grid">
        {partyIds.map((pid, idx) => (
          <PartyBox
            key={pid}
            id={pid}
            index={idx}
            members={teamMembers.filter((m) => m.partyId === pid)}
            onReturn={onReturn}
          />
        ))}
      </div>
    </div>
  );
}
