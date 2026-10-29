// Formulas are written in TeX between $$ … $$ and typeset by KaTeX (loaded in index.html).
// texToText turns the same TeX into plain words, for read-aloud and as a fallback if KaTeX fails to load.

const MATH = /\$\$([\s\S]*?)\$\$/g;

/** Returns the brace group starting at s[i] === '{' as [content, indexAfter]. */
function group(s, i) {
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') depth++;
    else if (s[j] === '}' && --depth === 0) return [s.slice(i + 1, j), j + 1];
  }
  return [s.slice(i + 1), s.length];
}

export function texToText(tex, spoken = false) {
  let out = '', i = 0;
  while (i < tex.length) {
    const frac = tex.slice(i).match(/^\\d?frac/);
    if (frac) {
      const [num, a] = group(tex, i + frac[0].length);
      const [den, b] = group(tex, a);
      const n = texToText(num, spoken), d = texToText(den, spoken);
      out += spoken ? ` ${n}, divided by ${d}, ` : `(${n}) ÷ (${d})`;
      i = b;
    } else if (tex.startsWith('\\text', i)) {
      const [t, a] = group(tex, i + 5);
      out += t; i = a;
    } else {
      out += tex[i++];
    }
  }
  out = out.replace(/\{,\}/g, ',').replace(/\\times/g, spoken ? ' times ' : ' × ').replace(/\\div/g, spoken ? ' divided by ' : ' ÷ ')
    .replace(/\\sum/g, spoken ? ' the sum of ' : ' Σ ').replace(/\^\{?(\w)\}?/g, spoken ? ' to the power $1' : '^$1')
    .replace(/\\[,;! ]/g, ' ').replace(/[{}]/g, '');
  if (spoken) out = out.replace(/=/g, ' equals ').replace(/−|-(?=\s)/g, ' minus ').replace(/\+/g, ' plus ');
  return out.replace(/\s+/g, ' ').trim();
}

/** Replaces every $$…$$ in a string with words (for speech). */
export const speakMath = html => html.replace(MATH, (_, t) => ` ${texToText(t, true).replace(/,$/, '')}. `);

/** Shrinks display formulas that are wider than their box (phones), down to a readable minimum; the rest scrolls. */
export function fitFormulas(el) {
  for (const d of el.querySelectorAll('.katex-display')) {
    const k = d.querySelector('.katex');
    k.style.fontSize = '';
    const ratio = d.clientWidth / k.scrollWidth;
    if (ratio < 1) k.style.fontSize = `${Math.max(0.6, ratio * 0.98) * 1.12}em`;
  }
}

/** Typesets formulas inside el with KaTeX, or falls back to readable plain text. */
export function typeset(el) {
  if (!el.textContent.includes('$$')) return;
  if (window.renderMathInElement) {
    window.renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }], throwOnError: false });
    fitFormulas(el);
    return;
  }
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) if (n.nodeValue.includes('$$')) n.nodeValue = n.nodeValue.replace(MATH, (_, t) => texToText(t));
}
