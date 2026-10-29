// Shared helpers for writing unit content files.

// F`tex` = a displayed formula block inside card HTML; M`tex` = formula markup for the formula sheet.
// String.raw keeps TeX backslashes intact. Typeset by KaTeX via js/tex.js.
export const M = (s, ...v) => '$$' + String.raw(s, ...v) + '$$';
export const F = (s, ...v) => `<div class="formula">${M(s, ...v)}</div>`;

// tbl(head, rows) = a data table inside a quiz question.
// A(value) is a "?" cell the student fills in; A(value, true) marks the cell that is the question's answer
// (it replaces the separate answer box). The quiz engine turns these cells into inputs and marks them.
export const A = (a, final = false) => ({ a, final });
export const tbl = (head, rows) => '<div class="table-wrap"><table class="fin qtable">'
  + (head.some(Boolean) ? `<tr>${head.map(c => `<th>${c}</th>`).join('')}</tr>` : '')
  + rows.map(r => `<tr>${r.map(c => typeof c === 'object'
    ? `<td class="blank" data-a="${c.a}"${c.final ? ' data-final' : ''}>?</td>`
    : `<td>${c}</td>`).join('')}</tr>`).join('')
  + '</table></div>';
