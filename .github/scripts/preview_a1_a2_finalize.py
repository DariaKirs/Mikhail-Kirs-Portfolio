from pathlib import Path
import re

stamp = '20260825-a1-a2-refine3'

# ---------------------------------------------------------------------------
# A1 — replace the card-like Previous / Next controls with lightweight text
# navigation: Switch to <section> + directional arrow.
# ---------------------------------------------------------------------------

def nav_markup(kind):
    if kind == 'personal':
        return '''  <nav class="work-sequence-nav work-sequence-nav-top" aria-label="Selected Work section navigation">
    <div class="container work-sequence-inner">
      <a class="work-sequence-link is-next" style="--sequence-accent:#7E9C86" href="project-forest-city.html">
        <span class="work-sequence-copy">Switch to <strong>Local Business</strong></span>
        <span class="work-sequence-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </nav>\n'''
    if kind == 'local':
        return '''  <nav class="work-sequence-nav work-sequence-nav-top" aria-label="Selected Work section navigation">
    <div class="container work-sequence-inner">
      <a class="work-sequence-link is-back" style="--sequence-accent:#69418C" href="personal-brand.html">
        <span class="work-sequence-arrow" aria-hidden="true">←</span>
        <span class="work-sequence-copy">Switch to <strong>Personal Brand</strong></span>
      </a>
      <a class="work-sequence-link is-next" style="--sequence-accent:#326E8B" href="project-city-storytelling.html">
        <span class="work-sequence-copy">Switch to <strong>Long Form</strong></span>
        <span class="work-sequence-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  </nav>\n'''
    return '''  <nav class="work-sequence-nav work-sequence-nav-top" aria-label="Selected Work section navigation">
    <div class="container work-sequence-inner">
      <a class="work-sequence-link is-back" style="--sequence-accent:#7E9C86" href="project-forest-city.html">
        <span class="work-sequence-arrow" aria-hidden="true">←</span>
        <span class="work-sequence-copy">Switch to <strong>Local Business</strong></span>
      </a>
    </div>
  </nav>\n'''


def replace_nav(path, kind):
    p = Path(path)
    html = p.read_text()
    top = nav_markup(kind)
    bottom = top.replace('work-sequence-nav-top', 'work-sequence-nav-bottom')
    html = re.sub(
        r'  <nav class="work-sequence-nav work-sequence-nav-top".*?</nav>\n',
        top,
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'  <nav class="work-sequence-nav work-sequence-nav-bottom".*?</nav>\n',
        bottom,
        html,
        count=1,
        flags=re.S,
    )
    html = html.replace('WATCH ↗', 'WATCH')
    html = re.sub(r'styles\.css\?v=[^"\']+', f'styles.css?v={stamp}', html)
    html = re.sub(r'assets/js/site-footer\.js\?v=[^"\']+', f'assets/js/site-footer.js?v={stamp}', html)
    p.write_text(html)


replace_nav('personal-brand.html', 'personal')
replace_nav('project-forest-city.html', 'local')
replace_nav('project-city-storytelling.html', 'long')

# Local Business runtime currently rewrites its Instagram links. Keep the
# approved WATCH label when the link is one of our new video CTAs.
footer = Path('assets/js/site-footer.js')
text = footer.read_text()
text = text.replace(
    "if (link) { link.textContent = 'WATCH ↗'; link.classList.add('watch-cta', 'watch-instagram'); }",
    "if (link) { link.textContent = 'WATCH'; link.classList.add('watch-cta', 'watch-instagram'); }"
)
text = text.replace(
    "if (link) link.textContent = 'Open @forestcityspotlight';",
    "if (link) { link.textContent = 'WATCH'; link.classList.add('watch-cta', 'watch-instagram'); }"
)
footer.write_text(text)

# ---------------------------------------------------------------------------
# Replace the first A1/A2 preview styling wholesale so there is one clean
# source of truth for the refined preview.
# ---------------------------------------------------------------------------
part11 = Path('assets/css/part-11.css')
css = part11.read_text()
marker = '/* A1 preview — Selected Work previous / next navigation'
if marker in css:
    css = css.split(marker, 1)[0].rstrip() + '\n\n'

