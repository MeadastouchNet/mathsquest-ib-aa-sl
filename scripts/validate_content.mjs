#!/usr/bin/env node
// Checks the content of an IB learning app (BizQuest engine) for mistakes that are easy to make when
// writing units by hand or with an agent. Usage:  node validate_content.mjs <app-root>
// Exit code 1 if there are errors. Warnings don't fail the check. No dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || '.');
const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);

// Content modules import engine files that touch the browser at load time; give them harmless stand-ins.
globalThis.window ??= globalThis;
globalThis.document ??= { createElement: () => ({ style: {} }), getElementById: () => null, addEventListener() {} };
globalThis.localStorage ??= { getItem: () => null, setItem() {} };
globalThis.addEventListener ??= () => {};

const imp = rel => import(pathToFileURL(path.join(root, rel)).href);
let UNITS, lookupTerm, GLOSSARY;
try {
  ({ UNITS } = await imp('js/content/units.js'));
  ({ lookupTerm, GLOSSARY } = await imp('js/content/glossary.js'));
} catch (e) {
  console.error(`Could not load content from ${root}: ${e.message}`);
  process.exit(1);
}

const labsSrc = fs.readFileSync(path.join(root, 'js/labs.js'), 'utf8');
const LAB_TYPES = new Set([...labsSrc.matchAll(/^ {2}(\w+)\(el, lab, onWin\) \{/mg)].map(m => m[1]));
const TERM = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const QTYPES = new Set(['mcq', 'tf', 'num', 'sort']);

/** Calls fn(string, keyPath) for every string inside a value. */
function walk(v, fn, at = '') {
  if (typeof v === 'string') fn(v, at);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, fn, `${at}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, fn, at ? `${at}.${k}` : k);
}

const sectionIds = new Set(), questionIds = new Set(), plannedIds = new Set();
const built = UNITS.filter(u => u.sections);
const unitIds = new Set();

for (const u of UNITS) {
  if (unitIds.has(u.id)) err(`Unit id "${u.id}" is used twice`);
  unitIds.add(u.id);
  for (const k of ['id', 'title', 'emoji']) if (!u[k]) err(`Unit ${u.id ?? '?'}: missing "${k}"`);
  if (!u.sections && !u.planned?.length) err(`Unit ${u.id}: needs either "sections" (built) or "planned" topics`);
  for (const p of u.planned || []) plannedIds.add(p.id);
}

for (const u of built) {
  const U = `Unit ${u.id}`;
  if (!u.blurb) warn(`${U}: no blurb (shown on the unit page)`);
  if (!u.formulas) warn(`${U}: no "formulas" array (use [] if the unit has none)`);
  for (const s of u.sections) {
    const S = `${s.id ?? '?'}`;
    if (sectionIds.has(s.id)) err(`Section id ${S} is used twice`);
    sectionIds.add(s.id);
    if (!String(s.id).startsWith(`${u.id}.`)) err(`Section ${S} is in ${U} but its id doesn't start with "${u.id}."`);
    for (const k of ['title', 'emoji', 'minutes', 'goal', 'hook', 'explain']) if (s[k] == null || s[k] === '') err(`${S}: missing "${k}"`);
    if (!(s.cards?.length >= 3)) warn(`${S}: only ${s.cards?.length ?? 0} Learn cards (aim for 3–6)`);
    for (const [i, c] of (s.cards || []).entries()) if (!c.title || !c.html) err(`${S} card ${i}: needs "title" and "html"`);
    if (!s.labs?.length) err(`${S}: no labs (every topic needs at least one interactive "Play" step)`);
    for (const lab of s.labs || []) if (!LAB_TYPES.has(lab.type)) err(`${S}: lab type "${lab.type}" doesn't exist in js/labs.js (have: ${[...LAB_TYPES].join(', ')})`);
    if (!(s.worked?.steps?.length >= 3)) err(`${S}: worked example needs at least 3 steps`);
    for (const st of s.worked?.steps || []) if (!st.prompt || !st.answer) err(`${S}: a worked-example step lacks "prompt" or "answer"`);
    if (!(s.quiz?.length >= 6)) warn(`${S}: only ${s.quiz?.length ?? 0} quiz questions (aim for 6–10)`);

    for (const q of s.quiz || []) {
      const Q = `${S} question ${q.id ?? '?'}`;
      if (!q.id) err(`${Q}: missing id`);
      else if (questionIds.has(q.id)) err(`${Q}: id used twice (ids must be unique across the whole app: progress is stored by id)`);
      questionIds.add(q.id);
      if (q.id && !q.id.startsWith(`${s.id}-`)) warn(`${Q}: id should start with "${s.id}-"`);
      if (!QTYPES.has(q.type)) { err(`${Q}: unknown type "${q.type}"`); continue; }
      if (!q.q) err(`${Q}: no question text`);
      if (!q.why) warn(`${Q}: no "why" explanation (feedback after answering)`);
      if (q.type === 'mcq') {
        if (!(q.options?.length >= 3)) err(`${Q}: mcq needs at least 3 options`);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) err(`${Q}: mcq answer must be an option index`);
        if (new Set(q.options).size !== q.options?.length) err(`${Q}: duplicate options`);
        for (const o of q.options || []) if (TERM.test(o)) warn(`${Q}: [[term]] inside an answer option (a click would also pick the option)`), TERM.lastIndex = 0;
      }
      if (q.type === 'tf' && typeof q.answer !== 'boolean') err(`${Q}: tf answer must be true or false`);
      if (q.type === 'num' && typeof q.answer !== 'number') err(`${Q}: num answer must be a number`);
      if (q.type === 'sort') {
        if (!(q.buckets?.length >= 2)) err(`${Q}: sort needs at least 2 buckets`);
        for (const it of q.items || []) if (!Number.isInteger(it.b) || it.b < 0 || it.b >= q.buckets.length) err(`${Q}: sort item "${it.t}" has no valid bucket`);
      }
      // Fillable table cells: A(value) → data-a, A(value, true) → data-final (must equal the answer).
      const cells = [...String(q.q).matchAll(/data-a="([^"]+)"(\s+data-final)?/g)];
      for (const c of cells) if (!Number.isFinite(parseFloat(c[1]))) err(`${Q}: a ? cell has a non-numeric value "${c[1]}"`);
      const finals = cells.filter(c => c[2]);
      if (finals.length > 1) err(`${Q}: more than one answer cell (A(value, true))`);
      if (finals.length && q.type !== 'num') err(`${Q}: an answer cell only works in a "num" question`);
      if (finals.length && q.type === 'num') {
        const tol = q.tol ?? Math.max(0.01, Math.abs(q.answer) * 0.005);
        if (Math.abs(parseFloat(finals[0][1]) - q.answer) > tol) err(`${Q}: answer cell ${finals[0][1]} ≠ answer ${q.answer}`);
      }
      if (/>\?<\/td>/.test(q.q) && !cells.length) warn(`${Q}: table has a plain "?" cell; write it as A(value) so it's fillable`);
    }

    // Every [[term]] must be in the glossary.
    walk(s, (str, at) => {
      for (const m of str.matchAll(TERM)) {
        if (/^'/.test(m[1])) continue; // a JS array literal inside a table, not a term
        const e = lookupTerm(m[1]);
        if (!e) err(`${S} (${at}): [[${m[1]}]] has no glossary entry`);
        else if (e.sec === s.id) warn(`${S}: [[${m[1]}]] is tagged inside the topic that teaches it`);
      }
    });
  }
  for (const g of u.formulas || []) for (const f of g.items || []) if (!f.name || !String(f.f).includes('$$')) warn(`${U} formula "${f.name}": should be TeX between $$ … $$ (use M\`…\`)`);

  // Options are shuffled, but if the right one is usually the longest, students can guess by length.
  const mcqs = u.sections.flatMap(s => s.quiz || []).filter(q => q.type === 'mcq' && q.options?.[q.answer] != null);
  const longest = mcqs.filter(q => q.options[q.answer].length > Math.max(...q.options.filter((_, i) => i !== q.answer).map(o => o.length)));
  if (mcqs.length >= 5 && longest.length / mcqs.length > 0.4) warn(`${U}: the correct option is the longest in ${longest.length}/${mcqs.length} mcqs, so students can guess by length. Make the distractors as long and specific (e.g. ${longest.slice(0, 5).map(q => q.id).join(', ')})`);
}

