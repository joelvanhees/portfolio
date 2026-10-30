import * as THREE from './vendor/three/three.module.js?v=43cfeb04609f';
import {raisedRelief} from './relief.js?v=43cfeb04609f';
import {SETTINGS} from './config/light-timeline.js?v=43cfeb04609f';

const fragment=`
precision highp float;
uniform vec2 uSize; uniform float uScroll; uniform vec3 uLight;
uniform float uRadius,uAmbient,uIntensity,uStill,uEmboss,uDepth,uFoilMax,uHighlightKnee,uHighlightCeiling;
uniform sampler2D uHeight,uSurface,uProperties,uScuffs;
uniform vec4 uFoil[24]; uniform int uFoilCount;
uniform vec4 uPanels[4]; uniform float uPanelAngles[4],uSceneDim; uniform int uPanelCount;
varying vec2 vUv;
float heightAt(vec2 uv){vec2 h=texture2D(uHeight,uv).rg;return h.r*uEmboss-h.g*uDepth;}
vec2 mirrorUV(vec2 uv){return 1.-abs(mod(uv,2.)-1.);}
float heightPixel(vec2 p){return heightAt(p/uSize);}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float tool(vec2 p){return noise(p)*.65+noise(p*2.)*.25+noise(p*4.)*.1;}
// Area reflection convolved with an anisotropic roughness footprint.
// A wide emitter replaces the old pinprick highlight. It is reflected by the
// material normal, so scratches and lettering participate in the same light.
float softbox(vec3 position,vec3 reflection,vec3 center,vec2 size,float rough){
 float z=max(.05,center.z-position.z);
 vec2 hit=position.xy+reflection.xy/max(.15,reflection.z)*z;
 vec2 q=hit-center.xy;
 float blur=max(.008,rough*rough*z*2.7);
 vec2 spread=vec2(blur*1.35,blur*.86);
 vec2 coverage=(atan((size*.5-q)/spread)+atan((size*.5+q)/spread))/3.14159265;
 return pow(max(0.,coverage.x*coverage.y),1.35);
}
vec3 linearToSRGB(vec3 c){return mix(12.92*c,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
void main(){
 vec2 p=vUv*uSize;
 float scale=.36/uSize.x;
 vec2 world=vec2(p.x,p.y-uScroll);
 vec2 uv=world/uSize;
 float panel=0.;
 for(int i=0;i<4;i++){if(i>=uPanelCount)break;vec4 r=uPanels[i];if(p.x>r.x&&p.x<r.z&&p.y>r.y&&p.y<r.w){float angle=uPanelAngles[i];vec2 local=(p-r.xy)/uSize;uv=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*local;panel=1.;}}
 vec2 tile=mirrorUV(uv);
 vec3 detail=texture2D(uSurface,tile).xyz*2.-1.;
 detail.xy*=sign(1.-mod(uv,2.));
 vec3 properties=texture2D(uProperties,tile).rgb;
 float rough=properties.r;
 float f0=properties.g;
 float cavity=texture2D(uScuffs,tile).r;
 vec2 rotated=mat2(.73168887,.68163876,-.68163876,.73168887)*tile*2.6;
 cavity=max(cavity,texture2D(uScuffs,mirrorUV(rotated)).r*.65);
 float h=heightPixel(p);
 float dx=(heightPixel(p+vec2(1.,0.))-heightPixel(p-vec2(1.,0.)))*.5;
 float dy=(heightPixel(p+vec2(0.,1.))-heightPixel(p-vec2(0.,1.)))*.5;
 // Fixed material coordinates; no time-dependent grain or flicker.
 vec2 micro=uv*vec2(.36,.48)*2100.;float e=.33;
 vec2 chatter=vec2(tool(micro+vec2(e,0))-tool(micro-vec2(e,0)),tool(micro+vec2(0,e))-tool(micro-vec2(0,e)))*(.000065*.30*2100./(2.*e));
 vec3 n=normalize(vec3(-dx,-dy,0.)+detail-vec3(chatter,0.));
 vec3 position=vec3((vUv-.5)*vec2(.36,.48),h*scale);
 vec3 view=normalize(vec3(-position.xy,1.02));
 vec3 reflection=reflect(-view,n);
 vec3 key=vec3(vec2(.20,.26)+vec2(uLight.x-.79,.31-uLight.y)*vec2(.36,.48),.20+uLight.z*.90);
 vec2 keySize=vec2(.30,.25)+vec2(.14,.10)*uRadius;
 float keyReflection=softbox(position,reflection,key,keySize,rough);
 float fill=softbox(position,reflection,vec3(-.27,.06,.42),vec2(.30,.45),rough);
 float low=softbox(position,reflection,vec3(.02,-.38,.25),vec2(.30,.12),rough);
 float fresnel=f0+(1.-f0)*pow(1.-max(0.,dot(n,view)),5.);
 // The reference has metallic=1: reflected illumination, no diffuse paint layer.
 float radiance=.0088+(keyReflection*15.6*uIntensity+fill*1.06+low*.88);
 float value=fresnel*radiance;
 // Subpixel grooves retain a narrow cavity and roughened rim. The mask is
 // derived solely from Metal038's real height differences, not painted marks.
 value*=1.-cavity*.52;
 value+=cavity*(.10+keyReflection*.25);
 vec3 lp=vec3(uLight.x*uSize.x,(1.-uLight.y)*uSize.y,uLight.z*min(uSize.x,uSize.y));
 vec2 ray=normalize(lp.xy-p+vec2(.001));float slope=lp.z/max(1.,length(lp.xy-p));
 float shadow=1.;
 for(int i=1;i<=12;i++){
  float d=float(i)*2.2;float obstruction=heightPixel(p+ray*d)-(h+slope*d+.18);
  shadow=min(shadow,1.-smoothstep(0.,1.3,obstruction)*.70);
 }
 value*=mix(shadow,1.,.28);
 // Same neutral steel reflectance; a small amount of indirect room illumination.
 value+=uAmbient*.035;
 value*=1.1892*uSceneDim;
 value*=mix(1.,.85,panel);
 vec3 color=linearToSRGB(vec3(value/(1.+value)));
 if(uStill>.5){
  vec3 steady=normalize(vec3(-.6,.6,.5));
  float relief=dot(n,steady)-.507;
  color=vec3(clamp(.36+relief*.95-smoothstep(.02,.3,abs(h))*.13,.045,.83));
 }
 // Smooth highlight shoulder: retain surface differences without a white hotspot.
 vec3 excess=max(vec3(0.),color-uHighlightKnee);
 float headroom=max(.01,uHighlightCeiling-uHighlightKnee);
 color=min(color,vec3(uHighlightKnee))+headroom*(1.-exp(-excess/headroom));
 // Keep raised faces distinguishable even when the emitter is reflected head-on.
 // A restrained relief occlusion term preserves edge highlights and the steel grain.
 float raisedShoulder=step(.01,h)*smoothstep(.03,.7,length(vec2(dx,dy)));
 color*=1.-raisedShoulder*.22;
 float foil=0.;
 for(int i=0;i<24;i++){if(i>=uFoilCount)break;vec4 r=uFoil[i];vec2 q=max(max(r.xy-p,p-r.zw),0.);foil=max(foil,1.-smoothstep(0.,max(140.,min(uSize.x*.25,340.)),length(q)));}
 // Compress rather than clip local reflectance, preserving texture under foil.
 vec3 safe=min(color,uFoilMax*(vec3(.70)+color*.30));
 color=mix(color,safe,foil);
 gl_FragColor=vec4(color,1.);
}`;

