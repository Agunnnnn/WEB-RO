import { useDroppable } from '@dnd-kit/core';
import { PARTY_SIZE } from '../constants/jobs';
import MemberChip from './MemberChip';
import { useAdmin } from '../context/AdminContext';

export default function PartyBox({ id, index, members, onReturn }) {
  const { isAdmin } = useAdmin();
  const { setNodeRef, isOver } = useDroppable({ id, disabled: !isAdmin });
  const full = members.length >= PARTY_SIZE;

  const hasKnight = members.some((m) => m.jobId === 'knight');
  const hasPriest = members.some((m) => m.jobId === 'priest');

  return (
    <div className="party-box">
      <div className="party-head">
        <span className="party-title">Party {index + 1}</span>
        <span className="party-count">{members.length}/{PARTY_SIZE}</span>
        <span className={`role-ind ${hasKnight ? 'ok' : 'warn'}`} title={hasKnight ? 'Ada Knight' : 'Belum ada Knight'}>K</span>
        <span className={`role-ind ${hasPriest ? 'ok' : 'warn'}`} title={hasPriest ? 'Ada Priest' : 'Belum ada Priest'}>P</span>
      </div>
      <div
        ref={setNodeRef}
        className={`party-drop drop-zone ${isOver ? 'drag-over' : ''} ${isOver && full ? 'zone-full' : ''}`}
      >
        {members.length === 0 && <div className="empty-hint mini">kosong</div>}
        {members.map((m) => (
          <MemberChip key={m.id} member={m} compact onReturn={onReturn} />
        ))}
      </div>
    </div>
  );
}
