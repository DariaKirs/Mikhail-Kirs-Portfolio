from pathlib import Path
import re

stamp = '20260825-a1-a2-preview'

shared_css = r'''

/* ========================================================================== */
/* A1 preview — Selected Work previous / next navigation                      */
/* ========================================================================== */
.work-sequence-nav { width: 100%; }
.work-sequence-nav-top { margin: 0 0 22px; }
.work-sequence-nav-bottom { margin: 28px 0 0; }
.work-sequence-inner { display: flex; align-items: stretch; justify-content: space-between; gap: 18px; }
.work-sequence-link {
  --sequence-accent: var(--blue);
  display: grid;
  min-width: 210px;
  max-width: 280px;
  gap: 5px;
  padding: 12px 16px 13px;
  border: 1px solid rgba(184, 170, 156, .62);
  border-bottom: 4px solid var(--sequence-accent);
  border-radius: 18px 8px 18px 8px;
  background: rgba(255, 253, 249, .88);
  color: var(--text);
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(32, 54, 74, .065);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
}
.work-sequence-link.is-back { margin-right: auto; text-align: left; }
.work-sequence-link.is-next { margin-left: auto; text-align: right; }
.work-sequence-action {
  color: var(--sequence-accent);
  font-size: .72rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.work-sequence-name { font-size: 1rem; font-weight: 800; line-height: 1.12; letter-spacing: -.02em; }
@media (hover: hover) and (pointer: fine) {
  .work-sequence-link:hover,
  .work-sequence-link:focus-visible {
    transform: translateY(-2px);
    background: var(--surface-strong);
    box-shadow: 0 14px 28px rgba(32, 54, 74, .10);
  }
}

/* A2 preview — one imperative WATCH action for every video link. */
.watch-cta {
  display: inline-flex !important;
  width: max-content !important;
  min-width: 92px;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  margin-top: auto !important;
  padding: 9px 14px !important;
  border: 1.5px solid currentColor;
  border-radius: 999px;
  font-size: .76rem !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  letter-spacing: .11em;
  text-transform: uppercase;
  text-decoration: none !important;
  text-underline-offset: 0 !important;
  transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
}
.watch-cta.watch-instagram {
  border-color: var(--accent-purple, var(--purple)) !important;
  background: transparent !important;
  color: var(--accent-purple, var(--purple)) !important;
  box-shadow: none !important;
}
.watch-cta.watch-youtube {
  border-color: #C8102E !important;
  background: #C8102E !important;
  color: #fff !important;
  box-shadow: 0 7px 0 rgba(200, 16, 46, .12) !important;
}
@media (hover: hover) and (pointer: fine) {
  .watch-cta:hover,
  .watch-cta:focus-visible { transform: translateY(-1px); }
  .watch-cta.watch-instagram:hover,
  .watch-cta.watch-instagram:focus-visible {
    background: rgba(105, 65, 140, .08) !important;
    color: var(--accent-purple, var(--purple)) !important;
  }
  .watch-cta.watch-youtube:hover,
  .watch-cta.watch-youtube:focus-visible {
    background: #B50E29 !important;
    border-color: #B50E29 !important;
    color: #fff !important;
  }
}
@media (max-width: 700px) {
  .work-sequence-nav-top { margin-bottom: 16px; }
  .work-sequence-nav-bottom { margin-top: 20px; }
  .work-sequence-inner { gap: 10px; }
  .work-sequence-link {
    min-width: 0;
    max-width: calc(50% - 5px);
    flex: 1 1 0;
    padding: 11px 12px 12px;
  }
  .work-sequence-link:only-child {
    width: min(64%, 240px);
    max-width: 240px;
    flex: none;
  }
  .work-sequence-action { font-size: .67rem; }
  .work-sequence-name { font-size: .92rem; }
}
'''

part11 = Path('assets/css/part-11.css')
css = part11.read_text()
if '/* A1 preview — Selected Work previous / next navigation' not in css:
    part11.write_text(css + shared_css)

styles = Path('styles.css')
s = styles.read_text()
s = re.sub(r'@import url\("assets/css/part-11\.css\?v=[^"\']+"\);', f'@import url("assets/css/part-11.css?v={stamp}");', s)
styles.write_text(s)

def bump_styles(path):
    p = Path(path)
    t = p.read_text()
    t = re.sub(r'styles\.css\?v=[^"\']+', f'styles.css?v={stamp}', t)
    p.write_text(t)