css += r'''/* A1 refined preview — lightweight Selected Work section switching. */
.work-sequence-nav {
  width: 100%;
}

.work-sequence-nav-top {
  margin: 0 0 14px;
}

.work-sequence-nav-bottom {
  margin: 24px 0 0;
}

.work-sequence-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.work-sequence-link {
  --sequence-accent: var(--blue);
  display: inline-flex;
  width: max-content;
  max-width: 48%;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: .96rem;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  box-shadow: none;
}

.work-sequence-link.is-back {
  margin-right: auto;
  text-align: left;
}

.work-sequence-link.is-next {
  margin-left: auto;
  text-align: right;
}

.work-sequence-copy strong {
  color: var(--sequence-accent);
  font-weight: 900;
}

.work-sequence-arrow {
  flex: 0 0 auto;
  color: var(--sequence-accent);
  font-size: 1.35em;
  font-weight: 900;
  line-height: .8;
  transition: transform .18s ease;
}

@media (hover: hover) and (pointer: fine) {
  .work-sequence-link:hover,
  .work-sequence-link:focus-visible {
    color: var(--text);
  }

  .work-sequence-link.is-next:hover .work-sequence-arrow,
  .work-sequence-link.is-next:focus-visible .work-sequence-arrow {
    transform: translateX(4px);
  }

  .work-sequence-link.is-back:hover .work-sequence-arrow,
  .work-sequence-link.is-back:focus-visible .work-sequence-arrow {
    transform: translateX(-4px);
  }
}

/* A2 refined preview — simple imperative WATCH buttons. */
.watch-cta {
  display: inline-flex !important;
  width: max-content !important;
  min-width: 104px !important;
  min-height: 46px !important;
  align-items: center !important;
  justify-content: center !important;
  align-self: flex-start !important;
  margin-top: auto !important;
  padding: 0 20px !important;
  border: 0 !important;
  border-radius: 999px !important;
  color: #fff !important;
  font-size: .8rem !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
  text-decoration: none !important;
  text-underline-offset: 0 !important;
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease !important;
}

/* Instagram — filled social gradient, same pill language as Contact actions. */
html body .watch-cta.watch-instagram,
html body.local-business-page .lb-business-card a.watch-cta.watch-instagram {
  border: 0 !important;
  background: linear-gradient(110deg, #833AB4 0%, #C13584 42%, #E1306C 68%, #F77737 100%) !important;
  color: #fff !important;
  box-shadow: 0 8px 0 rgba(193, 53, 132, .15) !important;
}

/* Long Form — Fanshawe red stays exactly within the approved site palette. */
html body.long-form-page .watch-cta.watch-youtube {
  border: 0 !important;
  background: var(--fanshawe-red, #C8102E) !important;
  color: #fff !important;
  box-shadow: 0 8px 0 rgba(200, 16, 46, .14) !important;
}

/* Give the Long Form film cards enough vertical breathing room for the CTA. */
html body.long-form-page .lf-film-card {
  min-height: 190px !important;
  padding-bottom: 24px !important;
  row-gap: 8px !important;
}

html body.long-form-page .lf-film-card .watch-cta {
  margin-top: 14px !important;
}

@media (hover: hover) and (pointer: fine) {
  html body .watch-cta:hover,
  html body .watch-cta:focus-visible {
    transform: translateY(-2px) !important;
    filter: saturate(1.04) brightness(1.02);
  }

  html body .watch-cta.watch-instagram:hover,
  html body .watch-cta.watch-instagram:focus-visible {
    box-shadow: 0 11px 0 rgba(193, 53, 132, .12) !important;
  }

  html body.long-form-page .watch-cta.watch-youtube:hover,
  html body.long-form-page .watch-cta.watch-youtube:focus-visible {
    box-shadow: 0 11px 0 rgba(200, 16, 46, .11) !important;
  }
}

@media (max-width: 700px) {
  .work-sequence-nav-top {
    margin-bottom: 12px;
  }

  .work-sequence-nav-bottom {
    margin-top: 18px;
  }

  .work-sequence-inner {
    gap: 14px;
  }

  .work-sequence-link {
    max-width: 50%;
    gap: 5px;
    font-size: .84rem;
    line-height: 1.24;
  }

  .work-sequence-link:only-child {
    max-width: 78%;
  }

  .work-sequence-arrow {
    font-size: 1.25em;
  }

  html body.long-form-page .lf-film-card {
    min-height: 0 !important;
    padding-bottom: 22px !important;
  }
}
'''
part11.write_text(css)

# Make sure every page fetches the revised part-11 stylesheet.
styles = Path('styles.css')
s = styles.read_text()
s = re.sub(r'@import url\("assets/css/part-11\.css\?v=[^"\']+"\);', f'@import url("assets/css/part-11.css?v={stamp}");', s)
styles.write_text(s)
