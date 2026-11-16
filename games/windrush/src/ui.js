/* Same interface and native Main Menu links as the established games. */
import { CHAPTERS, JOURNAL, SOURCES } from "./content.js";
export const $ = (id) => document.getElementById(id);
const PANELS = ["dialogue", "journal", "chapters", "credits", "card"];
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
  }
}
export function closeAll() {
  PANELS.forEach((id) => hide(id));
}
export function dialogue(who, L, done, cancel) {
  lines = L.map((l) => (typeof l === "string" ? { who, text: l } : l));
  li = 0;
  show("dialogue");
  doneTalk = done;
  onClose = cancel;
  drawLine();
}
function drawLine() {
  const l = lines[li];
  $("who").textContent = l.who;
  $("dialogue").classList.toggle("me", l.who === "You");
  $("line").textContent = l.text;
  $("next").textContent = li === lines.length - 1 ? "Done" : "Next";
}
$("next").onclick = () => {
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
export function card(title, L, buttons) {
  show("card");
  $("ctitle").textContent = title;
  $("cbody").replaceChildren(
    ...L.map((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      return p;
    }),
  );
  $("cbtns").replaceChildren(
    ...buttons.map(([text, fn]) => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = text;
      b.onclick = () => {
        hide("card");
        fn?.();
      };
      return b;
    }),
  );
}
export function journal(ids, memory, read) {
  show("journal");
  const pages = JOURNAL.filter((p) => ids.includes(p.id));
  $("jtabs").replaceChildren(
    ...pages.map((p) => {
      const b = document.createElement("button");
      b.className = "tab";
      b.textContent = p.title;
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.onclick = () => page(p);
      return b;
    }),
  );
  function page(p) {
    for (const tab of $("jtabs").querySelectorAll(".tab")) {
      const selected = tab.textContent === p.title;
      tab.classList.toggle("on", selected);
      tab.setAttribute("aria-pressed", String(selected));
    }
    $("jpage").scrollTop = 0;
    $("jpage").replaceChildren();
    const h = document.createElement("h3");
    h.textContent = p.title;
    $("jpage").append(h);
    for (const text of p.simple) {
      const el = document.createElement("p");
      el.textContent =
        p.id === "memory" && text.startsWith("Your choice")
          ? memory || "You are still making this memory."
          : text;
      $("jpage").append(el);
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
    $("jpage").append(details);
    if (p.source) {
      const a = document.createElement("a");
      a.href = SOURCES[p.source].url;
      a.textContent = SOURCES[p.source].name;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      $("jpage").append(a);
    }
  }
  if (pages.length) page(pages.at(-1));
  else $("jpage").textContent = "Your pages will open as you play.";
  read();
}
export function chapters(best, teacher, choose, toggle, reset) {
  show("chapters");
  $("chlist").replaceChildren(
    ...CHAPTERS.map((c, i) => {
      const el = document.createElement("li"),
        b = document.createElement("button");
      b.className = "chbtn";
      const year = document.createElement("span"), name = document.createElement("span"), status = document.createElement("span");
      year.className = "yr"; year.textContent = c.year;
      name.className = "nm"; name.textContent = `${i + 1}. ${c.name}`;
      status.className = "st"; status.textContent = i < best ? "Done" : i === best ? "Play" : "Locked";
      if (teacher && i > best) status.textContent = "Play";
      b.classList.toggle("done", i < best);
      b.append(year, name, status);
      b.disabled = !teacher && i > best;
      b.onclick = () => {
        hide("chapters");
        choose(c);
      };
      el.append(b);
      return el;
    }),
  );
  $("chteachernote").hidden = !teacher;
  $("chteacher").setAttribute("aria-pressed", teacher);
  $("chteacher").onclick = () => {
    toggle();
  };
  $("chreset").onclick = reset;
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
        "button:not(:disabled),a[href],select,input,textarea",
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
