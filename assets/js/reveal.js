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
  const revealGroups = [
    { selector: '.work-section .section-heading > div, .work-section .section-heading > p', stagger: 110 },
    { selector: '.work-section .card', stagger: 140 },
    { selector: '#about .about-title > .eyebrow, #about .about-title > h2, #about .about-portrait-stack', stagger: 110 },
    { selector: '#about .about-copy > .lead, #about .workflow-copy, #about .education-card', stagger: 120 },
    { selector: '#contact .contact-main > .eyebrow, #contact .contact-manifesto span', stagger: 105 },
    { selector: '#contact .contact-prompt, #contact .actions', stagger: 130 }
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

(() => {
  const workSection = document.querySelector('#work');
  const aboutCard = document.querySelector('#about .about-layout');
  const contactBox = document.querySelector('#contact .contact-box');
  if (!workSection || !aboutCard || !contactBox) return;

  workSection.setAttribute('data-ambient-squares-secondary', 'work');
  aboutCard.setAttribute('data-ambient-squares-secondary', 'about');
  contactBox.setAttribute('data-ambient-squares-secondary', 'contact');

  if (document.querySelector('script[data-ambient-secondary-loader]')) return;
  const script = document.createElement('script');
  script.src = 'assets/js/ambient-squares-secondary.js?v=20260825-cleanup1';
  script.dataset.ambientSecondaryLoader = 'true';
  document.head.appendChild(script);
})();
