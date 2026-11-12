import * as THREE from '../vendor/three/three.module.js?v=43cfeb04609f';
// Strict local reader for the static, four-layer interchange export. Deliberately
// rejects unsupported compression or skinning rather than displaying wrong geometry.
const TYPES={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array};
const WIDTH={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16};
export async function loadSculptureGLB(url){
 const response=await fetch(url);if(!response.ok)throw Error('Skulpturexport noch nicht verfügbar');
 const data=await response.arrayBuffer(),view=new DataView(data);
 if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2)throw Error('Invalid GLB');
 let json,bin;for(let offset=12;offset<data.byteLength;){const length=view.getUint32(offset,true),type=view.getUint32(offset+4,true);offset+=8;const part=data.slice(offset,offset+length);if(type===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(part));if(type===0x004e4942)bin=part;offset+=length;}
 if(!json||!bin)throw Error('Incomplete GLB');
 for(const extension of json.extensionsRequired||[])if(extension!=='KHR_mesh_quantization')throw Error('Unsupported GLB extension: '+extension);
 function attribute(id){
  const a=json.accessors[id],b=json.bufferViews[a.bufferView],Ctor=TYPES[a.componentType],width=WIDTH[a.type];
  if(a.sparse||!Ctor||!width||b.buffer!==0)throw Error('Unsupported accessor');
  const bytes=Ctor.BYTES_PER_ELEMENT,stride=b.byteStride||width*bytes,start=(b.byteOffset||0)+(a.byteOffset||0);
  let values;
  if(stride===width*bytes)values=new Ctor(bin.slice(start,start+a.count*stride));
  else{values=new Ctor(a.count*width);for(let i=0;i<a.count;i++){const row=new Ctor(bin.slice(start+i*stride,start+i*stride+width*bytes));values.set(row,i*width);}}
  return new THREE.BufferAttribute(values,width,!!a.normalized);
 }
 function node(index){
  const n=json.nodes[index];if(n.skin!==undefined)throw Error('Skinned model not supported');
  const group=new THREE.Group();group.name=n.name||'';
  if(n.matrix){group.matrix.fromArray(n.matrix);group.matrix.decompose(group.position,group.quaternion,group.scale);}
  else{if(n.translation)group.position.fromArray(n.translation);if(n.rotation)group.quaternion.fromArray(n.rotation);if(n.scale)group.scale.fromArray(n.scale);}
  if(n.mesh!==undefined)for(const p of json.meshes[n.mesh].primitives){
   if(p.mode!==undefined&&p.mode!==4)throw Error('Only triangles are supported');
   if(p.extensions?.KHR_draco_mesh_compression)throw Error('Export a readable GLB without Draco first');
   const g=new THREE.BufferGeometry();
   for(const [key,name] of [['POSITION','position'],['NORMAL','normal'],['TEXCOORD_0','uv']])if(p.attributes[key]!==undefined)g.setAttribute(name,attribute(p.attributes[key]));
   if(p.indices!==undefined)g.setIndex(attribute(p.indices));if(!g.attributes.normal)g.computeVertexNormals();
   const mesh=new THREE.Mesh(g);mesh.name=n.name||json.meshes[n.mesh].name||'';mesh.userData.layer=n.extras?.layer;group.add(mesh);
  }
  for(const child of n.children||[])group.add(node(child));return group;
 }
 const root=new THREE.Group();for(const index of json.scenes[json.scene||0].nodes)root.add(node(index));root.updateMatrixWorld(true);
 const layers={};for(const name of ['Shell','Kuppel','Mulde','Linse']){const found=[];root.traverse(o=>{if(o.isMesh&&(o.userData.layer===name||o.name===name))found.push(o);});if(!found.length)throw Error('Missing layer '+name);layers[name]=found;}
 return {root,layers,bytes:data.byteLength};
}
