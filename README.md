# MathsQuest · IB Mathematics AA SL

Independent study app for Mathematics: Analysis and Approaches SL, exams in 2027–2028. Original lessons built using the BizQuest engine.

**Live app:** https://meadastouchnet.github.io/mathsquest-ib-aa-sl/

All five topics and 51 current SL subtopics: 308 questions, 53 labs, worked examples, typeset formulas, glossary helpers, a scientific practice calculator, spaced review, mixed Boss Battles, XP, usage stats and light/dark themes. Student guide covers exams, GDC readiness, the exploration rubric and a locally saved planner.

Signing in with Google is required. Progress is kept in the browser and synced to the student's Firestore document (`users/{uid}`, Firebase project `mathquest-4bfea`), so it follows them to any device; the web config is in `js/config.js` and the security rule is set in the Firebase console. The exploration planner stays on the device and has its own download button. No advertising. Fonts and KaTeX load from external CDNs, which receive normal web requests. Internet is needed for those assets.

## Run and validate

No build or installation needed. Run `python -m http.server 8765` and open http://localhost:8765/.

`npm run validate` checks content; `npm test` checks maths tools and structure. Browser QA uses Playwright and Microsoft Edge. Install Playwright in your development environment or set PLAYWRIGHT_MODULE to its installed module path, then run `node scripts/browser-check.cjs`. The script signs in as a stubbed test user and also checks that the Google sign-in screen shows when signed out. Set INTERACTIONS=1 for answer/lab/progress checks; set APP_URL to the live URL and LIVE_CHECK=1 for deployment checks.

| File | Purpose |
|---|---|
| index.html, css/styles.css | Shell and themes |
| js/main.js | Lesson navigation and views |
| js/content/unit1.js–unit5.js | Original lessons |
| js/content/units.js, glossary.js | Registry and term helpers |
| js/labs.js, calc.js, quiz.js | Experiments, calculator, marking |
| js/guide.js | Student requirements and IA planner |
| js/store.js | Progress and spaced review (localStorage working copy) |
| js/cloud.js | Google sign-in and the cloud copy of progress (Firebase Auth + Firestore) |
| docs/SYLLABUS.md | Verified scope and primary sources |
| docs/ROADMAP.md | Maintenance |
| docs/VERIFICATION.md | Publication checks |

## Sources and scope

[Official guide](https://www.ibo.org/globalassets/new-structure/university-admission/pdfs/dp-mathematics-analysis-and-approaches-guide-en.pdf) and [transition update](https://ibo.org/university-admission/latest-curriculum-updates/dp-mathematics-analysis-and-approaches-updates), checked 29 October 2026. Finance and bivariate data remain for this current course. Revised 2029 coverage is not claimed.

The app supplements teaching; it does not replace the official formula booklet, an approved GDC or teacher feedback. No official past papers are reproduced. The IB has not endorsed the app. Based on [BizQuest](https://github.com/MeadastouchNet/bizquest-ib-business); learning-design research is in docs/LEARNING-DESIGN.md. Lucide icons use the ISC licence and KaTeX the MIT licence.
