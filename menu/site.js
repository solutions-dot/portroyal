/* Small shared script for the menu and the About page.
   Two things the owner can switch on, both empty on purpose until they are chosen:
     SUBSCRIBE_URL  where the sign-up form sends the email. Any service that accepts a plain form post works
                    (Buttondown, Mailchimp, Formspree, a Google Form...). SUBSCRIBE_FIELD is the name of its email field.
     CONTACT_EMAIL  where "tell us about a mistake" goes. Shown as a mailto link on the About page.
   While SUBSCRIBE_URL is empty the form says sign-ups are not open yet and sends nothing anywhere. */
const SUBSCRIBE_URL = '';
const SUBSCRIBE_FIELD = 'email';
const CONTACT_EMAIL = '';

for (const f of document.querySelectorAll('form.subscribe')) {
  const msg = f.querySelector('.sub-msg'), email = f.querySelector('input[type=email]'), btn = f.querySelector('button[type=submit]');
  email.name = SUBSCRIBE_FIELD;
  const say = (t, ok) => { msg.textContent = t; msg.dataset.ok = ok ? '1' : ''; };
  if (SUBSCRIBE_URL) { f.action = SUBSCRIBE_URL; f.method = 'post'; f.target = '_blank'; f.rel = 'noopener'; }
  else say('Sign-ups are not open yet. Please check back soon.', false);
  f.addEventListener('submit', (e) => {
    const trap = f.querySelector('input[name=website]');   /* a hidden box that only spam robots fill in */
    if (!SUBSCRIBE_URL || trap.value) { e.preventDefault(); if (!SUBSCRIBE_URL) say('Sign-ups are not open yet. Please check back soon.', false); return; }
    trap.disabled = true;   /* so the empty trap box is not sent to the sign-up service */
    say('Thank you! A new tab opened to finish signing up. If your service sends a confirmation email, please open it.', true); setTimeout(() => { f.reset(); trap.disabled = false; }, 800);
  });
  if (!SUBSCRIBE_URL) { email.disabled = true; btn.disabled = true; }
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
