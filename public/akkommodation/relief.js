// Cached glyph height maps. Rounded shoulders use the same positive relief
// channel, metal normals and cast shadows as the original wordmark.
const cache=new WeakMap();
export function raisedRelief(element,rect,style,lines){
 const width=Math.max(1,Math.ceil(rect.width)),height=Math.max(1,Math.ceil(rect.height));
 const key=[width,height,style.font,style.fontFamily,style.fontWeight,style.fontSize,style.letterSpacing,style.textAlign,...lines].join('|');
 const previous=cache.get(element);if(previous?.key===key)return previous.canvas;
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const size=parseFloat(style.fontSize),lineHeight=parseFloat(style.lineHeight)||size*1.2;
 ctx.font=style.fontStyle+' '+style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
 ctx.letterSpacing=style.letterSpacing==='normal'?'0px':style.letterSpacing;
 ctx.fillStyle='#fff';ctx.strokeStyle='#fff';ctx.lineWidth=size*.03;ctx.lineJoin='round';ctx.textBaseline='alphabetic';
 lines.forEach((text,i)=>{const x=style.textAlign==='center'?(rect.width-ctx.measureText(text).width)/2:0,y=i*lineHeight+(lineHeight-size)/2+size*.79;ctx.strokeText(text,x,y);ctx.fillText(text,x,y);});
 const image=ctx.getImageData(0,0,width,height),data=image.data;
 const distance=new Float32Array(width*height);
 for(let i=0;i<distance.length;i++)distance[i]=data[i*4+3]>=128?1e4:0;
 // Two-pass chamfer distance, only regenerated after text or layout changes.
 const diagonal=Math.SQRT2;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=y*width+x;if(!distance[i])continue;
  distance[i]=Math.min(distance[i],x?distance[i-1]+1:1,y?distance[i-width]+1:1,x&&y?distance[i-width-1]+diagonal:1e4,x+1<width&&y?distance[i-width+1]+diagonal:1e4);
 }
 for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){
  const i=y*width+x;if(!distance[i])continue;
  distance[i]=Math.min(distance[i],x+1<width?distance[i+1]+1:1,y+1<height?distance[i+width]+1:1,x+1<width&&y+1<height?distance[i+width+1]+diagonal:1e4,x&&y+1<height?distance[i+width-1]+diagonal:1e4);
 }
 const bevel=Math.max(2,size*.085);
 for(let i=0;i<distance.length;i++){
  const alpha=data[i*4+3]/255;
  const profile=Math.sin(Math.PI*.5*Math.min(1,Math.max(0,distance[i]-.45)/bevel));
  data[i*4]=Math.round(255*profile*alpha);data[i*4+1]=0;data[i*4+2]=0;data[i*4+3]=255;
 }
 ctx.putImageData(image,0,0);cache.set(element,{key,canvas});return canvas;
}
