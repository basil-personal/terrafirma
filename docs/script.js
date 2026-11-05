(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  let queued = false;
  function updateScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / maxScroll))})`;
    header.classList.toggle('scrolled', scrollY > 10);
    const exposed = Math.max(0, Math.min(1, (innerHeight - main.getBoundingClientRect().bottom) / footer.offsetHeight));
    footer.style.setProperty('--footer-reveal', reducedMotion.matches ? 1 : exposed);
    queued = false;
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  addEventListener('resize', updateScroll, { passive: true });
  updateScroll();
  const motionToggle = document.querySelector('.motion-toggle');
  if (motionToggle) motionToggle.addEventListener('click', () => {
    const paused = motionToggle.getAttribute('aria-pressed') !== 'true';
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.setAttribute('aria-label', paused ? 'Play background motion' : 'Pause background motion');
    motionToggle.querySelector('.motion-label').textContent = paused ? 'Play' : 'Pause';
    motionToggle.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
    document.querySelector('.hero-picture').classList.toggle('motion-paused', paused);
  });
  const motionObserver = new IntersectionObserver(entries => entries.forEach(e => { const img = e.target.querySelector('img'); if (img) img.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'; }), { threshold: 0 });
  document.querySelectorAll('.hero-picture').forEach(el => motionObserver.observe(el));
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); menu.hidden = true; document.body.classList.remove('menu-open'); }
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); menu.hidden = !open; document.body.classList.toggle('menu-open', open); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });
  addEventListener('resize', () => { if (innerWidth > 620) closeMenu(); }, { passive: true });
  function track(name, detail = {}) { document.dispatchEvent(new CustomEvent('terrafirma:interaction', { detail: { name, ...detail } })); }
  document.querySelectorAll('a[href="/owners/"],a[href="/operators/"]').forEach(a => a.addEventListener('click', () => track('audience_route', { path: a.getAttribute('href') })));
  const walkthrough = document.querySelector('.walkthrough');
  if (walkthrough) {
    const tabs = [...walkthrough.querySelectorAll('[role=tab]')];
    const fields = [...walkthrough.querySelectorAll('[data-field]')];
    const data = [
      { kicker: '01 / START WITH THE SOURCE', title: 'Every detail.<br>In context.', copy: 'Read a filing, identify the key information, and keep it connected to the original record.', label: 'SELECTED FIELD / PARTY', value: 'Example Family Trust', note: 'A named party becomes a starting point for ownership research. It is not a title conclusion on its own.', next: 'Connect the interest' },
      { kicker: '02 / CONNECT THE INTEREST', title: 'An interest.<br>With a paper trail.', copy: 'Connect the party, the property reference, and the related documents. Keep unanswered questions visible as the research develops.', label: 'SOURCE REFERENCE / RETAINED', value: 'Sample record / 001', note: 'The structured view links back to the document. The diagram illustrates the connection; it is not a surveyed boundary.', next: 'Explore a payment review' },
      { kicker: '03 / FOCUS THE REVIEW', title: 'A question.<br>A clear next step.', copy: 'Bring a potential discrepancy into focus so a person can check the source information and decide whether follow-up is needed.', label: 'NEXT STEP / HUMAN REVIEW', value: 'Verify the calculation basis', note: 'Check the relevant terms, allocation, and payment records before contacting the operator. An exception alone is not evidence of money owed.', next: 'Return to the source' }
    ];
    const fieldData = {
      owner: ['PARTY', 'Example Family Trust', 'A named party becomes a starting point for ownership research. It is not a title conclusion on its own.'],
      tract: ['PROPERTY REFERENCE', 'Illustrative Tract A', 'The property reference connects research across documents. This sample is fictional and does not identify a real tract.'],
      record: ['DOCUMENT REFERENCE', 'Sample record / 001', 'Retain the document reference so extracted information can be checked in its original context.']
    };
    let current = 0;
    const arrow = document.querySelector('#walk-next svg').outerHTML;
    function activate(index, focus = false) {
      current = index; const d = data[index];
      tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
      document.querySelector('#walk-panel').setAttribute('aria-labelledby', tabs[index].id);
      document.querySelector('.document-stage').hidden = index !== 0;
      document.querySelector('.interest-stage').hidden = index !== 1;
      document.querySelector('.review-stage').hidden = index !== 2;
      document.querySelector('#walk-kicker').textContent = d.kicker;
      document.querySelector('#walk-title').innerHTML = d.title;
      document.querySelector('#walk-copy').textContent = d.copy;
      document.querySelector('#insight-label').textContent = d.label;
      document.querySelector('#insight-value').textContent = d.value;
      document.querySelector('#insight-copy').textContent = d.note;
      document.querySelector('#walk-next').innerHTML = d.next + arrow;
      if (index === 0) fields.forEach((f, i) => { f.classList.toggle('selected', i === 0); f.setAttribute('aria-pressed', String(i === 0)); });
      walkthrough.classList.remove('changing'); void walkthrough.offsetWidth; walkthrough.classList.add('changing');
      if (focus) tabs[index].focus();
      track('walkthrough_step', { step: index + 1 });
      if (index === 2) track('walkthrough_complete');
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(i));
      tab.addEventListener('keydown', e => { let n; if (e.key === 'ArrowRight') n = (i + 1) % 3; if (e.key === 'ArrowLeft') n = (i + 2) % 3; if (e.key === 'Home') n = 0; if (e.key === 'End') n = 2; if (n !== undefined) { e.preventDefault(); activate(n, true); } });
    });
    fields.forEach(field => field.addEventListener('click', () => { const d = fieldData[field.dataset.field]; fields.forEach(f => { f.classList.toggle('selected', f === field); f.setAttribute('aria-pressed', String(f === field)); }); document.querySelector('#insight-label').textContent = 'SELECTED FIELD / ' + d[0]; document.querySelector('#insight-value').textContent = d[1]; document.querySelector('#insight-copy').textContent = d[2]; }));
    document.querySelector('#walk-next').addEventListener('click', () => activate((current + 1) % 3));
  }
  const form = document.querySelector('#inquiry-form');
  if (form) {
    const config = window.TERRAFIRMA_CONFIG || {};
    const destination = typeof config.contactEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail) ? config.contactEmail : '';
    const endpoint = (() => { try { const u = new URL(config.formEndpoint); return u.protocol === 'https:' && (u.hostname === 'script.google.com' || u.hostname === 'script.googleusercontent.com') ? u.href : ''; } catch { return ''; } })();
    const audienceNames = { owner: 'Mineral owner', operator: 'Operator or buyer', county: 'Courthouse partner', other: 'Other' };
    const audience = new URLSearchParams(location.search).get('audience');
    if (audienceNames[audience]) form.elements.audience.value = audience;
    let brief = '';
    let payload = null;
    if (endpoint) { document.querySelector('#contact-notice').textContent = 'Send the brief and it goes straight to our team. We reply by email.'; document.querySelector('#copy-inquiry').textContent = 'Send inquiry'; }
    else if (destination) { document.querySelector('#contact-notice').textContent = 'Prepare a short introduction. The next step opens an email draft for you to review and send.'; document.querySelector('#copy-inquiry').textContent = 'Open email draft'; }
    form.addEventListener('submit', e => {
      e.preventDefault(); if (!form.reportValidity() || form.elements.website.value) return;
      const d = new FormData(form);
      const values = [['Name', String(d.get('name')).trim()], ['Email', String(d.get('email')).trim()], ['Interest', audienceNames[d.get('audience')] || 'Other'], ['Region', String(d.get('region')).trim() || 'To discuss']];
      const dl = document.querySelector('#review-fields'); dl.replaceChildren();
      values.forEach(([key, value]) => { const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = key; dd.textContent = value; row.append(dt, dd); dl.append(row); });
      const message = String(d.get('message')).trim(); document.querySelector('#review-message').textContent = message;
      brief = 'TERRAFIRMA — INQUIRY\n\n' + values.map(([k, v]) => k + ': ' + v).join('\n') + '\n\n' + message;
      payload = { name: values[0][1], email: values[1][1], interest: values[2][1], region: values[3][1], message: message, website: form.elements.website.value };
      document.querySelector('#review-notice').textContent = endpoint ? 'Your inquiry is ready to send.' : destination ? 'Your introduction is ready. Open an email draft to review and send it.' : 'Your inquiry is ready to copy. Nothing has been sent.';
      form.hidden = true; document.querySelector('#inquiry-review').hidden = false;
      const heading = document.querySelector('#inquiry-review h2'); heading.tabIndex = -1; heading.focus({ preventScroll: true });
      track('inquiry_review');
    });
    document.querySelector('#edit-inquiry').addEventListener('click', () => { document.querySelector('#inquiry-review').hidden = true; form.hidden = false; form.elements.name.focus({ preventScroll: true }); document.querySelector('#inquiry-status').textContent = ''; });
    document.querySelector('#copy-inquiry').addEventListener('click', async () => {
      const status = document.querySelector('#inquiry-status');
      const sendButton = document.querySelector('#copy-inquiry');
      if (endpoint) {
        sendButton.disabled = true; status.textContent = 'Sending...';
        const nonce = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => b.toString(36)).join('').replace(/[^a-z0-9]/gi, '').slice(0, 24);
        const done = (state, text) => {
          window.removeEventListener('message', onAck); clearTimeout(timer); frame.remove(); postForm.remove();
          if (state === 'ok') { status.textContent = 'Sent. We will reply to the email you provided.'; sendButton.hidden = true; document.querySelector('#edit-inquiry').hidden = true; track('inquiry_sent'); }
          else { sendButton.disabled = false; status.textContent = text; offerCopy(); }
        };
        const offerCopy = () => {
          const copyButton = document.createElement('button');
          copyButton.className = 'text-link'; copyButton.type = 'button'; copyButton.textContent = 'Copy inquiry';
          copyButton.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(brief); copyButton.textContent = 'Copied to clipboard.'; }
            catch { copyButton.textContent = 'Copy failed; please select the text above and copy it yourself.'; }
          });
          status.after(copyButton);
        };
        const onAck = event => {
          if (event.source !== frame.contentWindow) return;
          if (event.origin !== 'https://script.google.com' && !/^https:\/\/([a-z0-9]+-)+script\.googleusercontent\.com$/.test(event.origin) && event.origin !== 'https://script.googleusercontent.com') return;
          const d = event.data;
          if (!d || d.app !== 'terrafirma-inquiry' || d.nonce !== nonce) return;
          if (d.status === 'ok') done('ok');
          else if (d.status === 'quota') done('quota', 'Delivery is temporarily unavailable. Please try again tomorrow; nothing was sent.');
          else done('unknown', 'We could not confirm delivery. Your inquiry may still have reached us; please wait before trying again.');
        };
        window.addEventListener('message', onAck);
        const frame = document.createElement('iframe');
        frame.name = 'inquiry-transport'; frame.hidden = true; frame.setAttribute('aria-hidden', 'true'); frame.tabIndex = -1;
        const postForm = document.createElement('form');
        postForm.method = 'POST'; postForm.action = endpoint; postForm.target = 'inquiry-transport'; postForm.hidden = true;
        const field = document.createElement('input');
        field.type = 'hidden'; field.name = 'payload'; field.value = JSON.stringify({ ...payload, nonce });
        postForm.append(field); document.body.append(frame, postForm);
        const timer = setTimeout(() => done('unknown', 'We could not confirm delivery. Your inquiry may still have reached us; please wait before trying again.'), 20000);
        postForm.submit();
        return;
      }
      if (destination) { location.href = 'mailto:' + encodeURIComponent(destination) + '?subject=' + encodeURIComponent('Terrafirma inquiry') + '&body=' + encodeURIComponent(brief); status.textContent = 'Your email app should open a draft. Send it there when you are ready.'; return; }
      try { await navigator.clipboard.writeText(brief); status.textContent = 'Copied. Your information has not been sent.'; track('inquiry_copied'); }
      catch { const field = document.createElement('textarea'); field.value = brief; field.setAttribute('aria-label', 'Inquiry text to copy'); status.replaceChildren(field); field.focus(); field.select(); }
    });
  }
})();
