import { AU } from "../../../engine/audio.js";

const clips = new Map();
let active = null;

export function preloadNarration(name) {
  if (!clips.has(name)) {
    const context = AU.ctx;
    if (!context) return Promise.resolve(null);
    const clip = fetch("./voices/narrator-" + name + ".mp3")
      .then((response) => {
        if (!response.ok) throw new Error("Narration unavailable");
        return response.arrayBuffer();
      })
      .then((bytes) => context.decodeAudioData(bytes))
      .catch(() => null);
    clips.set(name, clip);
  }
  return clips.get(name);
}

export function stopNarration() {
  active?.source?.stop();
  active = null;
}

export function playNarration(name, elapsed = () => 0) {
  stopNarration();
  if (!AU.on || !AU.ctx || !AU.master) return;
  const request = { source: null };
  active = request;
  preloadNarration(name).then((buffer) => {
    if (active !== request || !buffer || !AU.on) return;
    const offset = elapsed();
    if (offset >= buffer.duration) return;
    const source = AU.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(AU.master);
    request.source = source;
    source.onended = () => {
      source.disconnect();
      if (active === request) active = null;
    };
    source.start(0, offset);
  });
}

window.addEventListener("pagehide", stopNarration);
