import { useState } from 'react';
import { JOBS } from '../constants/jobs';

export default function EditMemberForm({ member, onSave, onCancel }) {
  const [nickname, setNickname] = useState(member.nickname);
  const [gear, setGear] = useState(member.gear);
  const [jobId, setJobId] = useState(member.jobId);

  function handleSave() {
    const nick = nickname.trim();
    if (!nick) return;
    const g = Number(gear);
    onSave({ nickname: nick, gear: Number.isNaN(g) || g < 0 ? 0 : g, jobId });
  }

  return (
    <div className="edit-form">
      <div className="edit-form-row">
        <input value={nickname} maxLength={24} onChange={(e) => setNickname(e.target.value)} autoFocus />
        <input type="number" min="0" style={{ width: 90 }} value={gear} onChange={(e) => setGear(e.target.value)} />
      </div>
      <select value={jobId} onChange={(e) => setJobId(e.target.value)}>
        {JOBS.map((j) => (
          <option key={j.id} value={j.id}>{j.emoji} {j.name}</option>
        ))}
      </select>
      <div className="edit-form-actions">
        <button type="button" className="btn btn-sm btn-ghost" onClick={onCancel}>Batal</button>
        <button type="button" className="btn btn-sm btn-gold" onClick={handleSave}>Simpan</button>
      </div>
    </div>
  );
}
