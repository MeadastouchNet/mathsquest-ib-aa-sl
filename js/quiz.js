// Quiz engine. Question types:
//   mcq:  { q, options: [...], answer: index, why }
//   tf:   { q, answer: true|false, why }
//   num:  { q, answer: number, tol (absolute, default 0.5% of answer), unit, why, hint }
//   sort: { q, buckets: [...], items: [{ t, b: bucketIndex }], why }
// Every question also has { id, cmd? (IB command term) }.
import { h, shuffle, reward, speakButton } from './ui.js';
import { sfx } from './audio.js';
import { calculator } from './calc.js';
import { icon } from './icons.js';
import * as store from './store.js';

/** Parses typed numbers, including accounting brackets: "(14,000)" = −14000. */
function parseNum(s) {
  let t = String(s).trim().replace(/[$,%\s]/g, '').replace(/−/g, '-');
  if (/^\(.*\)$/.test(t)) t = '-' + t.slice(1, -1);
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(t.replace(/,/g, ''))) return null;
  const n = Number(t.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}
function numCorrect(q, v) {
  const tol = q.tol ?? Math.max(0.01, Math.abs(q.answer) * 0.005);
  return v != null && Math.abs(v - q.answer) <= tol + 1e-9;
}
const acct = n => (n < 0 ? `(${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 2 })})` : n.toLocaleString('en-US', { maximumFractionDigits: 2 }));

/**
 * Turns the "?" cells of a question's tables into inputs. Returns the cells and a mark() that checks the
 * working cells (not the final one), shows the right figure under each wrong or empty cell, and reports a summary.
 */
function setupBlanks(root, onEnter) {
  const cells = [...root.querySelectorAll('td.blank')].map(td => {
    const input = h('input', { type: 'text', inputmode: 'decimal', placeholder: '?', 'aria-label': 'Your figure for this cell', autocomplete: 'off' });
    td.replaceChildren(input);
    return { td, input, a: parseFloat(td.dataset.a), final: td.hasAttribute('data-final') };
  });
  cells.forEach((c, i) => c.input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (i < cells.length - 1) cells[i + 1].input.focus(); else onEnter();
  }));
  const mark = (finalOk) => {
    let right = 0;
    for (const c of cells) {
      const v = parseNum(c.input.value);
      const ok = c.final ? finalOk : v != null && Math.abs(v - c.a) <= Math.max(0.001, Math.abs(c.a) * 0.001);
      if (ok) right++;
      c.input.disabled = true;
      c.td.classList.add(ok ? 'right' : 'wrong');
      if (!ok) c.td.append(h('div', { class: 'cell-fix' }, acct(c.a)));
    }
    return cells.length > 1 ? ` Working: <b>${right}/${cells.length}</b> cells right${right < cells.length ? ' (the correct figures are shown in the table)' : ''}.` : '';
  };
  return { cells, mark };
}

/**
 * Renders one question into `el`. Calls done(correct) once the learner has answered and pressed Next.
 * `onAnswer(correct)` fires immediately when marked (before Next).
 */
export function renderQuestion(el, q, { meta = '', onAnswer, done } = {}) {
  el.replaceChildren();
  const fb = h('div');
  const next = h('button', { class: 'btn dark hidden', style: 'margin-top:14px' }, 'Next', icon('arrow-right'));
  let answered = false;

  const finish = (ok, extra = '') => {
    if (answered) return;
    answered = true;
    sfx(ok ? 'good' : 'bad');
    onAnswer && onAnswer(ok);
    fb.replaceChildren(h('div', { class: `feedback ${ok ? 'good' : 'bad'}`, html:
      `<b>${ok ? pickPraise() : 'Not quite.'}</b> ${extra}${q.why ? `<div style="margin-top:6px">${q.why}</div>` : ''}` }));
    next.classList.remove('hidden');
    next.focus();
  };
  next.onclick = () => done && done(answered);

  const header = h('div', { class: 'q-meta' }, h('span', {}, meta), q.cmd ? h('span', {}, `Command term: ${q.cmd}`) : null);
  const qText = h('div', { class: 'q-text', html: q.q });
  const text = h('div', { class: 'spread', style: 'align-items:start' },
    qText, speakButton(() => q.q + (q.options ? '. Options: ' + q.options.join('. ') : '')));
  el.append(header, text);
  let submit = () => {};
  const blanks = setupBlanks(qText, () => submit());
  // The calculator's result goes into whichever box the student used last (a table cell or the answer box).
  let target = null;
  el.addEventListener('focusin', e => { if (e.target.matches('input[inputmode=decimal]')) target = e.target; });
  const insertResult = v => {
    const t = (target && !target.disabled) ? target : blanks.cells.find(c => !c.input.value)?.input;
    if (t && !t.disabled) { t.value = String(v); t.focus(); }
  };

  if (q.type === 'mcq' || q.type === 'tf') {
    const opts = q.type === 'tf'
      ? [{ label: 'True', val: true }, { label: 'False', val: false }]
      : shuffle(q.options.map((o, i) => ({ label: o, val: i })));
    const wrap = h('div', { class: 'options' });
    const buttons = opts.map((o, i) => {
      const b = h('button', { class: 'opt' }, h('span', { class: 'opt-key' }, 'ABCDEFGH'[i]), h('span', { html: o.label }));
      b.onclick = () => {
        const ok = o.val === q.answer;
        buttons.forEach((x, i) => {
          x.disabled = true;
          if (opts[i].val === q.answer) x.classList.add('correct'), x.append(h('span', { class: 'opt-mark' }, icon('check')));
        });
        if (!ok) b.classList.add('wrong'), b.append(h('span', { class: 'opt-mark' }, icon('x')));
        finish(ok);
      };
      return b;
    });
    wrap.append(...buttons);
    el.append(wrap);
    if (q.cmd === 'Calculate') el.append(calculator({ keys: q.calcKeys, useAnswer: blanks.cells.length ? insertResult : undefined }));
  } else if (q.type === 'num') {
    // If a table has the answer cell, that cell is the answer box.
    const finalCell = blanks.cells.find(c => c.final);
    const input = finalCell ? finalCell.input
      : h('input', { type: 'text', inputmode: 'decimal', placeholder: 'Your answer', 'aria-label': 'Your answer' });
    const check = h('button', { class: 'btn' }, 'Check');
    const hint = q.hint ? h('button', { class: 'btn ghost small' }, icon('lightbulb'), 'Hint') : null;
    const hintBox = h('div', { class: 'muted small', style: 'margin-top:8px' });
    if (hint) hint.onclick = () => { hintBox.innerHTML = q.hint; hint.remove(); };
    submit = () => {
      const v = parseNum(input.value);
      if (v == null) { input.focus(); return; }
      input.disabled = check.disabled = true;
      const ok = numCorrect(q, v);
      const working = blanks.mark(ok);
      finish(ok, (ok ? '' : `The answer is <b>${q.display || q.answer}${q.unit && !q.display ? ' ' + q.unit : ''}</b>.`) + working);
    };
    check.onclick = submit;
    if (!finalCell) input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    el.append(finalCell
      ? h('div', { class: 'num-input', style: 'margin-top:12px' }, check, h('span', { class: 'muted small' }, 'Fill in the ? cells, then check.'))
      : h('div', { class: 'num-input' }, input, q.unit ? h('span', { class: 'muted' }, q.unit) : null, check),
      h('div', {}, hint, hintBox), calculator({ keys: q.calcKeys, useAnswer: insertResult }));
    setTimeout(() => (blanks.cells[0]?.input || input).focus(), 50);
  } else if (q.type === 'sort') {
    el.append(sortWidget(q, ok => finish(ok, ok ? '' : 'Wrong ones are in red; the right bucket is shown in green.')));
  }
  el.append(fb, next);
}

