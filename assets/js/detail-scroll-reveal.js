(() => {
  const personalBrandPage = document.querySelector('.personal-brand-page');
  const localBusinessPage = document.querySelector('.local-business-page');
  const page = personalBrandPage || localBusinessPage;
  if (!page) return;

  /* Match the approved Local Business mobile hero treatment on Personal Brand:
     keep the eyebrow left-aligned, but center only the large hero headline on
     screens up to 700px. Desktop and tablet remain untouched. */
  if (personalBrandPage) {
    const mobileHeroStyle = document.createElement('style');
    mobileHeroStyle.textContent = `
      @media (max-width: 700px) {
        .personal-brand-page .personal-brand-question {
          width: 100% !important;
          max-width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
          text-align: center !important;
        }
      }
    `;
    document.head.appendChild(mobileHeroStyle);
  }

  /* The terminal navigation link must always remain visible. It is functional
     navigation, not scroll-reveal content. Keep the same label on both detail
     pages and return to the Selected Work section. */
  if (personalBrandPage) {
    const nextLink = document.querySelector('.personal-brand-next .text-link');
    if (nextLink) {
      nextLink.href = 'index.html#work';
      nextLink.innerHTML = 'See Selected Work <span aria-hidden="true">→</span>';
    }
  }

  const revealGroups = personalBrandPage
    ? [
        { elements: document.querySelectorAll('.personal-brand-concept'), stagger: 140 },
        { elements: document.querySelectorAll('.personal-brand-boundary-title, .personal-brand-boundary .personal-brand-statement-card'), stagger: 130 },
        { elements: document.querySelectorAll('.personal-brand-context-statement, .personal-brand-context .personal-brand-statement-card'), stagger: 130 }
      ]
    : Array.from(document.querySelectorAll('.local-pair-section')).map((section) => ({
        elements: section.querySelectorAll('.local-wide-card'),
        stagger: 140
      }));

  const elements = [];

  revealGroups.forEach(({ elements: groupElements, stagger }) => {
    groupElements.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      element.style.setProperty('--reveal-delay', `${index * stagger}ms`);
      elements.push(element);
    });
  });

  if (!elements.length) return;

  document.documentElement.classList.add('reveal-ready');

  let ticking = false;

  const revealVisibleElements = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const triggerLine = viewportHeight * 0.86;

    elements.forEach((element) => {
      if (element.classList.contains('is-visible')) return;
      const rect = element.getBoundingClientRect();
      if (rect.top <= triggerLine && rect.bottom >= 0) {
        element.classList.add('is-visible');
      }
    });

    ticking = false;
  };

  const requestRevealCheck = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(revealVisibleElements);
  };

  window.addEventListener('scroll', requestRevealCheck, { passive: true });
  window.addEventListener('resize', requestRevealCheck, { passive: true });
  window.addEventListener('load', requestRevealCheck, { once: true });
  window.requestAnimationFrame(() => window.requestAnimationFrame(requestRevealCheck));
})();
