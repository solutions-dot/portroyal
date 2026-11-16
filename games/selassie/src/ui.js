/* The interface, the same as Kendal 1957, Melissa, Garvey and Nanny Town: the goal box, the controls tip that shows
   for a few seconds at the start of play, toasts that wait while someone is talking, the Journal button that glows with a count of new
   pages, the gold talk mark over the step's story people and the talk button with the name of the nearest person, the dialogue box, cards,
   the journal with its tabs, the chapter list and the credits. */
import * as THREE from "three";
import { uiSound } from "../../../engine/audio.js";
import { headTop as realHeadTop, markAt, NEAR_GAP } from "../../../engine/marks.js"; /* the talk mark sits the same gap over the real head or hat in every game */
import { CHAPTERS, JOURNAL, SOURCES } from "./content.js";
export const $ = (id) => document.getElementById(id);
const PANELS = ["dialogue", "journal", "chapters", "credits", "card"];
const ME = ["You", "Ruth"]; /* lines the player says get their own colour */
let focusBefore = null,
  active = null,
  doneTalk = null,
  lines = [],
  li = 0,
  onClose = null;
export const openPanel = () => PANELS.some((id) => !$(id).hidden);
function show(id) {
  if (active) hide(active);
  focusBefore = document.activeElement;
  active = id;
  document.body.classList.toggle("talking", id === "dialogue");
  $("toast").hidden = true;
  $("talk").hidden = true;
  if (id === "dialogue") $("hint").hidden = true;
  $(id).hidden = false;
  $(id).setAttribute("aria-modal", "true");
  requestAnimationFrame(() => $(id).querySelector("button,a")?.focus());
}
export function hide(id = active) {
  if (!id) return;
  $(id).hidden = true;
  if (active === id) {
    active = null;
    document.body.classList.remove("talking");
    if (focusBefore?.isConnected && focusBefore.checkVisibility())
      focusBefore.focus();
    else $("stage").focus();
  }
  if (id === "dialogue") {
    doneTalk = null;
    onClose?.();
    onClose = null;
    setTimeout(flushToasts, 250); /* a page found while talking is shown now, not on top of the dialogue box */
  }
}
export function closeAll() {
  PANELS.forEach((id) => hide(id));
}

/* ---------- toasts: a short line at the bottom; one that comes while someone is talking waits until the dialogue box closes ---------- */
let toastTimer = 0;
const TOASTQ = [];
export function toast(msg, ms = 2600) {
  if (!$("dialogue").hidden) {
    if (!TOASTQ.some((q) => q[0] === msg)) TOASTQ.push([msg, ms]);
    return;
  }
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.hidden = true;
    if (TOASTQ.length && $("dialogue").hidden) toast(...TOASTQ.shift());
  }, ms);
}
function flushToasts() {
  if (TOASTQ.length && $("dialogue").hidden && $("toast").hidden)
    toast(...TOASTQ.shift());
}
/* journal pages found since the journal was last opened: the button glows and shows how many */
export function showCount(n) {
  const b = $("jbtn"),
    c = $("jcount");
  c.textContent = n;
  c.hidden = !n;
  b.classList.toggle("glow", n > 0);
  b.setAttribute(
    "aria-label",
    n ? "Journal, " + n + " new page" + (n > 1 ? "s" : "") : "Journal",
  );
}
export function newPage(id) {
  const p = JOURNAL.find((q) => q.id === id);
  if (p) toast("New journal page: " + p.title, 3200);
}

/* ---------- the goal box (it stays open until the task is done, as in every game) and the controls tip ---------- */
let goalText = "",
  hintTimer = 0,
  goalTap = null,
  playing = () => true;
