# MathsQuest maintenance roadmap

All five current AA SL topics are built: 51 lessons, 308 questions and 53 interactive labs. The student guide adds exams and a locally saved exploration planner.

## Extension checklist

1. Read SYLLABUS.md and the official guide for the student's exam session.
2. Preserve APP.storageKey: mathsquest.aa.sl.v1.
3. Never reuse or renumber published question IDs. Add new IDs for new questions.
4. Keep the hook, 3–6 cards, lab challenge, 3–6 worked steps, 6–10 mixed questions and self-explanation prompt.
5. Use data tables with A(value) working cells and A(value,true) scored cells. Use F/M TeX formulas.
6. Add glossary merge data and first-use cross-topic helpers.
7. Run npm run validate, npm test and browser checks at 375 px/desktop in both themes. Exercise changed interactions.
8. Update docs and publish.

## Future improvements

- Add longer connected Paper 1 and 2 exercises with teacher-reviewed marking rubrics.
- Extend graph drawing and written justification practice.
- Review Usage stats after one or two weeks and improve difficult lessons.
- Build a separately versioned 2029 course only after checking its final guide.

No terms await unbuilt units. Graphing, regression, integration and distributions use the student's approved GDC.
