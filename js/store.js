// Progress, XP, spaced repetition and the activity log. Everything lives in localStorage on this device.
import { APP } from './config.js';

const KEY = APP.storageKey;
const BOX_DAYS = [0, 0, 1, 3, 7, 16]; // index = Leitner box (1..5)
const LOG_MAX = 5000;

export const LEVELS = APP.levels;
export const XP_PER_LEVEL = 250;

const fresh = () => ({
  xp: 0, days: {}, sections: {}, cards: {}, explains: {}, ratings: {}, log: [], boss: { byUnit: {} },
  settings: { autoRead: false, sound: true, rate: 1, voice: '', theme: 'auto' }
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(fresh(), JSON.parse(raw));
  } catch (e) { /* storage blocked: run in memory */ }
  return fresh();
}
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}
export const get = () => state;

export function today(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
function addDays(dayStr, n) {
  const d = new Date(dayStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return today(d);
}
function day() {
  const t = today();
  return (state.days[t] ||= { xp: 0, ms: 0, answers: 0, correct: 0 });
}

export function log(type, data = {}) {
  state.log.push({ t: Date.now(), type, ...data });
  if (state.log.length > LOG_MAX) state.log.splice(0, state.log.length - LOG_MAX);
}

/** Adds XP; returns true when this pushed the learner into a new level. */
export function addXP(n) {
  const before = level();
  state.xp += n;
  day().xp += n;
  save();
  return level() > before;
}
export const level = () => Math.min(LEVELS.length - 1, Math.floor(state.xp / XP_PER_LEVEL));
export const levelName = () => LEVELS[level()];
export const levelProgress = () => (state.xp % XP_PER_LEVEL) / XP_PER_LEVEL;

export function streak() {
  let n = 0, d = today();
  if (!(state.days[d]?.xp > 0)) d = addDays(d, -1); // today not done yet: streak still alive from yesterday
  while (state.days[d]?.xp > 0) { n++; d = addDays(d, -1); }
  return n;
}

export function addTime(ms) { day().ms += ms; save(); }

// ---- sections ----
export function section(id) {
  return (state.sections[id] ||= { steps: {}, done: false, firstTry: { right: 0, total: 0 } });
}
export function markStep(id, step) { section(id).steps[step] = true; save(); }

// ---- spaced repetition (Leitner) ----
export function recordAnswer(q, sectionId, correct, { firstAttempt = true, mode = 'lesson' } = {}) {
  const c = (state.cards[q.id] ||= { box: 1, due: today(), right: 0, wrong: 0, sec: sectionId });
  if (correct) c.right++; else c.wrong++;
  // Extra practice before a question is due doesn't move it up a box (that would defeat the spacing),
  // but a miss still sends it back to box 1.
  const early = mode === 'practice' && c.due > today();
  if (firstAttempt && !(early && correct)) {
    c.box = correct ? Math.min(5, c.box + 1) : 1;
    c.due = addDays(today(), BOX_DAYS[c.box]);
    if (mode === 'lesson') {
      const s = section(sectionId).firstTry;
      s.total++; if (correct) s.right++;
    }
  }
  const d = day();
  d.answers++; if (correct) d.correct++;
  log('answer', { q: q.id, sec: sectionId, ok: correct, first: firstAttempt, mode });
  save();
}
export function dueCards() {
  const t = today();
  return Object.entries(state.cards).filter(([, c]) => c.due <= t).map(([id]) => id);
}
/** Earliest review date among these questions, or null if none have been answered yet. */
export function nextReview(questionIds) {
  const dues = questionIds.map(id => state.cards[id]?.due).filter(Boolean).sort();
  return dues[0] || null;
}
/** "today", "tomorrow", "in 3 days" for a YYYY-MM-DD date. */
export function relDay(dayStr) {
  const n = Math.round((new Date(dayStr + 'T12:00:00') - new Date(today() + 'T12:00:00')) / 864e5);
  return n <= 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`;
}
/** Mastery 0..1 for a section: how far its questions have climbed the boxes. */
export function mastery(sectionId, questionIds) {
  if (!questionIds.length) return 0;
  const sum = questionIds.reduce((a, id) => a + (state.cards[id] ? (state.cards[id].box - 1) / 4 : 0), 0);
  return sum / questionIds.length;
}

/** Best Boss Battle score per unit id ('all' = every built unit). Migrates the old single Unit 3 record. */
export function bossBests() {
  const b = state.boss;
  if (!b.byUnit) { b.byUnit = b.best ? { 3: b.best } : {}; delete b.best; save(); }
  return b.byUnit;
}

export function setSetting(k, v) { state.settings[k] = v; save(); }

export function exportJSON() { return JSON.stringify(state, null, 2); }
export function importJSON(text) { state = Object.assign(fresh(), JSON.parse(text)); save(); }
export function reset() { state = fresh(); save(); }