export function goalSetup({ started, tap }) {
  playing = started;
  goalTap = tap;
}
export function showGoal(withControls) {
  const el = $("goal");
  if (el.textContent !== goalText && playing()) uiSound("goal");
  el.textContent = goalText;
  el.classList.remove("folded");
  el.setAttribute("aria-expanded", "true");
  if (withControls) showHint();
}
export function setGoal(text) {
  text = text || "";
  if (text === goalText) return;
  goalText = text;
  if (!playing()) {
    $("goal").textContent = text;
    return;
  }
  showGoal();
}
export function nudgeGoal() {
  showGoal();
  const g = $("goal");
  g.classList.remove("nudge");
  void g.offsetWidth;
  g.classList.add("nudge");
}
$("goal").onclick = () => (goalTap?.() ? null : showGoal(true));
export function showHint() {
  $("hint").hidden = false;
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    $("hint").hidden = true;
  }, 6000);
}
/* the controls tip: shown at the start of play for a few seconds, then it goes away. It waits for the first moment you can
   really play (no welcome card, no loading, no scene), so it is seen: the game calls hintTick(quiet) every frame */
let hintWaits = false;
export function startHint(touch) {
  $("hint").textContent = touch
    ? "Left thumb walks. Drag to look. Tap a person to talk."
    : "W A S D to walk, Shift to hurry. Drag to look. Space or Enter to talk or use.";
  $("hint").hidden = true;
  hintWaits = true;
}
export function hintTick(quiet) {
  if (!hintWaits || !quiet) return;
  hintWaits = false;
  showHint();
}

/* ---------- a glowing talk mark over each story person, and the talk button with a name over the nearest person ---------- */
const BUBBLE = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d"),
    g = x.createRadialGradient(64, 64, 8, 64, 64, 62);
  g.addColorStop(0, "rgba(255,190,70,0.9)");
  g.addColorStop(0.35, "rgba(255,180,60,0.45)");
  g.addColorStop(1, "rgba(255,170,50,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  x.fillStyle = "#f6c45c";
  x.strokeStyle = "rgba(70,45,10,0.85)";
  x.lineWidth = 3;
  x.beginPath();
  x.arc(64, 64, 15, 0, Math.PI * 2);
  x.fill();
  x.stroke();
  x.fillStyle = "#fff3d0";
  x.beginPath();
  x.arc(59, 59, 5, 0, Math.PI * 2);
  x.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
})();
const TALK_SVG =
  '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12c0 4-4 7-9 7-1.2 0-2.4-.2-3.4-.5L3 20l1.5-4.2C3.6 14.7 3 13.4 3 12c0-4 4-7 9-7s9 3 9 7z"/><circle cx="8" cy="12" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="16" cy="12" r=".6" fill="currentColor"/></svg>';
