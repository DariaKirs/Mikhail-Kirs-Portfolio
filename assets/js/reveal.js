(() => {
  const workContainer = document.querySelector('#work .container');
  if (!workContainer) return;

  workContainer.innerHTML = `
    <div class="section-heading selected-work-heading">
      <div>
        <p class="eyebrow">Selected Work</p>
        <h2>Three directions in<br>visual storytelling.</h2>
      </div>
    </div>

    <div class="work-grid selected-work-grid">
      <article class="card selected-work-card personal-card" style="--category-accent: #C7B6DD;">
        <a class="card-media" href="personal-brand.html" aria-label="Explore Personal Brand Content">
          <img data-b64-src="assets/images/selected-work/personal-card-ultra.b64" alt="Modern professional in a Toronto city setting">
        </a>
        <div class="card-body">
          <h3>Personal Brand Content</h3>
          <p>Visual content that helps people share who they are, what inspires them, and build a recognizable visual brand.</p>
          <a class="card-link" href="personal-brand.html">Explore work <span aria-hidden="true">↗</span></a>
        </div>
      </article>

      <article class="card selected-work-card local-card" style="--category-accent: #7E9C86;">
        <a class="card-media" href="project-forest-city.html" aria-label="Explore Local Business Storytelling">
          <img data-b64-src="assets/images/selected-work/local-card-ultra.b64" alt="Independent shops and local businesses in a covered city arcade">
        </a>
        <div class="card-body">
          <h3>Local Business Storytelling</h3>
          <p>Video content that brings city businesses and places into focus.</p>
          <a class="card-link" href="project-forest-city.html">Explore work <span aria-hidden="true">↗</span></a>
        </div>
      </article>

      <article class="card selected-work-card long-card" style="--category-accent: #D8E9EE;">
        <a class="card-media" href="project-city-storytelling.html" aria-label="Explore Long-Form Visual Storytelling">
          <img src="assets/images/London_Bridge.jpeg" alt="Tower Bridge framed by contemporary London architecture and everyday city life" loading="lazy">
        </a>
        <div class="card-body">
          <h3>Long-Form Visual Storytelling</h3>
          <p>Cinematic video stories inspired by place and atmosphere, informed by history, legends and real life.</p>
          <a class="card-link" href="project-city-storytelling.html">Explore work <span aria-hidden="true">↗</span></a>
        </div>
      </article>
    </div>
  `;

  if (!document.getElementById('selected-work-preview-styles')) {
    const style = document.createElement('style');
    style.id = 'selected-work-preview-styles';
    style.textContent = `
      #work.work-section::before { display: none; }
      #work .selected-work-heading { display:flex; max-width:820px; margin:0 auto clamp(28px,3vw,40px); flex-direction:column; align-items:center; gap:0; text-align:center; }
      #work .selected-work-heading > div { width:100%; }
      #work .selected-work-heading h2 { max-width:760px; margin:0 auto; }
      #work .selected-work-grid { grid-template-columns:repeat(3,minmax(0,1fr)); gap:22px; align-items:stretch; }
      #work .selected-work-card { position:relative; display:flex; min-width:0; flex-direction:column; overflow:hidden; border-top:0; border-color:rgba(184,170,156,.56); border-radius:22px; }
      #work .selected-work-card::before { content:''; display:block; height:8px; flex:0 0 8px; background:var(--category-accent); }
      #work .selected-work-card .card-media { min-height:0; aspect-ratio:4/3; background:#f1ece4; }
      #work .selected-work-card .card-media img { width:100%; height:100%; min-height:0; object-fit:cover; transition:opacity .18s ease, transform .35s ease; }
      #work .selected-work-card .card-media img[data-b64-src] { opacity:0; }
      #work .selected-work-card .card-media img[data-b64-src].is-loaded { opacity:1; }
      #work .personal-card .card-media img { object-position:center 34%; }
      #work .local-card .card-media img { object-position:center center; }
      #work .long-card .card-media img { object-position:center 51%; }
      #work .selected-work-card .card-body { display:flex; flex:1; flex-direction:column; padding:26px 24px 24px; }
      #work .selected-work-card .card-link { margin-top:auto; padding-top:24px; color:var(--text); text-decoration-color:var(--category-accent); }
      @media (max-width:1000px) { #work .selected-work-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media (max-width:700px) { #work .selected-work-heading { margin-bottom:28px; } #work .selected-work-heading h2 br { display:none; } #work .selected-work-grid { grid-template-columns:1fr; gap:20px; } #work .selected-work-card .card-media { aspect-ratio:16/11; } }
    `;
    document.head.appendChild(style);
  }

  document.querySelectorAll('#work img[data-b64-src]').forEach(async (img) => {
    try {
      const response = await fetch(img.dataset.b64Src, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const encoded = (await response.text()).trim();
      img.src = `data:image/webp;base64,${encoded}`;
      img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      if (img.complete) img.classList.add('is-loaded');
    } catch (error) {
      console.error('Selected Work cover failed to load', error);
    }
  });
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
      if (rect.top <= triggerLine && rect.bottom >= 0) element.classList.add('is-visible');
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
  const stackingStyle = document.createElement('style');
  stackingStyle.textContent = `
    #work[data-ambient-squares-secondary="work"] > .container,
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