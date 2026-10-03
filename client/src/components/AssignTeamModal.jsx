import { PARTIES_PER_TEAM, PARTY_SIZE, partyId } from "../constants/jobs";

export default function AssignTeamModal({
  member,
  teams,
  members,
  onClose,
  onAssign,
}) {
  if (!member) return null;

  return (
    <div className="assign-overlay" onClick={onClose}>
      <div className="assign-modal" onClick={(e) => e.stopPropagation()}>
        <div className="assign-modal-head">
          <h3>Masukin {member.nickname}</h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {teams.length === 0 && (
          <div className="assign-empty">
            Belum ada tim. Bikin tim dulu di halaman utama.
          </div>
        )}

        <div className="assign-team-list">
          {teams.map((team) => (
            <div key={team.id} className="assign-team-group">
              <div
                className={`assign-team-name ${team.type === "secondary" ? "secondary" : ""}`}
              >
                {team.type === "secondary" ? "🛡️" : "⚔️"} {team.name}
              </div>
              <div className="assign-party-grid">
                {Array.from({ length: PARTIES_PER_TEAM }, (_, idx) => {
                  const pid = partyId(team.id, idx);
                  const count = members.filter((m) => m.partyId === pid).length;
                  const full = count >= PARTY_SIZE;
                  return (
                    <button
                      key={pid}
                      type="button"
                      className={`assign-party-btn ${full ? "full" : ""}`}
                      disabled={full}
                      onClick={() => onAssign(pid)}
                    >
                      Party {idx + 1}
                      <span className="assign-party-count">
                        {count}/{PARTY_SIZE}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