/* the real top of the head or hat (engine/marks.js), or a guess from the body's height when it has no head bone */
const headTop = (n) => {
  const y = realHeadTop(n.m);
  return y !== null ? y : (n.ground || 0) + 1.75 * (n.scale || 1);
};
export function createMarks({ scene, camera, canvas, onTap }) {
  const all = [],
    v = new THREE.Vector3(),
    ray = new THREE.Raycaster(),
    ndc = new THREE.Vector2();
  const el = document.createElement("button");
  el.className = "tbub";
  el.hidden = true;
  document.body.appendChild(el);
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    if (el.person) onTap(el.person);
  });
  return {
    el,
    add(n) {
      n.mark = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: BUBBLE,
          transparent: true,
          depthWrite: false,
          depthTest: true,
          fog: false,
        }),
      );
      n.mark.renderOrder = 5;
      n.mark.visible = false;
      n.mark.userData.noAudit = true;
      scene.add(n.mark);
      all.push(n);
    },
    /* people: this place's people; show: play is quiet; marked(n): a story person of this step; near: the nearest person you can talk to */
    tick(now, { people, show, marked, near, px, pz }) {
      const here = new Set(people);
      for (const n of all) {
        const m = n.mark;
        if (!show || !here.has(n) || !n.m.visible || !marked(n)) {
          m.visible = false;
          continue;
        }
        const d = Math.hypot(px - n.x, pz - n.z),
          k = (0.4 + d * 0.035) * (1 + Math.sin(now * 2 + n.x) * 0.1);
        m.position.set(
          n.x,
          markAt(headTop(n), k) + Math.sin(now * 2.4 + n.x) * 0.03,
          n.z,
        );
        m.scale.set(k, k, k);
        m.material.opacity = Math.max(0.6, 1 - d / 20);
        m.visible = near !== n && d < 40;
      }
      const on = show && !!near;
      el.hidden = !on;
      el.person = on ? near : null;
      if (!on) return;
      v.set(near.x, headTop(near) + NEAR_GAP, near.z).project(camera);
      if (v.z > 1) {
        el.hidden = true;
        return;
      }
      const r = canvas.getBoundingClientRect();
      el.style.left = r.left + ((v.x + 1) / 2) * r.width + "px";
      el.style.top = r.top + ((1 - v.y) / 2) * r.height + "px";
      if (el.dataset.label !== near.who) {
        el.dataset.label = near.who;
        el.innerHTML = TALK_SVG + '<span class="who">' + near.who + "</span>";
        el.setAttribute("aria-label", "Talk to " + near.who);
      }
    },
    /* the person under a tap, if they are near enough to talk to */
    tap(cx, cy, people, px, pz) {
      ndc.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      for (const n of people)
        if (
          n.m.visible &&
          Math.hypot(px - n.x, pz - n.z) < 6 &&
          ray.intersectObject(n.m, true).length > 0
        )
          return n;
      return null;
    },
  };
}

/* ---------- talking: one line at a time; the player's own lines get their own colour; the x or Escape ends it ---------- */
export function dialogue(who, L, done, cancel) {
  lines = L.map((l) => (typeof l === "string" ? { who, text: l } : l));
  li = 0;
  uiSound("tap");
  show("dialogue");
  doneTalk = done;
  onClose = cancel;
  drawLine();
}
function drawLine() {
  const l = lines[li];
  $("who").textContent = l.who;
  $("line").textContent = l.text;
  $("dialogue").classList.toggle("me", ME.includes(l.who));
}
$("next").onclick = () => {
  uiSound("tap");
  if (++li < lines.length) {
    drawLine();
    return;
  }
  const f = doneTalk;
  doneTalk = null;
  hide("dialogue");
  f?.();
};
$("dclose").onclick = () => hide("dialogue");

/* ---------- cards: the first button is the main one, the others are outlined; col puts the buttons one under another ---------- */
export function card(title, L, buttons, { col = false } = {}) {
  show("card");
  $("ctitle").textContent = title;
  $("cbody").replaceChildren(
    ...L.map((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      return p;
    }),
  );
  $("cbtns").classList.toggle("col", col);
  $("cbtns").replaceChildren(
    ...buttons.map(([text, fn], i) => {
      const b = document.createElement("button");
      b.className = "btn" + (i ? " ghost" : "");
      b.textContent = text;
      b.onclick = () => {
        hide("card");
        fn?.();
      };
      return b;
    }),
  );
}

