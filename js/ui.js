// Small DOM, formatting and SVG chart helpers shared by every view.
import { speak, stopSpeaking, htmlToSpeech, canSpeak, sfx } from './audio.js';
import * as store from './store.js';
import { icon } from './icons.js';

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'class') el.className = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export const money = (n, dp = 0) =>
  (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
export const pct = (n, dp = 1) => `${n.toFixed(dp)}%`;
export const round = (n, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp;

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

let toastTimer;
export function toast(msg, iconName) {
  const t = document.getElementById('toast');
  t.replaceChildren(...(iconName ? [icon(iconName)] : []), msg);
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

export function confetti(n = 40) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#ffd60a', '#121212', '#ffe566', '#9a9a94', '#ffffff'];
  for (let i = 0; i < n; i++) {
    const c = h('div', { class: 'confetti' });
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = Math.random() * .4 + 's';
    document.body.append(c);
    setTimeout(() => c.remove(), 2200);
  }
}

/** Gives XP with sound, toast and level-up celebration. */
export function reward(xp, msg) {
  const up = store.addXP(xp);
  renderStats();
  if (up) { sfx('level'); confetti(80); toast(`Level up! You're now: ${store.levelName()}`, 'party-popper'); }
  else if (msg) toast(`${msg} +${xp} XP`, 'zap');
}

export function renderStats() {
  const el = document.getElementById('stats');
  const s = store.streak();
  el.replaceChildren(
    h('span', { class: 'pill', title: 'Daily streak' }, icon('flame'), h('span', { class: 'n' }, s)),
    h('span', { class: 'pill', title: 'Experience points' }, icon('zap'), h('span', { class: 'n' }, store.get().xp), 'XP'),
    h('span', { class: 'pill hide-sm', title: 'Level' }, icon('graduation-cap'), store.levelName())
  );
}

/** Speaker button that reads the given HTML (or a function returning it). */
export function speakButton(getHtml) {
  if (!canSpeak()) return null;
  let on = false;
  const b = h('button', { class: 'icon-btn', title: 'Read aloud', 'aria-label': 'Read aloud' }, icon('volume-2'));
  b.onclick = () => {
    if (on) { stopSpeaking(); return; }
    on = true; b.replaceChildren(icon('square'));
    speak(htmlToSpeech(typeof getHtml === 'function' ? getHtml() : getHtml), () => { on = false; b.replaceChildren(icon('volume-2')); });
  };
  return b;
}

export function slider({ label, min, max, step = 1, value, fmt = v => v, oninput }) {
  const out = h('b', {}, fmt(value));
  const input = h('input', { type: 'range', min, max, step, value });
  input.addEventListener('input', () => { out.textContent = fmt(+input.value); oninput(+input.value); });
  const wrap = h('div', { class: 'slider' }, h('label', {}, h('span', {}, label), out), input);
  wrap.set = v => { input.value = v; out.textContent = fmt(v); };
  return wrap;
}

// ---- SVG charts (dependency-free) ----
const NS = 'http://www.w3.org/2000/svg';
export function svg(tag, attrs = {}, ...children) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  for (const c of children.flat()) if (c != null) el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return el;
}

function niceMax(v) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v)), n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}
const short = n => {
  const a = Math.abs(n), s = n < 0 ? '−' : '';
  return a >= 1e6 ? `${s}${round(a / 1e6, 1)}m` : a >= 1e3 ? `${s}${round(a / 1e3, 1)}k` : `${s}${round(a, 1)}`;
};

/**
 * Line chart. series: [{ name, color, points: [[x, y], ...], dash }]
 * opts: { xLabel, yLabel, markers: [{x, label, color}], hLines: [{y, label, color}], yMin }
 */
