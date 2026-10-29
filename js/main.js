import { guideView } from './guide.js';
import { h, renderStats, reward, toast, confetti, speakButton, shuffle, barChart, pct } from './ui.js';
import { runQuiz } from './quiz.js';
import { renderLab } from './labs.js';
import { speak, stopSpeaking, htmlToSpeech, voices, canSpeak, sfx } from './audio.js';
import * as store from './store.js';
import { UNITS, BUILT, SECTIONS, findSection, findUnit } from './content/units.js';
import { typeset, fitFormulas } from './tex.js';
import { linkTerms } from './terms.js';
import { APP } from './config.js';
import { icon } from './icons.js';

const STEPS = [
  { key: 'hook', label: 'Hook', icon: 'hand' },
  { key: 'learn', label: 'Learn', icon: 'book-open' },
  { key: 'lab', label: 'Play', icon: 'gamepad-2' },
  { key: 'worked', label: 'Example', icon: 'brain' },
  { key: 'quiz', label: 'Quiz', icon: 'list-checks' },
  { key: 'explain', label: 'Explain', icon: 'message-circle' }
];
// Back link at the top of a page.
const back = (href, label) => h('a', { href, class: 'crumb' }, icon('chevron-left'), label);
const app = document.getElementById('app');
const questionIndex = new Map(SECTIONS.flatMap(s => s.quiz.map(q => [q.id, { q, sec: s.id }])));

