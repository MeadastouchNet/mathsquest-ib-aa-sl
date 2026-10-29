// Turns [[term]] / [[term|shown text]] in rendered content into "?" helper buttons with a definition popover
// that links to the lesson where the term is taught.
import { h, speakButton } from './ui.js';
import { lookupTerm } from './content/glossary.js';
import { findTopic } from './content/units.js';
import { icon } from './icons.js';

const TERM = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/** Plain text of [[term|shown]] markup, for speech and anywhere HTML isn't rendered. */
export const stripTerms = s => s.replace(TERM, (_, t, shown) => shown || t);

export function linkTerms(root) {
  if (!root.textContent.includes('[[')) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n; (n = walker.nextNode());) if (n.nodeValue.includes('[[')) nodes.push(n);
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    let last = 0;
    const text = node.nodeValue;
    for (const m of text.matchAll(TERM)) {
      frag.append(text.slice(last, m.index));
      const entry = lookupTerm(m[1]);
      const shown = m[2] || m[1];
      if (!entry) { console.warn(`Glossary: no entry for "${m[1]}"`); frag.append(shown); }
      else frag.append(termButton(shown, entry));
      last = m.index + m[0].length;
    }
    frag.append(text.slice(last));
    node.replaceWith(frag);
  }
}

function termButton(shown, entry) {
  const b = h('button', { type: 'button', class: 'term', 'aria-haspopup': 'dialog', title: 'What does this mean?' },
    shown, h('span', { class: 'term-q', 'aria-hidden': 'true' }, '?'));
  b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openPopover(b, entry); });
  return b;
}

let pop = null;
function closePopover() { if (pop) { pop.remove(); pop = null; } }
addEventListener('click', e => { if (pop && !pop.contains(e.target)) closePopover(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closePopover(); });
addEventListener('hashchange', closePopover);

function openPopover(anchor, entry) {
  closePopover();
  const where = findTopic(entry.sec);
  const here = location.hash.startsWith(`#/s/${entry.sec}/`);
  let link;
  if (where?.built) {
    const href = `#/s/${entry.sec}/learn${entry.card != null ? '/' + entry.card : ''}`;
    // Inside a quiz a new tab keeps the question; elsewhere just go there.
    const inQuiz = !!document.querySelector('#app .q-text');
    link = h('a', { class: 'btn small', href, target: inQuiz ? '_blank' : null, rel: inQuiz ? 'noopener' : null },
      here ? `Re-read it in ${entry.sec}` : `Learn it in ${entry.sec} ${where.topic.title}`, inQuiz ? icon('arrow-up-right') : null);
  } else if (where) {
    link = h('div', { class: 'muted small' }, `You'll learn this in Unit ${where.unit.id} · ${where.topic.id} ${where.topic.title} (coming soon).`);
  }
  pop = h('div', { class: 'term-pop', role: 'dialog', 'aria-label': entry.key },
    h('div', { class: 'spread', style: 'align-items:start' }, h('b', { class: 'term-title' }, entry.key[0].toUpperCase() + entry.key.slice(1)),
      h('div', { class: 'row', style: 'gap:6px' }, speakButton(`${entry.key}. ${entry.def}`),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close', onclick: closePopover }, icon('x')))),
    h('p', { html: entry.def }), link);
  document.body.append(pop);
  // Below the term, kept inside the viewport.
  const r = anchor.getBoundingClientRect();
  const w = Math.min(340, innerWidth - 24);
  pop.style.width = `${w}px`;
  pop.style.left = `${Math.max(12, Math.min(r.left, innerWidth - w - 12))}px`;
  const below = r.bottom + 8 + pop.offsetHeight < innerHeight;
  pop.style.top = `${(below ? r.bottom + 8 : Math.max(8, r.top - pop.offsetHeight - 8)) + scrollY}px`;
}
