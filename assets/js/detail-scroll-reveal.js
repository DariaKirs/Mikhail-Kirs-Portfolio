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
    const style = document.createElement('style');
    style.dataset.personalBrandCampaign = 'true';
    style.textContent = `
      .personal-brand-campaign {
        position: relative;
        overflow: hidden;
        border-top: 1px solid var(--line);
        padding: 86px 0 92px;
        background: rgba(255, 253, 249, .18);
      }

      .personal-brand-campaign::before,
      .personal-brand-campaign::after {
        content: "";
        position: absolute;
        pointer-events: none;
        border-radius: 52px 24px 52px 24px;
        opacity: .1;
      }

      .personal-brand-campaign::before {
        width: 320px;
        height: 320px;
        right: -110px;
        top: 130px;
        background: var(--mist-blue, #d8e9ee);
        transform: rotate(12deg);
      }

      .personal-brand-campaign::after {
        width: 240px;
        height: 240px;
        left: -110px;
        bottom: 170px;
        background: var(--soft-lilac, #d9c7e8);
        transform: rotate(-10deg);
      }

      .campaign-shell {
        position: relative;
        z-index: 1;
        max-width: 1120px;
        margin: 0 auto;
      }

      .campaign-eyebrow {
        margin: 0 0 18px;
        color: var(--accent-purple);
        font-size: .95rem;
        font-weight: 750;
        letter-spacing: .13em;
        text-transform: uppercase;
      }

      .campaign-title {
        max-width: 820px;
        margin: 0;
        font-size: clamp(3.2rem, 6vw, 6rem);
        line-height: .94;
        letter-spacing: -.058em;
        text-wrap: balance;
      }

      .campaign-intro-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(340px, .85fr);
        gap: clamp(54px, 7vw, 92px);
        margin-top: 48px;
        align-items: start;
      }

      .campaign-copy {
        max-width: 690px;
      }

      .campaign-copy p {
        margin: 0;
        font-size: clamp(1.2rem, 1.8vw, 1.48rem);
        line-height: 1.48;
      }

      .campaign-copy p + p { margin-top: 20px; }

      .campaign-role-line {
        margin-top: 30px !important;
        color: var(--accent-purple);
        font-size: clamp(1.55rem, 2.5vw, 2.3rem) !important;
        font-weight: 800;
        line-height: 1.08 !important;
        letter-spacing: -.035em;
      }

      .campaign-official-link {
        display: inline-flex;
        margin-top: 26px;
        color: var(--accent-purple);
        font-weight: 760;
        text-decoration-thickness: 1px;
        text-underline-offset: 5px;
      }

      .campaign-role-card {
        position: relative;
        isolation: isolate;
        padding: 34px 34px 32px;
        border: 1px solid rgba(184, 170, 156, .48);
        border-radius: 32px 17px 32px 17px;
        background: var(--surface-strong);
        box-shadow: 0 18px 38px rgba(32, 54, 74, .08);
      }

      .campaign-role-card::before {
        content: "";
        position: absolute;
        z-index: -1;
        inset: 0;
        border-radius: inherit;
        background: var(--soft-lilac);
        transform: translate(15px, 14px) rotate(2.1deg);
      }

      .campaign-role-card .label {
        margin: 0 0 14px;
        color: var(--accent-purple);
        font-size: .82rem;
        font-weight: 800;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .campaign-role-card p {
        margin: 0;
        color: var(--accent-purple);
        font-size: clamp(1.08rem, 1.45vw, 1.3rem);
        font-weight: 620;
        line-height: 1.42;
      }

      .campaign-metrics {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        margin-top: 70px;
      }

      .campaign-metric {
        min-height: 174px;
        padding: 28px 26px;
        border: 1px solid rgba(184, 170, 156, .48);
        border-radius: 28px 15px 28px 15px;
        background: rgba(255, 253, 249, .62);
      }

      .campaign-metric:nth-child(1) .campaign-number { color: var(--accent-purple); }
      .campaign-metric:nth-child(2) .campaign-number { color: var(--dusty-rose); }
      .campaign-metric:nth-child(3) .campaign-number { color: var(--muted-green); }

      .campaign-number {
        display: block;
        margin-bottom: 10px;
        font-size: clamp(2.6rem, 4vw, 4.15rem);
        font-weight: 850;
        line-height: .95;
        letter-spacing: -.055em;
      }

      .campaign-metric-label {
        display: block;
        max-width: 230px;
        font-size: 1rem;
        font-weight: 650;
        line-height: 1.3;
      }

      .campaign-metric-note {
        margin: 14px 0 0;
        color: var(--muted, #65717a);
        font-size: .88rem;
      }

      .campaign-selected {
        margin-top: 92px;
        padding-top: 62px;
        border-top: 1px solid var(--line);
      }

      .campaign-selected-head {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 36px;
        margin-bottom: 38px;
      }

      .campaign-selected-title {
        margin: 0;
        font-size: clamp(2.5rem, 4.3vw, 4.4rem);
        line-height: .96;
        letter-spacing: -.052em;
      }

      .campaign-selected-note {
        max-width: 360px;
        margin: 0;
        color: var(--muted, #65717a);
        font-size: 1rem;
        line-height: 1.45;
      }

      .campaign-video-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px 30px;
      }

      .campaign-video-card {
        --video-accent: var(--accent-purple);
        position: relative;
        isolation: isolate;
        min-height: 300px;
        padding: 34px 34px 30px;
        border: 1px solid rgba(184, 170, 156, .48);
        border-radius: 34px 18px 34px 18px;
        background: var(--surface-strong);
        box-shadow: 0 18px 36px rgba(32, 54, 74, .07);
        display: flex;
        flex-direction: column;
      }

      .campaign-video-card::before {
        content: "";
        position: absolute;
        z-index: -1;
        inset: 0;
        border-radius: inherit;
        background: var(--video-accent);
        transform: translate(-10px, -9px) rotate(-1.2deg);
      }

      .campaign-video-card:nth-child(even)::before {
        transform: translate(10px, 9px) rotate(1.2deg);
      }

      .campaign-video-card:nth-child(1) { --video-accent: var(--dusty-rose); }
      .campaign-video-card:nth-child(2) { --video-accent: var(--button-blue); }
      .campaign-video-card:nth-child(3) { --video-accent: var(--muted-green); }
      .campaign-video-card:nth-child(4) { --video-accent: var(--accent-purple); }

      .campaign-video-meta {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 24px;
      }

      .campaign-video-index {
        color: var(--video-accent);
        font-size: .82rem;
        font-weight: 800;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .campaign-video-views {
        color: var(--video-accent);
        font-size: 1.05rem;
        font-weight: 800;
      }

      .campaign-video-title {
        margin: 0;
        font-size: clamp(1.9rem, 3vw, 2.8rem);
        line-height: 1;
        letter-spacing: -.045em;
      }

      .campaign-video-copy {
        margin: 18px 0 28px;
        font-size: 1.03rem;
        line-height: 1.46;
      }

      .campaign-video-link {
        margin-top: auto;
        color: var(--video-accent);
        font-weight: 800;
        text-decoration-thickness: 1px;
        text-underline-offset: 5px;
      }

      .campaign-bridge {
        display: grid;
        grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
        gap: clamp(44px, 7vw, 84px);
        margin-top: 92px;
        padding: 54px 0 0;
        border-top: 1px solid var(--line);
        align-items: start;
      }

      .campaign-bridge h3 {
        margin: 0;
        color: var(--muted-green);
        font-size: clamp(2.25rem, 4vw, 3.9rem);
        line-height: .98;
        letter-spacing: -.05em;
      }

      .campaign-bridge-copy {
        max-width: 620px;
      }

      .campaign-bridge-copy p {
        margin: 0;
        font-size: clamp(1.15rem, 1.7vw, 1.38rem);
        line-height: 1.48;
      }

      .campaign-bridge-kicker {
        display: inline-block;
        margin-top: 22px;
        color: var(--muted-green);
        font-size: .9rem;
        font-weight: 800;
        letter-spacing: .1em;
        text-transform: uppercase;
      }

      @media (max-width: 900px) {
        .campaign-intro-grid,
        .campaign-bridge { grid-template-columns: 1fr; }
        .campaign-role-card { max-width: 560px; }
        .campaign-selected-head { display: block; }
        .campaign-selected-note { margin-top: 18px; }
      }

      @media (max-width: 700px) {
        .personal-brand-campaign { padding: 56px 0 62px; }
        .campaign-shell { width: min(calc(100% - 32px), 1120px); }
        .campaign-eyebrow { margin-bottom: 13px; font-size: .8rem; }
        .campaign-title { font-size: 42px; line-height: .96; }
        .campaign-intro-grid { gap: 28px; margin-top: 30px; }
        .campaign-copy p { font-size: 18px; line-height: 1.46; }
        .campaign-role-line { margin-top: 22px !important; font-size: 26px !important; }
        .campaign-role-card { padding: 26px 24px 24px; border-radius: 26px 14px 26px 14px; }
        .campaign-role-card::before { transform: translate(7px, 6px) rotate(1.1deg); }
        .campaign-metrics { grid-template-columns: 1fr; gap: 14px; margin-top: 46px; }
        .campaign-metric { min-height: 0; padding: 24px 22px; }
        .campaign-number { font-size: 46px; }
        .campaign-selected { margin-top: 58px; padding-top: 40px; }
        .campaign-selected-title { font-size: 34px; }
        .campaign-video-grid { grid-template-columns: 1fr; gap: 24px; }
        .campaign-video-card { min-height: 0; padding: 28px 26px 25px; border-radius: 28px 15px 28px 15px; }
        .campaign-video-card::before,
        .campaign-video-card:nth-child(even)::before { transform: translate(-7px, -6px) rotate(-1deg); }
        .campaign-video-card:nth-child(even)::before { transform: translate(7px, 6px) rotate(1deg); }
        .campaign-video-title { font-size: 31px; }
        .campaign-bridge { gap: 22px; margin-top: 58px; padding-top: 40px; }
        .campaign-bridge h3 { font-size: 34px; }
        .campaign-bridge-copy p { font-size: 18px; }
      }
    `;
    document.head.appendChild(style);

    const section = document.createElement('section');
    section.id = 'mayoral-campaign';
    section.className = 'personal-brand-campaign';
    section.innerHTML = `
      <div class="container campaign-shell">
        <div class="campaign-intro">
          <p class="campaign-eyebrow">2026 Municipal Campaign · London, Ontario</p>
          <h2 class="campaign-title">Mustafa Zebuun for Mayor</h2>
        </div>

        <div class="campaign-intro-grid">
          <div class="campaign-copy">
            <p>In London’s 2026 municipal election, I joined the Mustafa Zebuun for Mayor campaign at an early stage.</p>
            <p>My work focuses on filming, editing, and turning campaign topics into clear visual stories for social media — from transit and downtown issues to housing, homelessness, and support for local business.</p>
            <p class="campaign-role-line">Filming. Editing. Short-form storytelling.</p>
            <a class="campaign-official-link" href="https://zebuunformayor.ca/" target="_blank" rel="noopener noreferrer">Official campaign ↗</a>
          </div>

          <aside class="campaign-role-card">
            <p class="label">My role</p>
            <p>Video production for public-facing campaign communication: filming, editing, visual pacing, and social-first storytelling.</p>
          </aside>
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

        <div class="campaign-selected">
          <div class="campaign-selected-head">
            <h3 class="campaign-selected-title">Selected videos</h3>
            <p class="campaign-selected-note">Four pieces that show the range of the work — reach, subject matter, and format.</p>
          </div>

          <div class="campaign-video-grid">
            <article class="campaign-video-card">
              <div class="campaign-video-meta">
                <span class="campaign-video-index">01 · Downtown</span>
                <span class="campaign-video-views">97.8K views</span>
              </div>
              <h4 class="campaign-video-title">Downtown Vacancies</h4>
              <p class="campaign-video-copy">Vacant commercial spaces, downtown renewal, and putting underused properties back into local circulation.</p>
              <a class="campaign-video-link" href="https://www.instagram.com/p/Da0gmFlxtAY/" target="_blank" rel="noopener noreferrer">Watch on Instagram ↗</a>
            </article>

            <article class="campaign-video-card">
              <div class="campaign-video-meta">
                <span class="campaign-video-index">02 · Transit</span>
                <span class="campaign-video-views">76.2K views</span>
              </div>
              <h4 class="campaign-video-title">Public Transit</h4>
              <p class="campaign-video-copy">Bus frequency, transfers, safer stops, and practical ways to make London’s transit network easier to use. My first video for the campaign.</p>
              <a class="campaign-video-link" href="https://www.instagram.com/p/DaY0s2gJnj0/" target="_blank" rel="noopener noreferrer">Watch on Instagram ↗</a>
            </article>

            <article class="campaign-video-card">
              <div class="campaign-video-meta">
                <span class="campaign-video-index">03 · Local business</span>
                <span class="campaign-video-views">37.4K views</span>
              </div>
              <h4 class="campaign-video-title">Supporting Local Business</h4>
              <p class="campaign-video-copy">A campaign message about supporting local businesses — and the launch of the idea that later became Forest City Spotlight.</p>
              <a class="campaign-video-link" href="https://www.instagram.com/p/Da33pq7pqfD/" target="_blank" rel="noopener noreferrer">Watch on Instagram ↗</a>
            </article>

            <article class="campaign-video-card">
              <div class="campaign-video-meta">
                <span class="campaign-video-index">04 · Long-form</span>
                <span class="campaign-video-views">14.3K views</span>
              </div>
              <h4 class="campaign-video-title">Homelessness &amp; Housing Stability</h4>
              <p class="campaign-video-copy">A four-minute social video on prevention, shelters, supportive housing, and pathways toward housing stability — a deliberately longer format that still reached a strong audience.</p>
              <a class="campaign-video-link" href="https://www.instagram.com/p/Dbe30p5gih1/" target="_blank" rel="noopener noreferrer">Watch on Instagram ↗</a>
            </article>
          </div>
        </div>

        <div class="campaign-bridge">
          <h3>From campaign content to local stories</h3>
          <div class="campaign-bridge-copy">
            <p>Forest City Spotlight began as an idea inside the mayoral campaign and developed into a separate storytelling series focused on London’s local businesses.</p>
            <span class="campaign-bridge-kicker">Next chapter · Local Businesses</span>
          </div>
        </div>
      </div>
    `;

    const contextSection = document.querySelector('.personal-brand-context');
    if (contextSection) contextSection.insertAdjacentElement('afterend', section);

    const nextLink = document.querySelector('.personal-brand-next .text-link');
    if (nextLink) {
      nextLink.href = '#mayoral-campaign';
      nextLink.innerHTML = 'See selected work <span aria-hidden="true">↓</span>';
    }
  }

  const revealGroups = personalBrandPage
    ? [
        { elements: document.querySelectorAll('.personal-brand-concept'), stagger: 140 },
        { elements: document.querySelectorAll('.personal-brand-boundary-title, .personal-brand-boundary .personal-brand-statement-card'), stagger: 130 },
        { elements: document.querySelectorAll('.personal-brand-context-statement, .personal-brand-context .personal-brand-statement-card'), stagger: 130 },
        { elements: document.querySelectorAll('.campaign-intro, .campaign-copy, .campaign-role-card'), stagger: 110 },
        { elements: document.querySelectorAll('.campaign-metric'), stagger: 110 },
        { elements: document.querySelectorAll('.campaign-video-card'), stagger: 120 },
        { elements: document.querySelectorAll('.campaign-bridge > *'), stagger: 120 }
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