/* games/_tivoli/src/clips.js: the gunfight poses, with stand-ins until the real clips are added.

   The game asks for a pose by its REAL clip name, always through pose(). If the shared animation library has that clip,
   it plays. If not, the stand-in listed below plays instead. So scenes can be built and timed now, and look right later
   with no change to the game code: add the clip to the library (docs/PIPELINE.md, section 2), add its name to
   games/_tivoli/anim-clips.json, rebuild, and the stand-in drops out by itself.

   Every stand-in is an existing clip, so nothing here needs new art. They will look wrong (standing, not crouching).
   That is expected. Do not ship with any stand-in left: ?test=clips (dev build) lists the ones still in use. */
import { CL } from '../../../engine/anim.js';

/* real clip name: [stand-in now, what the real clip must show]
   Look for these on Mixamo (all "In Place", FBX without skin): the rifle and crouch packs. */
export const POSES = {
  CrouchIdle:   ['Block',  'Crouched or kneeling behind cover, weapon held low, small breathing. Loops.'],
  DuckDown:     ['Block',  'Drop quickly from standing to a crouch at a shot. Plays once, ends in CrouchIdle.'],
  CrouchAim:    ['Point',  'Crouched, weapon raised, aiming over the cover. Loops.'],
  CrouchFire:   ['Point',  'Crouched, firing over the cover with a small recoil. Short loop.'],
  StandAim:     ['Point',  'Standing, weapon raised, aiming. Loops.'],
  StandFire:    ['Point',  'Standing, firing with a small recoil. Short loop.'],
  PeekAround:   ['Idle',   'Lean out from a wall corner, look, pull back. Plays once.'],
  RunLow:       ['Run',    'Run bent over from one cover to the next. Loops, in place.'],
  AdvanceReady: ['Walk',   'Walk with the weapon at the ready, slow and steady. Loops, in place.'],
};

/* the clip name to play now: the real one if the library has it, otherwise its stand-in */
export function pose(name) {
  if (CL[name]) return name;
  const p = POSES[name];
  if (!p) throw new Error('tivoli clips: no pose called ' + name);
  return p[0];
}

/* the poses still using a stand-in (for the dev check and the doc) */
export function standIns() { return Object.keys(POSES).filter((n) => !CL[n]); }
