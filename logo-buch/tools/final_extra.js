/* ---------- finale: three merged systems built from the user's favourites ---------- */
LOGOIDX.atelier=0;LOGOIDX.kasten=17;LOGOIDX.presse=21;
const DM={vb:LG[21].vb,parts:LG[21].parts};
FIN.atelier={primary:FIN.murmure.primary,secondary:FIN.murmure.secondary,signet:FIN.murmure.signet};
FIN.kasten={primary:FIN.vignelli.primary,secondary:FIN.vignelli.secondary,signet:FIN.vignelli.signet};
FIN.presse={primary:DM,signet:DM,secondary:null,word:FIN.trickster.secondary};
const FINALS=[
{key:"atelier",n:1,name:"Atelier",fit:"Kunst · Editorial · Ausstellung",head:"Bilder, Systeme, Skulpturen.",
 lead:"Le Murmure ist die Stimme, Libre Caslon trägt jeden längeren Text, eine feine Mono beschriftet. Rot nur für Signale, Unterstreichungen und Plakate. Die Druckermarke wird zum Exlibris auf jedem Werk.",
 kw:["Ausstellung","Katalog","Website"],
 v:{bg:"#EEEAE1",fg:"#0F0E0D",mut:"#7d776c",card:"#E5E0D5",line:"#cfc8ba",acc:"#C4392C",onacc:"#F6F1E8",
    fd:"'JM Murmure'",fs:"'JM Caslon Display'",fb:"'JM Caslon Text'",fm:"'JM Sligoil'",ds:1.25,dl:.84,dt:"0",dtt:"uppercase",ss:1.15},
 type:[["Titel","Le Murmure","Velvetyne · OFL<br>Versal · 120/100"],["Untertitel","Libre Caslon Display","Google Fonts · OFL<br>28/34"],["Fließtext","Libre Caslon Text","Google Fonts · OFL<br>17/26 · kursiv für Werke"],["Auszeichnung","Sligoil Micro","Velvetyne · OFL<br>12/17 · +4 %"]],
 col:[["Knochen","#EEEAE1","Fläche",58],["Tinte","#0F0E0D","Text, Logo",30],["Stein","#7d776c","Sekundär",6],["Leinen","#E5E0D5","Flächen 2",4],["Atelierrot","#C4392C","Signal",2]],
 poster:{t:"Werk-<br>schau",d:"Skulptur, Code, Bild",m:"14.–16. Mai 2027"},quote:"Ein Zeichen, das man auch im Flüstern erkennt.",web:"Arbeiten aus Bild, Code und Raum.",
 loved:["Werkschau-Plakat in Rot","Libre Caslon im Fließtext","Navigation mit roter Unterstreichung","Formular mit Mono-Label","Negativ-Logo im Stapel","Druckermarke als Exlibris"],
 mats:[0,21,23],
 pro:"Am stärksten für Kunst und Ausstellungen. Wirkt sofort wie ein Haus mit Haltung.",con:"Für KI-Beratung und Tech-Kunden eher leise. Le Murmure braucht Platz."},
{key:"kasten",n:2,name:"Kasten",fit:"Studio · Code · KI · Systeme",head:"weniger, aber richtig.",
 lead:"Das schwarze Quadrat ist das Zeichen, mit Namen oder nur mit dem j. Archivo für Titel, Bodoni kursiv als Gegenstimme, Newsreader für Text, die Schreibmaschine für Labels und Notizen. Das jvh mit rotem Strich ist deine Handschrift.",
 kw:["Studio","Briefkopf","Interface"],
 v:{bg:"#F3F1EA",fg:"#111111",mut:"#86837b",card:"#EAE7DE",line:"#d6d2c6",acc:"#D04B3B",onacc:"#F3F1EA",
    fd:"'JM Archivo Medium'",fs:"'JM Bodoni'",fb:"'JM Newsreader'",fm:"'JM Compagnon'",ds:1,dl:.95,dt:"-.035em",dtt:"lowercase",ss:1.2,sst:"italic",pbg:"#111111",pfg:"#FFFFFF"},
 type:[["Titel","Archivo Medium","Google Fonts · OFL<br>Gemeine · 80/76 · -3,5 %"],["Untertitel","Bodoni Moda Italic","Google Fonts · OFL<br>28/34"],["Fließtext","Newsreader","Production Type · OFL<br>17/27 · Text-Optik"],["Auszeichnung","Compagnon","Velvetyne · OFL<br>12/16 · Labels, Buttons"]],
 col:[["Papier","#F3F1EA","Fläche",58],["Schwarz","#111111","Kasten, Text",32],["Bleistift","#86837b","Sekundär",5],["Durchschlag","#EAE7DE","Flächen 2",3],["Korrekturrot","#D04B3B","Strich, Aktion",2]],
 poster:{t:"raster<br>und raum",d:"Vortrag über Systeme",m:"Do 19 Uhr"},quote:"Wenn alles im Raster steht, darf ein Ding laut sein.",web:"marken, websites, systeme.",
 loved:["Kasten mit nur dem j","Briefkopf mit Quadrat","Raster-und-Raum-Plakat","Bodoni kursiv als Gegenstimme","jvh mit rotem Strich","Newsreader im Formular"],
 mats:[17,23,24],
 pro:"Trägt alles: Studio, Code, KI und Kunst. Skaliert von 16 px bis zur Hauswand.",con:"Die Grundidee ist bekannt. Persönlich wird es erst durch Schreibmaschine, Rot und Bodoni."},
{key:"presse",n:3,name:"Presse",fit:"Druck · Merch · Musik · Editionen",head:"Laut gedruckt, sauber gebaut.",
 lead:"Die Druckermarke ist das Siegel. Trickster macht den Lärm, Fraktur spricht nur bei Editionen und Drops. Familjen und die Schreibmaschine halten alles lesbar. Gedruckt wird in Riso-Blau und Pink.",
 kw:["Riso","Drops","Label"],
 v:{bg:"#F2EFE6",fg:"#1B1B1B",mut:"#77736a",card:"#E8E4D8",line:"#d3cdbf",acc:"#24398F",onacc:"#F2EFE6",
    fd:"'JM Trickster'",fs:"'JM Compagnon'",fb:"'JM Familjen'",fm:"'JM Compagnon'",ds:1.05,dl:.95,dt:"-.01em",ss:1,pbg:"#EE55AE",pfg:"#24398F"},
 type:[["Titel","Trickster","Velvetyne · OFL<br>80/80 · -1 %"],["Untertitel","Compagnon","Velvetyne · OFL<br>22/28"],["Fließtext","Familjen Grotesk","Google Fonts · OFL<br>16/25"],["Auszeichnung","Compagnon","Velvetyne · OFL<br>12/16"]],
 col:[["Papier","#F2EFE6","Fläche",52],["Riso-Blau","#24398F","Logo, Text",24],["Fluo-Pink","#EE55AE","Zweitfarbe",14],["Druckschwarz","#1B1B1B","Fließtext",7],["Knochen","#ECE7DC","Merch",3]],
 poster:{t:"Live im<br>Keller",d:"Drei Bands, ein Drucker",m:"Fr 21 Uhr"},quote:"Lieber eine Farbe zu viel als eine zu wenig.",web:"Platten, Plakate, Abende.",
 loved:["Druckermarke","Riso-Versatz in Blau","Trickster-Website","Drop-Plakat in Fraktur","Fraktur auf Baumwolle","Doppelseite mit blauem Zitat"],
 mats:[21,7,4],
 pro:"Das meiste Leben und die beste Merch-Welt. Hier fühlt sich alles nach Handwerk an.",con:"Zu laut für Beratung und KI-Kunden. Die Druckermarke ist unter 24 px schwer lesbar."}
];
FINALS.forEach(s=>SYS.push(s));
const SF=FINALS;
function extraBlock(s){
 if(s.key==='atelier') return `<div class="xrow"><div class="mat" style="aspect-ratio:4/5">${matsvg(LG[21])}</div><div class="xt"><span class="badge2">Exlibris</span><p>Die Druckermarke als Stempel auf Rückseiten, Zertifikaten und Katalogen. Le Murmure bleibt das Logo, die Marke ist das Siegel des Ateliers.</p>${svgOf(DM)}</div></div>`;
 if(s.key==='kasten'){const L=lg('typebox');return `<div class="xrow"><div class="clogo2">${L.pr}</div><div class="xt"><span class="badge2">Handschrift</span><p>Der Kasten mit jvh und rotem Strich ist das Zweitzeichen für Notizen, Rechnungen, Code-Projekte und den Buchrücken. Der Kasten bleibt gleich, nur die Schrift darin wechselt.</p></div></div>`}
 if(s.key==='presse'){const fv=Object.assign({},s.v,{fd:"'JM Fraktur'",fs:"'JM Space Mono Bold'",stt:"uppercase",st:".14em",ss:.8,pbg:"#ECE7DC",pfg:"#0C0C0C",dl:1,dtt:"none"});
  return `<div class="xrow" style="${vars(fv)}"><div class="poster"><div class="pt">Drop<br>Nº 3</div><div class="pd">Shirts, Prints, Flash</div><div class="pm"><span>Nur 100 Stück<br>Presse Joel van Hees</span>${svgOf(FIN.fraktur.signet)}</div></div><div class="mat" style="aspect-ratio:4/5">${matsvg(LG[4])}</div><div class="xt"><span class="badge2">Editionen</span><p>Für Drops und limitierte Editionen kommt Fraktur dazu, mit Space Mono Bold. So bekommt jede Edition eine eigene Stimme und bleibt trotzdem Teil der Presse.</p></div></div>`}
 return ''}
