// App identity. A new subject built from this engine changes only this file (plus the content in js/content/).
export const APP = {
  name: 'MathsQuest',
  icon: 'sigma',
  course: 'IB Mathematics AA SL · exams through 2028',
  // Progress is kept in localStorage under this key. Apps hosted on the same domain (e.g. one GitHub Pages
  // account) share storage, so every subject needs its own key.
  storageKey: 'mathsquest.aa.sl.v1',
  // Google sign-in and the cloud copy of progress (Firebase project "mathquest-4bfea").
  // This web config is public by design; the Firestore security rule is what keeps each user's data private.
  firebase: {
    apiKey: 'AIzaSyADAG2b2fba8XwwvS9OshUxw69auUernBg',
    authDomain: 'mathquest-4bfea.firebaseapp.com',
    projectId: 'mathquest-4bfea',
    storageBucket: 'mathquest-4bfea.firebasestorage.app',
    messagingSenderId: '547600536193',
    appId: '1:547600536193:web:be773cd283a6ff57067380'
  },
  // Level titles, one per 250 XP.
  levels: ['Pattern Spotter', 'Problem Solver', 'Algebra Explorer', 'Function Finder', 'Graph Guide',
    'Trig Tactician', 'Data Detective', 'Calculus Climber', 'Proof Builder', 'Maths Legend'],
  voiceTest: 'A derivative measures the rate of change. Explain the units as well as the number.'
};
