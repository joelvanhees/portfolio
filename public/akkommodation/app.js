import {Plate} from './plate.js?v=43cfeb04609f';
import {storyLight,lightAt,SETTINGS} from './config/light-timeline.js?v=43cfeb04609f';
import {COPY} from './copy.js?v=43cfeb04609f';
import {Sculpture} from './sculpture/scene.js?v=43cfeb04609f';
import {Cosmos} from './cosmos.js?v=43cfeb04609f';
import {Story} from './story.js?v=43cfeb04609f';
let sculpture=null,cosmos=null;
const copy=COPY[document.documentElement.lang],root=document.documentElement;
const media=matchMedia('(prefers-reduced-motion: reduce)');
let paused=false,gyro=false,hasPointer=false,light=lightAt(0),pointer={x:.79,y:.31},lastFrame=0,dirty=true,raf=0,plate=null,settled=0,forcedStill=false;
const canvas=document.querySelector('#plate'),pause=document.querySelector('#pause'),gyroButton=document.querySelector('#gyro');
let scrollDemo=false,demo=null,frameTimes=[],measuredFrames=0;
const review=document.querySelector('.review-toolbar');
if(location.search.includes('review'))root.classList.add('review-mode');
const reduced=()=>media.matches||location.search.includes('reduced');
root.classList.toggle('reduced',reduced());
const still=()=>reduced()||paused||forcedStill;
const story=new Story(request);
root.classList.toggle('past-hero',scrollY>innerHeight*.30);
function progress(){return Math.max(0,Math.min(1,scrollY/(innerHeight*.3)));}
function request(layout=false){dirty=dirty||layout===true;settled=0;if(!raf&&!document.hidden)raf=requestAnimationFrame(tick);}
function onMotion(e){if(still()||e.pointerType==='touch')return;hasPointer=true;sculpture?.pointer(e.clientX,e.clientY);pointer.x=e.clientX/innerWidth;pointer.y=e.clientY/innerHeight;request();}
function orient(e){if(!gyro||still()||e.beta==null||e.gamma==null)return;pointer.x=Math.max(.05,Math.min(.95,.5+e.gamma/70));pointer.y=Math.max(.06,Math.min(.94,.5+(e.beta-40)/80));hasPointer=true;request();}
addEventListener('pointermove',onMotion,{passive:true});addEventListener('pointerdown',onMotion,{passive:true});
addEventListener('scroll',()=>{root.classList.toggle('past-hero',scrollY>innerHeight*.30);if(!still())sculpture?.scroll();request(true);},{passive:true});
addEventListener('resize',()=>{plate?.resize();request(true);},{passive:true});
addEventListener('deviceorientation',orient,{passive:true});
media.addEventListener('change',()=>{root.classList.toggle('reduced',reduced());request(true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;lastFrame=0;}else request();});
pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?copy.resume:copy.pause);pause.innerHTML=paused?'<svg viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1 9 6 1 11Z"/></svg>':'<svg viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1H4V11H1ZM6 1H9V11H6Z"/></svg>';request();});
gyroButton?.addEventListener('click',async()=>{if(gyro){gyro=false;hasPointer=false;gyroButton.textContent=copy.light;gyroButton.setAttribute('aria-pressed','false');request();return;}try{if(typeof DeviceOrientationEvent==='undefined')throw new Error('unavailable');if(typeof DeviceOrientationEvent.requestPermission==='function'&&await DeviceOrientationEvent.requestPermission()!=='granted')throw new Error('denied');gyro=true;gyroButton.textContent=copy.lightOff;gyroButton.setAttribute('aria-pressed','true');}catch{gyroButton.setAttribute('aria-pressed','false');gyroButton.title=document.documentElement.lang==='de'?'Neigung nicht verfügbar. Das Licht folgt weiter dem Scrollen.':'Tilt unavailable. The light continues to follow scrolling.';}request();});
const menu=document.querySelector('#index');document.querySelector('#index-toggle').addEventListener('click',()=>menu.showModal());document.querySelector('#menu-close').addEventListener('click',()=>menu.close());menu.addEventListener('click',e=>{const a=e.target.closest('a');if(a){e.preventDefault();const target=document.querySelector(a.getAttribute('href'));menu.close();requestAnimationFrame(()=>{target?.scrollIntoView({behavior:'instant'});request(true);});}else if(e.target===menu)menu.close();});
function tick(now){
 raf=0;if(!plate||document.hidden)return;
 const dt=Math.min(.1,lastFrame?(now-lastFrame)/1000:.016);if(lastFrame&&dt<.1)frameTimes.push(dt*1000);lastFrame=now;if(frameTimes.length>180)frameTimes.shift();if(review&&review.dataset.benchmark==='running'&&frameTimes.length>=120){const sorted=[...frameTimes].sort((a,b)=>a-b);review.dataset.benchmark='done';review.dataset.benchmarkResult=JSON.stringify({frames:frameTimes.length,meanMs:frameTimes.reduce((a,b)=>a+b,0)/frameTimes.length,p95Ms:sorted[Math.floor(sorted.length*.95)],width:innerWidth,height:innerHeight,dpr:plate.renderer.getPixelRatio()});}
 let target=lightAt(progress());const mobile=innerWidth<700;
 if((hasPointer&&!mobile)||gyro){target.x=pointer.x;target.y=pointer.y;}
 if(demo){const t=(now-demo)/1000;if(t>10){demo=null;scrollDemo=false;root.classList.remove('recording');document.querySelector('#demo').textContent='Lichtlauf';}else{target.x=.5+.39*Math.sin(t*.7-.8);target.y=.43+.25*Math.cos(t*.8);target.height=.025+.065*(.5+.5*Math.sin(t*.9));target.radius=.68;target.double=Math.max(0,6-t);if(scrollDemo){window.scrollTo(0,innerHeight*.32*Math.sin(Math.min(1,t/10)*Math.PI));target=lightAt(progress());}}}
 target=storyLight(target,story.update(still()));
 const blend=still()?1:1-Math.exp(-dt/SETTINGS.followTime);let error=0;
 for(const key of Object.keys(target)){error+=Math.abs((light[key]||0)-target[key]);light[key]=(light[key]||0)+(target[key]-(light[key]||0))*blend;}
 const heightKey=still()?0:Math.round(target.double*10)/10;if(dirty||heightKey!==plate.lastDouble){plate.drawHeights(heightKey);plate.lastDouble=heightKey;dirty=false;}
 plate.render(light,still());const gazeActive=sculpture?.render(dt,still());const cosmosActive=cosmos?.render(dt,still(),pointer);measuredFrames++;
 if(review&&root.classList.contains('review-mode')){const avg=frameTimes.reduce((a,b)=>a+b,0)/frameTimes.length;review.querySelector('output').textContent=`${Math.round(1000/avg)||0} fps`;review.dataset.frames=measuredFrames;review.dataset.meanMs=avg?.toFixed(2);review.dataset.maxMs=Math.max(...frameTimes).toFixed(2);review.dataset.contexts='1';review.dataset.light=JSON.stringify(light);}
 settled=error<.004?settled+1:0;
 if(demo||gazeActive||cosmosActive||settled<3)raf=requestAnimationFrame(tick);else lastFrame=0;
}
document.querySelector('#demo')?.addEventListener('click',()=>{demo=performance.now();frameTimes=[];review.dataset.benchmark='running';document.querySelector('#demo').textContent='Läuft';request();});
document.querySelector('#record')?.addEventListener('click',()=>{demo=performance.now();scrollDemo=innerWidth<700;frameTimes=[];root.classList.add('recording');request();});
document.querySelector('#still-test')?.addEventListener('click',()=>{forcedStill=!forcedStill;document.querySelector('#still-test').setAttribute('aria-pressed',String(forcedStill));request();});
document.querySelector('#foil-font')?.addEventListener('click',e=>{const alt=root.style.getPropertyValue('--foil-font')==='Space';root.style.setProperty('--foil-font',alt?'Inter':'Space');e.target.textContent=alt?'Inter':'Space Grotesk';request(true);});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();root.classList.remove('webgl');root.classList.add('no-webgl');cancelAnimationFrame(raf);raf=0;});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
try{await document.fonts.ready;await Promise.all([document.fonts.load('40px Akkommodation'),document.fonts.load('500 30px Signature'),document.fonts.load('italic 500 30px Signature')]);if(location.search.includes('fallback'))throw new Error('Fallback preview');plate=new Plate(canvas);await plate.load();root.classList.add('webgl');const cosmosStage=document.querySelector('.cosmos-stage');if(cosmosStage){cosmos=new Cosmos(plate,cosmosStage);for(const [id,key,amount] of [['orbit','angleExtra',.65],['approach','closeExtra',1.9]])document.querySelector('#'+id).addEventListener('click',e=>{cosmos[key]=cosmos[key]?0:amount;e.currentTarget.setAttribute('aria-pressed',String(!!cosmos[key]));request();});}request();const stage=document.querySelector('.object-stage');if(stage){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();sculpture=new Sculpture(plate,stage);sculpture.load().then(()=>request(true)).catch(e=>{stage.dataset.error=e.message;console.warn('Sculpture unavailable:',e.message);});}},{rootMargin:'800px'});observer.observe(stage);}}catch(e){root.classList.add('no-webgl');canvas.hidden=true;if(!location.search.includes('fallback'))console.warn('Interactive plate unavailable:',e.message);}

