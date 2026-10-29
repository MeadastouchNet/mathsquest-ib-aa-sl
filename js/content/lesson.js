// A compact authoring helper; all mathematical content is supplied per lesson.
import { F, M, tbl, A } from './helpers.js';
export { F, M, tbl, A };
export const mc = (q, options, answer, why, cmd = 'Find') => ({type:'mcq', q, options, answer, why, cmd});
export const num = (q, answer, why, tol = 0.001) => ({type:'num', q, answer, why, tol, cmd:'Calculate'});
export const tf = (q, answer, why) => ({type:'tf', q, answer, why});
export function lesson(id, title, hook, cards, example, questions, explain, extraLabs = []) {
  return {id, title, emoji:'∑', minutes:12, hl:false, goal:explain,
    hook, cards:cards.map(([title,html])=>({title,html})),
    labs:[{type:'scenarios', title:`${title}: choose your method`, challenge:'Solve both decisions and explain why the alternatives fail.',
      items:questions.filter(q=>q.type==='mcq').slice(0,2).map(q=>({s:q.q, options:q.options.map((t,i)=>({t,ok:i===q.answer,fb:i===q.answer?q.why:'Try again. '+q.why}))}))}, ...extraLabs],
    worked:{title:example[0], intro:example[1], steps:example.slice(2).map(([prompt,answer])=>({prompt,answer})), takeaway:'State the method, keep exact values until the end, and check the result in context.'},
    quiz:questions.map((q,i)=>({...q,id:`${id}-${i+1}`})),
    explain:`Explain to a friend how to ${explain} Use one numerical example and name a common mistake.`};
}