export function lineChart(series, opts = {}) {
  const W = 560, H = 300, L = 54, R = 14, T = 16, B = opts.xLabel ? 58 : 40;
  const xs = series.flatMap(s => s.points.map(p => p[0]));
  const ys = series.flatMap(s => s.points.map(p => p[1])).concat((opts.hLines || []).map(l => l.y));
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  let yMax = niceMax(Math.max(...ys, 0)), yMin = Math.min(opts.yMin ?? 0, ...ys);
  if (yMin < 0) yMin = -niceMax(-yMin);
  const X = x => L + (x - xMin) / (xMax - xMin || 1) * (W - L - R);
  const Y = y => T + (yMax - y) / (yMax - yMin || 1) * (H - T - B);
  const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img', 'aria-label': opts.title || 'Chart' });
  for (let i = 0; i <= 4; i++) {
    const v = yMin + (yMax - yMin) * i / 4;
    root.append(svg('line', { x1: L, x2: W - R, y1: Y(v), y2: Y(v), class: 'axis', 'stroke-opacity': .5 }),
      svg('text', { x: L - 6, y: Y(v) + 4, 'text-anchor': 'end' }, short(v)));
  }
  if (yMin < 0) root.append(svg('line', { x1: L, x2: W - R, y1: Y(0), y2: Y(0), stroke: 'var(--muted)', 'stroke-width': 1.5 }));
  const xt = opts.xTicks || [xMin, xMin + (xMax - xMin) / 2, xMax];
  xt.forEach(x => root.append(svg('text', { x: X(x), y: H - B + 16, 'text-anchor': 'middle' }, opts.xFmt ? opts.xFmt(x) : short(x))));
  if (opts.xLabel) root.append(svg('text', { x: (L + W - R) / 2, y: H - B + 34, 'text-anchor': 'middle' }, opts.xLabel));
  for (const l of opts.hLines || []) {
    root.append(svg('line', { x1: L, x2: W - R, y1: Y(l.y), y2: Y(l.y), stroke: l.color, 'stroke-dasharray': '5 4', 'stroke-width': 1.5 }),
      svg('text', { x: W - R - 4, y: Y(l.y) - 5, 'text-anchor': 'end', style: `fill:${l.color}` }, l.label));
  }
  for (const s of series) {
    const d = s.points.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
    root.append(svg('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-dasharray': s.dash || '' }));
    if (s.dots) s.points.forEach(p => root.append(svg('circle', { cx: X(p[0]), cy: Y(p[1]), r: 4, fill: s.color })));
  }
  for (const m of opts.markers || []) {
    root.append(svg('line', { x1: X(m.x), x2: X(m.x), y1: T, y2: H - B, stroke: m.color, 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }),
      svg('text', { x: X(m.x) + 4, y: T + 12, style: `fill:${m.color}` }, m.label));
  }
  // legend
  let lx = L;
  series.filter(s => s.name).forEach(s => {
    root.append(svg('rect', { x: lx, y: H - 14, width: 10, height: 10, rx: 2, fill: s.color }),
      svg('text', { x: lx + 14, y: H - 5 }, s.name));
    lx += 22 + s.name.length * 6.5;
  });
  return root;
}

/** Bar chart. bars: [{ label, value, color }] — handles negatives. */
export function barChart(bars, opts = {}) {
  const W = 560, H = opts.height || 260, L = 54, R = 10, T = 14, B = 34;
  const vals = bars.map(b => b.value).concat(opts.hLines?.map(l => l.y) || []);
  const yMax = niceMax(Math.max(0, ...vals)), yMin = Math.min(0, ...vals) < 0 ? -niceMax(-Math.min(...vals)) : 0;
  const Y = y => T + (yMax - y) / (yMax - yMin || 1) * (H - T - B);
  const bw = (W - L - R) / bars.length;
  const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img', 'aria-label': opts.title || 'Bar chart' });
  for (let i = 0; i <= 4; i++) {
    const v = yMin + (yMax - yMin) * i / 4;
    root.append(svg('line', { x1: L, x2: W - R, y1: Y(v), y2: Y(v), class: 'axis', 'stroke-opacity': .5 }),
      svg('text', { x: L - 6, y: Y(v) + 4, 'text-anchor': 'end' }, short(v)));
  }
  bars.forEach((b, i) => {
    const x = L + i * bw + bw * .15, y0 = Y(0), y1 = Y(b.value);
    root.append(svg('rect', { x, y: Math.min(y0, y1), width: bw * .7, height: Math.max(1, Math.abs(y1 - y0)), rx: 4, fill: b.color || 'var(--chart-1)' }),
      svg('text', { x: x + bw * .35, y: H - B + 15, 'text-anchor': 'middle' }, b.label));
    if (opts.showValues) root.append(svg('text', { x: x + bw * .35, y: Math.min(y0, y1) - 4, 'text-anchor': 'middle' }, short(b.value)));
  });
  root.append(svg('line', { x1: L, x2: W - R, y1: Y(0), y2: Y(0), stroke: 'var(--muted)' }));
  for (const l of opts.hLines || []) {
    root.append(svg('line', { x1: L, x2: W - R, y1: Y(l.y), y2: Y(l.y), stroke: l.color, 'stroke-dasharray': '5 4', 'stroke-width': 1.5 }),
      svg('text', { x: W - R - 4, y: Y(l.y) - 5, 'text-anchor': 'end', style: `fill:${l.color}` }, l.label));
  }
  return root;
}
