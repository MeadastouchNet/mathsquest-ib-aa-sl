# Publication verification · 29 October 2026

## Curriculum and content

- Official IB current guide checked for all SL subtopics 1.1–1.9, 2.1–2.11, 3.1–3.8, 4.1–4.12 and 5.1–5.11.
- 5 units, 51 lessons, 308 questions, 53 labs and 115 glossary entries.
- Unit 1/2 calculations reviewed separately. Geometry, statistics and calculus calculations checked by their authors, including independent computation for all statistics numerical answers and normal-distribution examples.
- `node scripts/validate_content.mjs .`: no errors or warnings; unique IDs, supported question/lab shapes, glossary targets and final table cells checked.
- `node scripts/test-maths.mjs`: passes scientific parser/domain checks and all 51 lesson structures.

## Browser checks

Microsoft Edge via Playwright, local preview. Every lesson step and Learn card, every unit, unit formula sheet and Boss Battle, plus global home, guide, settings, stats and review: **433 routes × 2 widths × 2 themes = 1,732 views**. Widths: 1440 and 375 pixels. No empty pages, raw term markers, unknown labs, KaTeX errors, horizontal page overflow or JavaScript errors. The mathematical word “undefined” is allowed in teaching prose, rather than mistaken for a rendering defect.

Interaction checks:

- All 308 correct answers accepted through the actual question renderer.
- Deliberately incorrect answers rejected for every numerical question.
- All 53 labs completed, including both slider experiments.
- Working/scored table cells populated and marked through the renderer.
- Glossary popover links to its correct teaching card.
- Exploration planner text survives page reload.
- Full first-lesson quiz records completion and XP, both retained after reload.
- Scientific calculator checks cover precedence, powers, reciprocal powers, tiny/scientific numbers, roots, logs, trig in DEG/RAD, inverse trig and invalid real-domain operations. Tangent at 90° is rejected.
- Desktop and phone home screenshots visually reviewed.

The auto-checks verify the published answer key and interactions; they do not replace mathematical review or teacher feedback on extended written reasoning. Local browser tests use a separate origin from the student's live profile.

## Hosting

Public repository: MeadastouchNet/mathsquest-ib-aa-sl. GitHub Pages serves the main branch root; no build or backend is required. Live deployment verification is performed after push.