// ---------- theme ----------
function applyTheme() {
  const t = store.get().settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

// ---------- time tracking: counts only while the tab is visible and the learner was active in the last minute ----------
let lastActive = Date.now();
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(e => addEventListener(e, () => { lastActive = Date.now(); }, { passive: true }));
setInterval(() => {
  if (document.visibilityState === 'visible' && Date.now() - lastActive < 60000) store.addTime(15000);
}, 15000);

// ---------- router ----------
function route() {
  stopSpeaking();
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const [view, a, b, c] = parts;
  window.scrollTo(0, 0);
  if (view === 's' && findSection(a) && b === 'practice') practiceView(findSection(a));
  else if (view === 's' && findSection(a)) sectionView(findSection(a), b, c);
  else if (view === 'u' && findUnit(a)) unitView(findUnit(a));
  else if (view === 'review') reviewView();
  else if (view === 'boss') bossView(findUnit(a)?.sections ? findUnit(a) : null);
  else if (view === 'formulas') formulasView(findUnit(a)?.sections ? findUnit(a) : null);
  else if (view === 'stats' || view === 'parent') statsView();
  else if (view === 'settings') settingsView();
  else if (view === 'guide') guideView();
  else homeView();
  renderStats();
  app.focus({ preventScroll: true });
}
addEventListener('hashchange', route);

// ---------- home ----------
function nextAction() {
  const due = store.dueCards().filter(id => questionIndex.has(id));
  if (due.length >= 3) return { href: '#/review', label: `Do my 10 minutes · ${due.length} reviews due`, sub: 'Spaced review first: it locks in what you learned.' };
  // Next lesson: keep going in the unit last worked on, then the first unfinished one anywhere.
  const lastSec = [...store.get().log].reverse().find(l => l.sec && findSection(l.sec))?.sec;
  const lastUnit = lastSec && findSection(lastSec).unit;
  const s = SECTIONS.find(x => x.unit === lastUnit && !store.section(x.id).done) || SECTIONS.find(x => !store.section(x.id).done);
  if (s) {
    const st = store.section(s.id).steps;
    const step = STEPS.find(x => !st[x.key])?.key || 'hook';
    return { href: `#/s/${s.id}/${step}`, label: `Do my 10 minutes · ${s.id} ${s.title}`, sub: Object.keys(st).length ? 'Pick up where you left off.' : 'Next lesson, about 10 minutes.' };
  }
  if (due.length) return { href: '#/review', label: `Do my 10 minutes · ${due.length} reviews due`, sub: 'Keep it fresh.' };
  return { href: '#/boss', label: 'Boss Battle', sub: 'All lessons done. Try to beat your best score.' };
}

function homeView() {
  const st = store.get();
  const na = nextAction();
  const today = st.days[store.today()];
  const mins = Math.round((today?.ms || 0) / 60000);
  const hero = h('section', { class: 'card hero disc' },
    h('div', { class: 'eyebrow' }, icon(mins >= 10 ? 'trophy' : 'graduation-cap'), `Level: ${store.levelName()}`),
    h('h1', {}, mins >= 10 ? 'Daily goal done. Legend.' : 'Ready for your 10 minutes?'),
    h('p', { class: 'muted' }, `Today: ${mins} min · ${today?.answers || 0} questions answered`),
    h('div', { class: 'bar', style: 'margin:10px 0 18px;max-width:420px', title: 'Progress to the next level' }, h('span', { style: `width:${store.levelProgress() * 100}%` })),
    h('a', { class: 'btn big', href: na.href }, icon('play'), na.label),
    h('p', { class: 'muted small', style: 'margin-top:8px' }, na.sub)
  );
  const due = store.dueCards().filter(id => questionIndex.has(id)).length;
  const quick = h('div', { class: 'row', style: 'margin-bottom:26px' },
    h('a', { class: 'btn ghost', href: '#/review' }, icon('rotate-ccw'), 'Review', h('span', { class: 'tag' }, `${due} due`)),
    h('a', { class: 'btn ghost', href: '#/boss' }, icon('swords'), 'Boss Battle'),
    h('a', { class: 'btn ghost', href: '#/formulas' }, icon('sigma'), 'Formulas'),
    h('a', { class: 'btn ghost', href: '#/guide' }, icon('graduation-cap'), 'Student guide'));

  const units = h('section', {}, h('h2', {}, 'Units'), h('div', { class: 'grid' }, UNITS.map(unitCard)));
  app.replaceChildren(hero, quick, units);

}

function unitCard(u) {
  if (!u.sections) {
    return h('a', { class: 'tile soon', href: `#/u/${u.id}` },
      h('div', { class: 'num' }, h('span', { class: 'badge' }, u.emoji), `Unit ${u.id}`), h('h3', {}, u.title),
      h('div', { class: 'muted small' }, `${u.planned.length} topics · coming soon`));
  }
  const done = u.sections.filter(s => store.section(s.id).done).length;
  const m = u.sections.reduce((a, s) => a + store.mastery(s.id, s.quiz.map(q => q.id)), 0) / u.sections.length;
  return h('a', { class: 'tile', href: `#/u/${u.id}` },
    h('div', { class: 'num' }, h('span', { class: 'badge' }, u.emoji), `Unit ${u.id}`), h('h3', {}, u.title),
    h('div', { class: 'bar' }, h('span', { style: `width:${m * 100}%` })),
    h('div', { class: 'muted small', style: 'margin-top:8px' }, `${done}/${u.sections.length} topics done · mastery ${Math.round(m * 100)}%`));
}

const hlTag = t => t.hl === true ? h('span', { class: 'tag' }, 'HL only') : t.hl ? h('span', { class: 'tag' }, 'part HL') : null;

// ---------- unit page ----------
function unitView(u) {
  const head = [back('#/', 'Home'), h('h1', { style: 'margin-top:6px' }, `Unit ${u.id} · ${u.title}`)];
  if (!u.sections) {
    app.replaceChildren(...head,
      h('p', { class: 'muted' }, `This unit isn't in ${APP.name} yet. These are the topics it will cover:`),
      h('div', { class: 'grid' }, u.planned.map(t => h('div', { class: 'tile soon' },
        h('div', { class: 'num' }, t.id, hlTag(t)), h('h3', {}, t.title), h('div', { class: 'muted small' }, 'Coming soon')))));
    return;
  }
  const tiles = u.sections.map(s => {
    const m = store.mastery(s.id, s.quiz.map(q => q.id));
    const sec = store.section(s.id);
    return h('a', { class: 'tile', href: `#/s/${s.id}` },
      h('div', { class: 'num' }, h('span', { class: 'badge' }, s.emoji), s.id, hlTag(s)),
      h('h3', {}, s.title),
      h('div', { class: 'bar' }, h('span', { style: `width:${m * 100}%` })),
      h('div', { class: 'muted small status', style: 'margin-top:8px' }, sec.done ? [icon('circle-check'), `Done · mastery ${Math.round(m * 100)}% · tap to practise`]
        : Object.keys(sec.steps).length ? [icon('hourglass'), 'In progress · tap to continue'] : [icon('clock'), `${s.minutes} min`]));
  });
  app.replaceChildren(...head, h('p', { class: 'muted' }, u.blurb),
    h('div', { class: 'row', style: 'margin-bottom:16px' },
      h('a', { class: 'btn ghost', href: `#/boss/${u.id}` }, icon('swords'), `Unit ${u.id} Boss Battle`),
      u.formulas?.length ? h('a', { class: 'btn ghost', href: `#/formulas/${u.id}` }, icon('sigma'), `Unit ${u.id} formulas`) : null),
    h('div', { class: 'grid' }, tiles));
}

// ---------- lesson ----------
function sectionView(s, stepKey, startCard) {
  const prog = store.section(s.id);
  if (!stepKey) {
    // Opening a topic: finished → overview; otherwise resume at the first step not done yet.
    if (prog.done) return sectionOverview(s);
    const resume = STEPS.find(x => !prog.steps[x.key]) || STEPS[0];
    location.replace(`#/s/${s.id}/${resume.key}`);
    return;
  }
  const idx = Math.max(0, STEPS.findIndex(x => x.key === stepKey));
  const step = STEPS[idx];
  const go = k => { location.hash = `#/s/${s.id}/${k}`; };
  const nextStep = () => {
    store.markStep(s.id, step.key);
    if (idx < STEPS.length - 1) go(STEPS[idx + 1].key); else location.hash = `#/u/${s.unit}`;
  };

  const stepper = h('nav', { class: 'stepper', 'aria-label': 'Lesson steps' }, STEPS.map((x, i) =>
    h('button', { class: `${i === idx ? 'active' : ''} ${prog.steps[x.key] ? 'done' : ''}`, 'aria-current': i === idx ? 'step' : null, onclick: () => go(x.key) },
      icon(prog.steps[x.key] && i !== idx ? 'check' : x.icon), x.label)));
  const head = h('div', {},
    h('div', { class: 'crumbs' }, back(`#/u/${s.unit}`, `Unit ${s.unit}`),
      prog.done ? h('a', { href: `#/s/${s.id}`, class: 'crumb' }, icon('clipboard-list'), 'Topic overview') : null),
    h('h1', { style: 'margin-top:6px' }, `${s.id} ${s.title}`, s.hl === true ? h('span', { class: 'tag' }, 'HL only') : null),
    stepper);
  const body = h('div');
  app.replaceChildren(head, body);

  const nextBtn = (label = 'Next') => h('button', { class: 'btn', onclick: nextStep }, label, icon('arrow-right'));

  if (step.key === 'hook') {
    body.append(h('div', { class: 'card hero' },
      h('div', { class: 'spread', style: 'align-items:start' }, h('div', { class: 'hook', html: s.hook }), speakButton(s.hook)),
      h('p', { class: 'muted small', style: 'margin-top:12px' }, `What you'll be able to do: ${s.goal}`),
      nextBtn("Let's go")));
    autoRead(s.hook);
  }

  if (step.key === 'learn') {
    let c = Math.min(Math.max(0, parseInt(startCard, 10) || 0), s.cards.length - 1);
    const holder = h('div');
    const show = () => {
      const card = s.cards[c];
      stopSpeaking();
      holder.replaceChildren(h('article', { class: 'card lesson-card' },
        h('h2', {}, h('span', {}, card.title), speakButton(() => card.title + '. ' + card.html)),
        h('div', { class: 'body', html: card.html }),
        h('div', { class: 'spread', style: 'margin-top:16px' },
          h('button', { class: 'btn ghost', disabled: c === 0, onclick: () => { c--; show(); } }, icon('arrow-left'), 'Back'),
          c < s.cards.length - 1
            ? h('button', { class: 'btn', onclick: () => { c++; sfx('click'); show(); } }, 'Next card', icon('arrow-right'))
            : nextBtn('Got it · Play')),
        h('div', { class: 'dots' }, s.cards.map((_, i) => h('i', { class: i <= c ? 'on' : '' })))));
      autoRead(card.title + '. ' + card.html);
      window.scrollTo(0, 0);
    };
    body.append(holder);
    show();
  }

  if (step.key === 'lab') {
    s.labs.forEach((lab, li) => {
      const wrap = h('div', { class: 'card' });
      body.append(wrap);
      renderLab(wrap, lab, () => {
        const key = `${s.id}:lab${li}`;
        if (!store.get().sections[s.id].steps[key]) {
          store.markStep(s.id, key);
          sfx('good'); confetti(30); reward(25, 'Challenge beaten!');
        }
      });
    });
    body.append(nextBtn('Next: worked example'));
  }

  if (step.key === 'worked') body.append(workedExample(s.worked), nextBtn('Next: quiz'));

  if (step.key === 'quiz') {
    const holder = h('div');
    body.append(holder);
    runQuiz(holder, s.quiz.map(q => ({ q, sec: s.id })), {
      title: `${s.id} quiz`,
      onFinish: ({ right, total }) => {
        store.markStep(s.id, 'quiz');
        const great = right / total >= .8;
        if (great) { confetti(60); sfx('level'); }
        holder.replaceChildren(h('div', { class: 'card hero' },
          h('div', { class: 'eyebrow' }, icon(great ? 'flame' : 'list-checks'), 'Quiz done'),
          h('h2', {}, great ? `${right}/${total} first try!` : `${right}/${total} first try`),
          h('p', {}, great ? 'Strong. These questions will come back in Review over the next days so they stick.'
            : "Good effort. The ones you missed will come back in Review soon. That's where the real learning happens."),
          h('button', { class: 'btn', onclick: () => go('explain') }, 'Last step: explain it', icon('arrow-right'))));
      }
    });
  }

  if (step.key === 'explain') {
    const prev = store.get().explains[s.id];
    const ta = h('textarea', { rows: 4, placeholder: 'Type it like you would text it…' }, prev?.text || '');
    const rate = {};
    const choice = (key, opts) => h('div', { class: 'rating' }, opts.map(([v, label]) => {
      const b = h('button', { class: 'chip' }, label);
      b.onclick = () => { rate[key] = v; b.parentNode.querySelectorAll('.chip').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); };
      return b;
    }));
    const finish = () => {
      const text = ta.value.trim();
      if (text) store.get().explains[s.id] = { text, t: Date.now() };
      store.get().ratings[s.id] = { ...rate, t: Date.now() };
      store.log('lesson_done', { sec: s.id, ...rate });
      const first = !prog.done;
      prog.done = true;
      store.markStep(s.id, 'explain');
      if (first) { confetti(100); sfx('level'); reward(text.length > 40 ? 70 : 50, `Lesson ${s.id} complete!`); }
      location.hash = `#/u/${s.unit}`;
    };
    body.append(h('div', { class: 'card' },
      h('h2', {}, 'Explain it like you\'re texting a mate'),
      h('p', { html: s.explain }),
      ta,
      h('p', { class: 'muted small' }, 'Explaining it in your own words is one of the best ways to make it stick. Longer than one line = bonus XP.'),
      h('h3', { style: 'margin-top:16px' }, 'Quick rating (1 tap)'),
      h('p', { class: 'muted small' }, 'This lesson was…'),
      choice('fun', [[1, '😴 Boring'], [2, '🙂 OK'], [3, '🔥 Good']]),
      choice('difficulty', [[1, 'Too easy'], [2, 'Just right'], [3, 'Too hard']]),
      h('button', { class: 'btn big', onclick: finish }, icon('check'), 'Finish lesson')));
  }
}

