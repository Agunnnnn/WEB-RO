import { useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { JOBS } from "../constants/jobs";
import MemberChip from "./MemberChip";
import EditMemberForm from "./EditMemberForm";
import { useAdmin } from "../context/AdminContext";

export default function Roster({
  members,
  addMember,
  updateMember,
  deleteMember,
  onAssign,
}) {
  const { isAdmin } = useAdmin();
  const [nickname, setNickname] = useState("");
  const [gear, setGear] = useState("");
  const [jobId, setJobId] = useState(JOBS[0].id);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const { setNodeRef, isOver } = useDroppable({
    id: "roster",
    disabled: !isAdmin,
  });

  const unassigned = useMemo(() => {
    let list = members.filter((m) => !m.partyId);
    if (roleFilter !== "all") list = list.filter((m) => m.jobId === roleFilter);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((m) => m.nickname.toLowerCase().includes(s));
    }
    return [...list].sort(
      (a, b) => (Number(b.gear) || 0) - (Number(a.gear) || 0),
    );
  }, [members, roleFilter, search]);

  function handleSubmit(e) {
    e.preventDefault();
    const nick = nickname.trim();
    if (!nick) return;
    const g = parseInt(gear, 10);
    addMember({
      nickname: nick,
      gear: Number.isNaN(g) || g < 0 ? 0 : g,
      jobId,
    });
    setNickname("");
    setGear("");
  }

  return (
    <>
      {isAdmin && (
        <form className="add-form" onSubmit={handleSubmit}>
          <input
            placeholder="Nickname"
            maxLength={24}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Gear Score"
            min="0"
            value={gear}
            onChange={(e) => setGear(e.target.value)}
            required
          />
          <select value={jobId} onChange={(e) => setJobId(e.target.value)}>
            {JOBS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.emoji} {j.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-gold">
            Tambah Anggota
          </button>
        </form>
      )}

      <input
        className="search"
        placeholder="Cari nickname..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="search"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="all">Semua Role</option>
        {JOBS.map((j) => (
          <option key={j.id} value={j.id}>
            {j.emoji} {j.name}
          </option>
        ))}
      </select>

      <div
        ref={setNodeRef}
        className={`chip-list drop-zone ${isOver ? "drag-over" : ""}`}
      >
        {unassigned.length === 0 && (
          <div className="empty-hint">
            {members.length === 0
              ? isAdmin
                ? "Belum ada anggota. Tambahin lewat form di atas."
                : "Belum ada anggota."
              : "Semua anggota sudah masuk party."}
          </div>
        )}
        {unassigned.map((m) =>
          isAdmin && editingId === m.id ? (
            <EditMemberForm
              key={m.id}
              member={m}
              onCancel={() => setEditingId(null)}
              onSave={(data) => {
                updateMember(m.id, data);
                setEditingId(null);
              }}
            />
          ) : (
            <MemberChip
              key={m.id}
              member={m}
              onEdit={() => setEditingId(m.id)}
              onDelete={() => {
                if (window.confirm(`Hapus ${m.nickname} dari roster?`))
                  deleteMember(m.id);
              }}
              onAssign={onAssign}
            />
          ),
        )}
      </div>
    </>
  );
}
