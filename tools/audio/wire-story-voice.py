#!/usr/bin/env python3
"""Wires a game that has the shared ui.js layout (Windrush, Selassie, Hutchinson template) to engine/storyvoice.js:
   python3 tools/audio/wire-story-voice.py <game>   (see docs/ENGINE.md, "Story voice"). New games copy the template instead; this is for older ones."""
import sys
g=sys.argv[1]; R='games/%s/src/'%g
p=R+'ui.js'; s=open(p).read()
if 'createStoryVoice' not in s:
    old='function drawLine() {\n  const l = lines[li];\n  $("who").textContent = l.who;\n  $("line").textContent = l.text;\n  $("dialogue").classList.toggle("me", ME.includes(l.who));\n}'
    assert old in s,'drawLine pattern'
    s=s.replace(old,'/* spoken lines, cards and look lines: one shared module (engine/storyvoice.js) */\nexport const SV = createStoryVoice();\nfunction drawLine() {\n  const l = lines[li];\n  $("who").textContent = l.who;\n  $("line").textContent = l.text;\n  $("dialogue").classList.toggle("me", ME.includes(l.who));\n  SV.line(l.who, l.text, ME.includes(l.who));\n}',1)
    old='  const f = doneTalk;\n  doneTalk = null;\n  hide("dialogue");\n  f?.();\n};\n$("dclose").onclick = () => hide("dialogue");'
    assert old in s,'next pattern'
    s=s.replace(old,'  const f = doneTalk;\n  doneTalk = null;\n  SV.stop();\n  hide("dialogue");\n  f?.();\n};\n$("dclose").onclick = () => {\n  SV.stop();\n  hide("dialogue");\n};',1)
    old='export function card(title, L, buttons, { col = false } = {}) {\n  show("card");'
    assert old in s,'card pattern'
    s=s.replace(old,old+'\n  SV.card(title, L);',1)
    old='      b.onclick = () => {\n        hide("card");'
    assert old in s,'btn pattern'
    s=s.replace(old,'      b.onclick = () => {\n        SV.stop();\n        hide("card");',1)
    i=s.index('import '); s=s[:i]+'import { createStoryVoice } from "../../../engine/storyvoice.js";\n'+s[i:]
    open(p,'w').write(s)
p=R+'main.js'; s=open(p).read()
if '...SV.look' not in s:
    if 'import { $, openPanel,' in s: s=s.replace('import { $, openPanel,','import { $, SV, openPanel,',1)
    else:
        import re
        m=re.search(r'import \{\n(\s+)\$,\n',s); assert m,'ui import'
        s=s.replace(m.group(0),m.group(0)+m.group(1)+'SV,\n',1)
    assert '  freeze: (on) => (busy = on),' in s
    s=s.replace('  freeze: (on) => (busy = on),','  ...SV.look,\n  freeze: (on) => (busy = on),',1)
    if 'lines: lk.say,' in s: s=s.replace('lines: lk.say,','line: 1.6, lines: SV.lookLines(lk),',1)
    elif 'lines: L.say,' in s: s=s.replace('lines: L.say,','line: 1.6, lines: SV.lookLines(L),',1)
    open(p,'w').write(s)
p=R+'director.js'; s=open(p).read()
s=s.replace('import { createFilmVoice } from "../../../engine/filmvoice.js";','import { sharedVoice } from "../../../engine/filmvoice.js";',1).replace('createFilmVoice()','sharedVoice()',1)
open(p,'w').write(s)
print('wired',g)
