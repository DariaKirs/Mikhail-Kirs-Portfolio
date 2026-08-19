(() => {
  const personalBrandPage = document.querySelector('.personal-brand-page');
  const localBusinessPage = document.querySelector('.local-business-page');
  const page = personalBrandPage || localBusinessPage;
  if (!page) return;

  const revealGroups = personalBrandPage
    ? [
        { selector: '.personal-brand-concept', stagger: 140 },
        { selector: '.personal-brand-boundary-title, .personal-brand-boundary .personal-brand-statement-card', stagger: 130 },
        { selector: '.personal-brand-context-statement, .personal-brand-context .personal-brand-statement-card, .personal-brand-next', stagger: 130 }
      ]
    : [
        { selector: '.local-pair-section:first-of-type .local-wide-card', stagger: 140 },
        { selector: '.local-pair-section + .local-pair-section .local-wide-card, .local-business-page .selected-detail-next', stagger: 140 }
      ];

  const elements = [];

  revealGroups.forEach(({ selector, stagger }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
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
