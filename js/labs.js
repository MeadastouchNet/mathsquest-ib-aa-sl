// Interactive "Play" labs. Each lab gets a container and calls onWin() once its challenge is beaten.
import { h, money, pct, round, slider, svg, lineChart, barChart, speakButton, toast, shuffle } from './ui.js';
import { sortWidget } from './quiz.js';
import { sfx } from './audio.js';
import { icon } from './icons.js';

export function renderLab(el, lab, onWin) {
  const fn = LABS[lab.type];
  if (!fn) { el.append(h('p', {}, `Unknown lab: ${lab.type}`)); return; }
  fn(el, lab, onWin);
}

function challengeBox(text) {
  const box = h('div', { class: 'challenge', html: text });
  box.win = msg => { if (box.classList.contains('won')) return false; box.classList.add('won'); box.innerHTML = `✅ ${msg || text}`; return true; };
  return box;
}

/** A list of challenges checked in order; onWin fires when all are beaten. */
function challengeList(texts, onWin) {
  const boxes = texts.map(t => challengeBox(t));
  const done = new Set();
  const wrap = h('div', {}, boxes);
  wrap.check = results => {
    results.forEach((ok, i) => {
      if (ok && !done.has(i)) { done.add(i); boxes[i].win(); sfx('good'); toast('Challenge done!'); }
    });
    if (done.size === texts.length && !wrap.fired) { wrap.fired = true; onWin(); }
  };
  return wrap;
}

const LABS = {
  // ------------------------------------------------------------ classify
  sort(el, lab, onWin) {
    const render = () => {
      el.replaceChildren(h('h2', {}, icon('gamepad-2'), lab.title), challengeBox(lab.challenge));
      const ch = el.lastChild;
      el.append(sortWidget({ buckets: lab.buckets, items: lab.items }, (all, right, total) => {
        if (all) { ch.win(`${lab.challenge} Done!`); onWin(); }
        else el.append(h('p', { class: 'muted', style: 'margin-top:10px' }, `${right}/${total} correct.`),
          h('button', { class: 'btn ghost', onclick: render }, icon('rotate-ccw'), 'Shuffle and try again'));
      }));
    };
    render();
  },

  // ------------------------------------------------------------ pick the best option per scenario
  scenarios(el, lab, onWin) {
    const solved = new Set();
    const ch = challengeBox(lab.challenge);
    el.append(h('h2', {}, icon('gamepad-2'), lab.title), ch);
    lab.items.forEach((it, i) => {
      const fb = h('div');
      const opts = shuffle(it.options).map(o => {
        const b = h('button', { class: 'opt', html: o.t });
        b.onclick = () => {
          b.classList.add(o.ok ? 'correct' : 'wrong');
          sfx(o.ok ? 'good' : 'bad');
          fb.replaceChildren(h('div', { class: `feedback ${o.ok ? 'good' : 'bad'}` }, o.fb));
          if (o.ok) {
            opts.forEach(x => { x.disabled = true; });
            solved.add(i);
            if (solved.size === lab.items.length && ch.win()) onWin();
          }
        };
        return b;
      });
      el.append(h('div', { class: 'card flat', style: 'background:var(--card-2)' },
        h('div', { class: 'spread', style: 'align-items:start' }, h('p', { html: `<b>${i + 1}.</b> ${it.s}` }), speakButton(it.s)),
        h('div', { class: 'options' }, opts), fb));
    });
  },

  sequence(el, lab, onWin) {
    const output=h('div'), chart=h('div');
    const ch=challengeList(['Set the ratio so the first term 40 becomes 320 at term 4.','Then find a ratio that gives positive decay.'],onWin);
    let ratio=1;
    const update=()=>{
      const values=Array.from({length:6},(_,i)=>40*ratio**i),max=Math.max(1,...values);
      output.textContent=`Ratio ${ratio.toFixed(1)} · term 4: ${values[3].toFixed(2)} · six-term total: ${values.reduce((a,b)=>a+b,0).toFixed(2)}`;
      chart.innerHTML=`<svg viewBox="0 0 340 240" role="img" aria-label="Six sequence terms; maximum height is ${max}" style="width:100%"><path d="M25 15V210H330" stroke="var(--muted)" fill="none"/>${values.map((v,i)=>`<rect x="${35+i*48}" y="${210-v/max*180}" width="28" height="${v/max*180}" fill="var(--accent)"/><text x="${49+i*48}" y="230" text-anchor="middle" fill="var(--text)" font-size="12">${i+1}</text>`).join('')}</svg>`;
      ch.check([Math.abs(ratio-2)<0.001,ratio>0&&ratio<1]);
    };
    el.append(h('h2',{},'Growth studio'),h('p',{class:'muted'},'Change the multiplier and watch the first six terms. The first term stays at 40.'),ch,
      slider({label:'Common ratio',min:0,max:2.5,step:0.1,value:ratio,fmt:v=>v.toFixed(1),oninput:v=>{ratio=v;update();}}),output,chart);
    update();
  },
  parabola(el, lab, onWin) {
    let a=1,shift=0,height=0;
    const output=h('div'), chart=h('div');
    const ch=challengeList(['Move the vertex to (3, −4).','Keep the vertex and make the graph open downwards.'],onWin);
    const update=()=>{
      output.textContent=`y = ${a}(x − ${shift})² + (${height}) · vertex (${shift}, ${height})`;
      const points=Array.from({length:81},(_,i)=>{const x=-5+i/8;return `${30+(x+5)*28},${180-(a*(x-shift)**2+height)*10}`;}).join(' ');
      chart.innerHTML=`<svg viewBox="0 0 340 320" role="img" aria-label="Parabola on axes: x from minus 5 to 5; y from minus 12 to 16" style="width:100%;max-height:320px"><defs><clipPath id="plot"><rect x="30" y="20" width="280" height="280"/></clipPath></defs><path d="M30 180H310 M170 20V300" stroke="var(--muted)"/><g fill="var(--text)" font-size="12"><text x="300" y="175">x</text><text x="177" y="28">y</text><text x="28" y="196">−5</text><text x="300" y="196">5</text><text x="177" y="196">0</text></g><polyline points="${points}" clip-path="url(#plot)" fill="none" stroke="var(--accent)" stroke-width="3"/></svg>`;
      ch.check([shift===3&&height===-4,shift===3&&height===-4&&a<0]);
    };
    el.append(h('h2',{},'Parabola studio'),h('p',{class:'muted'},'Change one parameter at a time. Parts outside the viewing window are clipped.'),ch,
      slider({label:'Vertical factor a',min:-3,max:3,step:1,value:a,fmt:String,oninput:v=>{a=v;update();}}),
      slider({label:'Horizontal shift h',min:-4,max:4,step:1,value:shift,fmt:String,oninput:v=>{shift=v;update();}}),
      slider({label:'Vertical shift k',min:-6,max:6,step:1,value:height,fmt:String,oninput:v=>{height=v;update();}}),output,chart);
    update();
  },
};
