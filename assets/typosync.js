/* ================================================================
   K.I.M.I. — ERROR LOOP · TYPOSYNC
   Baut die Zweite Haut aus LYRICS und koppelt die Typografie an
   den Puls: jeder Onset rückt das Highlight eine Zeile weiter.
   Die Lyrics werden vom Lesetext zum Performance-Element.
   ================================================================ */
'use strict';

(function(){

const scroller = document.getElementById('skin-scroll');
const sentinel = document.getElementById('skin-end');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const ROMAN = { a:'I', b:'II', loop:'III' };
const LABEL = { a:'SCHMIERFILM — VERDICHTUNG', b:'TERMINAL CUT — ENTNAHME', loop:'LOOP — UMSCHLAG' };

/* Künstlerkommentare — die Stimme im Werk */
const FRAME_TOP = 'Das System dichtet sich ab, um sich zu entleeren. Der Fehler hält es am Laufen.';
const COMMENT_A = 'Jede empfohlene Hörreihenfolge ist bereits Teil des Systems.';
const COMMENT_B = 'Der Ausstieg ist möglich. Er stößt an die Grenze des Verstandes, der in Vorher/Nachher denkt.';
const FRAME_END = 'K.I.M.I. — ERROR LOOP // KEINE LINEARE REIHENFOLGE VORHANDEN';

if (!scroller || typeof LYRICS === 'undefined') return;

function frame(txt, cls){
  const d = document.createElement('div');
  d.className = 'skin-frame ' + cls;
  d.textContent = txt;
  return d;
}

/* Aufbau: Rahmung oben, dann Phasen mit Kommentaren dazwischen */
scroller.insertBefore(frame(FRAME_TOP, 'top'), sentinel);

for (const ph of ['a','b','loop']){
  const g = document.createElement('div');
  g.className = 'lyr-group';
  g.innerHTML = `<div class="lyr-label">${ROMAN[ph]} · ${LABEL[ph]}</div>`;
  LYRICS[ph].forEach((tr, i) => {
    const el = document.createElement('article');
    el.className = 'lyr';
    el.id = `lyr-${ph}-${i+1}`;
    const lines = tr.x.split('\n').map((l, li) =>
      `<span style="--l:${li}">${l || '&nbsp;'}</span>`).join('');
    el.innerHTML = `
      <header><span class="n">${ROMAN[ph]}·${String(i+1).padStart(2,'0')}</span><h3>${tr.t}</h3></header>
      <div class="x">${lines}</div>`;
    g.appendChild(el);
  });
  scroller.insertBefore(g, sentinel);
  if (ph === 'a') scroller.insertBefore(frame(COMMENT_A, 'mid'), sentinel);
  if (ph === 'b') scroller.insertBefore(frame(COMMENT_B, 'mid'), sentinel);
}
scroller.insertBefore(frame(FRAME_END, 'end'), sentinel);

/* Zeilen-Reveal beim Scrollen innerhalb der Haut */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), {root: scroller, threshold:.2});
scroller.querySelectorAll('.lyr, .skin-frame').forEach(el => io.observe(el));

/* ---------------- Beat-Kopplung ---------------- */
let liveEl = null, lines = [], idx = -1;

Player.onTrackChange = (ph, i) => {
  scroller.querySelectorAll('.lyr.live').forEach(e => e.classList.remove('live'));
  liveEl = document.getElementById(`lyr-${ph}-${i+1}`);
  idx = -1;
  if (!liveEl) return;
  liveEl.classList.add('live');
  lines = [...liveEl.querySelectorAll('.x span')];
  if (REDUCED){ lines.forEach(s => s.classList.add('hit')); return; }
  lines.forEach(s => s.classList.remove('hit'));
  /* beim Trackwechsel in der Haut: zum Text scrollen */
  if (Skin.state === 'substance')
    liveEl.scrollIntoView({behavior:'smooth', block:'center'});
};

if (!REDUCED){
  Pulse.onBeat(() => {
    if (!liveEl || !lines.length) return;
    idx = (idx + 1) % lines.length;   /* auch die Zeile läuft im Loop */
    lines.forEach((s, j) => s.classList.toggle('hit', j === idx));
  });
  /* Atmen zwischen den Schlägen: Level → CSS-Variable */
  setInterval(() => {
    if (liveEl) liveEl.style.setProperty('--pulse', Pulse.level().toFixed(3));
  }, 80);
}
})();