/* ---------- the journal: a tab for each page found, the newest open, and how many are left to find ---------- */
export function journal(ids, memory, read, sel) {
  show("journal");
  function render(open) {
    const tabs = $("jtabs");
    tabs.replaceChildren();
    for (const p of JOURNAL.filter((q) => ids.includes(q.id))) {
      const b = document.createElement("button"),
        selected = p.id === open;
      b.type = "button";
      b.className = "tab";
      b.classList.toggle("on", selected);
      b.setAttribute("aria-pressed", String(selected));
      b.textContent = p.title;
      b.onclick = () => render(p.id);
      tabs.appendChild(b);
    }
    const left = JOURNAL.filter((q) => !ids.includes(q.id)).length;
    if (left > 0) {
      const m = document.createElement("button");
      m.className = "tab";
      m.disabled = true;
      m.textContent = left + " more to find";
      tabs.appendChild(m);
    }
    const page = $("jpage");
    $("jpage").scrollTop = 0;
    page.replaceChildren();
    const p = JOURNAL.find((q) => q.id === open);
    if (!p) {
      const e = document.createElement("p");
      e.textContent = "Your journal is empty. Talk to people to fill it.";
      page.appendChild(e);
      return;
    }
    const h = document.createElement("h3");
    h.textContent = p.title;
    page.append(h);
    for (const text of p.simple) {
      const el = document.createElement("p");
      el.textContent =
        p.id === "memory" && text.startsWith("Your choice")
          ? memory || "You are still making this memory."
          : text;
      page.append(el);
    }
    const details = document.createElement("details"),
      summary = document.createElement("summary");
    summary.textContent = "Dig deeper";
    details.append(summary);
    for (const text of p.deeper) {
      const el = document.createElement("p");
      el.textContent = text;
      details.append(el);
    }
    if (p.source && SOURCES[p.source]) {
      const sp = document.createElement("p"),
        a = document.createElement("a");
      sp.className = "source";
      a.href = SOURCES[p.source].url;
      a.textContent = SOURCES[p.source].name;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      sp.append(a);
      page.append(details, sp);
    } else page.append(details);
  }
  render(sel || ids.at(-1));
  read();
}

/* ---------- chapters: year, name and Play or Done; teacher unlock; Start again asks for a second tap ---------- */
export function chapters({ best, done, teacher, choose, toggle, erase }) {
  show("chapters");
  $("chteacher").setAttribute("aria-pressed", String(teacher));
  $("chteacher").textContent = teacher ? "Unlock All: on" : "Unlock All";
  $("chteachernote").hidden = !teacher;
  $("chlist").replaceChildren(
    ...CHAPTERS.map((c, i) => {
      const li = document.createElement("li"),
        b = document.createElement("button"),
        dn = done(i);
      b.className = "chbtn" + (dn ? " done" : "");
      b.disabled = !teacher && i > best;
      for (const [cls, txt] of [
        ["yr", c.year],
        ["nm", c.name],
        ["st", dn ? "Done" : "Play"],
      ]) {
        const sp = document.createElement("span");
        sp.className = cls;
        sp.textContent = txt;
        b.appendChild(sp);
      }
      b.onclick = () => {
        hide("chapters");
        choose(c);
      };
      li.append(b);
      return li;
    }),
  );
  $("chteacher").onclick = () => {
    toggle();
    $("chteacher").focus();
  };
  const r = $("chreset");
  r.textContent = "Restart";
  r.dataset.armed = "";
  r.onclick = () => {
    if (!r.dataset.armed) {
      r.dataset.armed = "1";
      r.textContent = "Tap again to erase all progress";
      return;
    }
    erase();
  };
  requestAnimationFrame(() =>
    ($("chlist").querySelector("button:not(:disabled)") || $("chclose")).focus(),
  );
}
for (const [close, id] of [
  ["jclose", "journal"],
  ["chclose", "chapters"],
  ["crclose", "credits"],
])
  $(close).onclick = () => hide(id);
$("chcred").onclick = () => show("credits");
$("sourceList").replaceChildren(
  ...Object.values(SOURCES).map((s) => {
    const p = document.createElement("p"),
      a = document.createElement("a");
    p.className = "source";
    a.href = s.url;
    a.textContent = s.name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    p.append(a);
    return p;
  }),
);
addEventListener("keydown", (e) => {
  if (!active) return;
  if (e.key === "Escape" && active !== "card") {
    hide();
    e.preventDefault();
  }
  if (e.key !== "Tab") return;
  const nodes = [
      ...$(active).querySelectorAll(
        "button:not(:disabled),a[href],select,input,textarea,summary",
      ),
    ].filter((x) => !x.hidden),
    first = nodes[0],
    last = nodes.at(-1);
  if (e.shiftKey && document.activeElement === first) {
    last?.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first?.focus();
    e.preventDefault();
  }
});
