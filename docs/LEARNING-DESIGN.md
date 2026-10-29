# Learning design: why the app works the way it does

Target learner: 17 years old, bright, low on motivation for "studying". The goal is to make the effective
thing the easy thing: short sessions, almost no reading walls, constant small wins, and lots of
being asked questions instead of being told answers.

## What the research says (and how the app uses it)

| Finding | Evidence | Used in the app as |
|---|---|---|
| **Retrieval practice** (testing yourself) beats re-reading by a wide margin for long-term retention. | Roediger & Karpicke (2006); Dunlosky et al. (2013) rate practice testing "high utility". | Every lesson ends in a quiz; quick "check yourself" questions; Review mode is all retrieval. |
| **Spacing** reviews over days beats cramming. | Cepeda et al. (2006) meta-analysis; Dunlosky et al. (2013) "high utility". | Every question goes into a 5-box Leitner system (due again after 0, 1, 3, 7, 16 days). *Review* shows what is due today. |
| **Interleaving** different topics in practice improves the ability to pick the right method. | Rohrer & Taylor (2007); Kornell & Bjork (2008). | Review and Boss Battle mix questions from every section he has started. |
| **Immediate, specific feedback** is one of the strongest influences on learning. | Hattie & Timperley (2007). | Every answer is marked instantly with a "why" explanation; wrong answers are asked again at the end of the quiz. |
| **Worked examples, then faded examples** beat unguided problem-solving for novices (cognitive load). | Sweller & Cooper (1985); Renkl & Atkinson (2003). | Each section has a step-by-step worked example he reveals one step at a time and must predict first, then similar questions in the quiz. |
| **Multimedia principles**: words + visuals beat words alone; short segments; conversational tone; narration helps. | Mayer, *Multimedia Learning* (2009/2020). | Short cards, live charts in the labs, informal "you" language, read-aloud on every card. |
| **Self-explanation** improves understanding. | Chi et al. (1989, 1994). | Each lesson ends with "Explain it like you're texting a mate". The parent dashboard shows these answers. |
| **Personalised, relatable context** raises interest and learning. | Cordova & Lepper (1996). | Connected cases about a gaming channel, a festival, a gaming club and a skate park plus examples from gaming, Spotify, festivals, phones, part-time jobs. |
| **Autonomy, competence and progress** sustain motivation (Self-Determination Theory). | Deci & Ryan (2000). | XP, levels from *Pattern Spotter* to *Maths Legend*, streaks, mastery bars, challenges inside the labs, a free choice of what to do next. |
| **Active exploration** (manipulating a model) builds intuition. | Freeman et al. (2014) on active learning. | Each section has an interactive lab with scenario decisions; selected labs also use sliders and a small challenge to beat. |
| **"Learning styles" matching is a myth.** | Pashler et al. (2008). | No "visual/auditory learner" settings. Everyone gets multiple formats. |

## Design rules for a "smart but lazy" learner

1. **One-tap start.** The home screen has one big button, *Do my 10 minutes*, which picks the next useful thing:
   reviews due first, otherwise the next lesson.
2. **Small chunks.** A lesson is about 10 minutes, split into 6 tiny steps (Hook → Learn → Play → Worked example → Quiz → Explain).
3. **Ask, don't tell.** The worked examples ask him to think before he reveals each step.
4. **Earned rewards, not just pretty badges.** XP mostly comes from answering correctly first time and from reviews,
   so it rewards effort that actually helps learning.
5. **IB exam language.** Exam tips use the IB command terms (define, calculate, explain, analyse, evaluate),
   so the knowledge transfers to Paper 1, 2 and 3.

## About video

The app doesn't embed YouTube videos. Links go stale, and watching passively works worse than doing.
Instead, the labs are animated and interactive, and every card can be read aloud with the browser's
built-in speech. Recorded narration (for example AI voice-overs) can be added later if the read-aloud voice
turns out to be popular.

## How we evaluate whether it works

The **Usage stats** page (link in the footer) shows, for this device:

- minutes per day (last 14 days) and current streak,
- mastery per section (how far its questions have moved up the spaced-repetition boxes),
- first-attempt accuracy per section, and the questions he gets wrong most often,
- his "explain it" answers (the best window into real understanding),
- his 1-tap rating after each lesson (boring / OK / good, too easy / just right / too hard).

Suggested check-in after 2 weeks:

1. **Is he using it?** Days active and minutes. If low: make sessions even shorter, add more game elements, or set a family deal (streak = reward).
2. **Is it sticking?** Review accuracy on questions first seen 7+ days ago. Below ~70% means the lessons need more practice items.
3. **Which formats work?** His ratings per lesson, plus whether he uses read-aloud.
4. **Exam transfer.** Try one real past Paper 2 question on paper and compare.

Progress is stored in the browser on the device he uses (no account, no server). Use *Export* on the
Usage stats page to save a copy, or open that page on his device.

## References

- Cepeda, N. J. et al. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin*, 132(3).
- Chi, M. T. H. et al. (1989). Self-explanations. *Cognitive Science*, 13(2).
- Cordova, D. I. & Lepper, M. R. (1996). Intrinsic motivation and the process of learning. *Journal of Educational Psychology*, 88(4).
- Deci, E. L. & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. *Psychological Inquiry*, 11(4).
- Dunlosky, J. et al. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1).
- Freeman, S. et al. (2014). Active learning increases student performance in STEM. *PNAS*, 111(23).
- Hattie, J. & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1).
- Kornell, N. & Bjork, R. A. (2008). Learning concepts and categories: Is spacing the "enemy of induction"? *Psychological Science*, 19(6).
- Mayer, R. E. (2020). *Multimedia Learning* (3rd ed.). Cambridge University Press.
- Pashler, H. et al. (2008). Learning styles: Concepts and evidence. *Psychological Science in the Public Interest*, 9(3).
- Renkl, A. & Atkinson, R. K. (2003). Structuring the transition from example study to problem solving. *Educational Psychologist*, 38(1).
- Roediger, H. L. & Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science*, 17(3).
- Rohrer, D. & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35(6).
- Sweller, J. & Cooper, G. A. (1985). The use of worked examples as a substitute for problem solving in learning algebra. *Cognition and Instruction*, 2(1).