// Review controls exercise the same renderer and visible DOM, never a separate mockup.
document.querySelector('#contrast')?.addEventListener('click',()=>{
 if(!plate)return;cancelAnimationFrame(raf);raf=0;
 const blocks=[...document.querySelectorAll('[data-foil]')].map(e=>e.getBoundingClientRect()).filter(r=>r.width&&r.top<innerHeight&&r.bottom>0);
 const results=[];for(const height of [.025,.1,.5]){const r=blocks[Math.floor(blocks.length/2)]||{left:0,top:0,width:innerWidth,height:innerHeight};
  const test={...lightAt(1),x:(r.left+r.width/2)/innerWidth,y:(r.top+r.height/2)/innerHeight,height,radius:1,intensity:1.5,ambient:.30};
  plate.render(test,false);results.push({light:test,highlight:plate.inspectHighlights(),blocks:plate.inspectContrast()});
 }
 plate.render(light,true);results.push({mode:'static',highlight:plate.inspectHighlights(),blocks:plate.inspectContrast()});
 const white=Math.min(...results.flatMap(x=>x.blocks.map(b=>b.white))),green=Math.min(...results.flatMap(x=>x.blocks.map(b=>b.green)));
 review.dataset.contrast=JSON.stringify({white,green,samples:results.length,results});review.querySelector('output').textContent=`AA ${white.toFixed(2)} / ${green.toFixed(2)}`;
 request();
});

// Local review surface, excluded from normal navigation.
document.querySelector('#review-section')?.addEventListener('change',e=>{const key=e.target.value;const el=document.getElementById(key)||document.querySelector('.'+key);const y=key==='top'?0:el.getBoundingClientRect().top+scrollY-90;window.scrollTo({top:y,behavior:'instant'});request(true);});
if(review){try{new PerformanceObserver(list=>{const entries=list.getEntries();review.dataset.lcp=String(entries.at(-1).startTime);}).observe({type:'largest-contentful-paint',buffered:true});}catch{}addEventListener('load',()=>{review.dataset.resources=JSON.stringify(performance.getEntriesByType('resource').map(e=>({name:e.name,bytes:e.transferSize})));});}
