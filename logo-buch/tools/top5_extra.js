/* ---------- top 5: deeper sections + combinations ---------- */
const TOP=['murmure','fraktur','trickster','vignelli','schreibmaschine'];
const S5=TOP.map(k=>SYS.find(s=>s.key===k));
const ART={kicker:"Werkstattbericht",title:"Augen, die zurückschauen",lead:"Wie aus einer Skizze im Browser eine Skulptur aus Gips wird, und warum Code dabei hilft.",
 p:["Am Anfang steht fast nie ein Material, sondern eine Frage. Für die Augen-Serie war es diese: Was passiert, wenn ein Objekt den Blick erwidert? Die ersten Formen entstanden nicht im Atelier, sondern in einem Browserfenster, als Parameter, die sich so lange verschieben lassen, bis etwas zurückschaut.",
    "Danach wird es langsam. Gedruckte Schablonen, Gips, Schleifpapier. Die Maschine liefert Varianten, die Hand trifft die Entscheidung. Genauso arbeite ich an Marken und Websites: Systeme bauen, die viele Möglichkeiten erzeugen, und dann mit Geschmack auswählen.",
    "KI ist in diesem Prozess kein Autor, sondern ein schneller Assistent. Sie schlägt vor, ich verwerfe das meiste. Was bleibt, muss man anfassen können."],
 quote:"Die Maschine liefert Varianten, die Hand trifft die Entscheidung.",cap:"Abb. 1 — Augen-Skulptur, Gips, 2026"};
const COMBOS={
 murmure:[{w:"Schreibmaschine",perfect:1,logo:"murmure",title:"Le Murmure × Schreibmaschine",why:"Murmure für Titel, Newsreader für Text, Compagnon für Bildunterschriften. So sieht ein Ausstellungskatalog aus, der auch gelesen wird.",v:{fs:"'JM Compagnon Light'",sst:"italic",ss:1,fb:"'JM Newsreader'",fm:"'JM Compagnon'"}},
          {w:"Vignelli",logo:"murmurebox",title:"Le Murmure im Kasten",why:"Der Name im schwarzen Quadrat, gesetzt in Murmure. Ein Stempel für Rückseiten und Kisten.",v:{fb:"'JM Archivo'",fm:"'JM Archivo Bold'"}}],
 fraktur:[{w:"Vignelli",perfect:1,logo:"frakturbox",title:"Fraktur im Kasten",why:"Die gebrochene Schrift im schwarzen Vignelli-Quadrat. Ornament trifft Ordnung, und das Zeichen wird stempeltauglich für Merch, Etiketten und Editionen.",v:{fb:"'JM Archivo'",fs:"'JM Archivo Bold'",stt:"uppercase",st:".08em",ss:.8}},
          {w:"Trickster",logo:"fraktur",title:"Fraktur × Riso",why:"Gleiche Schrift, gedruckt in Riso-Pink und Blau. Für Plakate und Drops.",v:{bg:"#F2EFE6",fg:"#24398F",acc:"#FF48B0",card:"#E8E4D8",line:"#d3cdbf",mut:"#5d6390",onacc:"#24398F",pbg:"#FF48B0",pfg:"#24398F"}}],
 trickster:[{w:"Schreibmaschine",perfect:1,logo:"trickster",title:"Trickster × Schreibmaschine",why:"Beide nutzen schon Compagnon. Mit Newsreader als Fließtext wird aus dem Label ein kleiner Verlag: Liner Notes, Fanzines, Plattentexte.",v:{fb:"'JM Newsreader'",fs:"'JM Compagnon Light'",sst:"italic"}},
          {w:"Fraktur",logo:"trickster",title:"Trickster × Fraktur",why:"Fraktur als zweite Stimme für limitierte Editionen.",v:{fs:"'JM Fraktur'",ss:1.35,stt:"none",st:"0",sst:"normal"}}],
 vignelli:[{w:"Schreibmaschine",perfect:1,logo:"vignelli",title:"Kasten × Schreibmaschine",why:"Das Quadrat als Zeichen, Compagnon für Struktur, Newsreader für Text. Streng gerastert und trotzdem persönlich. Für mich die stärkste Kombination im ganzen Heft.",v:{fs:"'JM Compagnon Light'",sst:"italic",ss:1,fb:"'JM Newsreader'",fm:"'JM Compagnon'"}},
          {w:"Le Murmure",logo:"vignelli",title:"Kasten × Le Murmure",why:"Murmure nur für große Ausstellungstitel, alles andere bleibt Vignelli.",v:{fd:"'JM Murmure'",dtt:"uppercase",ds:1.25,dl:.84,dt:"0"}}],
 schreibmaschine:[{w:"Vignelli",perfect:1,logo:"typebox",title:"Schreibmaschine im Kasten",why:"Die Signatur bekommt einen festen Rahmen. Das schwarze Quadrat mit jvh und rotem Strich funktioniert als Stempel, Favicon und Buchrücken.",v:{}},
          {w:"Le Murmure",logo:"schreibmaschine",title:"Schreibmaschine × Le Murmure",why:"Murmure für Ausstellungstitel, die Schreibmaschine erzählt den Rest.",v:{fd:"'JM Murmure'",dtt:"uppercase",ds:1.25,dl:.84,dt:"0"}}]
};
const TOTE={fraktur:["#121212","#ECE7DC"],trickster:["#E9E2D3","#24398F"],vignelli:["#E9E2D3","#111111"],murmure:["#E9E2D3","#0F0E0D"],schreibmaschine:["#E9E2D3","#1A1A1A"]};
const lg=k=>{const f=FIN[k];return {pr:svgOf(f.primary),sig:svgOf(f.signet||f.primary),sec:f.secondary?svgOf(f.secondary):svgOf(f.primary)}};

