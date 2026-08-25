from pathlib import Path
import re

stamp = '20260825-a1-a2-preview2'

footer = Path('assets/js/site-footer.js')
text = footer.read_text()
text = text.replace(
    "if (link) link.textContent = 'Open @forestcityspotlight';",
    "if (link) { link.textContent = 'WATCH ↗'; link.classList.add('watch-cta', 'watch-instagram'); }"
)
footer.write_text(text)

for path in ('personal-brand.html', 'project-forest-city.html', 'project-city-storytelling.html'):
    p = Path(path)
    html = p.read_text()
    html = re.sub(r'assets/js/site-footer\.js\?v=[^"\']+', f'assets/js/site-footer.js?v={stamp}', html)
    p.write_text(html)
