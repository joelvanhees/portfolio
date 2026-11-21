/* ---------- Atelier & Presse: one married system ---------- */
const HV={bg:"#F1F0EC",fg:"#141414",mut:"#77756f",card:"#E8E6E0",line:"#d6d4cd",acc:"#24398F",onacc:"#F1F0EC",
  fd:"'JM Murmure'",fs:"'JM Compagnon'",fb:"'JM Caslon Text'",fm:"'JM Compagnon'",ds:1.25,dl:.84,dt:"0",dtt:"uppercase",ss:1,pbg:"#C4392C",pfg:"#F6F1E8"};
const RED="#C4392C";
const SEAL={t:"Siegel",vb:HAUS.seal.vb,parts:HAUS.seal.parts};
LG.push(Object.assign({mat:"riso",accent:"#EE55AE"},SEAL));LOGOIDX.haus=LG.length-1;
TOTE.haus=["#E9E2D3","#24398F"];
const HS={key:"haus",name:"Atelier & Presse",quote:"Lieber von Hand gedruckt als perfekt gerendert.",poster:{t:"Werk-<br>schau",d:"Skulptur, Code, Bild",m:"14.–16. Mai 2027"},web:"Arbeiten aus Bild, Code und Raum.",v:HV};
const HL={pr:svgOf(HAUS.lockup),sig:svgOf(HAUS.seal),sec:svgOf(HAUS.seal)};
const sv=(k,cls='')=>svgOf(HAUS[k],cls);
const pg=(id,name,inner,extra='')=>`<section class="page sys pad haus ${extra}" id="seite-${id}" data-name="${name}" style="${vars(HV)}"><div class="wrap">${inner}</div></section>`;
const head=(no,t,sub)=>`<div class="sh"><span class="no">${no}</span><span>${sub}</span><span class="ix">Atelier &amp; Presse</span></div><h2 class="disp hh">${t}</h2>`;

function symbolSvg(){const R=HAUS.raw;const m=[[1,78,-78],[2,98,0],[3,0,-118],[4,24,-238],[5,-2,52],[6,46,-48]];
 return `<svg viewBox="-150 -260 300 395" class="sym" role="img" aria-label="Siegel mit Erklärungen"><path class="i" d="${R.frame}"/><path class="i" d="${R.J}"/><path class="i" d="${R.H}"/><path class="i" d="${R.v}"/>
 ${m.map(([n,x,y])=>`<g transform="translate(${x} ${y})"><circle r="11" fill="var(--acc)"/><text y="4.5" text-anchor="middle" style="font:400 13px var(--fm);fill:var(--onacc)">${n}</text></g>`).join('')}</svg>`}
const SYMB=[
 ["Kreis","Die Welt, in der gearbeitet wird. Frühe Drucker führten oft einen Kreis als Erdkugel, also als Anspruch auf Reichweite. Hier heißt er: Alles, was du machst, passt in eine Form."],
 ["Horizont","Die Linie teilt oben und unten. Oben steht die Idee, unten das Handwerk. Deine Initialen stehen unten, auf dem Boden der Arbeit."],
 ["Achse","Der Stab verbindet beide Hälften und ragt aus dem Kreis heraus. Die Idee zeigt über das Gemachte hinaus."],
 ["Haken","Der offene Haken über dem Stab stammt aus deinem ersten Entwurf. Haken, Fähnchen und Winkel waren typische Spitzen alter Haus- und Druckermarken. Hier bleibt er offen und ohne Kreuz: ein Zeichen für Arbeit, die nie ganz abgeschlossen ist."],
 ["Initialen","J, v und H in Fraktur, den Buchstaben der Presse. Le Murmure trägt den Namen daneben. So stehen beide Stimmen im Zeichen: Presse im Siegel, Atelier im Namen."],
 ["Freies Viertel","Oben rechts bleibt Luft. Bei Editionen steht hier die Nummer, bei Zertifikaten das Jahr. So wird das Siegel zum Stempel, der mitzählt."]];