function more(s){const L=lg(s.key);return `
 <h4 class="lab"><b>05</b> Zweite Stimme</h4>${extraBlock(s)}
 <h4 class="lab"><b>06</b> Korrespondenz</h4>
 <div class="corr">${letter(s,L)}<div class="corr-r"><div class="lc w3" style="grid-column:auto"><div class="v">${L.sec}</div><div class="t">Briefkopf-Logo · Querformat</div></div><div class="note">Logo oben links, Absenderzeile in der Auszeichnungsschrift, Fließtext in 10 pt. Rand links 25 mm, Falzmarken bei 105 und 210 mm.</div></div></div>
 <h4 class="lab"><b>07</b> Editorial</h4>${spreadMock(L,false)}
 <h4 class="lab"><b>08</b> Komponenten</h4>${comps(s,L)}
 <h4 class="lab"><b>09</b> Social, Merch, Präsentation</h4>${social(s,L)}
 <h4 class="lab"><b>10</b> Material</h4><div class="mats3">${s.mats.map(i=>`<div class="mat">${matsvg(LG[i])}</div>`).join('')}</div>
 <h4 class="lab"><b>11</b> Aus deinen Screenshots</h4><div class="loved">${s.loved.map(t=>`<span>${t}</span>`).join('')}</div>
 <div class="pc2"><div><b>Stärke</b><p>${s.pro}</p></div><div><b>Schwäche</b><p>${s.con}</p></div></div>`}
