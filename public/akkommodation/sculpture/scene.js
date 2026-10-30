import * as T from '../vendor/three/three.module.js?v=43cfeb04609f';
import {loadSculptureGLB} from './glb.js?v=43cfeb04609f';
import {Gaze,GAZE} from './gaze.js?v=43cfeb04609f';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const names=['Shell','Kuppel','Mulde','Linse'];
export class Sculpture{
 constructor(plate,stage){this.plate=plate;this.renderer=plate.renderer;this.stage=stage;this.mainStage=stage;this.heroStage=document.querySelector('.hero-eye');this.returnStage=document.querySelector('.return-eye');this.story=stage.closest('.object-story');this.gaze=new Gaze();this.ready=false;this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(30,1,.01,8);this.scene.add(new T.HemisphereLight(0xf2f4f5,0x202020,.65));this.key=new T.DirectionalLight(0xffffff,2.6);this.key.position.set(-.7,.8,.5);this.scene.add(this.key);const fill=new T.DirectionalLight(0xd8e0e5,.7);fill.position.set(.8,.25,.1);this.scene.add(fill);this.assembly=new T.Group();this.scene.add(this.assembly);this.eye=new T.Group();this.eye.position.z=-.077;this.assembly.add(this.eye);this.groups={};this.labels=[...stage.querySelectorAll('[data-layer-tag]')];this.leaders=[...stage.querySelectorAll('[data-leader]')];this.time=0;this.rect=null;}
 async load(){
  const [{root,layers,bytes},veins]=await Promise.all([loadSculptureGLB(new URL('../assets/sculpture/akkommodation.glb',import.meta.url)),new T.TextureLoader().loadAsync(new URL('../assets/sculpture/eyeball-veins.webp',import.meta.url).href)]);
  veins.colorSpace=T.NoColorSpace;veins.flipY=true;this.veins=veins;this.createEnvironment();
  this.materials={Shell:new T.MeshStandardMaterial({color:0xebece8,roughness:.86,metalness:0}),Kuppel:this.steel(),Mulde:this.steel(),Linse:this.glass()};
  this.materials.Shell.onBeforeCompile=s=>{s.vertexShader='varying vec3 vSurface;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSurface=position;');s.fragmentShader='varying vec3 vSurface;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=normalize(normal+vec3(sin(vSurface.x*3900.)*sin(vSurface.y*3700.),sin(vSurface.y*4300.)*sin(vSurface.z*4100.),0.)*.018);');};
  for(const name of names){const group=new T.Group();this.groups[name]=group;(name==='Kuppel'||name==='Mulde'?this.eye:this.assembly).add(group);
   for(const original of layers[name]){const geometry=original.geometry.clone();for(const attrName of ['position','normal']){const a=geometry.getAttribute(attrName),v=new Float32Array(a.count*3);for(let i=0;i<a.count;i++){v[i*3]=a.getX(i);v[i*3+1]=a.getY(i);v[i*3+2]=a.getZ(i);}geometry.setAttribute(attrName,new T.BufferAttribute(v,3));}geometry.applyMatrix4(original.matrixWorld);if(name==='Kuppel'||name==='Mulde')geometry.translate(0,0,.077);const pos=geometry.attributes.position,uv=new Float32Array(pos.count*2);for(let i=0;i<pos.count;i++){uv[i*2]=pos.getX(i)/.254+.5;uv[i*2+1]=pos.getY(i)/.254+.5;}geometry.setAttribute('uv',new T.BufferAttribute(uv,2));geometry.computeBoundingSphere();group.add(new T.Mesh(geometry,this.materials[name]));}
  }
  // Presentation-only rear hemisphere: the original recessed front remains intact.
  // The intact front follows r=130 mm; its 254 mm rim ends 28 mm ahead of the centre.
  const backGeometry=new T.SphereGeometry(.130,96,64,0,Math.PI*2,Math.acos(.028/.130),Math.PI-Math.acos(.028/.130));
  backGeometry.rotateX(Math.PI/2);
  const backPos=backGeometry.attributes.position,backUV=backGeometry.attributes.uv;
  for(let i=0;i<backPos.count;i++)backUV.setXY(i,backPos.getX(i)/.254+.5,backPos.getY(i)/.254+.5);
  // Align the outer rim normals with the rounded continuation, keeping the hollow intact.
  for(const mesh of this.groups.Kuppel.children){const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i);if(v.z>.015&&Math.hypot(v.x,v.y)>.06){v.normalize();n.setXYZ(i,v.x,v.y,v.z);}}n.needsUpdate=true;}

  this.eyeBack=new T.Mesh(backGeometry,this.materials.Kuppel);this.eyeBack.name='Eyeball presentation back';
  this.groups.Kuppel.add(this.eyeBack);
  root.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});this.ready=true;this.stage.dataset.bytes=bytes;this.stage.classList.add('sculpture-ready');this.returnStage?.classList.add('sculpture-ready');this.heroStage?.classList.add('sculpture-ready');this.stage.dataset.state='idle';
 }
 createEnvironment(){const c=document.createElement('canvas');c.width=1024;c.height=512;const g=c.getContext('2d');g.fillStyle='#17191b';g.fillRect(0,0,1024,512);g.globalAlpha=.13;g.drawImage(this.plate.uniforms.uProperties.value.image,0,0,1024,512);g.globalAlpha=1;for(const [x,y,rx,ry,power] of [[210,125,230,150,.95],[780,210,200,220,.55],[470,30,300,90,.3]]){g.save();g.translate(x,y);g.scale(rx,ry);const grad=g.createRadialGradient(0,0,0,0,0,1);grad.addColorStop(0,`rgba(255,255,255,${power})`);grad.addColorStop(.35,`rgba(235,240,244,${power*.7})`);grad.addColorStop(1,'rgba(220,230,240,0)');g.fillStyle=grad;g.fillRect(-1,-1,2,2);g.restore();}const texture=new T.CanvasTexture(c);texture.mapping=T.EquirectangularReflectionMapping;texture.colorSpace=T.SRGBColorSpace;const pmrem=new T.PMREMGenerator(this.renderer);this.environment=pmrem.fromEquirectangular(texture);this.scene.environment=this.environment.texture;pmrem.dispose();texture.dispose();}
 steel(){const m=new T.MeshPhysicalMaterial({color:0xa4a6a5,metalness:1,roughness:.44,anisotropy:.45,envMapIntensity:1.65,normalMap:this.plate.uniforms.uSurface.value,normalScale:new T.Vector2(.14,.14)});m.onBeforeCompile=s=>{s.uniforms.uVeins={value:this.veins};s.uniforms.uSteelProperties=this.plate.uniforms.uProperties;s.vertexShader='varying vec3 vSurface;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSurface=position;');s.fragmentShader='uniform sampler2D uVeins; uniform sampler2D uSteelProperties; varying vec3 vSurface;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 vec2 inlayUV=vSurface.xy/.254+.5;
 float inlay=texture2D(uVeins,clamp(inlayUV,0.,1.)).r;
 float front=smoothstep(.02,.05,vSurface.z);
 inlay*=front;
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.80,.77),inlay);`);
 s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(clamp(texture2D(uSteelProperties,inlayUV).r+.07,.35,.59),.43,inlay);');s.fragmentShader=s.fragmentShader.replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor=mix(1.,.04,inlay);');
 // Geometric cavity approximation, based on actual surface depth and radius.
 s.fragmentShader=s.fragmentShader.replace('#include <aomap_fragment>','#include <aomap_fragment>\nfloat cavity=(1.-smoothstep(.005,.043,length(vSurface.xy)))*(1.-smoothstep(.097,.113,vSurface.z)); reflectedLight.indirectSpecular*=1.-cavity*.94; reflectedLight.indirectDiffuse*=1.-cavity*.94;');};return m;}
 glass(){
  const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,1024,1024);g.strokeStyle='#aaa';g.lineWidth=1.2;
  for(let i=0;i<18;i++){const a=i*Math.PI*2/18;g.save();g.translate(512,512);g.rotate(a);g.beginPath();g.moveTo(408,-18);g.lineTo(345,-18);g.lineTo(319,8);g.lineTo(275,8);g.stroke();g.beginPath();g.arc(275,8,3.5,0,Math.PI*2);g.stroke();g.restore();}
  const traces=new T.CanvasTexture(c);traces.colorSpace=T.NoColorSpace;
  // Thin clear optical overlay. Screen-space transmission cannot see the plate
  // drawn by the preceding scene, and was sampling black outside the sculpture.
  // Fresnel alpha preserves that real backdrop; no tinted absorption or shadows.
  const m=new T.MeshPhysicalMaterial({color:0xf6fbff,metalness:0,roughness:.10,transmission:0,transparent:true,opacity:.10,depthWrite:false,ior:1.46,envMapIntensity:.6,side:T.FrontSide});
  m.onBeforeCompile=s=>{
   s.uniforms.uCircuits={value:traces};s.vertexShader='varying vec3 vLens;\n'+s.vertexShader;
   s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLens=position;');
   s.fragmentShader='uniform sampler2D uCircuits; varying vec3 vLens;\n'+s.fragmentShader;
   s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',`float rim=pow(1.-clamp(abs(dot(normal,normalize(vViewPosition))),0.,1.),3.);
    float circuit=texture2D(uCircuits,vLens.xy/.25+.5).r;
    diffuseColor.a=clamp(.035+rim*.23+circuit*.27,.035,.38);
    outgoingLight=mix(max(outgoingLight,vec3(.38)),vec3(.18),circuit*.6);
    #include <opaque_fragment>`);
  };return m;
 }

 visible(){const main=this.mainStage.getBoundingClientRect(),other=this.returnStage?.getBoundingClientRect(),hero=this.heroStage?.getBoundingClientRect();this.stage=other&&other.bottom>0&&other.top<innerHeight?this.returnStage:hero&&hero.bottom>0&&hero.top<innerHeight*.9&&main.top>innerHeight?this.heroStage:this.mainStage;this.rect=this.stage.getBoundingClientRect();return this.rect.bottom>0&&this.rect.top<innerHeight;}
 pointer(x,y){if(!this.ready||!this.visible())return;const r=this.rect,dx=(x-r.left-r.width/2)/(r.width*.5),dy=(y-r.top-r.height/2)/(r.height*.5);this.gaze.input(dx,-dy,this.time,Math.hypot(dx,dy)<GAZE.blindRadius);}
 scroll(){if(!this.ready||!this.visible()||!matchMedia('(pointer:coarse)').matches&&innerWidth>=700)return;const r=this.story.getBoundingClientRect(),p=clamp(-r.top/Math.max(1,r.height-innerHeight));this.gaze.input(Math.sin(p*5)*.55,.18,this.time);}
 render(dt,still){if(!this.ready||!this.visible()){this.gaze.reset();return false;}if(!still)this.time+=dt;const r=this.rect,story=this.story.getBoundingClientRect(),p=clamp((100-story.top)/Math.max(1,story.height-r.height));let expansion=still||this.stage!==this.mainStage?0:smooth(p/.24)*(1-smooth((p-.73)/.22));
  this.groups.Shell.position.z=-.05*expansion;this.groups.Kuppel.position.z=.11*expansion;this.groups.Mulde.position.z=this.groups.Kuppel.position.z;this.groups.Linse.position.z=.31*expansion;this.assembly.rotation.y=-.69*expansion;this.assembly.rotation.x=.08*expansion;
  const pose=still?{x:0,y:0,state:'paused',active:false}:this.gaze.update(this.time,dt);this.eye.rotation.set(-pose.y,pose.x,0,'YXZ');this.stage.dataset.state=pose.state;this.stage.dataset.explosion=expansion.toFixed(3);this.stage.dataset.eyeJoint=String(this.groups.Kuppel.position.z===this.groups.Mulde.position.z);this.stage.dataset.glass='clear-fresnel';this.stage.dataset.gaze=JSON.stringify([pose.x,pose.y]);
  this.camera.aspect=r.width/r.height;const mobile=innerWidth<700,offset=-.045*expansion;
  this.camera.position.set(offset,0,Math.max(1.15,1.13/this.camera.aspect)*(mobile?1.13:1));this.camera.lookAt(offset,0,.03+expansion*.06);
  const copy=this.story.querySelector('.layer-copy');
  if(copy){const cr=copy.getBoundingClientRect();copy.style.clipPath=mobile&&this.stage===this.mainStage?`inset(${Math.max(0,r.bottom+16-cr.top)}px 0 0 0)`:'none';}this.camera.updateProjectionMatrix();this.scene.updateMatrixWorld(true);
  for(let i=0;i<4;i++){const a=new T.Vector3([-.21,-.10,0,.09][i],i===0?.12:i===2?0:.035,[0,.06,.103,.025][i]);this.groups[names[i]].localToWorld(a);a.project(this.camera);const x=(a.x*.5+.5)*r.width,y=(-a.y*.5+.5)*r.height;const lx=clamp(x+[-75,75,-65,-100][i],8,r.width-60),ly=clamp(y+[-65,90,-80,95][i],25,r.height-25);this.labels[i].style.cssText=`left:${lx}px;top:${ly}px;opacity:${expansion>.35&&this.stage===this.mainStage?1:0}`;this.leaders[i].setAttribute('d',expansion>.35?`M ${x} ${y} L ${lx+20} ${ly+14}`:'');}
  const renderer=this.renderer,output=renderer.outputColorSpace,tone=renderer.toneMapping,auto=renderer.autoClear;
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.autoClear=false;renderer.setScissorTest(true);renderer.setScissor(Math.max(0,r.left),Math.max(0,innerHeight-r.bottom),Math.min(innerWidth,r.right)-Math.max(0,r.left),Math.min(innerHeight,r.bottom)-Math.max(0,r.top));renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);renderer.clearDepth();renderer.render(this.scene,this.camera);renderer.setScissorTest(false);renderer.setViewport(0,0,innerWidth,innerHeight);renderer.autoClear=auto;renderer.outputColorSpace=output;renderer.toneMapping=tone;renderer.toneMappingExposure=1;
  return pose.active&&!still;
 }
}
