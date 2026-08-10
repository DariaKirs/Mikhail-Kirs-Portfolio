(() => {
  const CONTACT_VERSION = '20260810-1455';
  const REQUEST_TIMEOUT_MS = 18000;
  const cssHref = `assets/css/contact-form-refine.css?v=${CONTACT_VERSION}`;

  window.__MK_CONTACT_VERSION__ = CONTACT_VERSION;

  if (!document.querySelector('link[data-contact-form-styles]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    link.dataset.contactFormStyles = 'true';
    document.head.appendChild(link);
  }

  const contactActions = document.querySelector('#contact .actions');
  if (!contactActions) return;

  const existingMailLink = Array.from(contactActions.querySelectorAll('.button'))
    .find((element) => element.textContent.trim().toLowerCase() === 'mail me');

  if (!existingMailLink) return;

  const mailButton = document.createElement('button');
  mailButton.type = 'button';
  mailButton.className = `${existingMailLink.className} mail-form-button`;
  mailButton.textContent = 'Mail me';
  mailButton.setAttribute('aria-label', 'Open contact form for Mikhail Kirs');
  mailButton.dataset.contactOpen = 'true';
  existingMailLink.replaceWith(mailButton);

  const footerText = document.querySelector('.site-footer .footer-row > span');
  if (footerText && !footerText.querySelector('.footer-privacy-link')) {
    footerText.append(document.createTextNode(' · '));
    const privacyLink = document.createElement('a');
    privacyLink.href = 'privacy.html';
    privacyLink.className = 'footer-privacy-link';
    privacyLink.textContent = 'Privacy Policy';
    footerText.appendChild(privacyLink);
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'contact-dialog';
  dialog.id = 'contact-dialog';
  dialog.setAttribute('aria-labelledby', 'contact-dialog-title');
  dialog.innerHTML = `
    <div class="contact-modal-card">
      <button class="contact-modal-close" type="button" aria-label="Close contact form">×</button>
      <p class="contact-modal-eyebrow">Contact</p>
      <h2 class="contact-modal-title" id="contact-dialog-title">What should we make visible?</h2>
      <p class="contact-modal-intro">A person, a place, a business, an idea? Tell me what you have in mind, and we’ll find the right visual form.</p>

      <form class="contact-form" id="contact-form" novalidate>
        <fieldset class="contact-form-fields">
          <div class="contact-field contact-field-name">
            <label for="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" autocomplete="name" minlength="2" maxlength="80" required>
          </div>

          <div class="contact-field contact-field-email">
            <label for="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required>
          </div>

          <div class="contact-field contact-field-message">
            <label for="contact-message">Message</label>
            <textarea id="contact-message" name="message" minlength="10" maxlength="4000" required></textarea>
          </div>

          <div class="contact-hp" aria-hidden="true">
            <label for="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off">
          </div>

          <input id="contact-started-at" name="startedAt" type="hidden" value="">

          <label class="contact-consent" for="contact-consent">
            <input id="contact-consent" name="consent" type="checkbox" required>
            <span>I agree that Mikhail Kirs may use the information provided above to respond to my inquiry. <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a></span>
          </label>

          <div class="contact-form-actions">
            <button class="button contact-submit" type="submit">Send message</button>
            <p class="contact-form-note">Your details are used only to respond to this inquiry.</p>
          </div>
        </fieldset>

        <p class="contact-form-status" role="status" aria-live="polite"></p>

        <div class="contact-success">
          <strong>Thanks! Your message has been sent.</strong>
          <p>I’ll reply to the email address you provided.</p>
        </div>
      </form>
    </div>
  `;

  const footer = document.querySelector('.site-footer');
  if (footer) {
    footer.before(dialog);
  } else {
    document.body.appendChild(dialog);
  }

  const card = dialog.querySelector('.contact-modal-card');
  const form = dialog.querySelector('#contact-form');
  const fieldset = dialog.querySelector('.contact-form-fields');
  const status = dialog.querySelector('.contact-form-status');
  const success = dialog.querySelector('.contact-success');
  const submitButton = dialog.querySelector('.contact-submit');
  const closeButton = dialog.querySelector('.contact-modal-close');
  const nameInput = dialog.querySelector('#contact-name');
  const startedAtInput = dialog.querySelector('#contact-started-at');

  let returnFocus = mailButton;
  let activeSubmission = 0;

  const resetFormState = () => {
    activeSubmission += 1;
    form.reset();
    form.removeAttribute('aria-busy');
    fieldset.classList.remove('is-hidden');
    success.classList.remove('is-visible');
    status.textContent = '';
    status.classList.remove('is-error');
    submitButton.disabled = false;
    submitButton.textContent = 'Send message';
    startedAtInput.value = String(Date.now());
  };

  const openDialog = () => {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : mailButton;
    resetFormState();
    document.body.classList.add('contact-modal-open');
    dialog.showModal();
    card.scrollTop = 0;
    window.requestAnimationFrame(() => nameInput.focus());
  };

  const closeDialog = () => {
    activeSubmission += 1;
    if (dialog.open) dialog.close();
  };

  const showSuccess = () => {
    form.removeAttribute('aria-busy');
    fieldset.classList.add('is-hidden');
    status.textContent = '';
    status.classList.remove('is-error');
    success.classList.add('is-visible');
    submitButton.disabled = false;
    submitButton.textContent = 'Send message';
    card.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showError = (message) => {
    form.removeAttribute('aria-busy');
    status.textContent = message;
    status.classList.add('is-error');
    submitButton.disabled = false;
    submitButton.textContent = 'Send message';
    status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const sendContactRequest = async (payload) => {
    const controller = new AbortController();
    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = window.setTimeout(() => {
        controller.abort();
        const timeoutError = new Error('We couldn’t confirm delivery in time. Your message may already have been sent; please wait a moment before trying again.');
        timeoutError.name = 'ContactTimeoutError';
        reject(timeoutError);
      }, REQUEST_TIMEOUT_MS);
    });

    const requestPromise = fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MK-Contact-Client': CONTACT_VERSION
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store'
    }).then(async (response) => {
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const requestError = new Error(result.error || 'Unable to send your message right now.');
        requestError.status = response.status;
        throw requestError;
      }

      return result;
    });

    try {
      return await Promise.race([requestPromise, timeoutPromise]);
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  mailButton.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener('close', () => {
    activeSubmission += 1;
    document.body.classList.remove('contact-modal-open');
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.classList.remove('is-error');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submissionId = ++activeSubmission;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
      website: String(formData.get('website') || ''),
      startedAt: Number(formData.get('startedAt')),
      consent: formData.get('consent') === 'on'
    };

    form.setAttribute('aria-busy', 'true');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    try {
      await sendContactRequest(payload);
      if (submissionId !== activeSubmission || !dialog.open) return;
      showSuccess();
    } catch (error) {
      if (submissionId !== activeSubmission || !dialog.open) return;
      showError(error instanceof Error
        ? error.message
        : 'Unable to send your message right now. Please try again.');
    }
  });
})();
