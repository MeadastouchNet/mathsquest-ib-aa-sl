// Smoke test for one unit of a BizQuest-engine app. Paste into the browser console on the running app
// (or run it with a browser JS tool), after setting UNIT below. It opens the unit page, its formula sheet and
// Boss Battle, and every lesson step and Learn card of every topic, then reports pages that look broken:
// empty, showing "undefined"/"NaN"/raw [[terms]], unknown labs, wider than the screen, or throwing errors.
// Run it once at desktop width and once at 375 px wide. It only navigates; it doesn't answer anything.
(async () => {
  const UNIT = '1';          // the unit to check
  const WAIT = 200;          // ms per page; raise it on a slow machine
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const errors = [];
  const onErr = e => errors.push(`${location.hash}: ${e.message || e.reason}`);
  addEventListener('error', onErr);
  addEventListener('unhandledrejection', onErr);

  location.hash = `#/u/${UNIT}`;
  await wait(WAIT * 2);
  const topics = [...document.querySelectorAll(`main a.tile[href^="#/s/${UNIT}."]`)].map(a => a.getAttribute('href').split('/').pop());
  if (!topics.length) {
    const msg = `Smoke test: unit ${UNIT} has no built topics on #/u/${UNIT}. Is it registered in js/content/units.js, and is the page fresh?`;
    console.log(msg);
    return msg;
  }
  const routes = [`#/u/${UNIT}`, `#/formulas/${UNIT}`, `#/boss/${UNIT}`];
  for (const t of topics) {
    for (const step of ['hook', 'learn', 'lab', 'worked', 'quiz', 'explain']) routes.push(`#/s/${t}/${step}`);
    for (let c = 0; c < 8; c++) routes.push(`#/s/${t}/learn/${c}`);   // indexes past the last card are skipped below
  }

  const problems = [];
  const seen = new Set();
  for (const r of routes) {
    location.hash = r;
    await wait(WAIT);
    const main = document.querySelector('main') || document.body;
    const text = main.innerText;
    const card = r.match(/learn\/(\d+)$/);
    if (card) {   // the app clamps a too-high card index to the last card: skip repeats
      const key = r.replace(/\/\d+$/, '') + '|' + text;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    if (text.trim().length < 80) problems.push(`${r}: almost empty`);
    const bad = text.match(/.{0,30}(undefined|NaN|\[\[|Unknown lab).{0,30}/);
    if (bad) problems.push(`${r}: shows "${bad[0].trim()}"`);
    if (document.documentElement.scrollWidth > innerWidth + 1) problems.push(`${r}: page is ${document.documentElement.scrollWidth}px wide (screen ${innerWidth}px)`);
  }
  removeEventListener('error', onErr);
  removeEventListener('unhandledrejection', onErr);
  location.hash = `#/u/${UNIT}`;

  const report = [`Smoke test, unit ${UNIT}: ${topics.length} topics, ${routes.length} routes tried, screen ${innerWidth}px.`,
    ...problems, ...errors.map(e => `JS error ${e}`)];
  if (!problems.length && !errors.length) report.push('No problems found.');
  console.log(report.join('\n'));
  return report.join('\n');
})();