function autoRead(html) {
  if (store.get().settings.autoRead) speak(htmlToSpeech(html));
}

function workedExample(w) {
  const card = h('div', { class: 'card' }, h('div', { class: 'eyebrow' }, icon('brain'), 'Worked example'), h('h2', {}, w.title), h('div', { html: w.intro }));
  const stepsBox = h('div');
  let i = 0;
  const btn = h('button', { class: 'btn dark' }, 'Show step 1');
  const renderSteps = () => {
    stepsBox.replaceChildren(...w.steps.slice(0, i + 1).map((st, k) => {
      const revealed = k < i;
      return h('div', { class: `step ${revealed ? 'revealed' : ''}` },
        h('div', { html: `<b>Step ${k + 1}.</b> ${st.prompt}` }),
        revealed ? h('div', { class: 'ans', html: st.answer }) : h('div', { class: 'muted small' }, 'Think about it (or write it down) before you reveal.'));
    }));
    btn.textContent = `Reveal step ${i + 1}`;
  };
  btn.onclick = () => {
    i++;
    sfx('click');
    if (i >= w.steps.length) { renderSteps2(); btn.remove(); if (w.takeaway) card.append(h('div', { class: 'tip', html: w.takeaway })); return; }
    renderSteps();
  };
  const renderSteps2 = () => stepsBox.replaceChildren(...w.steps.map((st, k) =>
    h('div', { class: 'step revealed' }, h('div', { html: `<b>Step ${k + 1}.</b> ${st.prompt}` }), h('div', { class: 'ans', html: st.answer }))));
  renderSteps();
  card.append(stepsBox, btn);
  return card;
}

