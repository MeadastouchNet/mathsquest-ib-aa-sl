const {chromium}=require('C:/Users/jespe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
 const path=require('path');const root=path.resolve(__dirname,'..');
 const server=require('http').createServer((req,res)=>{
  const filename=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
  if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(filename,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html'})[path.extname(filename)]||'application/octet-stream');res.end(data);});
 });
 await new Promise(r=>server.listen(8766,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.APP_URL||'http://127.0.0.1:8766/',{waitUntil:'networkidle'});
 await page.waitForSelector('main h1');
 const content=await page.evaluate(async()=>{const {UNITS}=await import('./js/content/units.js');return UNITS.map(u=>({id:u.id,sections:u.sections.map(s=>({id:s.id,cards:s.cards.length}))}));});
 const results=[];
 for(const width of process.env.INTERACTIONS?[]:[1440,375]){
  await page.setViewportSize({width,height:1000});
  for(const theme of ['light','dark']){
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   const routes=['#/','#/guide','#/settings','#/stats','#/review','#/formulas','#/boss'];
   for(const u of content){routes.push('#/u/'+u.id,'#/formulas/'+u.id,'#/boss/'+u.id);for(const s of u.sections){for(const step of ['hook','learn','lab','worked','quiz','explain'])routes.push(`#/s/${s.id}/${step}`);for(let c=1;c<s.cards;c++)routes.push(`#/s/${s.id}/learn/${c}`);}}
   for(const route of routes){
    await page.evaluate(r=>location.hash=r,route);await page.waitForTimeout(35);
    const bad=await page.evaluate(()=>{
     const el=document.querySelector('main'),t=el.innerText;
     // 'undefined' is legitimate mathematical content (e.g. vertical gradients).
     return {empty:t.trim().length<50,raw:/NaN|\[\[|Unknown lab/.test(t),overflow:document.documentElement.scrollWidth>innerWidth+1,tex:el.querySelectorAll('.katex-error').length};
    });
    if(bad.empty||bad.raw||bad.overflow||bad.tex)results.push({width,theme,route,...bad});
   }
   console.log(`${width}px ${theme}: ${routes.length} routes checked`);
  }
 }
 if(process.env.INTERACTIONS){
  const checks=await page.evaluate(async()=>{
   const {UNITS}=await import('./js/content/units.js');const {renderQuestion}=await import('./js/quiz.js');const {renderLab}=await import('./js/labs.js');const store=await import('./js/store.js');store.setSetting('sound',false);
   const holder=document.createElement('div');document.body.append(holder);const failed=[];let answered=0,labs=0;
   const plain=html=>{const d=document.createElement('div');d.innerHTML=html;return d.textContent;};
   for(const u of UNITS)for(const s of u.sections){
    for(const q of s.quiz){
     holder.replaceChildren();let result;
     renderQuestion(holder,q,{onAnswer:ok=>result=ok,done(){}});
     if(q.type==='num'){
      for(const cell of holder.querySelectorAll('td.blank'))cell.querySelector('input').value=cell.dataset.a;
      const input=holder.querySelector('input[placeholder="Your answer"]');if(input)input.value=q.answer;
      [...holder.querySelectorAll('button')].find(b=>b.textContent==='Check').click();
     }else if(q.type==='mcq'||q.type==='tf'){
      const answer=q.type==='tf'?(q.answer?'True':'False'):plain(q.options[q.answer]);
      [...holder.querySelectorAll('.opt')].find(b=>b.children[1].textContent===answer)?.click();
     }
     if(result!==true)failed.push(q.id+' correct answer was not marked correct');answered++;
     if(q.type==='num'){
      holder.replaceChildren();result=undefined;renderQuestion(holder,q,{onAnswer:ok=>result=ok,done(){}});
      for(const cell of holder.querySelectorAll('td.blank'))cell.querySelector('input').value=cell.hasAttribute('data-final')?q.answer+1000:cell.dataset.a;
      const input=holder.querySelector('input[placeholder="Your answer"]');if(input)input.value=q.answer+1000;
      [...holder.querySelectorAll('button')].find(b=>b.textContent==='Check').click();
      if(result!==false)failed.push(q.id+' wrong answer was not rejected');
     }
    }
    for(const lab of s.labs){
     holder.replaceChildren();let won=false;renderLab(holder,lab,()=>won=true);
     if(lab.type==='scenarios')for(const it of lab.items){const right=plain(it.options.find(o=>o.ok).t);[...holder.querySelectorAll('button.opt:not([disabled])')].find(b=>b.textContent===right)?.click();}
     if(lab.type==='sequence'){const el=holder.querySelector('input');for(const value of [2,.5]){el.value=value;el.dispatchEvent(new Event('input'));}}
     if(lab.type==='parabola'){const el=holder.querySelectorAll('input');for(const [i,value] of [[1,3],[2,-4],[0,-1]]){el[i].value=value;el[i].dispatchEvent(new Event('input'));}}
     if(!won)failed.push(s.id+' '+lab.type+' did not win');labs++;
    }
   }
   holder.remove();return{answered,labs,failed};
  });
  console.log(JSON.stringify(checks));results.push(...checks.failed);
  await page.evaluate(()=>location.hash='#/guide');await page.waitForTimeout(100);
  await page.getByLabel('My focused question',{exact:true}).fill('How can I model the festival wheel?');
  await page.reload({waitUntil:'networkidle'});
  if(await page.getByLabel('My focused question',{exact:true}).inputValue()!=='How can I model the festival wheel?')results.push('Planner did not persist');
  await page.evaluate(()=>location.hash='#/s/1.4/learn/2');await page.waitForTimeout(100);
  await page.locator('.term').first().click();
  if(!await page.locator('.term-pop a').getAttribute('href').then(h=>h==='#/s/1.3/learn/0'))results.push('Glossary link incorrect');
  await page.evaluate(()=>location.hash='#/s/1.1/quiz');await page.waitForTimeout(100);
  const progressCheck=await page.evaluate(async()=>{
    const {findSection}=await import('./js/content/units.js');
    const store=await import('./js/store.js');
    for(const q of findSection('1.1').quiz){
      const root=document.querySelector('main .q-text').closest('.card');
      if(q.type==='num'){
        for(const cell of root.querySelectorAll('td.blank'))cell.querySelector('input').value=cell.dataset.a;
        const input=root.querySelector('input[placeholder="Your answer"]');if(input)input.value=q.answer;
        [...root.querySelectorAll('button')].find(b=>b.textContent==='Check').click();
      }else{
        const d=document.createElement('div');d.innerHTML=q.type==='tf'?(q.answer?'True':'False'):q.options[q.answer];
        [...root.querySelectorAll('.opt')].find(b=>b.children[1].textContent===d.textContent).click();
      }
      [...root.querySelectorAll('button')].find(b=>b.textContent.trim()==='Next').click();
    }
    return store.get().sections['1.1'].steps.quiz===true&&store.get().xp>0;
  });
  if(!progressCheck)results.push('Quiz completion/XP did not save');
  await page.reload({waitUntil:'networkidle'});
  if(!await page.evaluate(async()=>{const s=await import('./js/store.js');return s.get().sections['1.1'].steps.quiz===true&&s.get().xp>0;}))results.push('Progress did not persist on reload');
 }
 await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>{document.documentElement.dataset.theme='light';location.hash='#/';});await page.waitForTimeout(100);
 fs.mkdirSync('artifacts',{recursive:true});await page.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
 await page.setViewportSize({width:375,height:900});await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
 fs.writeFileSync('artifacts/browser-report.json',JSON.stringify({results,errors},null,2));
 console.log(JSON.stringify({problems:results,errors},null,2));await browser.close();server.close();if(results.length||errors.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
