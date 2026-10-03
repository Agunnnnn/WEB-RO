import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { JOB_MAP, JOBS } from "../constants/jobs";
import { useAdmin } from "../context/AdminContext";

export default function MemberChip({
  member,
  compact,
  onEdit,
  onDelete,
  onReturn,
  onAssign,
}) {
  const { isAdmin } = useAdmin();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: member.id,
      disabled: !isAdmin,
    });
  const job = JOB_MAP[member.jobId] || JOBS[0];

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`chip ${compact ? "chip-compact" : ""} ${isAdmin ? "is-draggable" : "is-readonly"}`}
      title={`${member.nickname} · ${job.name} · GS ${member.gear}`}
      {...(isAdmin ? listeners : {})}
      {...(isAdmin ? attributes : {})}
    >
      <span className="dot" style={{ background: job.color }} />
      <span className="job-emoji">{job.emoji}</span>
      <div className="info">
        <div className="nick">{member.nickname}</div>
        <div className="meta">
          {compact ? job.name : `${job.name} · GS ${member.gear}`}
        </div>
      </div>
      {isAdmin && (
        <div className="chip-actions">
          {compact ? (
            <button
              type="button"
              title="Kembalikan ke roster"
              onClick={(e) => {
                e.stopPropagation();
                onReturn(member);
              }}
            >
              ↩
            </button>
          ) : (
            <>
              <button
                type="button"
                title="Masukin ke tim"
                onClick={(e) => {
                  e.stopPropagation();
                  onAssign(member);
                }}
              >
                🎯
              </button>
              <button
                type="button"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(member);
                }}
              >
                ✎
              </button>
              <button
                type="button"
                title="Hapus"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(member);
                }}
              >
                ✕
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