function spreadMock(L,big){return `<div class="spread2 ${big?'big':''}"><div class="pg l"><div class="kick">${ART.kicker} · Nº 014</div><div class="st">${ART.title}</div><div class="sl">${ART.lead}</div><div class="fig">${L.sig}<span>${ART.cap}</span></div></div>
 <div class="pg r"><div class="cols"><p class="dc">${ART.p[0]}</p><blockquote>„${ART.quote}“</blockquote><p>${ART.p[1]}</p><p>${ART.p[2]}</p></div><div class="folio2"><span>Joel van Hees</span>${L.sig}<span>15</span></div></div></div>`}

function letter(s,L){return `<div class="letter"><div class="lh">${L.sec}<div class="snd">Joel van Hees · Design, Code, KI, Kunst</div></div>
 <div class="rcp">Studio Beispiel GmbH<br>z. Hd. Frau Muster<br>Musterstraße 1<br>00000 Musterstadt</div>
 <div class="dt">20. November 2026</div><div class="sub">Angebot: Markenauftritt und Website</div>
 <div class="bd"><p>Sehr geehrte Frau Muster,</p><p>vielen Dank für das gute Gespräch. Anbei mein Vorschlag für den neuen Auftritt: ein Zeichen, ein System und eine Website, die mit Ihnen wächst. Ich arbeite in drei Schritten, von der Idee über den Entwurf bis zur fertigen Umsetzung.</p><p>Herzliche Grüße</p><div class="sg">Joel van Hees</div></div>
 <div class="ft"><span>Design · Code · KI · Kunst</span><span>@joelvanhees</span><span>Seite 1 / 1</span></div></div>`}

function comps(s,L){return `<div class="comps">
 <div class="cg"><span class="t">Buttons</span><div class="row"><span class="b1">Projekt anfragen</span><span class="b2">Arbeiten ansehen</span><span class="b3">Mehr lesen →</span></div></div>
 <div class="cg"><span class="t">Tags</span><div class="row">${["Marke","Website","KI","Skulptur"].map(t=>`<span class="tg">${t}</span>`).join('')}</div></div>
 <div class="cg"><span class="t">Formular</span><label class="fl">E-Mail<span class="in">name@studio.de</span></label></div>
 <div class="cg"><span class="t">Projektkarte</span><div class="pc"><div class="pim">${L.sig}</div><div class="pt2">Augen-Serie</div><div class="pm2">Skulptur · Code · 2026</div></div></div>
 <div class="cg w"><span class="t">Navigation</span><div class="nv">${L.sig}<span class="on">Arbeiten</span><span>Labor</span><span>Kunst</span><span>Über</span><span class="b1 sm">Kontakt</span></div></div>
 <div class="cg w"><span class="t">E-Mail-Signatur</span><div class="esig"><div class="ei">${L.sig}</div><div><div class="en">Joel van Hees</div><div class="er">Design · Code · KI · Kunst<br>@joelvanhees</div></div></div></div></div>`}