// ---------- finished topic: overview + practice ----------
function sectionOverview(s) {
  const ids = s.quiz.map(q => q.id);
  const m = store.mastery(s.id, ids);
  const next = store.nextReview(ids);
  const boxes = ids.map(id => store.get().cards[id]?.box || 1);
  const strong = boxes.filter(b => b >= 4).length;
  app.replaceChildren(
    back(`#/u/${s.unit}`, `Unit ${s.unit}`),
    h('h1', { style: 'margin-top:6px' }, `${s.id} ${s.title}`),
    h('div', { class: 'card hero' },
      h('div', { class: 'eyebrow' }, icon('circle-check'), 'Lesson done'),
      h('h2', {}, `Mastery ${Math.round(m * 100)}%`),
      h('div', { class: 'bar', style: 'margin:8px 0 12px' }, h('span', { style: `width:${m * 100}%` })),
      h('p', {}, 'Finishing the lesson is step one. Mastery shows how well these ',
        h('b', {}, `${ids.length} questions`), ' are stored in your long-term memory. It grows each time you get one right in ',
        h('b', {}, 'Review'), ', which brings them back after 1, 3, 7 and 16 days. Spacing them out is what makes them stick.'),
      h('p', { class: 'muted' }, `${strong}/${ids.length} questions locked in so far. `,
        next ? `Next review for this topic: ${store.relDay(next)}.` : ''),
      h('div', { class: 'row' },
        h('a', { class: 'btn', href: `#/s/${s.id}/practice` }, icon('target'), 'Practise this topic now'),
        h('a', { class: 'btn ghost', href: '#/review' }, icon('rotate-ccw'), 'Go to Review'))),
    h('div', { class: 'card' }, h('h2', {}, 'Revisit any part'),
      h('div', { class: 'row' }, STEPS.map(x => h('a', { class: 'btn ghost small', href: `#/s/${s.id}/${x.key}` }, icon(x.icon), x.label))),
      store.get().explains[s.id] ? h('div', { class: 'example plain', style: 'margin-top:14px;white-space:pre-wrap' }, h('b', {}, 'Your explanation: '), store.get().explains[s.id].text) : null));
}