personal_next = '''  <nav class="work-sequence-nav work-sequence-nav-top" aria-label="Selected Work section navigation">
    <div class="container work-sequence-inner">
      <a class="work-sequence-link is-next" style="--sequence-accent:#7E9C86" href="project-forest-city.html">
        <span class="work-sequence-action">NEXT <span aria-hidden="true">→</span></span>
        <span class="work-sequence-name">Local Business</span>
      </a>
    </div>
  </nav>\n'''
personal_next_bottom = personal_next.replace('work-sequence-nav-top', 'work-sequence-nav-bottom')

local_nav = '''  <nav class="work-sequence-nav work-sequence-nav-top" aria-label="Selected Work section navigation">
    <div class="container work-sequence-inner">
      <a class="work-sequence-link is-back" style="--sequence-accent:#69418C" href="personal-brand.html">
        <span class="work-sequence-action"><span aria-hidden="true">←</span> BACK</span>
        <span class="work-sequence-name">Personal Brand</span>
      </a>
      <a class="work-sequence-link is-next" style="--sequence-accent:#326E8B" href="project-city-storytelling.html">
        <span class="work-sequence-action">NEXT <span aria-hidden="true">→</span></span>
        <span class="work-sequence-name">Long Form</span>
      </a>
    </div>
  </nav>\n'''
local_nav_bottom = local_nav.replace('work-sequence-nav-top', 'work-sequence-nav-bottom')

long_back = '''  <nav class="work-sequence-nav work-sequence-nav-top" aria-label="Selected Work section navigation">
    <div class="container work-sequence-inner">
      <a class="work-sequence-link is-back" style="--sequence-accent:#7E9C86" href="project-forest-city.html">
        <span class="work-sequence-action"><span aria-hidden="true">←</span> BACK</span>
        <span class="work-sequence-name">Local Business</span>
      </a>
    </div>
  </nav>\n'''
long_back_bottom = long_back.replace('work-sequence-nav-top', 'work-sequence-nav-bottom')

def add_sequence(path, main_open, top, bottom):
    p = Path(path)
    t = p.read_text()
    if 'work-sequence-nav-top' not in t:
        t = t.replace(main_open, main_open + '\n' + top, 1)
        t = t.replace('  </main>', bottom + '  </main>', 1)
    p.write_text(t)

add_sequence('personal-brand.html', '  <main id="main-content" class="personal-brand-main">', personal_next, personal_next_bottom)
add_sequence('project-forest-city.html', '  <main id="main-content" class="personal-brand-main">', local_nav, local_nav_bottom)
add_sequence('project-city-storytelling.html', '  <main id="main-content" class="long-form-main">', long_back, long_back_bottom)

p = Path('personal-brand.html')
t = p.read_text()
t = re.sub(r'<a (href="https://www\.instagram\.com/p/[^"]+" target="_blank" rel="noopener noreferrer")>Watch on Instagram ↗</a>', r'<a class="watch-cta watch-instagram" \1>WATCH ↗</a>', t)
p.write_text(t)

p = Path('project-forest-city.html')
t = p.read_text()
t = re.sub(r'<a (href="https://www\.instagram\.com/p/[^"]+" target="_blank" rel="noopener noreferrer")>Open @forestcityspotlight</a>', r'<a class="watch-cta watch-instagram" \1>WATCH ↗</a>', t)
p.write_text(t)

p = Path('project-city-storytelling.html')
t = p.read_text()
t = re.sub(r'<a (href="https://www\.youtube\.com/watch\?v=[^"]+" target="_blank" rel="noopener noreferrer")>Watch on YouTube ↗</a>', r'<a class="watch-cta watch-youtube" \1>WATCH ↗</a>', t)
p.write_text(t)

for path in ('personal-brand.html', 'project-forest-city.html', 'project-city-storytelling.html'):
    bump_styles(path)

# Keep the preview homepage usable after the image migration.
reveal = Path('assets/js/reveal.js')
js = reveal.read_text()
js = js.replace('data-b64-src="assets/images/selected-work/personal-card-ultra.b64"', 'src="assets/images/selected-work-personal-brand.webp"')
js = js.replace('data-b64-src="assets/images/selected-work/local-card-ultra.b64"', 'src="assets/images/local-business.webp"')
js = js.replace('src="assets/images/London_Bridge.jpeg"', 'src="assets/images/long-form-cover-london-bridge.webp"')
js = re.sub(r'\n\s*document\.querySelectorAll\(\'#work img\[data-b64-src\]\'\)\.forEach\(async \(img\) => \{.*?\n\s*\}\);', '', js, flags=re.S)
reveal.write_text(js)

index = Path('index.html')
it = index.read_text()
it = re.sub(r'assets/js/reveal\.js\?v=[^"\']+', f'assets/js/reveal.js?v={stamp}', it)
index.write_text(it)
