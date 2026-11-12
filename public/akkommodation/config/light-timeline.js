// Position and height use viewport fractions. One editable light choreography.
export const LIGHT_TIMELINE = [
  {at:0, x:.79, y:.31, height:.10, radius:.88, intensity:1.0, ambient:.17, double:6},
  {at:.5, x:.28, y:.48, height:.065, radius:.64, intensity:1.08, ambient:.18, double:2.2},
  {at:1, x:.67, y:.62, height:.045, radius:.45, intensity:1.10, ambient:.20, double:0}
];
export const SETTINGS = {desktopDPR:1.75,mobileDPR:1.5,followTime:.13,embossHeight:4.0,engraveDepth:2.0,foilCeiling:.30,highlightKnee:.62,highlightCeiling:.88,scan:'#30da8c'};
export function lightAt(progress) {
  const p=Math.max(0,Math.min(1,progress));
  const b=LIGHT_TIMELINE.findIndex(k=>k.at>=p);
  if(b<=0)return {...LIGHT_TIMELINE[0]};
  const a=LIGHT_TIMELINE[b-1],c=LIGHT_TIMELINE[b],t=(p-a.at)/(c.at-a.at),out={};
  for(const key in a)out[key]=a[key]+(c[key]-a[key])*t;
  return out;
}

// Section lighting. Scroll progress is local to each chapter, from 0 to 1.
export const CHAPTER_LIGHT={lens:{ambient:.26,intensity:.8},adaptation:{ambient:.23,intensity:.9},pull:{ambient:.12,intensity:.6},readings:{ambient:.21,intensity:.9},contact:{ambient:.65,intensity:1.5}};
export function storyLight(base,context){const out={...base,sceneDim:1};if(context.name&&CHAPTER_LIGHT[context.name])Object.assign(out,CHAPTER_LIGHT[context.name]);if(context.trilogy!=null){const p=context.trilogy;out.x=.12+.76*p;out.y=.38;out.radius=.4+p*.6;out.intensity=1.1*(1-p*.93);out.ambient=.22-p*.13;out.sceneDim=1-p*.88;}if(context.pull!=null){const p=context.pull;out.x+=(.5-out.x)*p;out.y+=(.5-out.y)*p;out.intensity*=1-p;out.ambient*=1-p*.8;out.sceneDim=1-p*.9;}if(context.contact!=null){const p=context.contact;out.x+=(.5-out.x)*p;out.y+=(context.eyeY-out.y)*p;out.intensity=.9+.6*p;out.ambient=.25+.4*p;}return out;}
