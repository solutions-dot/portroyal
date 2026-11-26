import { BlobError, BlobPreconditionFailedError, get, list, put } from '@vercel/blob';

const options = () => ({ access: 'private', token: process.env.PASTPORT_BLOB_READ_WRITE_TOKEN });
export const storageReady = () => Boolean(process.env.PASTPORT_BLOB_READ_WRITE_TOKEN);
export const catalogPath = 'pastport/settings/catalog.json';

export async function read(path, fresh = false) {
  const result = await get(path, { ...options(), useCache: !fresh });
  if (!result) return null;
  return { value: await new Response(result.stream).json(), etag: result.blob.etag };
}

export async function write(path, value, etag) {
  return put(path, JSON.stringify(value), {
    ...options(), contentType: 'application/json', cacheControlMaxAge: 60,
    ...(etag ? { ifMatch: etag } : {})
  });
}

export function isWriteConflict(error) {
  return error instanceof BlobPreconditionFailedError ||
    (error instanceof BlobError && /already exists/i.test(error.message));
}

export async function records(prefix, cursor, fresh) {
  const page = await list({ ...options(), prefix, cursor, limit: 40 });
  const rows = await Promise.all(page.blobs.map(async ({ pathname }) => (await read(pathname, fresh))?.value));
  return { rows: rows.filter(Boolean), cursor: page.hasMore ? page.cursor : null };
}

export async function saveProgress(path, value, invite) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const saved = await read(path, true);
    if (saved && (saved.value.sequence >= value.sequence ||
        saved.value.visitor !== value.visitor || saved.value.tester !== value.tester)) return;
    try {
      await write(path, {
        ...value,
        tester: saved ? saved.value.tester : invite,
        country: saved ? saved.value.country : value.country,
        city: saved ? saved.value.city : value.city
      }, saved?.etag);
      return;
    } catch (error) {
      if (!isWriteConflict(error) || attempt === 3) throw error;
    }
  }
}

/* Every record under a prefix (up to `max`), read a few at a time so a busy day stays within the function's time. */
export async function allRecords(prefix, max = 5000) {
  const paths = [];
  let cursor;
  do {
    const page = await list({ ...options(), prefix, cursor, limit: 1000 });
    paths.push(...page.blobs.map((blob) => blob.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && paths.length < max);
  const rows = new Array(Math.min(paths.length, max));
  let next = 0;
  await Promise.all(Array.from({ length: 24 }, async () => {
    while (next < rows.length) {
      const index = next++;
      try { rows[index] = (await read(paths[index], true))?.value; } catch { rows[index] = null; }
    }
  }));
  return rows.filter(Boolean);
}
