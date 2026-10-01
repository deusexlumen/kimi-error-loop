# ZWEITE HAUT — Design Spec
**K.I.M.I. — ERROR LOOP · Release-Seite, zweite Iteration**
Datum: 2026-10-01 · Status: approved (dialogisch, 2026-10-01)

## Ausgangslage

Die erste Iteration ist eine lange Scroll-Seite: Hero (WebGL-Ölfluss), drei
Phasen mit Tracklisten, Lyrics-Sektion (#texts), Bildband (#band), Footer.
Probleme laut Owner:

1. Lyrics sind faktisch unsichtbar (weit unten, klein, unansehnlich) — sollen
   für jeden Track zugänglich sein.
2. Statement-Texte wirken wie ein angehängtes Handbuch, nicht wie Teil des
   Kunstwerks.
3. Der Bildband wirkt wie ein Attachment, nicht wie Teil der Arbeit.
4. Der Player ist klein und unscheinbar; er soll Präsenz bekommen, eine große
   Ansicht und einen passenden Visualizer.

## Konzept

Der Loop-Gedanke wird zur UI-Mechanik: die Seite besteht aus zwei Ebenen in
einem geschlossenen Rotationszustand. Keine Ebene endet an einer harten Kante.

- **Ebene 1 — Oberfläche:** Hero, Loop-Bänder, Phasen, Player. Dominanz von
  Artwork, Canvas-Loop und Audio.
- **Ebene 2 — Zweite Haut:** Vollbild-Typo-Layer mit allen Lyrics (gruppiert
  nach Phase), gerahmt von den Künstlerkommentaren.
- **Zyklische Transition:** Der Übergang 1→2 ist ein Peel: das Bild des
  aktuell laufenden Tracks reißt/sheert auf (kontrollierter Glitch der
  WebGL-Engine + Clip-Wipe) und legt die Typo-Ebene frei. Am Ende der
  Typo-Ebene führt eine Morph-Animation nahtlos zurück in den Hero von
  Ebene 1. Ein permanenter Edge-Handle erlaubt den Wechsel jederzeit.
  Navigation läuft im Kreis: Oberfläche → Peel → Haut → Morph → Oberfläche.

## 1 · Architektur: zwei Skins, ein Orbit

- Ebene 2 ist ein fixed, vollflächiges Element über dem Canvas, mit eigenem
  Scroll-Container. Ebene 1 bleibt darunter montiert (Canvas läuft weiter).
- Peel: `S.glitch` wird für die Dauer der Transition hochgefahren (das Bild
  „reißt"), gleichzeitig wischt ein Clip-Pfad die Haut herein.
- Morph zurück: ein Sentinel am Ende der Haut (IntersectionObserver) löst den
  Rücksprung aus — sanfte Überblendung in den Hero, Scroll-Position Ebene 1 =
  top. Zusätzlich manueller Handle.
- State-Machine: `surface → peeling → substance → morphing → surface`.
  Während Transitionen sind Eingaben gesperrt.

## 2 · Bild–Track-Bindung (Galerie löst sich auf)

- Der Bildband (#band) wird als Sektion entfernt.
- Mapping aus `assets/art-map.js`:
  - Phase a: 15 Tracks → `a01…a15`
  - Phase b: 17 Tracks → Pool `b00…b08`, zyklisch (`pool[i % 9]`)
  - loop: 2 Tracks → `loop01_tendrils`, `loop02_ghost_gesicht`
- Beim Trackwechsel crossfadet die WebGL-Engine die Hintergrundtextur zum
  Bild des Tracks (Dual-Texturen + uMix-Uniform). Ohne WebGL: statischer
  Bildwechsel im Fallback-Div.
- Der Peel reißt immer durch das aktuell klingende Bild.

## 3 · Player: Präsenz, Deck, Visualizer

- Bar: größer, Track-Art-Thumbnail, kalte Glaskante, Titel + Phase.
- Klick auf die Bar öffnet das **Deck** (große Panel-Overlay): Track-Bild,
  Titel/Phase, Controls, Fortschrittsring, Schließen-Button — und ein
  Visualizer-Canvas.
- Visualizer: Frequenzspektrum aus dem vorhandenen AnalyserNode, gezeichnet
  als dünne kalte Linien mit Öl-Verhalten (Nachzug/Smear über fade+redraw,
  Zeilen-Stutter synchron zum Glitch-Scheduler).
- **Grand Loop:** Track-Ende → nächster Track; Ende Phase a → Phase b;
  Ende b → loop; Ende loop → Phase a. Die Arbeit zirkuliert endlos.

## 4 · Typo-Sync: Lyrics als Performance

- `pulse.js`: Onset-Detection auf dem AnalyserNode — Bass-Band
  Energy-Flux (Bins 1–8), adaptiver Schwellwert, Mindestabstand 180 ms.
  Events: `Pulse.onBeat(cb)`. Fallbacks: kein Analyser (file://) →
  prozeduraler Puls; `prefers-reduced-motion` → kein Auto-Advance.
- Auf Ebene 2 rückt bei jedem Onset ein kaltes Highlight zeilenweise durch
  die Lyrics des aktiven Tracks. Zwischen Onsets atmet die aktive Zeile über
  die variablen Font-Achsen (Intensität = Audio-Level). Alle anderen Texte
  bleiben dim/statisch.
- Ehrliche Einschränkung: keine Beat-Grids/Stems — Detection approximiert
  BPM-Trigger. Sensitivität ist ein Konstanten-Block in pulse.js.

## 5 · Künstlerkommentare als Stimme im Werk

- Footer-Statements („Der Ausstieg ist möglich …") und die Core-Zeile ziehen
  als rahmende Stimme in Ebene 2 (gleiche Mono-Type, kalt getönt), zwischen
  den Lyric-Blöcken gesetzt.
- Der Hero behält Titel + Eintreten; die Core-Zeile lebt auf Ebene 1 bereits
  als Loop-Band I weiter. Footer Ebene 1: nur Loop-Schluss-Button + Signatur.

## 6 · Code-Struktur (Classic Scripts, kein Build, file://-tauglich)

| Datei | Aufgabe | Schnittstelle |
|---|---|---|
| `assets/key-visual.js` | eingebettetes Fallback-Bild | `KEY_VISUAL` |
| `assets/lyrics.js` | Lyric-Daten (Renderer entfernt) | `LYRICS` |
| `assets/art-map.js` | Track→Bild-Mapping | `ARTMAP` |
| `assets/engine.js` | WebGL Flowmap/Draw, Glitch-Scheduler, Textur-Crossfade | `Engine.setImage(src)`, `Engine.state`, `Engine.onGlitch` |
| `assets/pulse.js` | AudioContext, Analyser, Onset-Detection | `Pulse.level`, `Pulse.onBeat(cb)`, `Pulse.attach(audioEl)` |
| `assets/player.js` | Track-Registry, Bar, Deck, Visualizer, Grand Loop | `Player.play(ph,i)`, Events |
| `assets/skin.js` | Layer-State-Machine, Peel/Morph, Handles | `Skin.enter()`, `Skin.leave()` |
| `assets/typosync.js` | Haut-DOM aus LYRICS, Zeilen-Highlight via Pulse | intern |
| Inline/`main.js` | Boot, Phasen-UI, Loop-Bänder, Echos, Counter, Loop-Schluss, Telemetrie | — |

## 7 · Error Handling / Fallbacks

- Kein WebGL → `no-webgl` Fallback (statisches Bild, Swap per src-Wechsel).
- Analyser stumm → prozeduraler Puls (bestehende Logik wandert nach pulse.js).
- `prefers-reduced-motion` → Crossfade statt Peel, kein Zeilen-Auto-Advance,
  Bänder/Echos/Welle aus (bestehende Media-Query erweitert).
- Transition-Inputs gesperrt während `peeling`/`morphing`.

## 8 · Verifikation

Headless Chrome: Render Ebene 1, Ebene 2 (aktiviert), Deck geöffnet;
DOM-Assertionen (Haut enthält alle 34 Lyrics, Art-Mapping auflösbar,
Grand-Loop-Verkettung); keine Console-Errors. Danach Sync nach `dist/`,
Commit, Push auf `github.com/deusexlumen/kimi-error-loop`.

## Explizit entfernt (YAGNI)

- Sektion `#texts` (wandert in die Haut), Sektion `#band` (Galerie),
  Lightbox-Links, Footer-Statement auf Ebene 1, Chrome-Links TEXTS/BILDBAND
  (ersetzt durch den Haut-Handle).