function practiceView(s) {
  const holder = h('div');
  app.replaceChildren(
    back(`#/s/${s.id}`, `${s.id} overview`),
    h('h1', { style: 'margin-top:6px' }, `Practise ${s.id} ${s.title}`),
    h('p', { class: 'muted' }, 'Extra practice, in a new order. Mistakes come back in Review sooner. Questions that aren\'t due yet don\'t move up here: only Review on the right day does that.'),
    holder);
  runQuiz(holder, shuffle(s.quiz).map(q => ({ q, sec: s.id })), {
    mode: 'practice', title: 'Practice', xpRight: 4, xpRetry: 1,
    onFinish: ({ right, total }) => holder.replaceChildren(h('div', { class: 'card hero' },
      h('h2', {}, `${right}/${total} first try`),
      h('p', {}, right === total ? 'Perfect. Come back for Review when these questions are due.' : 'The ones you missed are now due in Review. Do them again later today or tomorrow.'),
      h('div', { class: 'row' }, h('a', { class: 'btn', href: `#/s/${s.id}` }, 'Back to topic'), h('a', { class: 'btn ghost', href: '#/' }, 'Home'))))
  });
}

// ---------- review (spaced + interleaved) ----------
function reviewView() {
  let ids = shuffle(store.dueCards().filter(id => questionIndex.has(id))).slice(0, 12);
  let extra = false;
  if (!ids.length) {
    const seen = Object.entries(store.get().cards).filter(([id]) => questionIndex.has(id)).sort((a, b) => a[1].box - b[1].box);
    ids = shuffle(seen.slice(0, 10).map(([id]) => id));
    extra = true;
  }
  const head = h('div', {}, back('#/', 'Home'), h('h1', { style: 'margin-top:6px' }, 'Review'),
    h('p', { class: 'muted' }, extra ? 'Nothing due today. Here is some bonus practice on your weakest questions.' : 'Mixed questions from different topics. Mixing is harder, and that is why it works.'));
  const holder = h('div');
  app.replaceChildren(head, holder);
  if (!ids.length) { holder.append(h('div', { class: 'card' }, h('p', {}, 'Do a lesson first, then its questions will show up here.'), h('a', { class: 'btn', href: '#/' }, 'Go to lessons'))); return; }
  runQuiz(holder, ids.map(id => questionIndex.get(id)), {
    mode: 'review', title: 'Review', xpRight: 8,
    onFinish: ({ right, total }) => {
      confetti(40);
      holder.replaceChildren(h('div', { class: 'card hero' }, h('h2', {}, `Review done: ${right}/${total}`),
        h('p', {}, 'Each one you got right moves to a later review date. That is how it goes into long-term memory.'),
        h('a', { class: 'btn', href: '#/' }, 'Home')));
    }
  });
}

