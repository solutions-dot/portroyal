import { Vector3 } from 'three';

// A seated animation is anchored by its pelvis, rather than by its toes.
// Coordinates belong to the model's parent, so a seat can travel with a train.
const hip = new Vector3(), delta = new Vector3();
export function anchorSeat(model) {
  const seat=model.userData.seatAnchor, bone=model.getObjectByName('mixamorigHips');
  if(!seat||!bone)return;
  if(seat.ry!==undefined)model.rotation.y=seat.ry;
  model.updateMatrixWorld(true);bone.getWorldPosition(hip);
  if(model.parent)model.parent.worldToLocal(hip);
  let lift=seat.lift;
  if(lift===undefined){
    lift=.12*model.scale.y; const fwd=new Vector3(0,0,1).applyQuaternion(model.quaternion),pos=new Vector3();let pelvis=Infinity,feet=Infinity;
    model.traverse(o=>{if(!o.isSkinnedMesh||!o.visible)return;const mat=o.material.name||'';if(!/Skin|Breeches|Skirt|Shoes|Sole/.test(mat))return;o.skeleton.update();const a=o.geometry.attributes.position,step=Math.max(1,Math.floor(a.count/600));for(let i=0;i<a.count;i+=step){o.getVertexPosition(i,pos);pos.applyMatrix4(o.matrixWorld);if(model.parent)model.parent.worldToLocal(pos);const dx=pos.x-hip.x,dz=pos.z-hip.z,ahead=dx*fwd.x+dz*fwd.z,side=Math.abs(dx*fwd.z-dz*fwd.x);if(side<.22*model.scale.x&&ahead>-.18&&ahead<.04&&pos.y>hip.y-.3*model.scale.y&&pos.y<hip.y-.04)pelvis=Math.min(pelvis,pos.y);if(/Shoes|Sole/.test(mat))feet=Math.min(feet,pos.y);}});
    if(isFinite(pelvis))lift=Math.max(lift,hip.y-pelvis-.005);
    if(isFinite(feet))lift=Math.max(lift,(model.userData.ground||0)-seat.top+hip.y-feet+.005);
    lift=Math.min(.29*model.scale.y,lift);
    const ac=model.userData.anim;if(ac?.cur?.time>.5)seat.lift=lift;
  }
  delta.set(seat.x===undefined?0:seat.x-hip.x,seat.top+lift-hip.y,seat.z===undefined?0:seat.z-hip.z);
  model.position.add(delta);model.updateMatrixWorld(true);
}

// Test a swept disc against furniture rectangles, including segment interiors.
// Checking only the destination misses a thin obstacle or a long frame.
export function segmentHitsWall(a,b,w,r=0) {
  let lo=0,hi=1;
  for(const [p,d,min,max]of [[a[0],b[0]-a[0],w[0]-r,w[2]+r],[a[1],b[1]-a[1],w[1]-r,w[3]+r]]){
    if(Math.abs(d)<1e-9){if(p<=min||p>=max)return false;continue;}
    let t0=(min-p)/d,t1=(max-p)/d;if(t0>t1)[t0,t1]=[t1,t0];lo=Math.max(lo,t0);hi=Math.min(hi,t1);if(lo>=hi)return false;
  }
  return hi>0&&lo<1;
}
export function routeIssues(id,path,walls,r=.24,loop=true) {
  const out=[];for(let i=0;i<path.length-(loop?0:1);i++){const a=path[i],b=path[(i+1)%path.length];const w=walls.find(w=>segmentHitsWall(a,b,w,r));if(w)out.push(`${id} route ${i+1} crosses furniture [${w.join(',')}]`);}return out;
}
export function slideWalls(from,to,walls,r=.25) {
  const result=from.slice(),steps=Math.max(1,Math.ceil(Math.hypot(to[0]-from[0],to[1]-from[1])/.1)),dx=(to[0]-from[0])/steps,dz=(to[1]-from[1])/steps;
  for(let i=0;i<steps;i++)for(const [axis,d]of [[0,dx],[1,dz]]){const next=result.slice();next[axis]+=d;if(!walls.some(w=>segmentHitsWall(result,next,w,r)))result[axis]=next[axis];}
  return result;
}

// Check actual furniture boxes as well as the walking walls. Otherwise an
// omitted collision rectangle makes the route check pass through a table.
export function furnitureRouteIssues(id,path,snap,ground=0,r=.22,loop=true) {
  const out=[];
  for(const m of snap){if(!m.lb||!m.inv)continue;const size=m.b.getSize(new Vector3());if(size.x>30||size.z>30||m.b.max.y<ground+.2||m.b.min.y>ground+1.45||size.y<.025)continue;
    if(!routeIssues(id,path,[[m.b.min.x,m.b.min.z,m.b.max.x,m.b.max.z]],r,loop).length)continue;
    const local=path.map(([x,z])=>new Vector3(x,ground+.6,z).applyMatrix4(m.inv)).map(q=>[q.x,q.z]);
    const wall=[m.lb.min.x,m.lb.min.z,m.lb.max.x,m.lb.max.z];
    if(routeIssues(id,local,[wall],r/m.sc,loop).length)out.push(`${id} crosses a ${size.x.toFixed(2)} x ${size.z.toFixed(2)} furniture box at (${m.b.min.x.toFixed(1)},${m.b.min.z.toFixed(1)})`);
  }
  return out;
}

// Visibility graph around nearby furniture. Followers use a short route rather
// than aiming straight through a table to reach the player on its other side.
export function walkRoute(a,b,walls,r=.22,bounds) {
  const clear=(p,q)=>!walls.some(w=>segmentHitsWall(p,q,w,r));if(clear(a,b))return [b.slice()];
  const near=walls.filter(w=>w[2]>Math.min(a[0],b[0])-3&&w[0]<Math.max(a[0],b[0])+3&&w[3]>Math.min(a[1],b[1])-3&&w[1]<Math.max(a[1],b[1])+3),pts=[a,b];
  const free=p=>(!bounds||(p[0]>=bounds.x0&&p[0]<=bounds.x1&&p[1]>=bounds.z0&&p[1]<=bounds.z1))&&!walls.some(w=>p[0]>w[0]-r&&p[0]<w[2]+r&&p[1]>w[1]-r&&p[1]<w[3]+r);
  for(const w of near)for(const x of [w[0]-r-.02,w[2]+r+.02])for(const z of [w[1]-r-.02,w[3]+r+.02])if(free([x,z]))pts.push([x,z]);
  const dist=pts.map(()=>Infinity),prev=pts.map(()=>-1),seen=new Set();dist[0]=0;
  for(let pass=0;pass<pts.length;pass++){let at=-1;for(let i=0;i<pts.length;i++)if(!seen.has(i)&&(at<0||dist[i]<dist[at]))at=i;if(at<0||!isFinite(dist[at]))break;if(at===1){const path=[];for(let i=1;i!==0;i=prev[i])path.unshift(pts[i]);return path;}seen.add(at);for(let j=0;j<pts.length;j++){if(seen.has(j)||j===at)continue;const next=dist[at]+Math.hypot(pts[j][0]-pts[at][0],pts[j][1]-pts[at][1]);if(next<dist[j]&&clear(pts[at],pts[j])){dist[j]=next;prev[j]=at;}}}
  return [];
}
