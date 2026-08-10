(() => {
  const cssHref = 'assets/css/contact-form.css?v=20260810-1205';

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
  mailButton.className = existingMailLink.className;
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
      <h2 class="contact-modal-title" id="contact-dialog-title">Tell me about your project.</h2>
      <p class="contact-modal-intro">Share a few details and I’ll get back to you.</p>

      <form class="contact-form" id="contact-form" novalidate>
        <fieldset class="contact-form-fields">
          <div class="contact-field">
            <label for="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" autocomplete="name" minlength="2" maxlength="80" required>
          </div>

          <div class="contact-field">
            <label for="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required>
          </div>

          <div class="contact-field">
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

        <div class="contact-success" hidden>
          <strong>Thanks — your message has been sent.</strong>
          <p>Mikhail will reply to the email address you provided.</p>
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

  const form = dialog.querySelector('#contact-form');
  const fieldset = dialog.querySelector('.contact-form-fields');
  const status = dialog.querySelector('.contact-form-status');
  const success = dialog.querySelector('.contact-success');
  const submitButton = dialog.querySelector('.contact-submit');
  const closeButton = dialog.querySelector('.contact-modal-close');
  const nameInput = dialog.querySelector('#contact-name');
  const startedAtInput = dialog.querySelector('#contact-started-at');

  let returnFocus = mailButton;

  const resetFormState = () => {
    form.reset();
    fieldset.hidden = false;
    success.hidden = true;
    status.textContent = '';
    submitButton.disabled = false;
    submitButton.textContent = 'Send message';
    startedAtInput.value = String(Date.now());
  };

  const openDialog = () => {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : mailButton;
    resetFormState();
    document.body.classList.add('contact-modal-open');
    dialog.showModal();
    window.requestAnimationFrame(() => nameInput.focus());
  };

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  mailButton.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('contact-modal-open');
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
      website: String(formData.get('website') || ''),
      startedAt: Number(formData.get('startedAt')),
      consent: formData.get('consent') === 'on'
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Unable to send your message right now.');
      }

      fieldset.hidden = true;
      status.textContent = '';
      success.hidden = false;
    } catch (error) {
      status.textContent = error instanceof Error
        ? error.message
        : 'Unable to send your message right now. Please try again.';
      submitButton.disabled = false;
      submitButton.textContent = 'Send message';
    }
  });
})();