// ---------- boss battle ----------
function bossView(unit) {
  // A unit's own battle, or (from Home) everything built so far.
  const key = unit ? unit.id : BUILT.length === 1 ? BUILT[0].id : 'all';
  const scope = unit ? [unit] : BUILT;
  const name = scope.length === 1 ? `Unit ${scope[0].id}` : 'All units';
  const pool = scope.flatMap(u => u.sections).flatMap(s => s.quiz.filter(q => q.type !== 'sort').map(q => ({ q, sec: s.id })));
  const qs = shuffle(pool).slice(0, 15);
  const bests = store.bossBests();
  const best = bests[key];
  const start = Date.now();
  const head = h('div', {}, back(unit ? `#/u/${unit.id}` : '#/', unit ? `Unit ${unit.id}` : 'Home'), h('h1', { style: 'margin-top:6px' }, `Boss Battle: ${name}`),
    h('p', { class: 'muted' }, `15 mixed questions from ${scope.length === 1 ? `all of Unit ${scope[0].id}` : 'every unit so far'}. ${best ? `Your best: ${best.score}/15 in ${best.secs}s.` : 'Set your first record.'}`));
  const holder = h('div');
  app.replaceChildren(head, holder);
  runQuiz(holder, qs, {
    mode: 'boss', title: 'Boss', xpRight: 12,
    onFinish: ({ right }) => {
      const secs = Math.round((Date.now() - start) / 1000);
      const record = !best || right > best.score || (right === best.score && secs < best.secs);
      if (record) { bests[key] = { score: right, secs }; store.save(); confetti(120); sfx('level'); }
      store.log('boss', { unit: key, score: right, secs });
      holder.replaceChildren(h('div', { class: 'card hero' }, record ? h('div', { class: 'eyebrow' }, icon('trophy'), 'New record!') : null, h('h2', {}, `${right}/15`),
        h('p', {}, `Time: ${secs}s. ${right >= 12 ? 'Exam ready on this unit.' : right >= 8 ? 'Getting there. Review mode will fix the gaps.' : 'Do the lessons and reviews, then come back for revenge.'}`),
        h('div', { class: 'row' }, h('a', { class: 'btn', href: location.hash, onclick: () => setTimeout(route, 0) }, 'Rematch'), h('a', { class: 'btn ghost', href: '#/' }, 'Home'))));
    }
  });
}

// ---------- formulas ----------
function formulasView(unit) {
  const scope = (unit ? [unit] : BUILT).filter(u => u.formulas?.length);
  app.replaceChildren(h('div', {}, back(unit ? `#/u/${unit.id}` : '#/', unit ? `Unit ${unit.id}` : 'Home'),
    h('h1', { style: 'margin-top:6px' }, unit ? `Formula sheet: Unit ${unit.id}` : 'Formula sheet'),
    h('p', { class: 'muted' }, 'Every formula you need, by topic. Tap the speaker to hear one read out.')),
    ...scope.flatMap(u => [unit ? null : h('h2', { style: 'margin-top:20px' }, `${u.emoji} Unit ${u.id} · ${u.title}`), ...u.formulas.map(g => h('div', { class: 'card' }, h('h2', {}, g.group),
      g.items.map(f => h('div', {}, h('div', { class: 'spread' }, h('b', {}, f.name, f.hl ? h('span', { class: 'tag' }, 'HL') : null), speakButton(f.name + ': ' + f.f)),
        h('div', { class: 'formula', html: f.f }), f.note ? h('p', { class: 'muted small', html: f.note }) : null))))]).filter(Boolean));
}

