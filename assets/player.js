/* ================================================================
   K.I.M.I. — ERROR LOOP · PLAYER
   Track-Registry, Bar mit Track-Art, Deck (große Ansicht +
   Visualizer), Grand Loop (a → b → loop → a).
   Exportiert: window.Player = { play(ph,i), current, buildLists,
   onTrackChange, openDeck, closeDeck }
   ================================================================ */
'use strict';

const Player = (function(){

const PHASES = {
  a: {
    dir: 'PHASE_A_SCHMIERFILM/audio/',
    label: 'Schmierfilm — Verdichtung',
    tracks: ['01_Neural_Sync','02_Akt_I','03_Hydraulic_Seal','04_Schmierfilm','05_EPP','06_Druck','07_Wutgeschoss','08_Pink_Pressure','09_Brennender_Boden','10_Industriegift','11_Submerged','12_Fettfang','13_Kernel_Panik','14_Morast','15_Thermodynamik']
  },
  b: {
    dir: 'PHASE_B_TERMINAL_CUT/audio/',
    label: 'Terminal Cut — Entnahme',
    tracks: ['01_Vakuum_Sog','02_Schwarzes_Glas','03_Semantic_Rot','04_Pure_Intent','05_Silbenmultiplikator','06_Voltage_Throne','07_Shear_Line','08_Surgical_Precision','09_Falling_in_the_Panic','10_Flesh_Archive','11_Anomaly_Lobotomy','12_Astral_Sex','13_Bound_To_Rot','14_Der_Riss','15_SYSTEM_ERROR','16_Neural_Sync_Erratic_Drop','17_Dreamy_Ethereal']
  },
  loop: {
    dir: 'LOOP/audio/',
    label: 'Loop — Umschlag',
    tracks: ['03_Reset_Erratic_Drop','04_Ghost_Dreamy_Ethereal']
  }
};
const ORDER = ['a','b','loop'];
const pretty = f => f.replace(/^\d+_/,'').replace(/_/g,' ');

const au = document.getElementById('au');
const player = document.getElementById('player');
const pTitle = document.getElementById('p-title');
const pThumb = document.getElementById('p-thumb');
const ringFg = document.querySelector('#ring .fg');
const CIRC = 2*Math.PI*12;
ringFg.style.strokeDasharray = CIRC;
ringFg.style.strokeDashoffset = CIRC;

const deck = document.getElementById('deck');
const deckArt = document.getElementById('deck-art');
const deckTitle = document.getElementById('deck-title');
const deckPhase = document.getElementById('deck-phase');
const deckProg = document.getElementById('deck-prog');
const viz = document.getElementById('viz');
const vctx = viz.getContext('2d');

const current = { ph: null, i: -1 };

function play(ph, i){
  const P = PHASES[ph]; if (!P || !P.tracks[i]) return;
  current.ph = ph; current.i = i;
  au.src = P.dir + P.tracks[i] + '.m4a';
  Pulse.attach(au);
  au.play().catch(()=>{});
  Engine.state.phase = ph;

  const art = artFor(ph, i);
  if (art){
    Engine.setImage(art);
    pThumb.style.backgroundImage = `url('${art}')`;
    deckArt.style.backgroundImage = `url('${art}')`;
  }
  pTitle.innerHTML = pretty(P.tracks[i]) + '<small>' + P.label + '</small>';
  deckTitle.textContent = pretty(P.tracks[i]);
  deckPhase.textContent = P.label;
  player.classList.add('on');

  document.querySelectorAll('.tracks li').forEach(li=>{
    li.classList.toggle('playing', li.dataset.ph===ph && +li.dataset.i===i);
  });
  Player.onTrackChange && Player.onTrackChange(ph, i);
}

au.addEventListener('timeupdate', ()=>{
  if (!au.duration) return;
  const f = au.currentTime/au.duration;
  ringFg.style.strokeDashoffset = CIRC*(1-f);
  deckProg.style.transform = `scaleX(${f})`;
});
au.addEventListener('ended', ()=>{
  /* Grand Loop: a → b → loop → a */
  const P = PHASES[current.ph]; if (!P) return;
  if (current.i < P.tracks.length-1) play(current.ph, current.i+1);
  else {
    const next = ORDER[(ORDER.indexOf(current.ph)+1) % ORDER.length];
    play(next, 0);
  }
});
/* Fehler sichtbar machen statt Schweigen */
au.addEventListener('error', ()=>{
  if (!au.src) return;
  pTitle.innerHTML = 'FEHLER — TRACK NICHT ERREICHBAR<small>erneut tippen, um es noch einmal zu versuchen</small>';
});

function togglePlay(){
  if (!au.src) return;
  if (au.paused){ Pulse.attach(au); au.play(); }
  else au.pause();
}
document.getElementById('p-play').onclick = togglePlay;
document.getElementById('d-play').onclick = togglePlay;
document.getElementById('p-prev').onclick = ()=>{ if (current.i>0) play(current.ph, current.i-1); };
document.getElementById('d-prev').onclick = ()=>{ if (current.i>0) play(current.ph, current.i-1); };
document.getElementById('p-next').onclick = ()=>{
  const P = PHASES[current.ph];
  if (P && current.i < P.tracks.length-1) play(current.ph, current.i+1);
};
document.getElementById('d-next').onclick = ()=>{
  const P = PHASES[current.ph];
  if (P && current.i < P.tracks.length-1) play(current.ph, current.i+1);
};

/* ---------------- Deck ---------------- */
let deckOpen = false;
function openDeck(){
  if (!au.src) return;
  deckOpen = true;
  deck.classList.add('on');
  deck.setAttribute('aria-hidden','false');
  sizeViz();
  requestAnimationFrame(vizFrame);
}
function closeDeck(){
  deckOpen = false;
  deck.classList.remove('on');
  deck.setAttribute('aria-hidden','true');
}
player.addEventListener('click', e => {
  if (e.target.closest('#p-ctl')) return;
  openDeck();
});
document.getElementById('deck-close').onclick = closeDeck;
deck.addEventListener('click', e => { if (e.target === deck) closeDeck(); });
addEventListener('keydown', e => { if (e.key==='Escape' && deckOpen) closeDeck(); });

/* ---------------- Visualizer ----------------
   Spektrum als kalte Linien, mit Öl-Nachzug (fade + leichtem Zoom)
   und Zeilen-Stutter synchron zum Glitch. */
function sizeViz(){
  const r = viz.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio||1, 1.75);
  viz.width = Math.max(2, r.width*dpr|0);
  viz.height = Math.max(2, r.height*dpr|0);
  vctx.fillStyle = '#0a0908';
  vctx.fillRect(0,0,viz.width,viz.height);
}
addEventListener('resize', ()=>{ if (deckOpen) sizeViz(); }, {passive:true});

function vizFrame(){
  if (!deckOpen) return;
  const w = viz.width, h = viz.height;

  /* Nachzug: altes Bild leicht vergrößert + abgedunkelt */
  vctx.globalAlpha = .84;
  const z = 1.006;
  vctx.drawImage(viz, w*(1-z)/2, h*(1-z)/2, w*z, h*z);
  vctx.globalAlpha = 1;
  vctx.fillStyle = 'rgba(10,9,8,.3)';
  vctx.fillRect(0,0,w,h);

  const bins = Pulse.bins(64);
  const g = Engine.state.glitch;
  const bw = w/bins.length;
  vctx.fillStyle = 'rgba(185,212,222,.85)';
  for (let i=0;i<bins.length;i++){
    let v = bins[i]/255;
    /* Stutter: einzelne Säulen springen */
    if (g>0 && Math.random()<g*.08) v = Math.min(1, v + g*.5);
    const bh = v*h*.92;
    vctx.fillRect(i*bw + bw*.22, h-bh, bw*.56, bh);
  }
  requestAnimationFrame(vizFrame);
}

/* ---------------- Tracklisten ---------------- */
function buildLists(phaseEls){
  phaseEls.forEach(el => {
    const ph = el.dataset.phase;
    const ul = el.querySelector('[data-list]');
    PHASES[ph].tracks.forEach((f, j) => {
      const li = document.createElement('li');
      li.dataset.ph = ph; li.dataset.i = j;
      li.innerHTML = `<span class="idx">${String(j+1).padStart(2,'0')}</span>${pretty(f)}<span class="st">anhören · <a href="#lyr-${ph}-${j+1}" data-lyr="${ph}-${j+1}">lyrics&nbsp;↗</a></span>`;
      li.addEventListener('click', e => { e.stopPropagation(); play(ph, j); });
      /* LYRICS-Link: nicht abspielen, sondern die Haut am richtigen
         Text öffnen — stopPropagation, damit der li-Handler nicht feuert */
      li.querySelector('[data-lyr]').addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        Skin.enter();
        const target = document.getElementById(`lyr-${ph}-${j+1}`);
        setTimeout(() => target && target.scrollIntoView({behavior:'smooth', block:'center'}),
          Engine.REDUCED ? 700 : 1300);
      });
      ul.appendChild(li);
    });
  });
}

const Player = {
  PHASES, pretty, current, play, buildLists,
  openDeck, closeDeck,
  onTrackChange: null,
  isDeckOpen: () => deckOpen
};
return Player;
})();
