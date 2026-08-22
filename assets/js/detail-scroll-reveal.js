(() => {
  if (!document.querySelector('script[data-site-footer]')) {
    const footerScript = document.createElement('script');
    footerScript.src = 'assets/js/site-footer.js?v=20260820-footer-preview';
    footerScript.defer = true;
    footerScript.dataset.siteFooter = 'true';
    document.body.appendChild(footerScript);
  }

  const personalBrandPage = document.querySelector('.personal-brand-page');
  const localBusinessPage = document.querySelector('.local-business-page');
  const page = personalBrandPage || localBusinessPage;
  if (!page) return;

  if (personalBrandPage && !document.querySelector('#mayoral-campaign')) {
    const obsoleteNext = document.querySelector('.personal-brand-next');
    if (obsoleteNext) obsoleteNext.remove();

    const style = document.createElement('style');
    style.dataset.personalBrandCampaign = 'true';
    style.textContent = `
      .personal-brand-campaign {
        border-top: 1px solid var(--line);
        padding: 48px 0 54px;
        background: rgba(255, 253, 249, .12);
      }

      .campaign-shell {
        max-width: 1120px;
        margin: 0 auto;
      }

      .campaign-layout {
        display: grid;
        grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
        gap: clamp(40px, 5vw, 64px);
        align-items: start;
      }

      .campaign-eyebrow {
        margin: 0 0 10px;
        color: var(--accent-purple);
        font-size: .78rem;
        font-weight: 780;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .campaign-title {
        max-width: 520px;
        margin: 0;
        font-size: clamp(2.2rem, 3.4vw, 3.4rem);
        line-height: .98;
        letter-spacing: -.045em;
      }

      .campaign-copy {
        max-width: 520px;
        margin-top: 20px;
      }

      .campaign-copy p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.48;
      }

      .campaign-copy p + p { margin-top: 13px; }

      .campaign-role-line {
        margin-top: 17px !important;
        color: var(--accent-purple);
        font-size: 1.08rem !important;
        font-weight: 800;
        line-height: 1.25 !important;
      }

      .campaign-official-link,
      .campaign-video-link {
        color: var(--accent-purple);
        font-weight: 760;
        text-decoration-thickness: 1px;
        text-underline-offset: 4px;
      }

      .campaign-official-link {
        display: inline-flex;
        margin-top: 15px;
        font-size: .92rem;
      }

      .campaign-metrics {
        display: grid;
        grid-template-columns: .72fr .95fr 1.5fr;
        gap: 9px;
        margin-top: 24px;
      }

      .campaign-metric {
        min-width: 0;
        padding: 14px 12px 13px;
        border: 1px solid rgba(184, 170, 156, .48);
        border-radius: 18px 10px 18px 10px;
        background: rgba(255, 253, 249, .6);
      }

      .campaign-number {
        display: block;
        margin-bottom: 5px;
        color: var(--text);
        font-size: 1.72rem;
        font-weight: 840;
        line-height: 1;
        letter-spacing: -.045em;
        white-space: nowrap;
      }

      .campaign-metric:last-child .campaign-number {
        color: var(--muted-green);
        font-size: 1.38rem;
      }

      .campaign-metric:nth-child(2) .campaign-number { color: var(--dusty-rose); }
      .campaign-metric:first-child .campaign-number { color: var(--accent-purple); }

      .campaign-metric-label {
        display: block;
        font-size: .72rem;
        font-weight: 650;
        line-height: 1.2;
      }

      .campaign-metric-note {
        margin: 9px 0 0;
        color: var(--muted, #65717a);
        font-size: .74rem;
        line-height: 1.35;
      }

      .campaign-selected-title {
        margin: 0 0 12px;
        font-size: 1.3rem;
        line-height: 1.1;
        letter-spacing: -.025em;
      }

      .campaign-video-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .campaign-video-card {
        --video-accent: var(--accent-purple);
        min-height: 168px;
        padding: 18px 18px 16px;
        border: 1px solid rgba(184, 170, 156, .45);
        border-left: 3px solid var(--video-accent);
        border-radius: 17px 9px 17px 9px;
        background: rgba(255, 253, 249, .54);
        display: flex;
        flex-direction: column;
      }

      .campaign-video-card:nth-child(1) { --video-accent: var(--dusty-rose); }
      .campaign-video-card:nth-child(2) { --video-accent: var(--button-blue); }
      .campaign-video-card:nth-child(3) { --video-accent: var(--muted-green); }
      .campaign-video-card:nth-child(4) { --video-accent: var(--accent-purple); }

      .campaign-video-title {
        margin: 0;
        color: var(--text);
        font-size: 1.08rem;
        line-height: 1.12;
        letter-spacing: -.025em;
      }

      .campaign-video-copy {
        margin: 9px 0 13px;
        font-size: .88rem;
        line-height: 1.4;
      }

      .campaign-video-link {
        margin-top: auto;
        color: var(--video-accent);
        font-size: .82rem;
      }

      @media (max-width: 900px) {
        .campaign-layout { grid-template-columns: 1fr; gap: 34px; }
        .campaign-copy { max-width: 680px; }
        .campaign-metrics { max-width: 620px; }
      }

      @media (max-width: 700px) {
        .personal-brand-campaign { padding: 34px 0 40px; }
        .campaign-shell { width: min(calc(100% - 28px), 1120px); }
        .campaign-layout { gap: 28px; }
        .campaign-eyebrow { font-size: .72rem; }
        .campaign-title { font-size: 34px; }
        .campaign-copy { margin-top: 15px; }
        .campaign-copy p { font-size: 16px; line-height: 1.45; }
        .campaign-role-line { font-size: 17px !important; }
        .campaign-metrics {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 20px;
        }
        .campaign-metric:last-child { grid-column: 1 / -1; }
        .campaign-number { font-size: 1.55rem; }
        .campaign-metric:last-child .campaign-number { font-size: 1.32rem; }
        .campaign-video-grid { grid-template-columns: 1fr; gap: 10px; }
        .campaign-video-card { min-height: 0; padding: 16px 16px 14px; }
        .campaign-video-copy { font-size: .86rem; }
      }
    `;
    document.head.appendChild(style);

    const section = document.createElement('section');
    section.id = 'mayoral-campaign';
    section.className = 'personal-brand-campaign';
    section.innerHTML = `
      <div class="container campaign-shell">
        <div class="campaign-layout">
          <div class="campaign-info">
            <p class="campaign-eyebrow">2026 Municipal Campaign · London, Ontario</p>
            <h2 class="campaign-title">Mustafa Zebuun for Mayor</h2>

            <div class="campaign-copy">
              <p>In London’s 2026 municipal election, I joined the Mustafa Zebuun for Mayor campaign at an early stage.</p>
              <p>My work focuses on filming, editing, and turning campaign topics into clear visual stories for social media — from transit and downtown issues to housing, homelessness, and support for local business.</p>
              <p class="campaign-role-line">Filming. Editing. Short-form storytelling.</p>
              <a class="campaign-official-link" href="https://zebuunformayor.ca/" target="_blank" rel="noopener noreferrer">Official campaign ↗</a>
            </div>

            <div class="campaign-metrics" aria-label="Campaign content metrics">
              <div class="campaign-metric">
                <span class="campaign-number">7</span>
                <span class="campaign-metric-label">campaign videos</span>
              </div>
              <div class="campaign-metric">
                <span class="campaign-number">291.1K+</span>
                <span class="campaign-metric-label">combined views</span>
              </div>
              <div class="campaign-metric">
                <span class="campaign-number">~400 → 1,583</span>
                <span class="campaign-metric-label">followers during my involvement</span>
              </div>
            </div>
            <p class="campaign-metric-note">Metrics as of August 21, 2026.</p>
          </div>

          <div class="campaign-selected">
            <h3 class="campaign-selected-title">Selected videos</h3>
            <div class="campaign-video-grid">
              <article class="campaign-video-card">
                <h4 class="campaign-video-title">Downtown Vacancies</h4>
                <p class="campaign-video-copy">Vacant commercial spaces, downtown renewal, and putting underused properties back into local circulation.</p>
                <a class="campaign-video-link" href="https://www.instagram.com/p/Da0gmFlxtAY/" target="_blank" rel="noopener noreferrer">Watch on Instagram ↗</a>
              </article>

              <article class="campaign-video-card">
                <h4 class="campaign-video-title">Public Transit</h4>
                <p class="campaign-video-copy">Bus frequency, transfers, safer stops, and practical ways to make London’s transit network easier to use. My first video for the campaign.</p>
                <a class="campaign-video-link" href="https://www.instagram.com/p/DaY0s2gJnj0/" target="_blank" rel="noopener noreferrer">Watch on Instagram ↗</a>
              </article>

              <article class="campaign-video-card">
                <h4 class="campaign-video-title">Supporting Local Business</h4>
                <p class="campaign-video-copy">A campaign message about supporting local businesses — and the launch of the idea that later became Forest City Spotlight.</p>
                <a class="campaign-video-link" href="https://www.instagram.com/p/Da33pq7pqfD/" target="_blank" rel="noopener noreferrer">Watch on Instagram ↗</a>
              </article>

              <article class="campaign-video-card">
                <h4 class="campaign-video-title">Homelessness &amp; Housing Stability</h4>
                <p class="campaign-video-copy">A four-minute social video on prevention, shelters, supportive housing, and pathways toward housing stability — a deliberately longer format that still reached a strong audience.</p>
                <a class="campaign-video-link" href="https://www.instagram.com/p/Dbe30p5gih1/" target="_blank" rel="noopener noreferrer">Watch on Instagram ↗</a>
              </article>
            </div>
          </div>
        </div>
      </div>
    `;

    const contextSection = document.querySelector('.personal-brand-context');
    if (contextSection) contextSection.insertAdjacentElement('afterend', section);
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