function buildHaus(){let h='',p=1;
 h+=`<section class="page cover pad" id="seite-${p++}" data-name="Atelier & Presse"><div class="top"><span>Logobuch · Das System</span><span>Ausgabe 06 · November 2026</span></div><h1>ATELIER<br>&amp; PRESSE</h1><p>Ein System mit zwei Stimmen. Das Atelier spricht groß und leise, die Presse druckt laut und von Hand. Beide unter einem Siegel.</p></section>`;

 h+=pg(p++,"Hauptlogo",head("00 · Dein Logo","Das Hauptlogo","Siegel + Name")+`
 <div class="mainlogo"><div class="ml1">${sv('lockup')}</div><div class="ml2">${sv('lockup')}</div></div>
 <div class="rules3"><div><b>Hauptlogo</b><p>Siegel und Name in Le Murmure, nebeneinander. Steht auf Website-Startseite, Briefbogen, Katalog, Verpackung und überall, wo du dich vorstellst.</p></div><div><b>Siegel allein</b><p>Wenn der Name schon dasteht oder der Platz klein ist: Profilbild, Stempel, Rückseite, Navigation. Ab 24 px.</p></div><div><b>Kleinform</b><p>Für Favicon und App-Icon unter 24 px: Siegel ohne Buchstaben.</p></div></div>`);

h+=pg(p++,"Das Siegel",head("01 · Das Siegel","Das Siegel","Symbolik")+`
 <div class="symg"><div class="symv">${symbolSvg()}</div><ol class="syml">${SYMB.map(([t,x],i)=>`<li><b><i>${i+1}</i>${t}</b><span>${x}</span></li>`).join('')}</ol></div>
 <h4 class="lab"><b>A</b> Vorher und nachher</h4>
 <div class="ba"><div class="lc"><div class="v">${sv('old')}</div><div class="t">Vorher · Logobuch Nº 22</div></div><div class="lc"><div class="v">${sv('seal')}</div><div class="t">Nachher · neu gezeichnet</div></div>
 <ul class="chg"><li>Buchstaben berührten den Ring. Jetzt haben sie überall Abstand.</li><li>Vier verschiedene Strichstärken sind jetzt eine.</li><li>Das Kreuz ist weg, der offene Haken bleibt.</li><li>IM Fell ist durch Fraktur ersetzt, die Schrift der Presse.</li><li>Neu ist eine Kleinform ohne Buchstaben, die ab 16 px funktioniert.</li></ul></div>
 <h4 class="lab"><b>B</b> Varianten</h4>
 <div class="logos"><div class="lc w2"><div class="v">${sv('seal')}</div><div class="t">Siegel · ab 24 px</div></div><div class="lc w2"><div class="v">${sv('edition')}</div><div class="t">Edition · Nummer im freien Viertel</div></div><div class="lc w2"><div class="v">${sv('small')}</div><div class="t">Kleinform · Favicon ab 16 px</div></div></div>`);

 h+=pg(p++,"Logo-Familie",head("02 · Logo-Familie","Zeichen &amp; Name","Wann welches Zeichen")+`
 <div class="hero-logo big">${sv('lockup')}</div>
 <div class="logos">
  <div class="lc w2"><div class="v">${sv('lockupv')}</div><div class="t">Hochformat · Plakat, Buch</div></div>
  <div class="lc w2"><div class="v">${sv('word')}</div><div class="t">Wortmarke · Website, Briefkopf</div></div>
  <div class="lc"><div class="v">${sv('stack')}</div><div class="t">Stapel · Atelier</div></div>
  <div class="lc"><div class="v">${sv('signet')}</div><div class="t">JvH · im Text, ab 12 px</div></div>
  <div class="lc neg"><div class="v">${sv('seal')}</div><div class="t">Negativ</div></div>
  <div class="lc acc"><div class="v">${sv('seal')}</div><div class="t">Presseblau</div></div>
  <div class="lc" style="background:${RED}"><div class="v" style="color:#F6F1E8">${sv('stack')}</div><div class="t" style="color:#F6F1E8;opacity:.75">Atelierrot</div></div>
  <div class="lc" style="background:#141414"><div class="v" style="color:#ECE7DC">${sv('frakJ')}</div><div class="t" style="color:#ECE7DC;opacity:.7">Editionen · Fraktur-J</div></div>
  <div class="lc w2"><div class="v"><div class="clear"><i class="x">¼ H</i><i class="y">¼ H</i>${sv('seal')}</div></div><div class="t">Schutzzone · ¼ der Siegelhöhe</div></div>
 </div>
 <div class="rules3"><div><b>Siegel</b><p>Das Hauptzeichen. Steht auf allem, was dauerhaft ist: Website, Briefbogen, Werke, Verpackung.</p></div><div><b>Le Murmure</b><p>Der Name. Groß im Atelier, auf Plakaten und Katalogen, immer in Versalien.</p></div><div><b>Fraktur</b><p>Nur für Editionen, Drops und Merch. Nie im Studio-Alltag.</p></div></div>`);

 const TR=[["Titel","Le Murmure","Velvetyne · OFL · Versal · 120/100",`<div class="s-title">Bilder, Systeme, Skulpturen.</div>`],
  ["Text","Libre Caslon Text","Google Fonts · OFL · 17/26 · kursiv für Werke",`<div class="s-body">Joel van Hees entwirft Marken, baut Websites und trainiert Modelle. Im Atelier entstehen <em>Skulpturen</em>, die zurückschauen. Alles folgt derselben Frage: Wie fühlt sich eine Idee an, wenn man sie anfassen kann?</div>`],
  ["Struktur","Compagnon","Velvetyne · OFL · Labels, Buttons, Zitate, Absender",`<div class="s-sub">„Die Maschine liefert Varianten, die Hand trifft die Entscheidung.“</div><div class="s-mono" style="margin-top:8px">Nº 014 — Augen-Skulptur, Gips, 2026</div>`],
  ["Edition","UnifrakturMaguntia","Google Fonts · OFL · Siegel, Drops, Merch",`<div style="font:400 64px/1 'JM Fraktur'">van Hees</div><div style="font:400 14px/1.4 'JM Compagnon';letter-spacing:.18em;margin-top:8px">SHIRTS · PRINTS · FLASH</div>`]];
 h+=pg(p++,"Typografie",head("03 · Typografie","Vier Rollen","Lesen, Struktur, Stimme, Edition")+`
 <div class="type">${TR.map(t=>`<div class="tr"><div class="role">${t[0]}</div><div class="meta"><b>${t[1]}</b>${t[2]}</div><div class="spec">${t[3]}</div></div>`).join('')}</div>
 <div class="rules3"><div><b>Lesen</b><p>Alles, was man liest, steht in Caslon: Texte, Briefe, Navigation, Formulare.</p></div><div><b>Bedienen</b><p>Alles, was man klickt, beschriftet oder zitiert, steht in Compagnon.</p></div><div><b>Rausgeflogen</b><p>Trickster, Familjen, Sligoil, Archivo, Bodoni und Space Mono. Sechs Schriften weniger, damit nichts überladen wirkt.</p></div></div>`);

 const COL=[["Papier","#F1F0EC","Fläche",60],["Tinte","#141414","Text, Siegel",28],["Presseblau","#24398F","Highlights, Aktionen",8],["Stein","#77756f","Sekundär",3],["Atelierrot","#C4392C","Nur Plakat",1]];
 h+=pg(p++,"Farbe",head("04 · Farbe","Papier, Tinte, Blau","Blau ist das Highlight")+`
 <div class="colors">${COL.map(c=>`<div class="sw"><div class="chip" style="background:${c[1]}"></div><b>${c[0]}</b><span>${c[1]} · ${c[2]}</span></div>`).join('')}</div>
 <div class="ratio">${COL.map(c=>`<i style="background:${c[1]};width:${c[3]}%"></i>`).join('')}</div>
 <div class="rules3"><div><b>Grundton</b><p>Papier und Tinte tragen alles. Das Blau setzt die Highlights darauf.</p></div><div><b>Presseblau</b><p>Buttons, Links, aktive Navigation, Zitate, Badges, Visitenkarte, Riso. Überall, wo das Auge hin soll.</p></div><div><b>Textur statt Farbe</b><p>Der Charakter kommt aus dem Druck: Körnung, Prägung, Stempel. Die Titel tragen das Druckkorn vom Cover.</p></div></div>`);

 const atelierV=Object.assign({},HV,{fs:"'JM Caslon Display'",ss:1.15,pbg:RED,pfg:"#F6F1E8"});
 const presseV=Object.assign({},HV,{fd:"'JM Fraktur'",fs:"'JM Compagnon'",stt:"uppercase",st:".18em",ss:.8,pbg:"#ECE7DC",pfg:"#0C0C0C",dl:1,dtt:"none",ds:1});
 const ex={vb:HAUS.seal.vb,parts:HAUS.seal.parts,mat:"stamp",accent:RED};
 const tee={vb:HAUS.fraktur.vb,parts:HAUS.fraktur.parts,mat:"tee"};
 const riso={vb:HAUS.seal.vb,parts:HAUS.seal.parts,mat:"riso",accent:"#EE55AE"};
 h+=pg(p++,"Zwei Räume",head("05 · Zwei Räume","Atelier und Presse","Gleiches Haus, zwei Stimmen")+`
 <div class="rooms"><div class="room"><h4 class="lab"><b>Atelier</b> Kunst · Ausstellung · Katalog</h4><div class="rg" style="${vars(atelierV)}">
  <div class="poster"><div class="pt">Werk-<br>schau</div><div class="pd">Skulptur, Code, Bild</div><div class="pm"><span>14.–16. Mai 2027<br>Atelier Joel van Hees</span>${sv('signet')}</div></div>
  <div class="mat">${matsvg(ex)}</div></div><p class="rp">Le Murmure, Caslon und Rot. Das Siegel wird zum Exlibris auf jeder Rückseite.</p></div>
 <div class="room"><h4 class="lab"><b>Presse</b> Drucke · Merch · Editionen</h4><div class="rg" style="${vars(presseV)}">
  <div class="poster"><div class="pt">Drop<br>Nº 3</div><div class="pd">Shirts, Prints, Flash</div><div class="pm"><span>Nur 100 Stück<br>Presse Joel van Hees</span>${sv('frakJ')}</div></div>
  <div class="mat">${matsvg(tee)}</div></div><p class="rp">Fraktur, Schreibmaschine und Blau. Gedruckt in Riso, auf Baumwolle, mit dem Siegel als Stempel.</p></div></div>
 <div class="mats3"><div class="mat">${matsvg(riso)}</div><div class="mat">${matsvg(Object.assign({},ex,{mat:'press'}))}</div><div class="mat">${matsvg(Object.assign({},ex,{mat:'foil'}))}</div></div>`);

 h+=pg(p++,"Korrespondenz",head("06 · Korrespondenz","Brief &amp; Karte","Caslon für Text, Compagnon für den Absender")+`
 <div class="corr">${letter(HS,HL)}<div class="corr-r"><div class="cards"><div class="card front" style="--cbg:#24398F;--cfg:#F1F0EC;color:#F1F0EC">${sv('seal')}</div><div class="card back"><div class="n">Joel van Hees</div><div class="r">Design · Code · KI · Kunst<br>@joelvanhees</div></div></div>
 <div class="esig"><div class="ei">${sv('seal')}</div><div><div class="en">Joel van Hees</div><div class="er">Design · Code · KI · Kunst<br>@joelvanhees</div></div></div></div></div>`);

 h+=pg(p++,"Editorial",head("07 · Editorial","Doppelseite","Murmure, Fraktur-Initiale, Caslon, blaues Zitat")+spreadMock(HL,true));

 h+=pg(p++,"Web",head("08 · Web","Website &amp; Komponenten","Navigation in Caslon, Aktionen in Compagnon")+`
 <div class="web bigweb"><div class="bar"><i></i><i></i><i></i></div><div class="site"><nav>${sv('seal')}<span class="on2">Arbeiten</span><span>Labor</span><span>Kunst</span><span>Über</span><span class="b1 sm">Kontakt</span></nav><h5>Bilder, Systeme, Skulpturen.</h5><p>Joel van Hees entwirft Marken, baut Websites und trainiert Modelle. Im Atelier entstehen Skulpturen, die zurückschauen.</p><span class="btn">Projekte ansehen</span></div></div>
 ${comps(HS,HL)}`);

 h+=pg(p++,"Social & Merch",head("09 · Social &amp; Merch","Profil, Tasche, Folie","")+social(HS,HL));

 h+=pg(p++,"Regeln",head("10 · Regeln","Sechs Regeln","Damit es nie überladen wirkt")+`
 <ol class="rl">${["Ein Zeichen pro Fläche. Siegel oder Stapel, nie beide groß nebeneinander.","Le Murmure nur in Versalien, nur für Titel und nie tiefschwarz: immer mit Druckkorn.","Caslon für alles, was gelesen wird. Compagnon für alles, was bedient wird.","Fraktur nur bei Editionen und Merch.","Papier und Tinte als Grundton, Blau für Highlights. Rot nur auf Ausstellungsplakaten.","Papier statt Weiß, Tinte statt Schwarz. Materialien dürfen sichtbar sein."].map(t=>`<li>${t}</li>`).join('')}</ol>
 <p class="lead" style="margin-top:20px">Nächster Schritt: Logo-Dateien als SVG und PNG, Favicon, Druckvorlagen für Visitenkarte und Briefbogen, Website-Variablen und Styleguide als PDF.</p>`);
 return h}