/** Sort/classify widget, also reused by labs. onChecked(allCorrect). */
export function sortWidget(q, onChecked, { retry = false } = {}) {
  const chosen = new Map();
  const items = shuffle(q.items);
  const rows = items.map(it => {
    const chips = q.buckets.map((b, bi) => {
      const c = h('button', { class: 'chip' }, b);
      c.onclick = () => {
        if (c.disabled) return;
        chosen.set(it, bi);
        chips.forEach(x => x.classList.remove('sel'));
        c.classList.add('sel');
        sfx('click');
        check.disabled = chosen.size < items.length;
      };
      return c;
    });
    it._chips = chips;
    return h('div', { class: 'sort-item' }, h('span', { html: it.t }), h('div', { class: 'choices' }, chips));
  });
  const check = h('button', { class: 'btn', disabled: true, style: 'margin-top:12px' }, 'Check');
  check.onclick = () => {
    let all = true;
    for (const it of items) {
      const pick = chosen.get(it);
      it._chips.forEach((c, bi) => {
        c.disabled = true;
        c.classList.remove('sel');
        if (bi === it.b) c.classList.add('right');
        else if (bi === pick) c.classList.add('wrongc');
      });
      if (pick !== it.b) all = false;
    }
    check.remove();
    onChecked(all, items.filter(it => chosen.get(it) === it.b).length, items.length);
  };
  return h('div', {}, h('div', { class: 'card flat', style: 'padding:8px 14px;margin:0' }, rows), check);
}

const PRAISE = ['Nice!', 'Correct!', 'Spot on.', 'Yes!', 'Nailed it.', 'Exactly.', 'Good reasoning.'];
const pickPraise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

/**
 * Runs a list of questions. Wrong answers are asked once more at the end (not counted as first attempts).
 * questions: [{ q, sec }]. Calls onFinish({ right, total }) with first-attempt score.
 */
export function runQuiz(el, questions, { mode = 'lesson', title = 'Quiz', xpRight = 10, xpRetry = 3, onFinish } = {}) {
  const queue = questions.map(x => ({ ...x, first: true }));
  let i = 0, right = 0, total = questions.length;
  const box = h('div', { class: 'card' });
  const progress = h('div', { class: 'bar', style: 'margin-bottom:12px' }, h('span', { style: 'width:0%' }));
  el.replaceChildren(progress, box);

  const step = () => {
    if (i >= queue.length) { onFinish && onFinish({ right, total }); return; }
    const item = queue[i];
    progress.firstChild.style.width = `${(i / queue.length) * 100}%`;
    const meta = item.first ? `${title} · ${i + 1} / ${queue.length}` : 'Second chance';
    renderQuestion(box, item.q, {
      meta,
      onAnswer: ok => {
        store.recordAnswer(item.q, item.sec, ok, { firstAttempt: item.first, mode });
        if (ok) { if (item.first) right++; reward(item.first ? xpRight : xpRetry); }
        else if (item.first) queue.push({ ...item, first: false });
      },
      done: () => { i++; step(); }
    });
  };
  step();
}
