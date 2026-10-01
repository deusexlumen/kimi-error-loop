/* ================================================================
   K.I.M.I. — ERROR LOOP · SKIN
   Zwei-Ebenen-Orbit: Oberfläche ⇄ Zweite Haut.
   Peel: der Tear der Engine + Clip-Wipe. Morph: Sentinel am Ende
   der Haut führt nahtlos zurück in den Hero.
   Exportiert: window.Skin = { enter(), leave(), state }
   ================================================================ */
'use strict';

const Skin = (function(){

const skin = document.getElementById('skin');
const scroller = document.getElementById('skin-scroll');
const handle = document.getElementById('haut');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

let state = 'surface';   /* surface | peeling | substance | morphing */

function setHandle(){
  handle.innerHTML = state==='substance'
    ? 'Oberfläche&nbsp;↓'
    : 'Zweite Haut&nbsp;↑';
  handle.classList.toggle('invert', state==='substance');
}

function enter(){
  if (state !== 'surface') return;
  state = 'peeling';
  if (!REDUCED) Engine.tear(650);           /* das Bild reißt auf */
  skin.classList.add('peel-in');
  skin.setAttribute('aria-hidden','false');
  const done = () => {
    state = 'substance';
    document.body.style.overflow = 'hidden';  /* Ebene 1 ruht */
    scroller.scrollTop = 0;
    setHandle();
  };
  if (REDUCED){
    skin.classList.add('on');
    setTimeout(done, 620);
  } else {
    skin.addEventListener('animationend', function h(e){
      if (e.target !== skin) return;
      skin.removeEventListener('animationend', h); done();
    });
    setTimeout(done, 1400);                   /* Sicherheitsnetz */
  }
}

function leave(){
  if (state !== 'substance') return;
  state = 'morphing';
  skin.classList.add('morph-out');
  const done = () => {
    skin.classList.remove('peel-in','on','morph-out');
    skin.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
    state = 'surface';
    setHandle();
  };
  if (REDUCED) setTimeout(done, 620);
  else {
    skin.addEventListener('animationend', function h(e){
      if (e.target !== skin) return;
      skin.removeEventListener('animationend', h); done();
    });
    setTimeout(done, 1200);
  }
}

handle.addEventListener('click', () => {
  if (state === 'surface') enter();
  else if (state === 'substance') leave();
});
addEventListener('keydown', e => {
  if (e.key === 'Escape' && state === 'substance') leave();
});

/* Morph: das Ende der Texte führt zurück an die Oberfläche */
const sentinel = document.getElementById('skin-end');
new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting && state === 'substance' && !REDUCED){
    /* kurze Verweildauer, dann Morph */
    setTimeout(() => { if (state === 'substance') leave(); }, 900);
  }
}), {root: scroller, threshold: .6}).observe(sentinel);

setHandle();

return {
  enter, leave,
  get state(){ return state; }
};
})();
