# ZWEITE HAUT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline — subagents disabled in this workspace). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rebuild the ERROR LOOP release page as two full-screen layers in a closed rotation (surface ⇄ substance), with images bound to tracks, an expandable deck player with visualizer, and audio-driven lyric highlighting.

**Architecture:** Single `index.html` + classic scripts under `assets/` (no build step, file://-safe). WebGL engine gains dual-texture crossfade; a new pulse module detects onsets from the existing AnalyserNode; a skin module runs a layer state machine; typosync renders lyrics into the skin and advances a highlight per onset.

**Tech Stack:** Vanilla HTML/CSS/JS, WebGL2, Canvas 2D (visualizer), Web Audio AnalyserNode.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-10-01-zweite-haut-design.md` (committed)
- Palette stays locked: `--oil:#0a0908`, `--bone:#e8e4dc`, `--dim:#6e6a61`, `--faint:#3d3a34`, `--cold:#b9d4de`; fonts Archivo (variable wght/wdth) + Space Mono
- Classic scripts only (no ES modules — file:// must work), no libraries, no build step
- `prefers-reduced-motion` must disable: peel/morph (crossfade instead), beat auto-advance, letter wave, bands, echoes
- The git repo is `dist/` (remote: github.com/deusexlumen/kimi-error-loop). Work in root, sync changed files into `dist/`, commit/push from `dist/`
- Verification harness: local `python -m http.server 8791` + headless Chrome (`/c/Program Files/Google/Chrome/Application/chrome.exe --headless=new --screenshot/--dump-dom`) — screenshot writes need absolute Windows paths

## File Structure

- **Modify** `index.html` — remove `#texts`/`#band` sections; add `#skin` layer shell, `#deck` overlay, `#haut` handle; slim inline script to boot/phases/bands/echoes/counter/telemetry; load the new scripts
- **Create** `assets/art-map.js` — `ARTMAP` (track → image path)
- **Create** `assets/engine.js` — WebGL engine extracted from inline script + `Engine.setImage(src)` crossfade + `Engine.onGlitch` hook + `Engine.state` (the old `S`)
- **Create** `assets/pulse.js` — AudioContext/Analyser + onset detection; `Pulse.attach(audioEl)`, `Pulse.level`, `Pulse.onBeat(cb)`
- **Create** `assets/player.js` — `PHASES` registry, track lists, bar UI, `#deck` + visualizer, grand loop (a→b→loop→a)
- **Create** `assets/skin.js` — `Skin.enter()/Skin.leave()`, state machine, peel/morph, sentinel
- **Create** `assets/typosync.js` — renders `LYRICS` into `#skin`, line highlight via `Pulse.onBeat`
- **Modify** `assets/lyrics.js` — delete the renderer IIFE (keep `const LYRICS`)

Script load order (dependencies): `key-visual.js`, `lyrics.js`, `art-map.js`, `engine.js`, `pulse.js`, `player.js`, `skin.js`, `typosync.js`, inline main.

Interfaces (consumed across tasks):
- `Engine.state` — `{phase, warm, aber, flow, scale, drift, glitch, nextGlitch, audio, audioSm, track}` ; `Engine.setImage(src:string)` ; `Engine.onGlitch = fn|null` ; `Engine.tear(durationMs)` (sustained glitch for peel)
- `Pulse.attach(au:HTMLAudioElement)`, `Pulse.level:()=>number`, `Pulse.onBeat(cb):unsub`
- `Player.play(ph:string, i:number)`, `Player.current = {ph, i}`, `Player.onTrackChange = fn(ph,i)` — set by skin/typosync/main
- `Skin.enter()`, `Skin.leave()`, `Skin.state` ∈ `surface|peeling|substance|morphing`
- `ARTMAP[ph] = string[]` (image paths, cyclic for b)

---

### Task 1: Extract WebGL engine + texture crossfade

**Files:**
- Create: `assets/engine.js`
- Modify: `index.html` (remove WebGL block from inline script, add `<script src="assets/engine.js">`)

**Interfaces:**
- Produces: `window.Engine = {state, setImage(src), tear(ms), onGlitch}`

- [ ] **Step 1:** Move the WebGL block (constants `S`, `TARGETS`, shaders, `initGL`, `frame`, `drawScene`, pointer flowmap, resize, visibility handling) verbatim into `engine.js`; rename exported `S` → keep internal `S`, export as `Engine.state`. Where the scheduler called `stutHero()`, call `Engine.onGlitch && Engine.onGlitch()`.
- [ ] **Step 2:** Add dual textures + crossfade. New uniforms in FS_DRAW: `sampler2D uTexB`, `float uTexMix`. Blend: `colA = texture(uTex,...)`, `colB = texture(uTexB,...)`, mix by `uTexMix` (apply same aberration offsets to both). `Engine.setImage(src)` loads the image, uploads to texB, animates `texMix 0→1` over 900 ms inside `frame()`, then promotes texB→texA. Guard: ignore while a swap is in flight (queue latest).
- [ ] **Step 3:** Add `Engine.tear(ms)`: sets `S.glitch=1.4`, holds `nextGlitch` retriggering every 90 ms for `ms`, then releases. Used by skin peel.
- [ ] **Step 4:** Verify: serve + headless screenshot of layer 1 — identical hero to before; `--dump-dom` shows `body.ready`; no console errors (`--enable-logging=stderr | grep -i uncaught` empty).
- [ ] **Step 5:** Commit in `dist/` (after sync): `git commit -m "Engine: Modul + Dual-Textur-Crossfade + Tear-API"`.

### Task 2: Pulse — analyser + onset detection

**Files:**
- Create: `assets/pulse.js`

**Interfaces:**
- Consumes: nothing (attaches lazily)
- Produces: `Pulse.attach(au)`, `Pulse.level()`, `Pulse.onBeat(cb)`

- [ ] **Step 1:** Move `ensureCtx`/`pollAudio` logic from the old inline script into `pulse.js`. `Pulse.attach(au)` creates AudioContext + analyser (fftSize 256) once, keeps the existing procedural fallback (`audioDead` detection: currentTime>1.5 && near-zero energy ×40 checks).
- [ ] **Step 2:** Onset detection in the 50 ms poll: bass flux = sum of positive deltas of bins 1–8 vs previous frame; adaptive threshold = 1.5× running mean (decay 0.98); fire callbacks when flux > threshold and ≥180 ms since last beat. Also update `Engine.state.audio` (replaces old `S.audio` writes).
- [ ] **Step 3:** Verify: `--dump-dom` smoke (no errors); unit-ish check via evaluate in headless: `Pulse.onBeat` is a function, `Pulse.level()` returns a number.
- [ ] **Step 4:** Commit: `"Pulse: Analyser-Onset-Detection als Taktgeber"`.

### Task 3: Art map + player with deck, visualizer, grand loop

**Files:**
- Create: `assets/art-map.js`, `assets/player.js`
- Modify: `index.html` (player bar markup gains thumbnail + expand affordance; add `#deck` overlay markup + CSS)

**Interfaces:**
- Consumes: `Engine.setImage`, `Pulse.attach`, `Pulse.level`
- Produces: `ARTMAP`, `Player.play(ph,i)`, `Player.current`, `Player.onTrackChange`

- [ ] **Step 1:** `art-map.js`:
```js
const ARTMAP = {
  a:    Array.from({length:15}, (_,i)=>`assets/art/a${String(i+1).padStart(2,'0')}_`),
  b:    [...9 b-images...],
  loop: ['assets/art/loop01_tendrils.jpg','assets/art/loop02_ghost_gesicht.jpg']
};
```
For `a`, filenames are not uniform — write the 15 real names explicitly (`a01_oelkreatur.jpg … a15_schmierfilm.jpg`). For `b`, cyclic pool of 9 (`b00_banner…b08_struktur`), `b[i % 9]`.
- [ ] **Step 2:** Move `PHASES` registry + `playTrack` + bar controls into `player.js` as `Player`. On `play()`: `Engine.setImage(artFor(ph,i))`, `Pulse.attach(au)`, update bar (thumb `background-image`, title, phase label), call `Player.onTrackChange(ph,i)`.
- [ ] **Step 3:** Grand loop in `au.onended`: next track; at phase end advance `a→b`, `b→loop`, `loop→a` (wrap to track 0).
- [ ] **Step 4:** Deck: clicking the bar (not the controls) opens `#deck` — fixed overlay, big art (same image), controls, progress ring, close button. Visualizer canvas: each rAF — fade previous frame (`globalAlpha=.82`, slight scale 1.006 = smear), draw 64 frequency bins as thin cold vertical lines from bottom, height = bin value × (1+glitch). Skip when deck closed or REDUCED.
- [ ] **Step 5:** Verify: headless screenshot with `#deck` force-opened via test query param; dump-dom asserts `ARTMAP` paths resolve (curl each: `for f in …; do curl -sf`); no errors.
- [ ] **Step 6:** Commit: `"Player: Deck mit Visualizer, Grand Loop, Bild-Bindung"`.

### Task 4: Skin — layer state machine + peel/morph

**Files:**
- Create: `assets/skin.js`
- Modify: `index.html` (`#skin` shell: `<div id="skin"><div id="skin-scroll">…</div></div>` + edge handle `#haut`; CSS for both layers + transitions)

**Interfaces:**
- Consumes: `Engine.tear`, `Engine.state`
- Produces: `Skin.enter()`, `Skin.leave()`, `Skin.state`

- [ ] **Step 1:** CSS: `#skin{position:fixed;inset:0;z-index:20;background:var(--oil);clip-path:inset(0 0 100% 0);visibility:hidden}` — scroll container inside. Transition classes: `.peel-in` animates clip-path `inset(0 0 100% 0) → inset(0)` with jagged intermediate keyframes (5 stops, irregular left/right insets = tear shape); `.morph-out` reverses into hero crossfade.
- [ ] **Step 2:** `Skin.enter()`: guard state; `Engine.tear(650)`; add `.peel-in`; on animationend → state `substance`, lock layer-1 scroll (`body.style.overflow='hidden'`), focus skin. `Skin.leave()`: crossfade skin out, restore scroll, scrollTo(0,0).
- [ ] **Step 3:** Sentinel: last element in `#skin-scroll`; IntersectionObserver (root = skin-scroll) → `Skin.leave()` (the morph). Edge handle `#haut` (fixed bottom-right above chrome): label toggles ZWEITE HAUT ↑ / OBERFLÄCHE ↓.
- [ ] **Step 4:** REDUCED: skip tear + jag, plain 600 ms opacity crossfade.
- [ ] **Step 5:** Verify: headless — test page with `?skin=1` param calling `Skin.enter()` after boot; screenshot shows typo layer; dump-dom shows `Skin.state==="substance"`.
- [ ] **Step 6:** Commit: `"Skin: Zwei-Ebenen-Orbit mit Peel/Morph-Transition"`.

### Task 5: Typosync — lyrics in the skin + beat highlight

**Files:**
- Create: `assets/typosync.js`
- Modify: `assets/lyrics.js` (remove renderer IIFE)

**Interfaces:**
- Consumes: `LYRICS`, `Pulse.onBeat`, `Player.onTrackChange`, `Skin.state`
- Produces: none (terminal module)

- [ ] **Step 1:** Render into `#skin-scroll`: opening frame (core line, cold), then per phase: label + one `<article class="lyr">` per track (id `lyr-{ph}-{i+1}` — anchor compat), artist comment between phase blocks („Jede empfohlene Hörreihenfolge…" after a; „Der Ausstieg ist möglich…" after b), closing frame (signature). Lines as `<span>` with `--l` stagger var (reuse existing reveal CSS).
- [ ] **Step 2:** Beat highlight: `Player.onTrackChange` → mark active article `.live`, reset line index. `Pulse.onBeat` → if `Skin.state==='substance'` and active article exists: advance `.hit` class to next line (wraps at end = the lyric loops too). `.hit` CSS: cold color + slight weight spike; between beats the line breathes via existing `breathe` keyframes at low amplitude.
- [ ] **Step 3:** REDUCED: no auto-advance; active track's lines all get static highlight.
- [ ] **Step 4:** Verify: dump-dom — 34 `.lyr` articles inside `#skin-scroll`, framing comments present; simulate: set `Skin.state='substance'`, dispatch fake beats → `.hit` advances (evaluate script in headless).
- [ ] **Step 5:** Commit: `"TypoSync: Lyrics in der Haut, Onset-Highlight"`.

### Task 6: Rewire main + strip removed sections

**Files:**
- Modify: `index.html` (final), `assets/lyrics.js` cleanup landed in Task 5

**Interfaces:**
- Consumes: all modules
- Produces: finished page

- [ ] **Step 1:** Delete `#texts` + `#band` sections and their CSS (lyr styles move to skin-scoped rules, keep). Chrome top-right: replace TEXTS/BILDBAND links with nothing (handle `#haut` covers it). Footer: remove statement paragraph (moved to skin), keep `#loopback` + `.sig`.
- [ ] **Step 2:** Inline script keeps: boot, coreline char split, hero letter split + `Engine.onGlitch = stutHero`, loop bands engine, pointer echoes, DURCHLAUF counter, loopback, telemetry, capture (uses `Engine` internals — expose `Engine.capture()` from engine.js containing the old toBlob logic).
- [ ] **Step 3:** Phase UI wiring moves to `Player` API: opening a phase calls `Player.play(ph,0)` (existing autoplay behavior preserved, `S.noAuto` deep-link logic preserved); hover magnification unchanged.
- [ ] **Step 4:** Full verification: screenshots hero / skin / deck; dump-dom assertions (no `#band`, 34 lyr, `DURCHLAUF #`); no console errors.
- [ ] **Step 5:** Sync all changed/created files to `dist/` (including `assets/art` already present there), `git add -A`, commit `"ZWEITE HAUT: Oberflächen-Orbit, Deck-Player, Typo-Sync — Galerie aufgelöst"`, push.