function social(s,L){const v=s.v,[tb,ti]=TOTE[s.key];return `<div class="soc">
 <div class="ig">${[
  `<div style="background:${v.bg}">${L.pr}</div>`,`<div style="background:${v.acc};color:${v.onacc}">${L.sig}</div>`,`<div class="q2" style="background:${v.card}"><span>„${s.quote}“</span></div>`,
  `<div class="w2" style="background:${v.fg};color:${v.bg}"><span>${s.poster.t.replace(/<br>/g,' ')}</span></div>`,`<div class="mt">${matsvg(LG[LOGOIDX[s.key]])}</div>`,`<div class="tx" style="background:${v.bg}"><span>${BODY.split('. ')[1]}.</span></div>`,
  `<div style="background:${v.fg};color:${v.bg}">${L.sec}</div>`,`<div class="w2" style="background:${v.card}"><span>Nº 14</span></div>`,`<div style="background:${v.bg}">${L.sig}</div>`].join('')}</div>
 <div class="tote"><div class="bag" style="background:${tb};color:${ti}"><i style="border-color:${tb}"></i>${L.pr}</div><span class="t">Stofftasche · Siebdruck</span></div>
 <div class="slide"><div class="sl16"><div class="sh2"><span>${s.name}</span><span>03</span></div><div class="stt">Markenauftritt 2027</div><div class="sf">${L.sig}<span>Vorschlag für Studio Beispiel</span></div></div><span class="t">Präsentation · 16:9</span></div></div>`}

function combos(s){return (COMBOS[s.key]||[]).map(c=>{const mv=Object.assign({},s.v,c.v);const L=lg(c.logo);
 if(c.perfect) return `<div class="combo perfect" style="${vars(mv)}"><div class="ch"><span class="badge">Passt perfekt</span><span class="cn">${c.title}</span><span class="cw">mit Nº ${pad(SYS.find(x=>x.name===c.w||x.key===c.w.toLowerCase())?.n||0)} ${c.w}</span></div>
  <div class="cbody"><div class="clogo">${L.pr}</div><p>${c.why}</p></div>${spreadMock(L,true)}
  <div class="cmini"><div class="web"><div class="bar"><i></i><i></i><i></i></div><div class="site"><nav>${L.sig}<span>Arbeiten</span><span>Kontakt</span></nav><h5>${s.web}</h5><p>${BODY.split('. ')[0]}.</p><span class="btn">Projekte ansehen</span></div></div>${letter(s,L)}</div></div>`;
 return `<div class="combo minor" style="${vars(mv)}"><div class="ch"><span class="cn">${c.title}</span></div><div class="mrow"><div class="clogo">${L.pr}</div><div class="poster"><div class="pt">${s.poster.t}</div><div class="pd">${s.poster.d}</div><div class="pm"><span>${s.poster.m}</span>${L.sig}</div></div><p>${c.why}</p></div></div>`}).join('')}

function more(s){const L=lg(s.key);return `
 <h4 class="lab"><b>05</b> Korrespondenz</h4>
 <div class="corr">${letter(s,L)}<div class="corr-r"><div class="lc w3" style="grid-column:auto"><div class="v">${L.sec}</div><div class="t">Briefkopf-Logo · Querformat</div></div><div class="note">Logo oben links, Absenderzeile in der Auszeichnungsschrift, Fließtext in 10 pt. Rand links 25 mm, Falzmarken bei 105 und 210 mm.</div></div></div>
 <h4 class="lab"><b>06</b> Editorial</h4>${spreadMock(L,false)}
 <h4 class="lab"><b>07</b> Komponenten</h4>${comps(s,L)}
 <h4 class="lab"><b>08</b> Social, Merch, Präsentation</h4>${social(s,L)}
 <h4 class="lab"><b>09</b> Kombinationen</h4><div class="combos">${combos(s)}</div>`}
