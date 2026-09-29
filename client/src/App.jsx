import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMembers } from "./hooks/useMembers";
import { useTeams } from "./hooks/useTeams";
import { useAdmin } from "./context/AdminContext";
import { PARTY_SIZE } from "./constants/jobs";
import Roster from "./components/Roster";
import TeamCard from "./components/TeamCard";
import AdminGate from "./components/AdminGate";
import LoginPage from "./components/LoginPage";
import "./styles.css";

export default function App() {
  const { isAdmin } = useAdmin();
  const [page, setPage] = useState("main"); // 'main' | 'login'
  const [rosterOpen, setRosterOpen] = useState(false);
  const { members, addMember, updateMember, deleteMember, moveMember } =
    useMembers();
  const { teams, addTeam, renameTeam, deleteTeam } = useTeams();

  // Support both mouse and touch for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

  const mainTeams = useMemo(
    () => teams.filter((t) => t.type === "main"),
    [teams],
  );
  const secondaryTeams = useMemo(
    () => teams.filter((t) => t.type === "secondary"),
    [teams],
  );
  const unassignedCount = useMemo(
    () => members.filter((m) => !m.partyId).length,
    [members],
  );

  function handleAddTeam(type) {
    const countOfType = teams.filter((t) => t.type === type).length + 1;
    const label = type === "secondary" ? "Secondary" : "Main";
    addTeam({ name: `${label} ${countOfType}`, type });
  }

  // Server yang otomatis balikin anggota tim ke roster pas tim dihapus,
  // jadi di sini tinggal manggil deleteTeam aja (partyIds gak dipakai lagi).
  async function handleDeleteTeam(teamId) {
    await deleteTeam(teamId);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const memberId = active.id;
    const targetZone = over.id; // 'roster' atau sebuah partyId

    if (targetZone === "roster") {
      moveMember(memberId, null);
      return;
    }

    const currentCount = members.filter(
      (m) => m.partyId === targetZone && m.id !== memberId,
    ).length;
    if (currentCount >= PARTY_SIZE) return; // party penuh, drop ditolak
    moveMember(memberId, targetZone);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {/* Animated grid background */}
      <div className="app-grid-bg" aria-hidden="true" />

      {/* Floating background particles — same as login page */}
      <div className="app-particles" aria-hidden="true">
        <div className="particle p1" />
        <div className="particle p2" />
        <div className="particle p3" />
        <div className="particle p4" />
        <div className="particle p5" />
        <div className="particle p6" />
        <div className="particle p7" />
        <div className="particle p8" />
        <div className="particle p9" />
      </div>

      <div className="app">
        <header className="topbar">
          <div className="brand">
            <span className="brand-icon">⚔️</span>
            <div className="brand-text">
              <h1>Team Planner</h1>
              <p className="brand-sub">Web Resmi Guild Arcana</p>
            </div>
          </div>

          {/* Premium stat pills */}
          <div className="stats" aria-label="Statistik guild">
            <div className="stat-pills">
              <span className="stat-pill gold-pill">
                <span className="stat-pill-icon">👥</span>
                <b>{members.length}</b> anggota
              </span>
              <span className="stat-pill">
                <span className="stat-pill-icon">🏰</span>
                <b>{teams.length}</b> tim
              </span>
              <span className="stat-pill">
                <span className="stat-pill-icon">⏳</span>
                <b>{unassignedCount}</b> bebas
              </span>
            </div>
          </div>

          <div className="actions">
            {isAdmin && (
              <>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => handleAddTeam("main")}
                >
                  + Main
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleAddTeam("secondary")}
                >
                  + Secondary
                </button>
              </>
            )}
            <AdminGate onLoginClick={() => setPage("login")} />
          </div>
        </header>

        <main className="layout">
          {/* Roster: collapsible on mobile, always shown on desktop */}
          <div className="roster-panel">
            {/* Mobile toggle button */}
            <button
              type="button"
              className="roster-toggle"
              onClick={() => setRosterOpen((v) => !v)}
              aria-expanded={rosterOpen}
            >
              <span className="roster-toggle-title">📋 Roster</span>
              <span className="roster-toggle-meta">
                {unassignedCount} belum party
              </span>
              <span
                className={`roster-toggle-chevron ${rosterOpen ? "open" : ""}`}
              >
                ▼
              </span>
            </button>

            {/* Desktop heading — shown via CSS on ≥960px */}
            <h2>⚔️ Roster Guild</h2>

            {/* Body — collapses on mobile */}
            <div
              className="roster-body"
              style={{ display: rosterOpen ? "block" : undefined }}
            >
              <Roster
                members={members}
                addMember={addMember}
                updateMember={updateMember}
                deleteMember={deleteMember}
              />
            </div>
          </div>

          <section className="teams-panel">
            <div className="teams-section">
              <h2 className="section-head main-head">⚔️ Main Battle</h2>
              <div className="teams-grid">
                {mainTeams.length === 0 && (
                  <div className="section-empty">
                    Belum ada Tim Main Battle. Klik &quot;+ Main&quot; buat
                    mulai.
                  </div>
                )}
                {mainTeams.map((t) => (
                  <TeamCard
                    key={t.id}
                    team={t}
                    members={members}
                    renameTeam={renameTeam}
                    deleteTeam={handleDeleteTeam}
                    onReturn={(m) => moveMember(m.id, null)}
                  />
                ))}
              </div>
            </div>

            <div className="teams-section">
              <h2 className="section-head secondary-head">
                🛡️ Secondary Battle
              </h2>
              <div className="teams-grid">
                {secondaryTeams.length === 0 && (
                  <div className="section-empty">
                    Belum ada Tim Secondary Battle. Klik &quot;+
                    Secondary&quot; buat mulai.
                  </div>
                )}
                {secondaryTeams.map((t) => (
                  <TeamCard
                    key={t.id}
                    team={t}
                    members={members}
                    renameTeam={renameTeam}
                    deleteTeam={handleDeleteTeam}
                    onReturn={(m) => moveMember(m.id, null)}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Halaman login — overlay full-screen */}
      {page === "login" && <LoginPage onBack={() => setPage("main")} />}
    </DndContext>
  );
}
