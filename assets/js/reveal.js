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
      const isPastTrigger = rect.top <= triggerLine;
      const isStillOnScreen = rect.bottom >= 0;

      if (isPastTrigger && isStillOnScreen) {
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

  /* Two frames ensure the hidden state is painted before visible elements are
     released, so the transition is perceptible rather than collapsing into the
     initial render. */
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(requestRevealCheck);
  });
})();

/* Dream 2 ambient animation is intentionally limited to HERO, ABOUT and CONTACT.
   Selected Work remains animation-free. The secondary engine reuses the approved
   sizes, movement, rotation, dust burst and Cartoon Confetti sound preset. */
(() => {
  /* ABOUT uses its visible editorial sheet as the animation host, exactly like
     CONTACT uses contact-box. Previously the host was the entire About section,
     so the opaque about-layout card sat above the animation layer: hit-testing
     still worked, but the flying squares were hidden behind the card. */
  const aboutCard = document.querySelector('#about .about-layout');
  const contactBox = document.querySelector('#contact .contact-box');
  if (!aboutCard || !contactBox) return;

  aboutCard.setAttribute('data-ambient-squares-secondary', 'about');
  contactBox.setAttribute('data-ambient-squares-secondary', 'contact');

  const stackingStyle = document.createElement('style');
  stackingStyle.textContent = `
    .about-layout[data-ambient-squares-secondary="about"] > .about-title,
    .about-layout[data-ambient-squares-secondary="about"] > .about-copy {
      position: relative;
      z-index: 2;
    }
  `;
  document.head.appendChild(stackingStyle);

  if (document.querySelector('script[data-ambient-secondary-loader]')) return;
  const script = document.createElement('script');
  script.src = 'assets/js/ambient-squares-secondary.js?v=20260811-1253';
  script.setAttribute('data-ambient-secondary-loader', 'true');
  document.head.appendChild(script);
})();