(() => {
  const workContainer = document.querySelector('#work .container');
  if (!workContainer) return;

  const blankPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  workContainer.innerHTML = `
    <div class="section-heading selected-work-heading">
      <div>
        <p class="eyebrow">Selected Work</p>
        <h2>Three directions in<br>visual storytelling.</h2>
      </div>
      <p>Personal Brand Content, Local Business Storytelling and long-form films.</p>
    </div>

    <div class="work-grid selected-work-grid">
      <article class="card selected-work-card personal-card" style="--category-accent:#C7B6DD;">
        <a class="card-media" href="project-mayoral.html" aria-label="Explore Personal Brand Content">
          <img id="personal-brand-cover" src="${blankPixel}" alt="Modern professional in a Toronto city setting">
        </a>
        <div class="card-body">
          <h3>Personal Brand Content</h3>
          <p>Visual content that helps people share who they are, what inspires them, and build a recognizable visual brand.</p>
          <a class="card-link" href="project-mayoral.html">Explore work <span aria-hidden="true">↗</span></a>
        </div>
      </article>

      <article class="card selected-work-card local-card" style="--category-accent:#7E9C86;">
        <a class="card-media" href="project-forest-city.html" aria-label="Explore Local Business Storytelling">
          <img id="local-business-cover" src="${blankPixel}" alt="Independent shops and local businesses in a covered city arcade">
        </a>
        <div class="card-body">
          <h3>Local Business Storytelling</h3>
          <p>Video content that brings city businesses and places into focus.</p>
          <a class="card-link" href="project-forest-city.html">Explore work <span aria-hidden="true">↗</span></a>
        </div>
      </article>

      <article class="card selected-work-card long-card" style="--category-accent:#D8E9EE;">
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

  const hydrateCover = async (id, url) => {
    const img = document.getElementById(id);
    if (!img) return;
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const base64 = (await response.text()).trim();
      img.src = `data:image/webp;base64,${base64}`;
    } catch (error) {
      console.error(`Unable to load ${id}`, error);
    }
  };

  hydrateCover('personal-brand-cover', 'assets/images/selected-work/personal-card-ultra.b64');
  hydrateCover('local-business-cover', 'assets/images/selected-work/local-card-ultra.b64');

  if (!document.getElementById('selected-work-preview-styles')) {
    const style = document.createElement('style');
    style.id = 'selected-work-preview-styles';
    style.textContent = `
      #work.work-section { padding-top:54px; }
      #work.work-section::before { display:none; }
      #work .selected-work-heading { display:flex; max-width:900px; margin:0 auto 38px; flex-direction:column; align-items:center; gap:10px; text-align:center; }
      #work .selected-work-heading > div { width:100%; }
      #work .selected-work-heading .eyebrow { margin:0 0 14px; }
      #work .selected-work-heading h2 { margin:0; font-family:Georgia,'Times New Roman',serif; font-size:clamp(3rem,4.7vw,4.65rem); font-weight:500; line-height:.94; letter-spacing:-.052em; text-wrap:balance; }
      #work .selected-work-heading > p { max-width:760px; margin:9px auto 0; color:var(--muted); font-size:clamp(1rem,1.25vw,1.16rem); line-height:1.42; }
      #work .selected-work-grid { grid-template-columns:repeat(3,minmax(0,1fr)); gap:22px; align-items:stretch; }
      #work .selected-work-card { position:relative; display:flex; min-width:0; flex-direction:column; overflow:hidden; border-top:0; border-color:rgba(184,170,156,.54); border-radius:22px; background:var(--surface); }
      #work .selected-work-card::before { content:''; display:block; height:7px; flex:0 0 7px; background:var(--category-accent); }
      #work .selected-work-card .card-media { min-height:0; aspect-ratio:5/3; background:#ece7df; }
      #work .selected-work-card .card-media img { width:100%; height:100%; min-height:0; object-fit:cover; transition:transform .35s ease; }
      #work .personal-card .card-media img { object-position:center 36%; }
      #work .local-card .card-media img { object-position:center center; }
      #work .long-card .card-media img { object-position:center 54%; }
      #work .selected-work-card .card-body { display:flex; flex:1; flex-direction:column; padding:22px 22px 21px; }
      #work .selected-work-card h3 { font-family:Georgia,'Times New Roman',serif; font-size:clamp(1.55rem,1.85vw,1.95rem); font-weight:500; line-height:1.04; letter-spacing:-.035em; }
      #work .selected-work-card .card-body > p { margin:12px 0 0; color:var(--muted); font-size:.98rem; line-height:1.48; }
      #work .selected-work-card .card-link { margin-top:auto; padding-top:20px; color:var(--text); text-decoration-color:var(--category-accent); text-decoration-thickness:3px; }
      #work .selected-work-card .card-link:hover, #work .selected-work-card .card-link:focus-visible { text-decoration-thickness:4px; }
      @media (max-width:1000px) { #work .selected-work-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media (max-width:700px) {
        #work.work-section { padding-top:44px; }
        #work .selected-work-heading { margin-bottom:32px; }
        #work .selected-work-heading h2 { font-size:clamp(2.55rem,11vw,3.7rem); line-height:.95; }
        #work .selected-work-heading h2 br { display:none; }
        #work .selected-work-grid { grid-template-columns:1fr; gap:20px; }
        #work .selected-work-card .card-media { aspect-ratio:16/10; }
      }
    `;
    document.head.appendChild(style);
  }
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
  const aboutCard = document.querySelector('#about .about-layout');
  const contactBox = document.querySelector('#contact .contact-box');
  if (!aboutCard || !contactBox) return;
  aboutCard.setAttribute('data-ambient-squares-secondary', 'about');
  contactBox.setAttribute('data-ambient-squares-secondary', 'contact');
  const stackingStyle = document.createElement('style');
  stackingStyle.textContent = `.about-layout[data-ambient-squares-secondary="about"] > .about-title, .about-layout[data-ambient-squares-secondary="about"] > .about-copy { position:relative; z-index:2; }`;
  document.head.appendChild(stackingStyle);
  if (document.querySelector('script[data-ambient-secondary-loader]')) return;
  const script = document.createElement('script');
  script.src = 'assets/js/ambient-squares-secondary.js?v=20260811-1253';
  script.setAttribute('data-ambient-secondary-loader', 'true');
  document.head.appendChild(script);
})();