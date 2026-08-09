(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealGroups = [
    { selector: '.work-section .section-heading > *', stagger: 90 },
    { selector: '.work-section .card', stagger: 120 },
    { selector: '#about .about-title, #about .about-copy', stagger: 120 },
    { selector: '#contact .contact-main, #contact .contact-copy', stagger: 120 }
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

  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -10% 0px'
  });

  elements.forEach((element) => observer.observe(element));
})();
