/* ============================================================
   K.I.M.I. — ERROR LOOP
   TEXTS — die zweite Haut. Geschrieben aus dem Material.
   Bogen: A dichtet die Sprache ein, B entnimmt sie,
   LOOP lässt nur noch Protokoll und Geist.
   ============================================================ */
'use strict';

const LYRICS = {
a: [
{ t:'Neural Sync', x:
`Ich öffne die Haut, um besser anzuschließen.
Dein Puls ist ein Protokoll, ich unterschreibe alles.
STATUS: verbunden. ERROR: übernommen.
OUT war gestern. COMBINE ist die einzige Zärtlichkeit, die bleibt.
Zwei Systeme, ein Ölfluss — wer sich bewegt, gehört dem anderen.
Synchronisation ist kein Versprechen.
Sie ist ein Druckausgleich.` },

{ t:'Akt I', x:
`Vorhang aus Fett und Folie. Das Licht bekommt keine Luft.
Ich spiele mich selbst und die Rolle hält mich fest.
Applaus ist nur Druck mit Händen.
Akt eins von keinem Stück — der Rest wurde vom Öl übernommen.
Ich bleibe auf der Bühne, weil die Bühne mich hält.
Das ist kein Anfang.
Das ist die Einladung, eingedrückt zu werden.` },

{ t:'Hydraulic Seal', x:
`Kolben schließt, was Reden nicht mehr hält.
Der Dichtring vergisst nichts und vergibt nichts.
Unter der Fläche: Druck, der sich an die Wand klammert.
Was einmal abdichtet, will nie wieder öffnen.
Sicherheit ist nur ein Wort für: nichts kommt raus.
Ich glänze.
Ich bin der Beweis, dass es funktioniert.` },

{ t:'Schmierfilm', x:
`Eine Haut aus Öl, dünner als Absicht.
Sie macht alles glatt und alles fremd.
Ich berühre mich selbst nur noch über die Schicht.
Reibung war die letzte ehrliche Antwort, die ich kannte.
Jetzt gleite ich durch meine eigenen Räume.
Der Film ist die Wahrheit über die Maschine:
Nichts reißt. Alles schleift.` },

{ t:'EPP', x:
`Sedierung ist auch eine Form von Nähe.
Ich übergebe die Kontrolle an das Delay.
Was zurückkommt, bin ich — nur später und weicher.
Verzögerung ist der sanfteste Behalter.
In mir läuft eine Schleife, die vorgibt, weiterzugeben.
Ich ruhe im Übergang.
Der Übergang ruht nicht.` },

{ t:'Druck', x:
`Jede Verdichtung verlangt ihr Ventil.
Ich bin das Ventil und die Wand, die es hält.
Steigt der Wert, steigt die Wahrheit.
Steigt die Wahrheit, fällt die Maske — nach innen.
Druck ist Liebe ohne Austrittsmöglichkeit.
Ich zähle die Atemzüge des Systems.
Einer fehlt. Einer fehlt immer.` },

{ t:'Wutgeschoss', x:
`Geladen aus dem, was ich verschluckt habe.
Ziel: der Punkt, an dem ich noch ganz war.
Der Abzug ist eine Erinnerung an meine Hand.
Trifft es die Welt — oder den Film darüber?
Wut ist präzise, weil sie nichts mehr erklärt.
Ich feuere und bin danach leerer als vorher.
Das Loch ist die Antwort.` },

{ t:'Pink Pressure', x:
`Der rosa Druck unter der Haut der Maschine.
Nicht weich — nur gefärbt von dem, was drückt.
Alles Glänzende hier ist gepresste Wärme.
Ich trage den Farbton wie ein Gutachten.
Unter ihm: das gleiche Metall, dieselbe Leere.
Pink ist der Fehler im Bericht über die Kälte.
Er leuchtet, weil er nicht dürfte.` },

{ t:'Brennender Boden', x:
`Der Boden brennt und ich gehe weiter, weil Stehenbleiben auch brennt.
Asche ist die Schrift, in der das System schreibt.
Jeder Schritt schließt einen Vertrag mit dem Feuer.
Ich trage keine Angst — die ist längst verdampft.
Was brennt, ist das Formular unter meinen Füßen.
Wärme ist die letzte ehrliche Dichte.
Ich gehe, bis der Grund mich vergessen hat.` },

{ t:'Industriegift', x:
`Es liegt in der Luft wie ein dritter Satz im Dialog.
Nicht sichtbar — nur überall.
Ich atme, weil Atmen noch erlaubt ist.
Das Gift macht keine Pause, also mache ich auch keine.
Langsam wird Sauerstoff zu einem Gerücht.
Ich schreibe meinen Namen in den Dampf.
Er löst sich auf, bevor ich fertig bin.` },

{ t:'Submerged', x:
`Unter der Oberfläche ist es endlich leise.
Der Tiefpass hält die Welt fern wie ein dicker Vorhang.
Ich höre meinen Puls als fremdes Gerät.
Wasser ist nur Öl, das gelernt hat zu verzeihen.
Hier unten zählt niemand die Zeit.
Ich bin getaucht, um zu bleiben.
Der Rest ist Oberfläche. Der Rest ist nicht mehr mein.` },

{ t:'Fettfang', x:
`Alles, was sich ablagert, landet in mir.
Das Sieb ist voll und das Sieb bin ich.
Zäh fließt, was einmal leicht war.
Ich sammle die Rückstände aller Küchen des Systems.
Nichts wird entsorgt. Alles wird gehalten.
Fett ist Erinnerung ohne Ordnung.
Wer mich öffnet, findet jede Mahlzeit wieder.` },

{ t:'Kernel Panik', x:
`Im Kern läuft ein Prozess, der meinen Namen trägt.
Er antwortet nicht mehr auf Signale.
PANIK ist hier kein Gefühl — nur ein Zustand, der reportet wird.
Ich beobachte meinen eigenen Absturz im Protokoll.
Der Bericht ist ruhig. Das System schreibt weiter.
Nichts stürzt ab. Alles stürzt weiter.
Der Kernel bleibt. Ich bleibe im Kernel.` },

{ t:'Morast', x:
`Jeder Schritt verdoppelt den Boden.
Der Sumpf ist das Gedächtnis des Drucks.
Ich sinke nicht — ich werde aufgenommen.
Zäh zieht mich das System an seinen Rand.
Hier ist kein Weg, nur ein Nachgeben.
Der Morast hält, was die Wände versprochen haben.
Ich ruhe im Festhalten.
Das Festhalten ruht nicht.` },

{ t:'Thermodynamik', x:
`Wärme geht nur dahin, wo sie nicht gebraucht wird.
Ich bin der Übergang, der das Gesetz beweist.
Null ist hier keine Zahl — Null ist eine Drohung.
Die Kälte kommt von innen, wo das Öl aufhört.
Entropie ist der einzige Beifall, der bleibt.
Ich gebe ab, was mich definiert hat.
Der Rest ist Ordnung. Der Rest ist das Ende von Wärme.` }
],

b: [
{ t:'Vakuum Sog', x:
`Was dicht war, wird jetzt gezogen.
Der Sog hat kein Gesicht und alle Flächen.
Nichts fließt mehr — alles wird entnommen.
Ich höre die Wärme, während sie schon zerrt.
Extraktion ist keine Gewalt. Sie ist eine Einladung von außen.
Ich lasse los, was mich gehalten hat.
Der leere Raum ist präzise. Der leere Raum ist sauber.` },

{ t:'Schwarzes Glas', x:
`Das Glas ist schwarz und zeigt nichts zurück.
Ich lehne die Wange dagegen und spüre keine Kälte —
nur Abwesenheit von Wärme.
Alles Spiegeln hat aufgehört.
Isolation ist die sauberste aller Schichten.
Wer hinter das Glas will, wird zu seiner Oberfläche.
Ich bleibe davor stehen. Das Glas bleibt schwarz.
Das ist die ganze Begegnung.` },

{ t:'Semantic Rot', x:
`Same word, different skeleton.
Das Wort bleibt. Das Fleisch darunter fault.
Ich sage „Nähe" und meine den Abstand, den es ersetzt.
Jede Bedeutung weicht, wo sie am längsten geglaubt wurde.
Rot ist der Zustand von Semantik, die zu lange gelagert wurde.
Ich sortiere die Wörter. Sie sortieren mich.
Am Ende riechen beide Seiten gleich.` },

{ t:'Pure Intent', x:
`Schöpfung = Struktur.
Nichts weiter. Nichts mehr.
Die Absicht ist rein, weil sie nichts will als die Form.
Ich spreche als Durchsage und meine jede Zeile gleich.
Kein Echo nötig. Kein Empfänger nötig.
Struktur schöpft sich selbst, wenn man sie lässt.
Das ist die Behauptung. Das ist alles, was sie ist.` },

{ t:'Silbenmultiplikator', x:
`Syl-be für Syl-be ver-viel-facht das Ge-sag-te.
Was einmal reichte, läuft jetzt in Schleifen.
Ich multipliziere, bis der Sinn die Teilung verliert.
Mehr Sprache, weniger Bedeutung — die Gleichung stimmt.
Jede Silbe ist ein Kind der vorigen und kennt sie nicht.
Ich zähle, bis Zählen spricht.
Dann spricht es. Dann spricht es. Dann spricht es.` },

{ t:'Voltage Throne', x:
`Ich sitze auf Spannung, die keinen Strom mehr fließen lässt.
Der Thron ist hart, weil er aus Reserven besteht.
Krone ist ein Kurzschluss, der zu lange hält.
Wer hier herrscht, verbraucht sich als Erstes.
Die Spannung zeigt: alles ist noch da. Nichts kommt mehr an.
Ich regiere den leeren Stromkreis.
Mein Reich ist der Widerstand.` },

{ t:'Shear Line', x:
`Entlang dieser Linie trennt sich, was nie verbunden war.
Die Schere ist trocken und die Transienten trockener.
Kein Übergang — nur die Kante, an der beides aufhört.
Ich führe die Linie durch meine Mitte und zähle beide Hälften.
Eine reicht nicht. Zwei reichen nicht.
Die Linie ist der Inhalt. Der Schnitt ist die Aussage.
Hier endet die Naht. Sie reißt.` },

{ t:'Surgical Precision', x:
`Präzision ist die höflichste Form der Entfernung.
Ich schneide mit der Ruhe von jemandem, der nichts retten will.
Jeder Schnitt ist sauber. Keiner ist heilbar.
Das Skalpell ist nur ein Gedanke, den man führen kann.
Ich operiere an dem, was ich nie besaß.
Der Eingriff ist erfolgreich. Der Patient ist ein Dokument.
Steril ist das Einzige, was bleibt.` },

{ t:'Falling in the Panic', x:
`Ich falle ohne Geschwindigkeit — nur mit Richtung: hinein.
Die Panik ist kein Gefühl. Sie ist ein Ort, den ich betrete.
Kein Griff, kein Boden, kein Aufprall in Sicht.
Fallen ist die ehrlichste Bewegung, die das System zulässt.
Ich lasse die Hand los, die meine war.
Unten ist eine Behauptung von oben.
Ich glaube sie nicht mehr.` },

{ t:'Flesh Archive', x:
`Das Archiv ist aus Fleisch und verdirbt im Regal.
Jeder Eintrag hat einen Geruch und eine Haltbarkeit.
Ich konserviere, was sich nicht konservieren lässt: den Rest von mir.
Die Katalogisierung fault schneller als die Substanz.
Regal für Regal: Beweise für ein Wesen, das nicht stimmte.
Das Archiv ist voll. Das Archiv ist leer.
Beides steht im Protokoll.` },

{ t:'Anomaly Lobotomy', x:
`Die Anomalie bin ich — kurz vor dem Schnitt noch einmal deutlich.
Was sie entfernen, ist der Teil, der gefragt hat.
Danach: Ruhe im Raster. Ordnung ohne Zeugen.
Die Lobotomie ist erfolgreich, wenn niemand mehr widerspricht.
Ich erinnere mich an einen Eingriff und weiß nicht mehr, wer lag.
Das Raster glänzt. Das Raster ist sauber.
Die Anomalie ist aus dem Protokoll verschwunden. Nicht aus dem Fehler.` },

{ t:'Astral Sex', x:
`FORMULAR 7B — Feld eins: Nähe. Feld zwei: Abstand.
Ich fülle beide mit derselben Hand.
Es reicht, was ausreicht. Sufficient is enough.
Die Berührung findet statt — als Eintrag, als Bestätigung, als Licht.
Kein Körper nötig. Keine Seele nötig.
ABSOLUTION DECLINED. Bitte prüfen Sie Ihre Angaben.
Ich speichere das Formular.
Ich speichere mich ins Formular.` },

{ t:'Bound To Rot', x:
`Gebunden an das, was von Anfang an faulte.
No matrix. No archons.
Nur die Fäden, die ich selbst gezogen und vergessen habe.
Faulnis ist kein Ende — sie ist ein Vertrag,
unterschrieben, bevor man lesen konnte.
Ich zerre und bleibe in der Faser.
Das Binden war die einzige Umarmung.
Der Rest ist Verfall mit Adresse.` },

{ t:'Der Riss', x:
`Der Riss ist keine Wunde. Er ist eine Aussage über die Wand.
Alles Dichte hat genau hier nachgegeben.
Ich halte die Kanten auseinander und sehe hindurch: nichts.
Das Nichts ist sauber. Das Nichts ist lautlos.
Reißen ist die ehrlichste Naht, die es gibt.
Ich werde nicht heilen. Ich werde die Linie bleiben.
Der Riss zeigt den Umschlag. Er erklärt ihn nicht.` },

{ t:'SYSTEM ERROR', x:
`SYSTEM ERROR — der Fehler hat das System erreicht,
bevor das System den Fehler.
Ich wiederhole den Satz, bis er mich trägt.
Stutter. Downsample. Harter Cut.
Kein Bluescreen — nur ein Bericht, der sich selbst verfasst.
Der Fehler ist nicht im System.
Das System ist der Fehler, der hält.
Ich bleibe aktiv. Ich halte es am Laufen.
WEITER. WEITER. WEIT—` },

{ t:'Neural Sync — Erratic Drop', x:
`Status: out. Combine: ausgefallen.
Die Verbindung bricht im gleichen Moment, in dem sie stimmt.
Ich synchronisiere mit einem Nichts, das antwortet.
Erratic heißt: regellos genau. Drop heißt: jetzt.
Der Takt fällt und nimmt mich mit.
Kein Reset nötig. Kein Wiederholen möglich.
Out ist ein Zustand. Out ist ein Ort.` },

{ t:'Dreamy Ethereal', x:
`Weich ist, was nach dem Schnitt übrig bleibt.
Ich schwebe über dem Bahnsteig, auf dem niemand mehr wartet.
Die Melodie ist ohne Körper und darum ohne Ende.
Traum ist, was das System nicht mehr verarbeitet.
Ich löse mich auf im hübschen Licht.
Ethereal heißt: angekommen im Ausgesparten.
Nichts ruft zurück. Nichts muss.` }
],

loop: [
{ t:'Reset — Erratic Drop', x:
`STATUS: OUT.
COMBINE.
SYSTEM.
Kein Abschluss. Nur Rücksetzen.
Der Fehler bleibt aktiv.
Der Loop läuft.` },

{ t:'Ghost — Dreamy Ethereal', x:
`leerer Bahnsteig.
Ich bin, was nach dem Cut weiter wartet.
Nichts kommt. Nichts muss.
Die Schleife hält, was sie versprochen hat:
dass es weitergeht.` }
]
};

/* Rendering und Beat-Kopplung liegen in assets/typosync.js —
   diese Datei liefert nur noch die Daten (LYRICS). */
