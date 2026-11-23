/* The full look at a character (owner rule 15, 23 November 2026: "check every character thoroughly and don't give me half checked work").
     node tools/review/full-check.mjs <game> <id,id,...> [anims=Idle:0.4,Walk:0.2,Walk:0.6,PickUp:0.4,SitIdle:0.4] [w=260] [h=360]
   Serve the repository root first (python3 -m http.server 8765). For each id it writes one sheet, build/review/full-<game>-<id>.png, holding:
     - every pose in `anims` (clip:share of its length) from the front, three-quarter, side and back, whole body;
     - the clothes close up (torso, torso three-quarter, torso side, torso back) standing and mid-stride;
     - the neck and collar close up from all four sides;
     - the phone and light copies (<id>_phone, <id>_lo, <id>_crowd, whichever the game has) from the front and side, standing and mid-stride.
   A clip the game does not have is left out and named. Every point the cloth check reports in a pose is marked red and printed.
   Look at every cell of the sheet before calling a character done, and name what is still wrong. */
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const [game, ids, ...rest] = process.argv.slice(2), o = Object.fromEntries(rest.filter((a) => a.includes('=')).map((a) => a.split('=')));
if (!game || !ids) { console.log('usage: node tools/review/full-check.mjs <game> <id,id,...> [anims=Clip:0.4,...]'); process.exit(1); }
const W = +(o.w || 260), H = +(o.h || 360), anims = (o.anims || 'Idle:0.4,Walk:0.2,Walk:0.6,PickUp:0.4,SitIdle:0.4').split(',').map((a) => a.split(':'));
mkdirSync('build/review/parts', { recursive: true });
const sheet = (id, views, anim, frac, extra = '') => {
  const out = `build/review/parts/${game}-${id}-${views.replace(/,/g, '_')}-${anim}-${frac}.png`;
  const r = spawnSync(process.execPath, ['tools/review/people-sheet.mjs', game, id, out, `views=${views}`, `anim=${anim}`, `frac=${frac}`, `w=${W}`, `h=${H}`, 'cloth=1', ...(extra ? [extra] : [])], { encoding: 'utf8', timeout: 600000 });
  const txt = (r.stdout || '') + (r.stderr || ''); const ok = r.status === 0 && existsSync(out) && !/SHEET error/.test(txt);
  const cloth = txt.split('\n').filter((l) => /shows through|CLOTH/.test(l));
  return { out, ok, cloth, label: `${id} ${anim}@${frac} ${views}`, err: ok ? '' : txt.split('\n').filter((l) => /ERR|error|Error/.test(l)).slice(0, 2).join(' ') };
};
const py = (files, dest) => spawnSync('python3', ['-c', `
import sys
from PIL import Image, ImageDraw
fs=sys.argv[2:]; ims=[Image.open(f).convert('RGB') for f in fs]; w=max(i.width for i in ims); h=sum(i.height+18 for i in ims)
o=Image.new('RGB',(w,h),(30,30,30)); d=ImageDraw.Draw(o); y=0
for f,i in zip(fs,ims):
    d.text((6,y+3),f.split('/')[-1][:-4],fill=(240,240,240)); o.paste(i,(0,y+18)); y+=i.height+18
o.save(sys.argv[1])`, dest, ...files], { encoding: 'utf8' });
for (const id of ids.split(',')) {
  const parts = [], missing = [], lines = [];
  const add = (r) => { if (r.ok) { parts.push(r.out); lines.push(...r.cloth.map((l) => `${r.label}: ${l.trim()}`)); } else missing.push(`${r.label}${r.err ? ' (' + r.err + ')' : ''}`); };
  for (const [a, f] of anims) add(sheet(id, 'front,torso34,side,back', a, f));
  add(sheet(id, 'torso,torso34,torsoside,torsoback', 'Idle', '0.4'));
  add(sheet(id, 'torso,torso34,torsoside,torsoback', 'Walk', '0.2'));
  add(sheet(id, 'neck,neck34,neckside,neckback', 'Idle', '0.4'));
  for (const suf of ['_phone', '_lo', '_crowd']) if (existsSync(`games/${game}/site/models/${id}${suf}.js`)) { add(sheet(id + suf, 'front,torso34,side', 'Idle', '0.4')); add(sheet(id + suf, 'front,torso34,side', 'Walk', '0.2')); }
  const dest = `build/review/full-${game}-${id}.png`; if (existsSync(dest)) unlinkSync(dest);
  if (parts.length) py(parts, dest);
  console.log(`FULL ${id}: ${parts.length} rows -> ${dest}`);
  if (missing.length) console.log(`  not drawn: ${missing.join('; ')}`);
  console.log(lines.length ? lines.map((l) => '  ' + l).join('\n') : '  cloth check: nothing reported in these poses');
}