export class Plate {
 constructor(canvas){
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power',preserveDrawingBuffer:true});
  this.renderer.setClearColor(0x292c2e);this.renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
  this.scene=new THREE.Scene();this.camera=new THREE.Camera();
  this.heightCanvas=document.createElement('canvas');this.ctx=this.heightCanvas.getContext('2d',{alpha:false});
  this.heightTexture=new THREE.CanvasTexture(this.heightCanvas);this.heightTexture.minFilter=THREE.LinearFilter;this.heightTexture.magFilter=THREE.LinearFilter;this.heightTexture.generateMipmaps=false;
  this.uniforms={uSize:{value:new THREE.Vector2()},uScroll:{value:0},uLight:{value:new THREE.Vector3(.8,.3,.1)},uRadius:{value:.8},uAmbient:{value:.17},uIntensity:{value:1},uStill:{value:0},uEmboss:{value:SETTINGS.embossHeight},uDepth:{value:SETTINGS.engraveDepth},uFoilMax:{value:SETTINGS.foilCeiling},uHighlightKnee:{value:SETTINGS.highlightKnee},uHighlightCeiling:{value:SETTINGS.highlightCeiling},uHeight:{value:this.heightTexture},uSurface:{value:null},uProperties:{value:null},uScuffs:{value:null},uFoil:{value:Array.from({length:24},()=>new THREE.Vector4())},uFoilCount:{value:0},uPanels:{value:Array.from({length:4},()=>new THREE.Vector4())},uPanelCount:{value:0},uPanelAngles:{value:[.32,.97,1.62,0]},uSceneDim:{value:1}};
  this.material=new THREE.ShaderMaterial({uniforms:this.uniforms,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:fragment,depthTest:false,depthWrite:false});
  this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),this.material));
 }
 async load(){this.reliefs={};await Promise.all(['title','signature'].map(async name=>{const img=new Image();img.src=new URL('./assets/materials/'+name+'-relief.png',import.meta.url).href;await img.decode();this.reliefs[name]=img;}));const loader=new THREE.TextureLoader();await Promise.all([['uSurface','steel-surface-normal.avif'],['uProperties','steel-surface-properties.avif'],['uScuffs','steel-scratch-cavity.avif']].map(async([uniform,file])=>{const tex=await loader.loadAsync(new URL('./assets/materials/'+file,import.meta.url).href);tex.colorSpace=THREE.NoColorSpace;this.uniforms[uniform].value=tex;}));this.resize();}
 resize(){this.w=innerWidth;this.h=innerHeight;const dpr=Math.min(devicePixelRatio,this.w<700?SETTINGS.mobileDPR:SETTINGS.desktopDPR);this.renderer.setPixelRatio(dpr);this.renderer.setSize(this.w,this.h,false);this.uniforms.uSize.value.set(this.w,this.h);this.scale=Math.min(1,dpr);this.heightCanvas.width=Math.round(this.w*this.scale);this.heightCanvas.height=Math.round(this.h*this.scale);this.heightTexture.dispose();this.heightTexture=new THREE.CanvasTexture(this.heightCanvas);this.heightTexture.minFilter=THREE.LinearFilter;this.heightTexture.magFilter=THREE.LinearFilter;this.heightTexture.generateMipmaps=false;this.uniforms.uHeight.value=this.heightTexture;this.drawHeights(0);}
 drawHeights(double=0){
  const c=this.ctx,s=this.scale;c.setTransform(1,0,0,1,0,0);c.fillStyle='#000';c.fillRect(0,0,c.canvas.width,c.canvas.height);c.scale(s,s);c.textBaseline='alphabetic';c.textAlign='left';
  const heroWidth=document.querySelector('.title')?.getBoundingClientRect().width||this.w;
  this.uniforms.uEmboss.value=heroWidth*(.00185/.2934)*(SETTINGS.embossHeight/4);
  this.uniforms.uDepth.value=heroWidth*(.00055/.2934)*(SETTINGS.engraveDepth/2);
  const elements=[...document.querySelectorAll('.engrave')];
  for(const el of elements){
   const r=el.getBoundingClientRect();if(r.bottom<0||r.top>this.h)continue;const card=el.closest('.reading-card');if(card){const clip=Number(card.dataset.clipBottom);if(clip<=r.top)continue;}c.save();if(card){c.beginPath();c.rect(0,0,this.w,Number(card.dataset.clipBottom)||this.h);c.clip();}
   const relief=el.dataset.map|| (el.classList.contains('title')?'title':el.classList.contains('signature')?'signature':null);
   if(relief&&this.reliefs[relief]){
    c.filter='none';c.globalAlpha=relief==='signature'?Math.max(.24,Math.min(1,r.width/((document.querySelector('.title')?.getBoundingClientRect().width||this.w)*.4644))):1;c.drawImage(this.reliefs[relief],r.left,r.top,r.width,r.height);c.globalAlpha=1;
    if(relief==='title'){
     if(double>.05){c.globalAlpha=.45;c.drawImage(this.reliefs.title,r.left+double*Math.min(1,r.width/1292),r.top,r.width,r.height);c.globalAlpha=1;}
    }
    c.restore();continue;
   }
   const ps=getComputedStyle(el),fontSize=parseFloat(ps.fontSize),lineHeight=parseFloat(ps.lineHeight)||fontSize*1.2;
   c.font=ps.fontStyle+' '+ps.fontWeight+' '+ps.fontSize+' '+ps.fontFamily;c.letterSpacing=ps.letterSpacing==='normal'?'0px':ps.letterSpacing;
   const lines=[];let line='';for(const word of el.textContent.trim().split(/\s+/)){const trial=line?line+' '+word:word;if(line&&c.measureText(trial).width>r.width+1){lines.push(line);line=word;}else line=trial;}if(line)lines.push(line);
   if(el.dataset.relief==='raise'){
    const map=raisedRelief(el,r,ps,lines);
    c.filter='none';c.globalAlpha=Math.min(1,fontSize*.023/Math.max(.01,this.uniforms.uEmboss.value));
    c.drawImage(map,r.left,r.top,r.width,r.height);c.restore();continue;
   }
   c.fillStyle='#00f000';c.filter='blur(.75px)';
   lines.forEach((text,i)=>{const x=ps.textAlign==='center'?r.left+(r.width-c.measureText(text).width)/2:r.left;c.fillText(text,x,r.top+i*lineHeight+(lineHeight-fontSize)/2+fontSize*.79);});c.restore();

  }
  c.filter='none';this.heightTexture.needsUpdate=true;
  let count=0;for(const el of document.querySelectorAll('[data-foil]')){const r=el.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>this.h||getComputedStyle(el).display==='none')continue;if(count>=24)break;this.uniforms.uFoil.value[count++].set(r.left-5,this.h-r.bottom-4,r.right+5,this.h-r.top+4);}this.uniforms.uFoilCount.value=count;
  let panels=0,pi=0;for(const el of document.querySelectorAll('.reading-card,.museum-plaque')){const r=el.getBoundingClientRect();const angle=pi++*.65+.32;if(r.bottom<0||r.top>this.h)continue;if(panels<4){this.uniforms.uPanelAngles.value[panels]=angle;this.uniforms.uPanels.value[panels++].set(r.left,this.h-r.bottom,r.right,this.h-r.top);}}this.uniforms.uPanelCount.value=panels;
 }
 render(light,still=false){let u=this.uniforms;u.uScroll.value=scrollY;u.uLight.value.set(light.x,light.y,light.height);u.uRadius.value=light.radius;u.uAmbient.value=light.ambient;u.uIntensity.value=light.intensity;u.uStill.value=still?1:0;u.uSceneDim.value=light.sceneDim??1;this.renderer.render(this.scene,this.camera);}
 inspectHighlights(){
  const gl=this.renderer.getContext(),w=gl.drawingBufferWidth,h=gl.drawingBufferHeight,data=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,data);let peak=0,clipped=0;
  for(let i=0;i<data.length;i+=4){const v=Math.max(data[i],data[i+1],data[i+2]);peak=Math.max(peak,v);if(v>=254)clipped++;}return {peak,clipped,pixels:w*h};
 }
 inspectContrast(){
  const gl=this.renderer.getContext(),w=this.renderer.domElement.width,h=this.renderer.domElement.height;
  const pixels=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  const linear=x=>(x/=255)<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4);
  const lum=rgb=>rgb.reduce((sum,v,i)=>sum+linear(v)*[.2126,.7152,.0722][i],0);
  const white=lum([242,241,236]),green=lum([48, 218, 140]);
  return [...document.querySelectorAll('[data-foil]')].filter(el=>{let r=el.getBoundingClientRect();return r.width&&r.bottom>0&&r.top<this.h&&getComputedStyle(el).opacity!=='0';}).map(el=>{
   const r=el.getBoundingClientRect();let maxL=0;
   for(let y=Math.max(0,Math.floor((this.h-r.bottom)*h/this.h));y<Math.min(h,Math.ceil((this.h-r.top)*h/this.h));y++){
    for(let x=Math.max(0,Math.floor(r.left*w/this.w));x<Math.min(w,Math.ceil(r.right*w/this.w));x++){const i=(y*w+x)*4;maxL=Math.max(maxL,lum([pixels[i],pixels[i+1],pixels[i+2]]));}
   }
   return {text:el.textContent.trim(),white:(white+.05)/(maxL+.05),green:(green+.05)/(maxL+.05),maxBackgroundLuminance:maxL};
  });
 }
 dispose(){this.renderer.dispose();this.heightTexture.dispose();this.material.dispose();}
}
