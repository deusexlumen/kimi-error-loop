/* ================================================================
   K.I.M.I. — ERROR LOOP · PULSE
   AudioContext + Analyser + Onset-Detection (Bass-Flux).
   Der Taktgeber für Typografie und Visualizer.
   Exportiert: window.Pulse = { attach(au), level(), onBeat(cb) }
   Fallback: file:// kann den Analyser stumm schalten → prozeduraler
   Puls, der ebenfalls Beats feuert.
   ================================================================ */
'use strict';

const Pulse = (function(){

let actx = null, analyser = null, freq = null, prevBass = null;
let audioDead = false, deadChecks = 0;
let au = null;
let level = 0;
let fluxMean = 0, lastBeat = 0;
const beats = new Set();

/* Tuning */
const BEAT_MIN_GAP = 180;    /* ms zwischen Onsets */
const FLUX_FACTOR  = 1.5;    /* Schwellwert = Faktor × Flux-Mittel */
const MEAN_DECAY   = .98;    /* adaptiver Mittelwert */

function attach(audioEl){
  au = audioEl;
  if (actx || audioDead) { actx && actx.resume(); return; }
  try{
    actx = new (window.AudioContext||window.webkitAudioContext)();
    const src = actx.createMediaElementSource(au);
    analyser = actx.createAnalyser();
    analyser.fftSize = 256;
    freq = new Uint8Array(analyser.frequencyBinCount);
    prevBass = new Uint8Array(8);
    src.connect(analyser); analyser.connect(actx.destination);
  }catch(e){ audioDead = true; }
}

function fireBeat(){
  const now = performance.now();
  if (now - lastBeat < BEAT_MIN_GAP) return;
  lastBeat = now;
  beats.forEach(cb => { try{ cb(now); }catch(e){} });
}

function poll(){
  if (!au || au.paused){
    level = level*.9;
    if (typeof Engine !== 'undefined') Engine.state.audio = level;
    return;
  }
  if (analyser && !audioDead){
    analyser.getByteFrequencyData(freq);
    let s=0; for (let i=1;i<10;i++) s+=freq[i];
    const v = s/9/255;
    if (au.currentTime>1.5 && v<.001 && ++deadChecks>40) audioDead=true;
    level = v*1.4;

    /* Bass-Flux: positive Energie-Deltas der Bins 1–8 */
    let flux = 0;
    for (let i=1;i<9;i++){
      const d = freq[i] - prevBass[i-1];
      if (d > 0) flux += d;
      prevBass[i-1] = freq[i];
    }
    fluxMean = fluxMean*MEAN_DECAY + flux*(1-MEAN_DECAY);
    if (flux > Math.max(18, fluxMean*FLUX_FACTOR)) fireBeat();
  } else {
    /* prozeduraler Ersatz: gleiche Level-Formel, Beats im 2.1s-Raster */
    const t = au.currentTime;
    level = .22 + .18*Math.abs(Math.sin(t*2.1)) * Math.abs(Math.sin(t*.37));
    if (Math.abs(Math.sin(t*2.1)) > .985) fireBeat();
  }
  if (typeof Engine !== 'undefined') Engine.state.audio = level;
}
setInterval(poll, 50);

/* n Spektral-Bins für den Visualizer — live oder prozedural */
function bins(n){
  const out = new Uint8Array(n);
  if (analyser && !audioDead && freq){
    for (let i=0;i<n;i++) out[i] = freq[Math.min(freq.length-1, i)];
  } else {
    const t = au && !au.paused ? au.currentTime : 0;
    for (let i=0;i<n;i++)
      out[i] = 255*level*(.6+.4*Math.sin(t*2.1+i*.35))*Math.exp(-i/n*1.6);
  }
  return out;
}

return {
  attach,
  level: () => level,
  bins,
  onBeat(cb){ beats.add(cb); return () => beats.delete(cb); }
};
})();