// ---------- settings ----------
function settingsView() {
  const st = store.get().settings;
  const voiceSel = h('select', {}, h('option', { value: '' }, 'Automatic (best English voice)'));
  const fillVoices = () => {
    voiceSel.replaceChildren(h('option', { value: '' }, 'Automatic (best English voice)'),
      ...voices().map(v => h('option', { value: v.name, selected: v.name === st.voice }, `${v.name} (${v.lang})`)));
  };
  fillVoices();
  if (canSpeak()) speechSynthesis.onvoiceschanged = fillVoices;
  voiceSel.onchange = () => store.setSetting('voice', voiceSel.value);
  const toggle = (key, label) => {
    const c = h('input', { type: 'checkbox', checked: st[key] });
    c.onchange = () => store.setSetting(key, c.checked);
    return h('label', { class: 'row', style: 'margin:10px 0' }, c, label);
  };
  const theme = h('select', {}, ['auto', 'dark', 'light'].map(t => h('option', { value: t, selected: st.theme === t }, t)));
  theme.onchange = () => { store.setSetting('theme', theme.value); applyTheme(); };
  app.replaceChildren(back('#/', 'Home'), h('h1', { style: 'margin-top:6px' }, 'Settings'),
    h('div', { class: 'card' },
      toggle('sound', 'Sound effects'),
      toggle('autoRead', 'Read every card aloud automatically'),
      h('div', { class: 'slider' }, h('label', {}, 'Voice'), voiceSel),
      ui_rate(st),
      h('button', { class: 'btn ghost small', onclick: () => speak(APP.voiceTest) }, icon('volume-2'), 'Test voice'),
      h('div', { class: 'slider', style: 'margin-top:16px' }, h('label', {}, 'Theme'), theme)));
}
function ui_rate(st) {
  const out = h('b', {}, `${st.rate}×`);
  const r = h('input', { type: 'range', min: .7, max: 1.5, step: .1, value: st.rate });
  r.oninput = () => { out.textContent = `${r.value}×`; store.setSetting('rate', +r.value); };
  return h('div', { class: 'slider' }, h('label', {}, h('span', {}, 'Reading speed'), out), r);
}

