(() => {
  if (document.querySelector('.mk-site-footer')) return;

  const isHome = /(?:^|\/)index\.html$/.test(location.pathname) || location.pathname === '/' || location.pathname.endsWith('/');
  const homePrefix = isHome ? '' : 'index.html';

  if (!document.querySelector('style[data-mk-footer-styles]')) {
    const style = document.createElement('style');
    style.dataset.mkFooterStyles = 'true';
    style.textContent = `
      .mk-site-footer {
        position: relative;
        overflow: hidden;
        border-top: 1px solid var(--line);
        background: rgba(255, 253, 249, .34);
        color: var(--text);
      }

      .mk-site-footer::before,
      .mk-site-footer::after {
        content: "";
        position: absolute;
        pointer-events: none;
        border-radius: 52px 22px 52px 22px;
        opacity: .12;
      }

      .mk-site-footer::before {
        width: 230px;
        height: 230px;
        right: -78px;
        top: -112px;
        background: var(--mist-blue, #d8e9ee);
        transform: rotate(12deg);
      }

      .mk-site-footer::after {
        width: 170px;
        height: 170px;
        right: 72px;
        bottom: -112px;
        background: #c6a9df;
        transform: rotate(-9deg);
      }

      .mk-footer-inner {
        position: relative;
        z-index: 1;
        padding: 42px 0 28px;
      }

      .mk-footer-main {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 42px;
        padding-bottom: 34px;
      }

      .mk-footer-identity {
        display: grid;
        gap: 24px;
      }

      .mk-footer-brand {
        width: fit-content;
        color: var(--text) !important;
      }

      .mk-footer-brand:hover { opacity: .84; }

      .mk-footer-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
      }

      .mk-footer-nav a {
        color: var(--muted);
        font-size: .98rem;
        font-weight: 700;
        text-decoration: none;
      }

      .mk-footer-nav a:hover,
      .mk-footer-nav a:focus-visible { color: var(--text); }

      .mk-footer-social {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .mk-footer-social a,
      .mk-footer-social button {
        display: inline-flex;
        width: 44px;
        height: 44px;
        padding: 0;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--line-dark);
        border-radius: 999px;
        color: var(--text);
        background: rgba(255, 253, 249, .66);
        font: inherit;
        text-decoration: none;
        cursor: pointer;
        transition: transform .18s ease, border-color .18s ease, background .18s ease;
      }

      .mk-footer-social a:hover,
      .mk-footer-social a:focus-visible,
      .mk-footer-social button:hover,
      .mk-footer-social button:focus-visible {
        transform: translateY(-2px);
        border-color: var(--purple);
        background: var(--surface-strong);
      }

      .mk-footer-social svg {
        width: 20px;
        height: 20px;
        display: block;
      }

      .mk-footer-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
        padding-top: 22px;
        border-top: 1px solid var(--line);
        color: var(--muted);
        font-size: .9rem;
        line-height: 1.5;
      }

      .mk-footer-bottom a {
        color: var(--muted);
        font-weight: 700;
        text-decoration-thickness: 1px;
        text-underline-offset: 4px;
      }

      .mk-footer-bottom a:hover,
      .mk-footer-bottom a:focus-visible { color: var(--purple); }

      @media (max-width: 700px) {
        .mk-footer-inner { padding: 34px 0 24px; }
        .mk-footer-main {
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
          padding-bottom: 28px;
        }
        .mk-footer-identity { gap: 20px; }
        .mk-footer-nav { gap: 18px; }
        .mk-footer-social { gap: 10px; }
        .mk-footer-social a,
        .mk-footer-social button { width: 42px; height: 42px; }
        .mk-footer-bottom {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding-top: 18px;
          font-size: .86rem;
        }
        .mk-site-footer::before { width: 170px; height: 170px; right: -78px; top: -74px; }
        .mk-site-footer::after { width: 120px; height: 120px; right: -26px; bottom: -82px; }
      }
    `;
    document.head.appendChild(style);
  }

  const footer = document.createElement('footer');
  footer.className = 'mk-site-footer';
  footer.innerHTML = `
    <div class="container mk-footer-inner">
      <div class="mk-footer-main">
        <div class="mk-footer-identity">
          <a class="brand mk-footer-brand" href="index.html" aria-label="Mikhail Kirs home">
            <span class="brand-mark" aria-hidden="true">MK</span>
            <span>Mikhail Kirs</span>
          </a>
          <nav class="mk-footer-nav" aria-label="Footer navigation">
            <a href="${homePrefix}#work">Work</a>
            <a href="${homePrefix}#about">About</a>
            <a href="${homePrefix}#contact">Contact</a>
          </nav>
        </div>

        <div class="mk-footer-social" aria-label="Social links">
          <button type="button" class="mk-footer-mail" aria-label="Open contact form for Mikhail Kirs" title="Email">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
          </button>
          <a href="https://www.linkedin.com/in/mikhail-kirs/" target="_blank" rel="noopener noreferrer" aria-label="Mikhail Kirs on LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M5.2 8.4H2.3V21h2.9V8.4ZM3.75 3A1.74 1.74 0 1 0 3.75 6.48 1.74 1.74 0 0 0 3.75 3ZM21.7 13.8c0-3.8-2-5.7-4.7-5.7-2.17 0-3.14 1.2-3.68 2.04V8.4h-2.9V21h2.9v-6.25c0-1.65.31-3.25 2.36-3.25 2.02 0 2.05 1.89 2.05 3.36V21h2.9l.07-7.2Z"/></svg>
          </a>
          <a href="https://instagram.com/mikki.kirs6haa" target="_blank" rel="noopener noreferrer" aria-label="Mikhail Kirs on Instagram" title="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </div>

      <div class="mk-footer-bottom">
        <span>© 2026 Mikhail Kirs. All rights reserved.</span>
        <span>Website by <a href="https://archkirs.site/en" target="_blank" rel="noopener noreferrer">ARCHKIRS</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="privacy.html">Privacy Policy</a></span>
      </div>
    </div>
  `;

  const oldFooter = document.querySelector('.site-footer');
  if (oldFooter) oldFooter.replaceWith(footer);
  else document.body.appendChild(footer);

  const footerMail = footer.querySelector('.mk-footer-mail');
  if (footerMail) {
    footerMail.addEventListener('click', () => {
      const openContact = () => {
        if (typeof window.__MK_OPEN_CONTACT__ === 'function') {
          window.__MK_OPEN_CONTACT__(footerMail);
          return true;
        }
        return false;
      };

      if (openContact()) return;

      let loader = document.querySelector('script[data-mk-contact-loader]');
      if (!loader) {
        loader = document.createElement('script');
        loader.src = 'assets/js/contact-form-v2.js?v=20260820-footer-contact';
        loader.defer = true;
        loader.dataset.mkContactLoader = 'true';
        document.body.appendChild(loader);
      }

      loader.addEventListener('load', () => openContact(), { once: true });
    });
  }
})();
