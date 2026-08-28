(() => {
  if (document.querySelector('script[data-vercel-analytics]')) return;

  const ANALYTICS_OPT_OUT_KEY = 'va-disable';
  const params = new URLSearchParams(window.location.search);
  const analyticsPreference = params.get('analytics');

  if (analyticsPreference === 'off') {
    try {
      localStorage.setItem(ANALYTICS_OPT_OUT_KEY, '1');
    } catch (_) {}
  } else if (analyticsPreference === 'on') {
    try {
      localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
    } catch (_) {}
  }

  if (analyticsPreference === 'off' || analyticsPreference === 'on') {
    params.delete('analytics');
    const query = params.toString();
    history.replaceState(
      null,
      '',
      `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    );
  }

  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  window.va('beforeSend', (event) => {
    try {
      if (localStorage.getItem(ANALYTICS_OPT_OUT_KEY)) return null;
    } catch (_) {}
    return event;
  });

  const analyticsScript = document.createElement('script');
  analyticsScript.src = '/_vercel/insights/script.js';
  analyticsScript.defer = true;
  analyticsScript.dataset.vercelAnalytics = 'true';
  document.head.appendChild(analyticsScript);
})();

(() => {
  if (document.querySelector('script[data-vercel-speed-insights]')) return;

  window.si = window.si || function () {
    (window.siq = window.siq || []).push(arguments);
  };

  const speedInsightsScript = document.createElement('script');
  speedInsightsScript.src = '/_vercel/speed-insights/script.js';
  speedInsightsScript.defer = true;
  speedInsightsScript.dataset.vercelSpeedInsights = 'true';
  document.head.appendChild(speedInsightsScript);
})();

(() => {
  if (!document.body.classList.contains('personal-brand-page')) return;

  const oldPress = document.querySelector('.pb-fixed-press');
  if (oldPress) oldPress.remove();

  const fixedContainer = document.querySelector('.pb-fixed');
  if (!fixedContainer || document.querySelector('.pb-media-wrap')) return;

  if (!document.querySelector('style[data-media-section-preview]')) {
    const style = document.createElement('style');
    style.dataset.mediaSectionPreview = 'true';
    style.textContent = `
      .pb-media-wrap {
        margin-top: 24px;
      }

      .pb-media-section {
        padding: 34px 38px 38px;
        border-radius: var(--radius-md);
        background: #20364a;
        box-shadow: var(--shadow);
      }

      .pb-media-heading {
        margin: 0 0 22px;
        color: var(--coral);
        font-size: .76rem;
        font-weight: 850;
        letter-spacing: .14em;
        text-transform: uppercase;
      }

      .pb-media-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .pb-media-card {
        display: flex;
        min-width: 0;
        min-height: 204px;
        flex-direction: column;
        padding: 22px;
        border-radius: var(--radius-sm);
        background: var(--surface-strong);
      }

      .pb-media-source {
        margin: 0;
        color: var(--coral);
        font-size: .72rem;
        font-weight: 850;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .pb-media-title {
        margin: 10px 0 0;
        color: var(--text);
        font-size: clamp(1.05rem, 1.35vw, 1.25rem);
        font-weight: 800;
        line-height: 1.18;
        letter-spacing: -.025em;
      }

      .pb-media-date {
        margin: 8px 0 0;
        color: var(--muted);
        font-size: .8rem;
        font-weight: 700;
      }

      .pb-media-copy {
        margin: 12px 0 0;
        color: var(--muted);
        font-size: .86rem;
        line-height: 1.45;
      }

      .pb-media-link {
        display: inline-block;
        align-self: flex-start;
        margin-top: auto;
        padding-top: 18px;
        color: var(--coral);
        font-size: .82rem;
        font-weight: 800;
        text-decoration-thickness: 1px;
        text-underline-offset: 4px;
      }

      .pb-media-link:hover,
      .pb-media-link:focus-visible {
        text-decoration-thickness: 2px;
      }

      @media (max-width: 760px) {
        .pb-media-wrap {
          margin-top: 18px;
        }

        .pb-media-section {
          padding: 24px 20px;
        }

        .pb-media-grid {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .pb-media-card {
          min-height: 0;
          padding: 19px 18px;
        }

        .pb-media-title {
          font-size: 19px;
        }

        .pb-media-copy {
          font-size: 15px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const wrap = document.createElement('div');
  wrap.className = 'container pb-media-wrap';
  wrap.innerHTML = `
    <section class="pb-media-section" aria-labelledby="media-title">
      <h2 id="media-title" class="pb-media-heading">IN THE MEDIA</h2>
      <div class="pb-media-grid">
        <article class="pb-media-card">
          <p class="pb-media-source">CBC NEWS</p>
          <h3 class="pb-media-title">“London’s youngest mayoral candidate aims to reach voters through viral videos and social media”</h3>
          <p class="pb-media-date">August 27, 2026</p>
          <p class="pb-media-copy">The article features a campaign video with the credit “Filmed and edited by @mikki.kirs6haa.”</p>
          <a class="pb-media-link" href="https://www.cbc.ca/news/canada/london/london-s-youngest-mayoral-candidate-aims-to-reach-voters-through-viral-videos-and-social-media-9.7321257" target="_blank" rel="noopener noreferrer">VIEW ON CBC NEWS</a>
        </article>

        <article class="pb-media-card">
          <p class="pb-media-source">CBC ARTS</p>
          <h3 class="pb-media-title">“London is liminal”</h3>
          <p class="pb-media-date">August 24, 2026</p>
          <p class="pb-media-copy">Portrait published with the photo credit “Misha Kirs.”</p>
          <a class="pb-media-link" href="https://www.cbc.ca/arts/loiterfest-9.7316003" target="_blank" rel="noopener noreferrer">VIEW ON CBC ARTS</a>
        </article>
      </div>
    </section>
  `;

  fixedContainer.insertAdjacentElement('afterend', wrap);
})();

(async () => {
  const currentScript = document.currentScript;
  if (currentScript) currentScript.dataset.siteFooter = 'true';

  if (document.querySelector('.mk-site-footer')) return;

  const ensureStylesheet = () => new Promise((resolve) => {
    const existing = document.querySelector('link[data-mk-footer-styles]');
    if (existing) {
      if (existing.sheet) resolve();
      else {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', resolve, { once: true });
      }
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/site-footer.css?v=20260825-cleanup1';
    link.dataset.mkFooterStyles = 'true';
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
    document.head.appendChild(link);
  });

  await ensureStylesheet();

  const isHome = /(?:^|\/)index\.html$/.test(location.pathname)
    || location.pathname === '/'
    || location.pathname.endsWith('/');
  const homePrefix = isHome ? '' : 'index.html';
  const INSTAGRAM_URL = 'https://www.instagram.com/mikki.kirs6haa/';

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
          <a href="${INSTAGRAM_URL}" aria-label="Mikhail Kirs on Instagram" title="Instagram">
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

  document
    .querySelectorAll('a[href*="instagram.com/mikki.kirs6haa"], a.instagram')
    .forEach((link) => {
      link.href = INSTAGRAM_URL;
      link.removeAttribute('target');
      link.removeAttribute('rel');
    });

  if (document.body.classList.contains('personal-brand-page')
      && !document.querySelector('script[data-detail-reveal-v2]')) {
    const revealScript = document.createElement('script');
    revealScript.src = 'assets/js/detail-reveal-v2.js?v=20260825-cleanup1';
    revealScript.defer = true;
    revealScript.dataset.detailRevealV2 = 'true';
    document.body.appendChild(revealScript);
  }

  const footerMail = footer.querySelector('.mk-footer-mail');
  if (!footerMail) return;

  const openContact = () => {
    if (typeof window.__MK_OPEN_CONTACT__ !== 'function') return false;
    window.__MK_OPEN_CONTACT__(footerMail);
    return true;
  };

  footerMail.addEventListener('click', () => {
    if (openContact()) return;

    let loader = document.querySelector('script[data-mk-contact-loader]');
    if (!loader) {
      loader = document.createElement('script');
      loader.src = 'assets/js/contact-form-v2.js?v=20260825-cleanup1';
      loader.defer = true;
      loader.dataset.mkContactLoader = 'true';
      document.body.appendChild(loader);
    }

    loader.addEventListener('load', openContact, { once: true });
  });
})();
