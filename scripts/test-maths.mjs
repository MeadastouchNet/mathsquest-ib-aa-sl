import assert from 'node:assert/strict';
globalThis.window=globalThis;
globalThis.document={getElementById:()=>null,addEventListener(){}};
globalThis.localStorage={getItem:()=>null,setItem(){}};
globalThis.addEventListener=()=>{};
const {evaluate}=await import('../js/calc.js');
for(const [expression,mode,expected] of [
 ['2^3^2','RAD',512],['-2^2','RAD',-4],['2^-3','RAD',.125],
 ['sqrt(169)','RAD',13],['sin(30)','DEG',.5],['cos(π)','RAD',-1],
 ['asin(0.5)','DEG',30],['ln(exp(2))','RAD',2],['log(1000)','RAD',3],
 ['ln(10)/ln(2)','RAD',Math.log2(10)],['1000(1.05)^2','RAD',1102.5],
 ['0.000000000001','RAD',1e-12],['1e-12*2','RAD',2e-12]
])assert.ok(Math.abs(evaluate(expression,mode)-expected)<Math.max(1e-14,Math.abs(expected)*1e-12),expression);
for(const bad of ['1/0','sqrt(-1)','ln(0)','2abc','alert(1)']) assert.throws(()=>evaluate(bad),bad);
assert.throws(()=>evaluate('tan(90)','DEG'));
const {UNITS}=await import('../js/content/units.js');
assert.deepEqual(UNITS.map(u=>u.sections.length),[9,11,8,12,11]);
for(const u of UNITS)for(const s of u.sections){
 assert.ok(s.cards.length>=3&&s.cards.length<=6,s.id+' cards');
 assert.ok(s.quiz.length>=6&&s.quiz.length<=10,s.id+' quiz');
 assert.ok(s.worked.steps.length>=3&&s.worked.steps.length<=6,s.id+' steps');
 for(const q of s.quiz)if(q.type==='num')assert.ok(Number.isFinite(q.answer),q.id);
}
console.log('Scientific calculator and 51-lesson structure checks passed.');
