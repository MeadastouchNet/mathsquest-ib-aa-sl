// Read-aloud (Web Speech API) and small game sounds (Web Audio API). No files, no network.
import { get } from './store.js';
import { speakMath } from './tex.js';

const synth = window.speechSynthesis;
let ctx;

export const canSpeak = () => !!synth;

export function voices() {
  if (!synth) return [];
  return synth.getVoices().filter(v => v.lang.startsWith('en'));
}

function pickVoice() {
  const list = voices();
  const wanted = get().settings.voice;
  return list.find(v => v.name === wanted)
    || list.find(v => /en-GB/i.test(v.lang) && /natural|neural|online/i.test(v.name))
    || list.find(v => /natural|neural|online/i.test(v.name))
    || list.find(v => /en-GB/i.test(v.lang))
    || list[0];
}

/** Reads text aloud. Calls onEnd when finished or stopped. */
export function speak(text, onEnd) {
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = get().settings.rate || 1;
  u.onend = u.onerror = () => onEnd && onEnd();
  synth.speak(u);
}
export function stopSpeaking() { if (synth) synth.cancel(); }
export const speaking = () => !!synth && synth.speaking;

/** Strips HTML into speakable text, turning formula symbols into words. */
export function htmlToSpeech(html) {
  const div = document.createElement('div');
  // Tables read row by row: "Year 1, 6,000, 0.9434, blank."
  // (Text must stay inside cells: text between rows would be moved out of the table by the HTML parser.)
  div.innerHTML = speakMath(html).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, t, shown) => shown || t).replace(/class="blank"[^>]*>\?/g, '>blank')
    .replace(/<\/t[dh]>\s*<\/tr>/g, '. </td></tr>').replace(/<\/t[dh]>/g, ', </td>');
  return div.textContent
    .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ')
    .replace(/=/g, ' equals ').replace(/%/g, ' percent ').replace(/\//g, ' over ');
}

function tone(freq, start, dur, type = 'sine', gain = 0.08) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(gain, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.02);
}
export function sfx(kind) {
  if (!get().settings.sound) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (kind === 'good') { tone(660, 0, .12, 'triangle'); tone(990, .1, .18, 'triangle'); }
    else if (kind === 'bad') { tone(180, 0, .25, 'sawtooth', .05); }
    else if (kind === 'level') { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .1, .2, 'triangle')); }
    else if (kind === 'click') { tone(800, 0, .04, 'square', .03); }
  } catch (e) { /* audio blocked */ }
}
