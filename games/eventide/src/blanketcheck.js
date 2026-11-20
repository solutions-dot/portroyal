/* Chapter 4, ?test=blankets. Measure the rendered surfaces during the same idle and
   speaking clips the wearers use, including the blends between lines of dialogue. */
import * as THREE from 'three';
import { isJoined } from '../../../engine/joinbody.js';

function posedVertices(mesh, inverse) {
  const toBody = inverse.clone().multiply(mesh.matrixWorld);
  return Array.from({ length: mesh.geometry.attributes.position.count }, (_, i) =>
    mesh.getVertexPosition(i, new THREE.Vector3()).applyMatrix4(toBody));
}

function triangles(mesh, vertices, visit) {
  const idx = mesh.geometry.index, count = idx?.count ?? vertices.length;
  for (let i = 0; i < count; i += 3) visit(vertices[idx ? idx.getX(i) : i], vertices[idx ? idx.getX(i+1) : i+1], vertices[idx ? idx.getX(i+2) : i+2]);
}

function handVertices(mesh) {
  const { skinIndex, skinWeight } = mesh.geometry.attributes;
  const hands = mesh.skeleton.bones.map(b => b.name.includes('Hand'));
  return Array.from({ length: skinIndex.count }, (_, i) => {
    for (let k = 0; k < 4; k++) if (skinWeight.getComponent(i, k) > .3 && hands[skinIndex.getComponent(i, k)]) return true;
    return false;
  });
}

function checkPose(n, pieces) {
  const wrap = n.blanket, body = n.m, inv = body.matrixWorld.clone().invert();
  const joint = name => body.getObjectByName('mixamorig' + name).getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
  const hips = joint('Hips'), neck = joint('Neck'), left = joint('LeftArm'), right = joint('RightArm');
  const width = left.distanceTo(right), forward = left.clone().sub(right).cross(new THREE.Vector3(0,1,0)).normalize();
  const cloth = posedVertices(wrap, inv), low = Math.min(...cloth.map(v => v.y)), high = Math.max(...cloth.map(v => v.y));
  const bands = Array.from({ length: 48 }, () => []), bandOf = y => THREE.MathUtils.clamp(Math.floor(48 * (y-low)/(high-low)), 0, 47);
  const ray = new THREE.Ray(), hit = new THREE.Vector3(), mid = new THREE.Vector3(), problems = new Set();

  // Check both the inner and outer shoulder. Measure straight down to the shirt
  // and the wrap at the same point, so a high, floating collar cannot pass.
  const shoulders = [left, right].map(arm => {
    const probes = [];
    for (const span of [.58,.80]) for (const dz of [-.06,.045]) {
      const p = neck.clone().lerp(arm, span).addScaledVector(forward, dz * width);
      p.y = neck.y + width;
      probes.push({ ray: new THREE.Ray(p, new THREE.Vector3(0,-1,0)), wrap: -Infinity, torso: -Infinity });
    }
    return probes;
  });
  function touchShoulder(a, b, c, which) {
    if (Math.max(a.y,b.y,c.y) < neck.y - .55 * width || Math.min(a.y,b.y,c.y) > neck.y + width) return;
    for (const side of shoulders) for (const p of side) {
      if (p.ray.intersectTriangle(a,b,c,false,hit) && (which === 'wrap' || hit.y < neck.y + .22 * width)) p[which] = Math.max(p[which], hit.y);
    }
  }
  triangles(wrap, cloth, (a,b,c) => {
    const tri = [a,b,c];
    for (let k = bandOf(Math.min(a.y,b.y,c.y)); k <= bandOf(Math.max(a.y,b.y,c.y)); k++) bands[k].push(tri);
    touchShoulder(a,b,c,'wrap');
  });

  // An outward ray finds the margin over the clothes. The opening is clear when
  // the ray misses. Each piece of the hand must have cloth outside it.
  let palms = 0;
  function covered(p, name, hand = false) {
    if (hand) palms++;
    if (p.y < low || p.y > high) { if (hand) problems.add('hand past hem'); return; }
    ray.origin.copy(hips).lerp(neck, THREE.MathUtils.clamp((p.y-hips.y)/(neck.y-hips.y), 0, 1)).y = p.y;
    ray.direction.subVectors(p, ray.origin);
    const radius = ray.direction.length();
    if (!radius) return;
    ray.direction.divideScalar(radius);
    let outside = -Infinity;
    for (const tri of bands[bandOf(p.y)]) if (ray.intersectTriangle(...tri, false, hit)) outside = Math.max(outside, hit.distanceTo(ray.origin));
    if (!Number.isFinite(outside)) { if (hand) problems.add('exposed hand'); }
    else if (radius - outside > .001) problems.add((hand ? 'hand' : name) + ' through blanket');
  }
  for (const { mesh, hands } of pieces) {
    const v = posedVertices(mesh, inv), name = mesh.material.name;
    v.forEach((p,i) => covered(p, name, hands?.[i]));
    triangles(mesh, v, (a,b,c) => {
      if (name !== 'Skin') covered(mid.copy(a).add(b).add(c).multiplyScalar(1/3), name);
      if (['Skin','Shirt','Collar'].includes(name)) touchShoulder(a,b,c,'torso');
    });
  }
  if (!palms) problems.add('missing hand samples');
  for (const [i, side] of ['Left', 'Right'].entries()) {
    const arm = i ? right : left, wrist = joint(side + 'Hand'), elbow = joint(side + 'ForeArm');
    const knuckle = joint(side + 'HandMiddle1');
    if (elbow.y <= wrist.y || arm.y - wrist.y < .92 * arm.distanceTo(wrist) || Math.abs(wrist.x-arm.x) > .28 * width) problems.add(side + ' arm lifted from side');
    if (knuckle.y >= Math.min(wrist.y, hips.y)) problems.add(side + ' hand lifted from thigh');
    const gaps = shoulders[i].map(p => p.wrap - p.torso);
    if (!gaps.every(Number.isFinite)) problems.add(side + ' shoulder uncovered');
    else if (Math.min(...gaps) > .07 * width) problems.add(side + ' shoulder gap ' + Math.round(Math.min(...gaps) * 1000) + ' mm');
  }
  return [...problems];
}

