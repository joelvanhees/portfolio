// All times are seconds. Deterministic choreography, never random jitter.
export const GAZE={stillAfter:3,irritation:.65,search:3.1,settle:.85,blindRadius:.12,maxYaw:14*Math.PI/180,maxPitch:10*Math.PI/180,response:.11};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
export class Gaze {
 constructor(config={}){this.config={...GAZE,...config};this.state='idle';this.lastMotion=-Infinity;this.phaseStart=0;this.target={x:0,y:0};this.current={x:0,y:0};this.origin={x:0,y:0};this.blind=false;}
 input(x,y,time,blind=false){
  this.blind=blind;
  if(blind)return;
  this.target={x:clamp(x,-1,1)*this.config.maxYaw,y:clamp(y,-1,1)*this.config.maxPitch};
  this.lastMotion=time;this.state='following';
 }
 reset(){this.state='idle';this.lastMotion=-Infinity;this.target={x:0,y:0};this.current={x:0,y:0};this.blind=false;}
 update(time,dt){
  const c=this.config;
  if(this.state==='following'&&time-this.lastMotion>=c.stillAfter){this.state='irritation';this.phaseStart=time;this.origin={...this.current};}
  let elapsed=time-this.phaseStart,target=this.target;
  if(this.state==='irritation'){
   const a=ease((elapsed-.18)/.32);target={x:this.origin.x-.024*a,y:this.origin.y+.012*a};
   if(elapsed>=c.irritation){this.state='searching';this.phaseStart=time;elapsed=0;}
  }
  if(this.state==='searching'){
   const stages=[{at:0,to:[-.64,.12]},{at:.82,to:[.82,-.21]},{at:1.94,to:[-.20,.48]}];
   const k=stages.filter(v=>v.at<=elapsed).at(-1);target={x:k.to[0]*c.maxYaw,y:k.to[1]*c.maxPitch};
   if(elapsed>=c.search){this.state='settling';this.phaseStart=time;this.origin={...this.current};elapsed=0;}
  }
  if(this.state==='settling'){
   const a=1-ease(elapsed/c.settle);target={x:this.origin.x*a,y:this.origin.y*a};
   if(elapsed>=c.settle){this.state='idle';this.current={x:0,y:0};target={x:0,y:0};}
  }
  if(this.state==='idle')target={x:0,y:0};
  const blend=1-Math.exp(-Math.min(.1,dt)/c.response);
  this.current.x+=(target.x-this.current.x)*blend;this.current.y+=(target.y-this.current.y)*blend;
  return {...this.current,state:this.state,active:this.state!=='idle'};
 }
}