// ---------- usage stats ----------
function statsView() {
  const st = store.get();
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return store.today(d); });
  const totalMin = Math.round(Object.values(st.days).reduce((a, d) => a + d.ms, 0) / 60000);
  const activeDays = Object.values(st.days).filter(d => d.xp > 0).length;
  const answers = st.log.filter(l => l.type === 'answer');
  const reviewAns = answers.filter(a => a.mode === 'review');
  const reviewAcc = reviewAns.length ? reviewAns.filter(a => a.ok).length / reviewAns.length * 100 : null;

  const chart = barChart(days.map(d => ({ label: d.slice(8), value: Math.round((st.days[d]?.ms || 0) / 60000), color: 'var(--chart-2)' })),
    { showValues: true, height: 220, hLines: [{ y: 10, label: '10 min goal', color: 'var(--warn)' }] });

  const rows = BUILT.flatMap(u => [h('tr', { class: 'head' }, h('td', { colspan: 5 }, `${u.emoji} Unit ${u.id} · ${u.title}`)), ...u.sections.map(s => {
    const p = st.sections[s.id];
    const ft = p?.firstTry;
    const r = st.ratings[s.id];
    return h('tr', {},
      h('td', {}, `${s.id} ${s.title}`),
      h('td', {}, p?.done ? h('span', { title: 'Done', style: 'color:var(--good)' }, icon('circle-check')) : p && Object.keys(p.steps).length ? h('span', { title: 'In progress', class: 'muted' }, icon('hourglass')) : '–'),
      h('td', {}, ft?.total ? pct(ft.right / ft.total * 100, 0) : '–'),
      h('td', {}, pct(store.mastery(s.id, s.quiz.map(q => q.id)) * 100, 0)),
      h('td', {}, r ? `${['', '😴', '🙂', '🔥'][r.fun] || ''} ${['', 'easy', 'right', 'hard'][r.difficulty] || ''}` : '–'));
  })]);
  const bossBests = Object.entries(store.bossBests());

  const wrongs = Object.entries(st.cards).filter(([id, c]) => c.wrong > 0 && questionIndex.has(id))
    .sort((a, b) => b[1].wrong - a[1].wrong).slice(0, 8);
  const explains = Object.entries(st.explains);

  const exportBtn = h('button', { class: 'btn ghost small' }, icon('arrow-down'), 'Export progress');
  exportBtn.onclick = () => {
    const blob = new Blob([store.exportJSON()], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `${APP.name.toLowerCase()}-progress-${store.today()}.json` });
    a.click();
  };
  const importInput = h('input', { type: 'file', accept: 'application/json', class: 'hidden' });
  importInput.onchange = async () => {
    try { store.importJSON(await importInput.files[0].text()); toast('Progress imported'); route(); }
    catch { toast('That file could not be read'); }
  };

  app.replaceChildren(back('#/', 'Home'), h('h1', { style: 'margin-top:6px' }, 'Usage stats'),
    h('p', { class: 'muted' }, 'Progress is stored in this browser on this device only. Use Export to save or share a copy.'),
    h('div', { class: 'kpis' },
      kpi(`${store.streak()}`, 'day streak'), kpi(`${activeDays}`, 'active days'), kpi(`${totalMin}`, 'minutes total'),
      kpi(`${st.xp}`, `XP · ${store.levelName()}`), kpi(reviewAcc == null ? '–' : pct(reviewAcc, 0), 'review accuracy', reviewAcc == null ? '' : reviewAcc >= 70 ? 'good' : 'warn'),
      kpi(bossBests.length ? bossBests.map(([, b]) => `${b.score}/15`).join(' · ') : '–', bossBests.length ? `Boss best (${bossBests.map(([u]) => u === 'all' ? 'all units' : `Unit ${u}`).join(' · ')})` : 'Boss best')),
    h('div', { class: 'card' }, h('h2', {}, 'Minutes per day (last 14 days)'), chart),
    h('div', { class: 'card' }, h('h2', {}, 'Sections'), h('div', { class: 'table-wrap' }, h('table', { class: 'fin' },
      h('tr', {}, h('th', {}, 'Section'), h('th', {}, 'Done'), h('th', {}, '1st-try'), h('th', {}, 'Mastery'), h('th', {}, 'Rating')), rows)),
      h('p', { class: 'muted small', style: 'margin-top:8px' }, '1st-try = quiz accuracy on first attempt. Mastery = how far the questions have moved up the spaced-review boxes (100% = remembered on several spaced reviews).')),
    h('div', { class: 'card' }, h('h2', {}, 'Most-missed questions'),
      wrongs.length ? h('ol', {}, wrongs.map(([id, c]) => h('li', { html: `${questionIndex.get(id).q.q} <span class="muted small">(${c.wrong}× wrong, ${c.right}× right)</span>` })))
        : h('p', { class: 'muted' }, 'None yet.')),
    h('div', { class: 'card' }, h('h2', {}, '"Explain it" answers'),
      explains.length ? explains.map(([id, e]) => h('div', { class: 'example plain', style: 'white-space:pre-wrap' }, h('b', {}, `${id} ${findSection(id)?.title || ''}: `), e.text))
        : h('p', { class: 'muted' }, 'None yet.')),
    h('div', { class: 'row' }, exportBtn, h('button', { class: 'btn ghost small', onclick: () => importInput.click() }, 'Import'), importInput,
      h('button', { class: 'btn ghost small', onclick: () => { if (confirm('Delete all progress on this device?')) { store.reset(); route(); } } }, 'Reset progress')));
}
const kpi = (v, l, cls = '') => h('div', { class: `kpi ${cls}` }, h('div', { class: 'v' }, v), h('div', { class: 'l' }, l));

// Typeset $$…$$ formulas whenever a view or card is (re)rendered.
let typesetQueued = false;
new MutationObserver(() => {
  if (typesetQueued) return;
  typesetQueued = true;
  setTimeout(() => { typesetQueued = false; linkTerms(app); typeset(app); });
}).observe(app, { childList: true, subtree: true });
addEventListener('resize', () => fitFormulas(app));

// Brand from js/config.js (index.html carries the same values for the first paint).
document.title = `${APP.name} · ${APP.course}`;
document.querySelector('.brand').replaceChildren(h('span', { class: 'brand-icon' }, icon(APP.icon)), APP.name);

applyTheme();
route();
