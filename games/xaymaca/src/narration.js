import { AU } from "../../../engine/audio.js";

const clips = new Map();
const playing = { narration: null, score: null };

function preload(path) {
  if (!clips.has(path)) {
    const context = AU.ctx;
    if (!context) return Promise.resolve(null);
    const clip = fetch(path)
      .then((response) => {
        if (!response.ok) throw new Error("Scene audio unavailable");
        return response.arrayBuffer();
      })
      .then((bytes) => context.decodeAudioData(bytes))
      .catch(() => null);
    clips.set(path, clip);
  }
  return clips.get(path);
}

const narrationPath = (name) => "./voices/narrator-" + name + ".mp3";
const scorePath = (name) => "./scores/score-" + name + ".mp3";
export const preloadNarration = (name) => preload(narrationPath(name));
export const preloadScore = (name) => preload(scorePath(name));

function balanceScore() {
  const gain = playing.score?.gain;
  if (gain) gain.gain.setTargetAtTime(playing.narration?.source ? 0.17 : 0.40, AU.ctx.currentTime, 0.09);
}

function stop(channel) {
  const request = playing[channel];
  playing[channel] = null;
  request?.source?.stop();
  if (channel === "narration") balanceScore();
}

function play(channel, path, elapsed) {
  stop(channel);
  if (!AU.on || !AU.ctx || !AU.master) return;
  const request = { source: null, gain: null };
  playing[channel] = request;
  preload(path).then((buffer) => {
    if (playing[channel] !== request) return;
    if (!buffer || !AU.on) { stop(channel); return; }
    const offset = elapsed();
    if (offset >= buffer.duration) { stop(channel); return; }
    const source = AU.ctx.createBufferSource();
    source.buffer = buffer;
    request.source = source;
    if (channel === "score") {
      request.gain = AU.ctx.createGain();
      request.gain.gain.value = playing.narration?.source ? 0.17 : 0.40;
      request.gain.connect(AU.master);
    }
    source.connect(request.gain || AU.master);
    source.onended = () => {
      source.disconnect();
      request.gain?.disconnect();
      if (playing[channel] === request) {
        playing[channel] = null;
        if (channel === "narration") balanceScore();
      }
    };
    source.start(0, offset);
    if (channel === "narration") balanceScore();
  });
}

export const narrationActive = () => !!playing.narration;
export const preloadDialogue = (path) => preload("./" + path);
export const playDialogue = (path) => play("narration", "./" + path, () => 0);

export const stopNarration = () => stop("narration");
export const stopScore = () => stop("score");
export const playNarration = (name, elapsed = () => 0) => play("narration", narrationPath(name), elapsed);
export const playScore = (name, elapsed) => play("score", scorePath(name), elapsed);

window.addEventListener("pagehide", () => {
  stopNarration();
  stopScore();
});
