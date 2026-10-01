/* ================================================================
   K.I.M.I. — ERROR LOOP · ART-MAP
   Bild-Bindung: jeder Track bekommt sein Gesicht.
   Phase a: 15 Tracks → a01…a15 (direkt)
   Phase b: 17 Tracks → Pool b00…b08, zyklisch
   loop:    2 Tracks  → tendrils / ghost_gesicht
   ================================================================ */
'use strict';

const ARTMAP = {
  a: [
    'assets/art/a01_oelkreatur.jpg',
    'assets/art/a02_monolith.jpg',
    'assets/art/a03_chromorganismus.jpg',
    'assets/art/a04_chip.jpg',
    'assets/art/a05_terminal.jpg',
    'assets/art/a06_kristall.jpg',
    'assets/art/a07_morast.jpg',
    'assets/art/a08_herz.jpg',
    'assets/art/a09_heiligenschein.jpg',
    'assets/art/a10_kernexplosion.jpg',
    'assets/art/a11_aktant_1.jpg',
    'assets/art/a12_brennend.jpg',
    'assets/art/a13_oelnacht.jpg',
    'assets/art/a14_sternwesen.jpg',
    'assets/art/a15_schmierfilm.jpg'
  ],
  b: [
    'assets/art/b00_banner.jpg',
    'assets/art/b01_cut_poster.jpg',
    'assets/art/b02_cut_portrait.jpg',
    'assets/art/b03_waechter.jpg',
    'assets/art/b04_scheibe.jpg',
    'assets/art/b05_scherbe.jpg',
    'assets/art/b06_zone.jpg',
    'assets/art/b07_auge.jpg',
    'assets/art/b08_struktur.jpg'
  ],
  loop: [
    'assets/art/loop01_tendrils.jpg',
    'assets/art/loop02_ghost_gesicht.jpg'
  ]
};

/* b läuft zyklisch über den Pool */
function artFor(ph, i){
  const pool = ARTMAP[ph];
  if (!pool || !pool.length) return null;
  return pool[i % pool.length];
}
