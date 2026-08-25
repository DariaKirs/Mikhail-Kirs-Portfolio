(() => {
  if (document.querySelector('.mk-site-footer')) return;

  const isHome = /(?:^|\/)index\.html$/.test(location.pathname) || location.pathname === '/' || location.pathname.endsWith('/');
  const homePrefix = isHome ? '' : 'index.html';
  const INSTAGRAM_URL = 'https://www.instagram.com/mikki.kirs6haa/';
  const isPersonalBrandPage = document.body.classList.contains('personal-brand-page');
  const isLocalBusinessPage = document.body.classList.contains('local-business-page');

  if (isPersonalBrandPage) {
    document.querySelector('.pb-fixed-official')?.remove();
    document.querySelector('.pb-fixed-selected-title')?.remove();

    const selectedVideos = document.querySelector('.pb-fixed-selected');
    if (selectedVideos && !isLocalBusinessPage) {
      selectedVideos.style.marginTop = '8px';
      selectedVideos.style.paddingTop = '0';
    }

    if (isLocalBusinessPage) {
      const campaign = document.querySelector('.pb-fixed-campaign');
      const metrics = campaign?.querySelector('.pb-fixed-metrics');
      const businessList = document.querySelector('.pb-fixed-selected');

      metrics?.remove();

      if (campaign && businessList) {
        businessList.classList.add('lb-business-list-wrap');
        campaign.appendChild(businessList);
      }

      const viewCounts = ['21.4K', '10.1K', '20K'];
      document.querySelectorAll('.lb-business-list-wrap .pb-fixed-video').forEach((card, index) => {
        card.classList.add('lb-business-card');

        if (!card.querySelector('.lb-business-views')) {
          const views = document.createElement('div');
          views.className = 'lb-business-views';
          views.setAttribute('aria-label', `${viewCounts[index]} views`);
          views.innerHTML = `<strong>${viewCounts[index]}</strong><span>views</span>`;
          card.querySelector('h3')?.insertAdjacentElement('afterend', views);
        }

        const link = card.querySelector('a');
        if (link) { link.textContent = 'WATCH'; link.classList.add('watch-cta', 'watch-instagram'); }
      });

      if (!document.querySelector('style[data-local-business-layout]')) {
        const localBusinessLayout = document.createElement('style');
        localBusinessLayout.dataset.localBusinessLayout = 'true';
        localBusinessLayout.textContent = `
          .local-business-page .pb-fixed-campaign {
            grid-template-columns: minmax(0, 1fr) minmax(340px, .9fr) !important;
            gap: clamp(32px, 4.2vw, 58px) !important;
            align-items: start !important;
          }

          .local-business-page .lb-business-list-wrap {
            min-width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            align-self: start !important;
            border-top: 0 !important;
          }

          .local-business-page .lb-business-list-wrap .pb-fixed-videos {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .local-business-page .lb-business-card {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto !important;
            grid-template-areas:
              "title views"
              "copy copy"
              "link link" !important;
            column-gap: 16px !important;
            row-gap: 0 !important;
            min-width: 0 !important;
            min-height: 0 !important;
            padding: 15px 17px 14px !important;
            border: 1px solid rgba(216, 206, 194, .72) !important;
            border-radius: var(--radius-sm) !important;
            background: var(--surface-strong) !important;
            box-shadow: none !important;
          }

          .local-business-page .lb-business-card h3 {
            grid-area: title !important;
            align-self: center !important;
            margin: 0 !important;
            font-size: 1.04rem !important;
            line-height: 1.14 !important;
            letter-spacing: -.025em !important;
          }

          .local-business-page .lb-business-card:nth-child(1) h3,
          .local-business-page .lb-business-card:nth-child(1) .lb-business-views strong {
            color: var(--purple) !important;
          }

          .local-business-page .lb-business-card:nth-child(2) h3,
          .local-business-page .lb-business-card:nth-child(2) .lb-business-views strong {
            color: var(--coral) !important;
          }

          .local-business-page .lb-business-card:nth-child(3) h3,
          .local-business-page .lb-business-card:nth-child(3) .lb-business-views strong {
            color: var(--green) !important;
          }

          .local-business-page .lb-business-views {
            grid-area: views !important;
            display: flex !important;
            align-items: baseline !important;
            justify-content: flex-end !important;
            gap: 5px !important;
            min-width: max-content !important;
            text-align: right !important;
          }

          .local-business-page .lb-business-views strong {
            display: inline !important;
            margin: 0 !important;
            font-size: clamp(1.35rem, 2vw, 1.72rem) !important;
            line-height: .95 !important;
            letter-spacing: -.045em !important;
            white-space: nowrap !important;
          }

          .local-business-page .lb-business-views span {
            display: inline !important;
            margin: 0 !important;
            color: var(--muted) !important;
            font-size: .7rem !important;
            font-weight: 750 !important;
            line-height: 1 !important;
            text-transform: uppercase !important;
            letter-spacing: .06em !important;
          }

          .local-business-page .lb-business-card p {
            grid-area: copy !important;
            margin: 8px 0 0 !important;
            color: var(--muted) !important;
            font-size: .84rem !important;
            line-height: 1.4 !important;
          }

          .local-business-page .lb-business-card a {
            grid-area: link !important;
            justify-self: start !important;
            align-self: start !important;
            margin: 10px 0 0 !important;
            padding: 0 !important;
            color: var(--purple) !important;
            font-size: .8rem !important;
            font-weight: 800 !important;
            line-height: 1.25 !important;
            text-decoration-thickness: 1px !important;
            text-underline-offset: 4px !important;
          }

          .local-business-page .lb-business-card a:hover,
          .local-business-page .lb-business-card a:focus-visible {
            text-decoration-thickness: 2px !important;
          }

          @media (max-width: 1050px) {
            .local-business-page .pb-fixed-campaign {
              grid-template-columns: 1fr !important;
              gap: 28px !important;
            }

            .local-business-page .lb-business-list-wrap {
              width: 100% !important;
              max-width: 760px !important;
            }
          }

          @media (max-width: 760px) {
            .local-business-page .pb-fixed-campaign {
              gap: 24px !important;
            }

            .local-business-page .lb-business-list-wrap {
              width: 100% !important;
              max-width: none !important;
              margin-top: 0 !important;
            }

            .local-business-page .lb-business-list-wrap .pb-fixed-videos {
              gap: 11px !important;
            }

            .local-business-page .lb-business-card {
              grid-template-columns: minmax(0, 1fr) auto !important;
              padding: 16px 15px 15px !important;
              column-gap: 12px !important;
            }

            .local-business-page .lb-business-card h3 {
              font-size: 19px !important;
            }

            .local-business-page .lb-business-views strong {
              font-size: 1.38rem !important;
            }

            .local-business-page .lb-business-views span {
              font-size: .62rem !important;
            }

            .local-business-page .lb-business-card p {
              font-size: 15px !important;
              line-height: 1.4 !important;
            }

            .local-business-page .lb-business-card a {
              margin-top: 11px !important;
              font-size: 14px !important;
            }
          }
        `;
        document.head.appendChild(localBusinessLayout);
      }
    }

    if (!document.querySelector('style[data-pb-mobile-polish]')) {
      const mobilePolish = document.createElement('style');
      mobilePolish.dataset.pbMobilePolish = 'true';
      mobilePolish.textContent = `
        @media (max-width: 760px) {
          .personal-brand-page .pb-fixed-campaign-label {
            margin-bottom: 20px !important;
          }

          .personal-brand-page .pb-fixed-metric:first-child strong {
            font-size: 0 !important;
          }

          .personal-brand-page .pb-fixed-metric:first-child strong::after {
            content: "seven";
            display: block;
            font-size: clamp(1.28rem, 5.2vw, 1.7rem);
            line-height: .95;
            letter-spacing: -.045em;
            color: #c9a5e7;
          }
        }

        @media (min-width: 1051px) {
          .personal-brand-page .pb-fixed {
            gap: 180px !important;
          }

          .personal-brand-page .pb-fixed-cards {
            column-gap: 13px !important;
            row-gap: 13px !important;
          }
        }
      `;
      document.head.appendChild(mobilePolish);
    }

    const revealGroups = isLocalBusinessPage
      ? [
          { selector: '.pb-fixed-top, .pb-fixed-campaign-shell', stagger: 0 },
          { selector: '.pb-fixed-card', stagger: 140 },
          { selector: '.lb-business-card', stagger: 140 }
        ]
      : [
          { selector: '.pb-fixed-top, .pb-fixed-campaign-shell', stagger: 0 },
          { selector: '.pb-fixed-card', stagger: 140 },
          { selector: '.pb-fixed-metric', stagger: 120 },
          { selector: '.pb-fixed-video', stagger: 140 }
        ];
    const revealElements = [];

    revealGroups.forEach(({ selector, stagger }) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add('scroll-reveal');
        element.style.setProperty('--reveal-delay', `${index * stagger}ms`);
        revealElements.push(element);
      });
    });

    if (revealElements.length) {
      document.documentElement.classList.add('reveal-ready');
      let revealTicking = false;

      const revealVisibleElements = () => {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const triggerLine = viewportHeight * 0.86;

        revealElements.forEach((element) => {
          if (element.classList.contains('is-visible')) return;
          const rect = element.getBoundingClientRect();
          if (rect.top <= triggerLine && rect.bottom >= 0) element.classList.add('is-visible');
        });

        revealTicking = false;
      };

      const requestRevealCheck = () => {
        if (revealTicking) return;
        revealTicking = true;
        window.requestAnimationFrame(revealVisibleElements);
      };

      window.addEventListener('scroll', requestRevealCheck, { passive: true });
      window.addEventListener('resize', requestRevealCheck, { passive: true });
      window.addEventListener('load', requestRevealCheck, { once: true });
      window.requestAnimationFrame(() => window.requestAnimationFrame(requestRevealCheck));
    }
  }

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
        display: block;
        width: 162px;
        height: 32px;
        flex: 0 0 auto;
        background: url("assets/brand/header-brand.svg") no-repeat left center / contain !important;
        color: var(--text) !important;
        text-decoration: none;
      }

      .mk-footer-brand > span,
      .mk-footer-brand .brand-mark {
        display: none !important;
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
        .site-header .nav-links {
          width: 100% !important;
          justify-content: center !important;
          text-align: center;
          overflow-x: visible !important;
        }

        .mk-footer-inner {
          padding: 34px 0 max(42px, calc(28px + env(safe-area-inset-bottom)));
        }

        .mk-footer-main {
          width: 100%;
          flex-direction: column;
          align-items: stretch;
          gap: 28px;
          padding-bottom: 30px;
        }

        .mk-footer-identity {
          width: 100%;
          gap: 20px;
        }

        .mk-footer-brand {
          width: 153px;
          height: 30px;
          align-self: center;
          margin-left: auto;
          margin-right: auto;
          background-position: center !important;
        }

        .mk-footer-nav {
          width: 100%;
          justify-content: center;
          gap: 18px;
          text-align: center;
        }

        .mk-footer-social {
          width: 100%;
          justify-content: center;
          gap: 10px;
        }

        .mk-footer-social a,
        .mk-footer-social button {
          width: 42px;
          height: 42px;
        }

        .mk-footer-bottom {
          width: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding-top: 20px;
          padding-bottom: max(18px, env(safe-area-inset-bottom));
          font-size: .86rem;
          text-align: center;
        }

        .mk-footer-bottom > span {
          display: block;
          width: 100%;
        }

        .mk-site-footer::before {
          width: 170px;
          height: 170px;
          right: -78px;
          top: -74px;
        }

        .mk-site-footer::after {
          width: 120px;
          height: 120px;
          right: -26px;
          bottom: -58px;
        }
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

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="instagram.com/mikki.kirs6haa"], a.instagram');
    if (!link) return;
    event.preventDefault();
    window.location.assign(INSTAGRAM_URL);
  });

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