export function auditBlankets(people) {
  const issues = [], lines = [];
  for (const n of people) {
    if (!n?.m.visible || !n.blanket?.isMesh) { issues.push('missing wrapped wearer'); continue; }
    const pieces = [];
    n.m.traverseVisible(mesh => {
      if (mesh === n.blanket || !mesh.isSkinnedMesh || isJoined(mesh) || /Hair|Hat|Wrap|Brow|Lash|Eye|Teeth|Tongue|low-poly/i.test(mesh.material.name)) return;
      pieces.push({ mesh, hands: mesh.material.name === 'Skin' ? handVertices(mesh) : null });
    });
    const result = new Set();
    let poses = 0;
    function sample(clip, phase) {
      n.blanket.userData.fit();
      n.m.updateMatrixWorld(true);
      for (const issue of checkPose(n, pieces)) result.add(n.id + ' ' + clip + ' ' + phase + ': ' + issue);
      poses++;
    }
    for (const clip of n.kid ? ['Idle'] : ['Idle','Talk1','Talk2','Talk3','Idle']) {
      if (!n.ctl.get(clip)) { result.add(n.id + ' missing ' + clip); continue; }
      n.ctl.play(clip);
      for (let i = 0; i < 4; i++) { n.ctl.mx.update(.1); sample(clip, 'blend ' + i); }
      for (let i = 0; i < 24; i++) {
        n.ctl.cur.time = i * n.ctl.cur.getClip().duration / 24;
        n.ctl.mx.update(0);
        sample(clip, 'frame ' + i);
      }
    }
    lines.push(n.id + ', ' + poses + ' poses, ' + result.size + ' issues');
    issues.push(...result);
  }
  return { issues, lines };
}
