(() => {
  const isPersonalBrandPage = document.body.classList.contains('personal-brand-page');
  if (!isPersonalBrandPage) return;

  const isLocalBusinessPage = document.body.classList.contains('local-business-page');
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