// Glossary entries must point at a real topic (built or planned), and a valid Learn card once built.
for (const [key, e] of Object.entries(GLOSSARY)) {
  if (!e.def) err(`Glossary "${key}": no definition`);
  const s = built.flatMap(u => u.sections).find(x => x.id === e.sec);
  if (s) {
    if (e.card == null) warn(`Glossary "${key}": taught in ${e.sec}, add "card" (Learn card index) so the link opens the right card`);
    else if (e.card < 0 || e.card >= s.cards.length) err(`Glossary "${key}": card ${e.card} doesn't exist in ${e.sec} (${s.cards.length} cards)`);
    else {
      // The card the link opens should actually mention the term (or an alias).
      const c = s.cards[e.card];
      const text = `${c.title} ${c.html}`.replace(/<[^>]+>/g, '').replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, t, shown) => shown || t).toLowerCase();
      if (![key, ...(e.aliases || [])].some(n => text.includes(n.toLowerCase()))) warn(`Glossary "${key}": card ${e.card} of ${e.sec} ("${c.title}") doesn't mention the term or an alias; check "card"`);
    }
  } else if (!plannedIds.has(e.sec)) err(`Glossary "${key}": topic ${e.sec} is neither built nor planned`);
}

const total = built.reduce((a, u) => a + u.sections.length, 0);
console.log(`Checked ${built.length} built unit(s), ${total} topics, ${questionIds.size} questions, ${Object.keys(GLOSSARY).length} glossary terms.`);
for (const w of warnings) console.log(`  warning: ${w}`);
for (const e of errors) console.log(`  ERROR: ${e}`);
console.log(errors.length ? `${errors.length} error(s).` : 'No errors.');
process.exit(errors.length ? 1 : 0);
