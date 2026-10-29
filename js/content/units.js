// All five topics of IB Mathematics AA SL (guide for first assessment 2021).
// A unit with `sections` is built and playable. A unit with only `planned` shows as "coming soon",
// and glossary terms can already point at its planned topics (the link switches on once it is built).
// To add a unit: create js/content/unitN.js in the same shape as unit3.js and replace its entry here.
// Check the planned topic titles against the official guide when building each unit.
import { unit1 } from './unit1.js';
import { unit2 } from './unit2.js';
import { unit3 } from './unit3.js';
import { unit4 } from './unit4.js';
import { unit5 } from './unit5.js';

export const UNITS = [
  unit1,
  unit2,
  unit3,
  unit4,
  unit5
];

export const BUILT = UNITS.filter(u => u.sections);
export const SECTIONS = BUILT.flatMap(u => u.sections.map(s => Object.assign(s, { unit: u.id })));
// Each question gets its unit's calculator keys (js/calc.js), if the unit sets `calcKeys`.
for (const u of BUILT) if (u.calcKeys) for (const s of u.sections) for (const q of s.quiz) q.calcKeys = u.calcKeys;
export const findSection = id => SECTIONS.find(s => s.id === id);
export const findUnit = id => UNITS.find(u => u.id === id);
/** Built section or planned topic for an id like "3.4" or "1.2", with its unit. */
export function findTopic(id) {
  const u = findUnit(String(id).split('.')[0]);
  if (!u) return null;
  const built = u.sections?.find(s => s.id === id);
  if (built) return { unit: u, topic: built, built: true };
  const p = u.planned?.find(s => s.id === id);
  return p ? { unit: u, topic: p, built: false } : null;
}