TOTE.atelier=["#E9E2D3","#0F0E0D"];TOTE.kasten=["#E9E2D3","#111111"];TOTE.presse=["#E9E2D3","#24398F"];
function decide(p){const R=[["Kunst und Ausstellung",[5,3,4]],["Design-Studio",[4,5,3]],["Code und KI",[2,5,2]],["Merch und Druck",[3,3,5]],["Lesbar ab 16 px",[4,5,2]],["Trägt 10 Jahre",[4,5,3]],["Unverwechselbar",[5,3,5]]];
 const dots=n=>'●'.repeat(n)+'○'.repeat(5-n);
 return `<section class="page end pad dec" id="seite-${p}" data-name="Entscheidung"><h2>ENTSCHEIDUNG</h2>
 <div class="mtx"><div class="mh"><span></span>${SF.map(s=>`<span style="${vars(s.v)}" class="mhn">${svgOf(FIN[s.key].signet)}<b>${s.name}</b></span>`).join('')}</div>
 ${R.map(([k,v])=>`<div class="mr"><span>${k}</span>${v.map(n=>`<span class="d">${dots(n)}</span>`).join('')}</div>`).join('')}
 <div class="mr tot"><span>Summe</span>${SF.map((s,i)=>`<span class="d">${R.reduce((a,r)=>a+r[1][i],0)} / 35</span>`).join('')}</div></div>
 <p><b>Meine Empfehlung: Kasten als Hauptmarke.</b> Es ist das einzige System, das KI-Kunden, Code und Kunst gleichzeitig ernst nehmen. Wenn dir das zu streng ist, nimm Atelier. Presse würde ich nicht als Hauptmarke führen, sondern als Linie für Drucke, Merch und Musik.</p>
 <p>Du musst dich übrigens nicht für nur eines entscheiden: Alle drei teilen Papier, Schwarz, Rot, eine Antiqua und die Schreibmaschine. Möglich ist ein Haus mit drei Räumen: <b>Kasten</b> für das Studio, <b>Atelier</b> für die Kunst und <b>Presse</b> für Editionen. Die Regel dabei: Es gibt nur ein Hauptzeichen, die anderen treten als Linien auf.</p></section>`}
