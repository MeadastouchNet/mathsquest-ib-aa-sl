// Google sign-in and the cloud copy of progress (Firebase Auth + Firestore, loaded from Google's CDN).
// Each user has one Firestore document users/{uid}; this app keeps its progress JSON in one field of it, named
// after APP.storageKey, so other subject apps can share the same Firebase project and document.
// Security rule (Firestore → Rules): users/{uid} is readable and writable only when request.auth.uid == uid.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut }
  from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import { APP } from './config.js';

const fb = initializeApp(APP.firebase);
const auth = getAuth(fb);
const db = getFirestore(fb);
const FIELD = APP.storageKey.replace(/\W/g, '_');
const userDoc = () => doc(db, 'users', auth.currentUser.uid);

/** Calls cb(user) now and whenever the user signs in or out (user is null when signed out). */
export const onUser = cb => onAuthStateChanged(auth, cb);

export async function signIn() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    // Some phones and in-app browsers block popups: fall back to a full-page redirect.
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') await signInWithRedirect(auth, provider);
    else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') throw e;
  }
}
export const signOutUser = () => signOut(auth);

/** The cloud copy: { data: progress JSON, updatedAt: ms }, or null if this user has none yet. */
export async function pull() {
  const snap = await getDoc(userDoc());
  return snap.exists() ? snap.data()[FIELD] || null : null;
}
export function push(data, updatedAt) {
  return setDoc(userDoc(), { [FIELD]: { data, updatedAt } }, { merge: true });
}
