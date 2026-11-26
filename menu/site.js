/* Forms on the menu and About page submit to the same private inbox. */
const CONTACT_EMAIL = 'miramoraiinteractive@gmail.com';

async function submitPastPort(action, form, fields = {}) {
  const data = Object.fromEntries(new FormData(form));
  const response = await fetch('/api/pastport?action=' + action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ...fields, adult: form.elements.adult.checked })
  });
  const result = await response.json();
  if (!response.ok || !result.saved) throw new Error(result.error || 'Please try again.');
}

for (const form of document.querySelectorAll('form.subscribe')) {
  const msg = form.querySelector('.sub-msg');
  const button = form.querySelector('button[type=submit]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    button.disabled = true;
    msg.dataset.ok = '';
    msg.textContent = 'Saving your sign-up…';
    try {
      await submitPastPort('newsletter', form);
      form.reset();
      msg.dataset.ok = '1';
      msg.textContent = 'You are on the list. Thank you!';
    } catch {
      msg.textContent = 'We could not save your sign-up. Please try again.';
    } finally {
      button.disabled = false;
    }
  });
}

for (const el of document.querySelectorAll('[data-contact]')) {
  if (!CONTACT_EMAIL) { el.hidden = true; continue; }
  for (const a of el.querySelectorAll('a.contact')) { a.href = 'mailto:' + CONTACT_EMAIL; a.textContent = CONTACT_EMAIL; }
}

/* The menu's "Get updates" button opens the sign-up panel; Escape or the shade closes it. */
const panel = document.getElementById('subpanel'), openBtn = document.getElementById('subopen');
if (panel && openBtn) {
  let last = null;
  const open = () => { last = document.activeElement; panel.hidden = false; (panel.querySelector('input:not([disabled])') || panel.querySelector('.sub-close')).focus(); };
  const close = () => { panel.hidden = true; if (last) last.focus(); };
  openBtn.addEventListener('click', open);
  panel.querySelector('.sub-close').addEventListener('click', close);
  panel.addEventListener('click', (e) => { if (e.target === panel) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) close(); });
}

/* Native dialog keeps keyboard focus inside the form and supports Escape. */
const contactPanel = document.getElementById('contactpanel');
const contactOpen = document.getElementById('contactopen');
if (contactPanel && contactOpen) {
  const form = document.getElementById('contactform');
  const status = document.getElementById('contactstatus');
  contactOpen.addEventListener('click', () => { status.textContent = ''; contactPanel.showModal(); });
  document.getElementById('contactclose').addEventListener('click', () => contactPanel.close());
  contactPanel.addEventListener('click', (event) => {
    const box = contactPanel.getBoundingClientRect();
    if (event.target === contactPanel && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) contactPanel.close();
  });
  contactPanel.addEventListener('close', () => contactOpen.focus());
  let submissionId;
  const button = form.querySelector('button[type=submit]');
  form.addEventListener('input', () => { if (!button.disabled) submissionId = undefined; });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submissionId ||= crypto.randomUUID();
    button.disabled = true;
    status.textContent = 'Sending your message…';
    try {
      await submitPastPort('contact', form, { id: submissionId });
      form.reset();
      submissionId = undefined;
      status.textContent = 'Your message was sent. Thank you!';
    } catch {
      status.textContent = 'We could not confirm your message was sent. Please try again or email ' + CONTACT_EMAIL + '.';
    } finally {
      button.disabled = false;
    }
  });
}

/* The games are listed in Jamaica's timeline, oldest first, by each card's data-year. A new card falls into place wherever it is written in index.html. */
for (const list of document.querySelectorAll('.games')) {
  const cards = [...list.querySelectorAll(':scope > .game')];
  cards.sort((a, b) => (+a.dataset.year || 9999) - (+b.dataset.year || 9999)).forEach((c) => list.appendChild(c));
}
