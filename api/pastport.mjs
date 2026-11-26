import { createHash, timingSafeEqual } from 'node:crypto';
import { allRecords, catalogPath, isWriteConflict, read, records, saveProgress, storageReady, write } from '../server/pastport-store.mjs';

const DAY = 86_400_000;
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const uuid = (value) => typeof value === 'string' && UUID.test(value);
const GAME = /^[a-z0-9-]{1,40}$/;
const DEFAULTS = { defaultProfile: 'teen', games: {} };
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (body, status = 200) => Response.json(body, { status, headers });
const ownerSecret = () => process.env.PASTPORT_ADMIN_PASSWORD || '';
const text = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
const integer = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
const hash = (value) => createHash('sha256').update(value).digest();
const equal = (a, b) => timingSafeEqual(hash(a), hash(b));
const isoDay = (ms) => new Date(ms - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
const publicSettings = async () => {
  if (!storageReady()) return { ...DEFAULTS, playtest: false };
  return { ...((await read(catalogPath, true))?.value || DEFAULTS), playtest: true };
};

function geo(request) {
  const country = request.headers.get('x-vercel-ip-country') || '';
  let city = request.headers.get('x-vercel-ip-city') || '';
  try { city = decodeURIComponent(city); } catch { city = ''; }
  return { country: /^[A-Z]{2}$/.test(country) ? country : '', city: text(city, 100) };
}

async function payload(request, max) {
  const stream = request.body?.getReader();
  if (!stream || Number(request.headers.get('content-length')) > max) return null;
  const chunks = [];
  let length = 0;
  while (true) {
    const { value, done } = await stream.read();
    if (done) break;
    length += value.byteLength;
    if (length > max) { await stream.cancel(); return null; }
    chunks.push(value);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch { return null; }
}

const views = ['Portrait','Landscape'];
const issueKinds = ['Script error','Asset load failure','Unhandled rejection','Graphics context lost','Startup failure','Chapter load failure','Long freeze'];
const clean = (value, limit, pattern = /[^\w .,:;'"()[\]{}<>=!?/+*&%#-]/g) => typeof value === 'string' ? value.replace(pattern, ' ').replace(/\s+/g, ' ').trim().slice(0, limit) : '';
const number = (value, min, max) => typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : null;
const whole = (value, min, max) => { const n = number(value, min, max); return n === null ? null : Math.round(n); };

/* Device, screen and graphics details. Each field is cleaned on its own, so one odd value never loses a visit. */
function environment(env) {
  if (!env || typeof env !== 'object' || Array.isArray(env)) return {};
  const os = ['iOS','Android','Windows','macOS','ChromeOS','Linux','Other'].includes(env.os) ? env.os : 'Other';
  return {
    os, osVersion: clean(env.osVersion, 8, /[^\d.]/g), browserVersion: clean(env.browserVersion, 8, /[^\d.]/g),
    touch: env.touch === true, screenW: whole(env.screenW, 0, 20000), screenH: whole(env.screenH, 0, 20000),
    viewW: whole(env.viewW, 0, 20000), viewH: whole(env.viewH, 0, 20000), dpr: number(env.dpr, 0, 10),
    cores: whole(env.cores, 0, 512), memory: number(env.memory, 0, 1024), gpu: clean(env.gpu, 80), webgl: env.webgl !== false,
    lang: clean(env.lang, 16, /[^\w-]/g), net: clean(env.net, 8, /[^\w-]/g), saveData: env.saveData === true, standalone: env.standalone === true
  };
}

function performanceOf(perf) {
  if (!perf || typeof perf !== 'object' || Array.isArray(perf)) return {};
  return { load: whole(perf.load, 0, 600000), fps: whole(perf.fps, 0, 240), fpsLow: whole(perf.fpsLow, 0, 240),
    longest: whole(perf.longest, 0, 60000), samples: whole(perf.samples, 0, 1e6) ?? 0, taps: whole(perf.taps, 0, 1e6) ?? 0 };
}

function diagnostics(body, now) {
  if (body.device === undefined) return {}; // Visits from earlier builds.
  if (!['Phone','Tablet','Desktop'].includes(body.device) ||
      !['Chrome','Edge','Firefox','Safari','Samsung Internet','Other'].includes(body.browser) ||
      !views.includes(body.orientation) || !views.includes(body.startOrientation) ||
      !integer(body.rotations,0,65535) || typeof body.build !== 'string' || !/^[a-zA-Z0-9.-]{0,64}$/.test(body.build) ||
      !Array.isArray(body.issues) || body.issues.length > 16) return null;
  const issues = [];
  for (const x of body.issues) {
    if (!x || !issueKinds.includes(x.kind) || typeof x.file !== 'string' || !/^[a-zA-Z0-9_./-]{0,80}$/.test(x.file) ||
        !integer(x.line,0,2147483647) || !integer(x.column,0,2147483647) || !integer(x.count,1,65535) ||
        !views.includes(x.orientation) || (x.chapter !== null && !integer(x.chapter,1,100)) ||
        (x.step !== null && !integer(x.step,0,10000))) return null;
    issues.push({kind:x.kind,message:clean(x.message,160),file:x.file,line:x.line,column:x.column,count:x.count,
      orientation:x.orientation,chapter:x.chapter,step:x.step,at:whole(x.at,0,86400)});
  }
  const reached = Array.isArray(body.reached) ? body.reached.slice(0, 40)
    .filter((pair) => Array.isArray(pair) && integer(pair[0], 1, 100) && integer(pair[1], 0, 86400)).map(([c, s]) => [c, s]) : [];
  return {
    device:body.device,browser:body.browser,orientation:body.orientation,startOrientation:body.startOrientation,
    rotations:body.rotations,build:body.build,issues,
    user: uuid(body.user) ? body.user : '',
    firstSeen: integer(body.firstSeen, Date.UTC(2026, 0, 1), now + 60_000) ? body.firstSeen : null,
    opens: whole(body.opens, 0, 1e6),
    referrer: clean(body.referrer, 80, /[^\w.-]/g),
    ...environment(body.env), perf: performanceOf(body.perf), reached
  };
}

async function progress(request, body) {
  const now = Date.now();
  const { page, visitor, game, startedAt, sequence, seconds, played, chapter, step, exit, screen } = body;
  const health = diagnostics(body, now);
  if (!health || !uuid(page) || !uuid(visitor) ||
      typeof game !== 'string' || (game !== '' && !GAME.test(game)) ||
      !integer(startedAt, now - DAY, now + 60_000) || !integer(sequence, 1, 20_000) ||
      !integer(seconds, 0, Math.min(86_400, Math.ceil((now - startedAt) / 1000) + 60)) ||
      typeof played !== 'boolean' || (played && !game) ||
      (chapter !== null && !integer(chapter, 1, 100)) || (step !== null && !integer(step, 0, 10_000)) ||
      !['', 'left-page', 'game-exit', 'menu-link'].includes(exit) ||
      !['menu', 'title', 'journal', 'chapters', 'dialogue', 'card', 'chcard', 'fade', 'game'].includes(screen)) {
    return json({ error: 'Invalid visit' }, 400);
  }
  const path = `pastport/visits/${isoDay(startedAt)}/${page}.json`;
  await saveProgress(path, {
    page, visitor, tester: '', game, startedAt, updatedAt: now, sequence, seconds, played,
    chapter, step, exit, screen, ...health, ...geo(request)
  }, '');
  return new Response(null, { status: 204, headers });
}

async function submission(body, kind) {
  if (body.website) return json({ saved: true });
  const email = text(body.email, 255);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.adult !== true) {
    return json({ error: 'Enter a valid email and confirm you are an adult.' }, 400);
  }
  let key = hash(email.toLowerCase()).toString('hex');
  let details = {};
  if (kind === 'contact') {
    const { id } = body;
    details = {
      name: text(body.name, 101), role: text(body.role, 81),
      enquiry: text(body.enquiry, 81), message: text(body.message, 4001)
    };
    if (!uuid(id) || Object.values(details).some((field) => !field) ||
        details.name.length > 100 || details.message.length > 4000 ||
        details.role.length > 80 || details.enquiry.length > 80) {
      return json({ error: 'Please fill in every field.' }, 400);
    }
    key = id;
  }
  try { await write(`pastport/${kind}/${key}.json`, { email, receivedAt: Date.now(), ...details }); }
  catch (error) { if (!isWriteConflict(error)) throw error; }
  return json({ saved: true });
}

function validateSettings(body) {
  if (!['kids', 'teen'].includes(body.defaultProfile) || !body.games ||
      typeof body.games !== 'object' || Array.isArray(body.games) || Object.keys(body.games).length > 100) return null;
  const games = {};
  for (const [id, setting] of Object.entries(body.games)) {
    if (!GAME.test(id) || !setting || typeof setting.enabled !== 'boolean' ||
        !['kids', 'teen'].includes(setting.category)) return null;
    games[id] = { enabled: setting.enabled, category: setting.category };
  }
  return { defaultProfile: body.defaultProfile, games };
}

async function admin(request, url) {
  const password = ownerSecret();
  if (!password) return json({ error: 'The dashboard password has not been configured.' }, 503);
  if (!equal(request.headers.get('authorization') || '', `Bearer ${password}`)) {
    return json({ error: 'Incorrect dashboard password.' }, 401);
  }
  const kind = url.searchParams.get('kind');
  if (request.method === 'GET' && kind === 'catalog') {
    const catalog = await read(catalogPath, true);
    return json({ settings: catalog?.value || DEFAULTS, revision: catalog?.etag || null });
  }
  if (request.method === 'GET' && kind === 'day') {
    // Every visit of one Jamaica day in one reply. A day that can no longer change is saved as one file and read from there.
    const day = url.searchParams.get('day') || '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(day))) return json({ error: 'Invalid date.' }, 400);
    const closed = Date.parse(day + 'T05:00:00Z') + 2 * DAY + 3_600_000 < Date.now();
    const cachePath = `pastport/daily/${day}.json`;
    if (closed) {
      const cached = await read(cachePath).catch(() => null);
      if (cached?.value?.version === 2) return json({ day, rows: cached.value.rows, closed, cached: true });
    }
    const rows = (await allRecords(`pastport/visits/${day}/`, 5000)).map((row) => {
      const { tester, testerLabel, ...rest } = row;
      return rest;
    });
    if (closed) await write(cachePath, { version: 2, day, rows }).catch(() => {});
    return json({ day, rows, closed, cached: false });
  }
  if (request.method === 'GET' && ['visits', 'newsletter', 'contact'].includes(kind)) {
    const day = url.searchParams.get('day') || isoDay(Date.now());
    if (kind === 'visits' && !/^\d{4}-\d{2}-\d{2}$/.test(day)) return json({ error: 'Invalid date.' }, 400);
    const prefix = kind === 'visits' ? `pastport/visits/${day}/` : `pastport/${kind}/`;
    const page = await records(prefix, url.searchParams.get('cursor') || undefined, kind === 'visits');
    return json(page);
  }
  if (request.method === 'POST' && kind === 'catalog') {
    const body = await payload(request, 16_384);
    const settings = body && validateSettings(body);
    if (!settings || !(body.revision === null || typeof body.revision === 'string')) return json({ error: 'Invalid settings.' }, 400);
    try {
      const saved = await write(catalogPath, settings, body.revision);
      return json({ settings, revision: saved.etag });
    } catch (error) {
      if (!isWriteConflict(error)) throw error;
      return json({ error: 'Settings changed in another window. Sign in again to load the latest settings.' }, 409);
    }
  }
  return json({ error: 'Unknown dashboard action.' }, 404);
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'config';
    try {
      if (request.method === 'GET' && action === 'config') return json(await publicSettings());
      if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
      if (request.method === 'POST' && (request.headers.get('origin') !== url.origin ||
          request.headers.get('sec-fetch-site') === 'cross-site')) return json({ error: 'This form must be sent from PastPort.' }, 403);
      if (!storageReady()) return json({ error: 'This service is not available yet.' }, 503);
      if (action === 'admin') return await admin(request, url);
      if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
      const body = await payload(request, action === 'progress' ? 8192 : 20_000);
      if (!body) return json({ error: 'Invalid submission.' }, 400);
      if (action === 'progress') return await progress(request, body);
      if (['newsletter', 'contact'].includes(action)) return await submission(body, action);
      return json({ error: 'Unknown action.' }, 404);
    } catch (error) {
      console.error('PastPort API request failed', action, error.name);
      return json({ error: 'The service is temporarily unavailable. Please try again.' }, 503);
    }
  }
};
