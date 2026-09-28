export const JOBS = [
  { id: 'priest',     name: 'Priest',     emoji: '✝️',  color: '#30A46C' },
  { id: 'monk',       name: 'Monk',       emoji: '🧘', color: '#C2681D' },
  { id: 'knight',     name: 'Knight',     emoji: '🛡️', color: '#E5484D' },
  { id: 'crusader',   name: 'Crusader',   emoji: '🐎', color: '#CBA135' },
  { id: 'wizard',     name: 'Wizard',     emoji: '🧙', color: '#3B82F6' },
  { id: 'hunter',     name: 'Hunter',     emoji: '🏹', color: '#F76B15' },
  { id: 'bard',       name: 'Bard',       emoji: '🎵', color: '#EC4899' },
  { id: 'assassin',   name: 'Assassin',   emoji: '🗡️', color: '#8E4EC6' },
  { id: 'blacksmith', name: 'Blacksmith', emoji: '🔨', color: '#A16207' },
  { id: 'alchemist',  name: 'Alchemist',  emoji: '⚗️', color: '#12A594' },
  { id: 'rebel',      name: 'Rebel',      emoji: '🔫', color: '#64748B' },
  { id: 'kanos',      name: 'Kanos',      emoji: '🎭', color: '#6D28D9' },
];

export const JOB_MAP = Object.fromEntries(JOBS.map(j => [j.id, j]));

export const PARTY_SIZE = 5;
export const PARTIES_PER_TEAM = 8;

// partyId dibentuk dari teamId + index party (0-7), jadi kita ga perlu
// collection/dokumen terpisah buat "party" di Firestore.
export function partyId(teamId, index) {
  return `${teamId}_p${index}`;
}
