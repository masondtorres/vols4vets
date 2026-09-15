#!/usr/bin/env python3
"""Apply the rebuilt chrome, fonts, and SEO head to every HTML page."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

CRISIS_HEADER = '''<a class="skip-link" href="#main">Skip to main content</a>
<div class="crisis-bar" role="region" aria-label="Veteran crisis help">
  <div class="crisis-inner">
    <p class="crisis-copy"><strong>Veteran in crisis or worried about one?</strong> Call 988, then press 1. Text 838255. If there is immediate danger, call 911.</p>
    <div class="crisis-actions">
      <a class="crisis-btn" href="tel:988">Call 988, then press 1</a>
      <a class="crisis-btn" href="sms:838255">Text 838255</a>
      <a class="crisis-btn crisis-btn-911" href="tel:911">Call 911 if in immediate danger</a>
    </div>
  </div>
</div>
<header class="site-header">
  <div class="nav-wrap">
    <a class="brand" href="/">
      <img class="brand-mark" src="/brand-mark.webp" alt="Vols4Vets" width="46" height="46">
      <span class="brand-text"><span class="brand-name">Vols4Vets</span><span class="brand-tag">Veteran Resource Guide</span></span>
    </a>
    <form class="header-search" action="/search" method="get" role="search">
      <label class="sr-only" for="nav-search">Search resources</label>
      <input id="nav-search" name="q" type="search" placeholder="Search DD214, VA, housing, jobs…">
      <button type="submit">Search</button>
    </form>
    <button class="nav-toggle" type="button" aria-controls="main-nav" aria-expanded="false" data-nav-toggle>Menu</button>
    <nav id="main-nav" class="main-nav" aria-label="Main navigation">
      <a href="/find-my-next-step">Start</a>
      <a href="/search">Search</a>
      <a href="/resources">Resources</a>
      <a href="/sections">Book sections</a>
      <a href="/sections/east-tennessee-and-the-smokies">East Tennessee</a>
      <a href="/about">About</a>
      <a class="nav-cta" href="/find-my-next-step">Find my next step</a>
    </nav>
  </div>
</header>'''

FOOTER = '''<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="/">
          <img class="brand-mark" src="/brand-mark.webp" alt="Vols4Vets" width="46" height="46">
          <span class="brand-text"><span class="brand-name">Vols4Vets</span><span class="brand-tag">Veteran Resource Guide</span></span>
        </a>
        <p>Independent veteran resource routing from Sevierville, Tennessee. Vols4Vets is not the VA, not a crisis line, not a law firm, not a medical provider, not a benefits office and not an accredited claims representative.</p>
      </div>
      <div>
        <h3>Start</h3>
        <ul class="footer-links">
          <li><a href="/find-my-next-step">Find my next step</a></li>
          <li><a href="/search">Search</a></li>
          <li><a href="/resources">Resources</a></li>
          <li><a href="/sections">Book sections</a></li>
          <li><a href="/sections/start-here-when-it-is-urgent">Urgent help</a></li>
        </ul>
      </div>
      <div>
        <h3>Local</h3>
        <ul class="footer-links">
          <li><a href="/sections/east-tennessee-and-the-smokies">East Tennessee</a></li>
          <li><a href="/sevier-county-veteran-resources">Sevier County</a></li>
          <li><a href="/knoxville-veteran-resources">Knoxville</a></li>
          <li><a href="/mountain-home-va-guide">Mountain Home VA</a></li>
          <li><a href="/about">About and contact</a></li>
        </ul>
      </div>
      <div>
        <h3>Trust</h3>
        <ul class="footer-links">
          <li><a href="/verification-policy">Verification policy</a></li>
          <li><a href="/privacy-safety">Privacy and safety</a></li>
          <li><a href="/no-claims-representation">No claims representation</a></li>
          <li><a href="/correction-request">Correction request</a></li>
          <li><a href="/monthly-update-log">Monthly update log</a></li>
          <li><a href="/crisis-emergency-disclaimer">Crisis disclaimer</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">&copy; 2026 Vols4Vets LLC. Verify current information directly with each official source before you drive, apply, call or send records.</div>
  </div>
</footer>'''

HEAD_SNIPPETS = [
    ('<link rel="icon" href="/favicon.svg" type="image/svg+xml">', 'favicon.svg'),
    ('<link rel="stylesheet" href="/fonts/fonts.css">', 'fonts/fonts.css'),
    ('<meta name="theme-color" content="#16302a">', 'theme-color'),
    ('<meta property="og:image" content="https://www.vols4vets.com/og-card.jpg">', 'og-card.jpg'),
]


def inject_head(html: str) -> str:
    html = re.sub(
        r'<meta name="theme-color" content="#[^"]+">',
        '<meta name="theme-color" content="#16302a">',
        html,
        count=1,
    )
    html = html.replace(
        'https://www.vols4vets.com/vols4vets-original-patch.webp',
        'https://www.vols4vets.com/og-card.jpg',
    )
    html = html.replace('content="#f77f00"', 'content="#16302a"')
    html = html.replace('content="#FF8200"', 'content="#16302a"')
    if 'fonts/fonts.css' not in html:
        html = html.replace(
            '<link rel="stylesheet" href="/main.css">',
            '<link rel="stylesheet" href="/fonts/fonts.css">\n  <link rel="stylesheet" href="/main.css">',
            1,
        )
    if 'favicon.svg' not in html:
        html = html.replace(
            '<link rel="stylesheet" href="/fonts/fonts.css">',
            '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n  <link rel="stylesheet" href="/fonts/fonts.css">',
            1,
        )
    if 'og-card.jpg' not in html:
        html = html.replace(
            '<link rel="stylesheet" href="/main.css">',
            '<meta property="og:image" content="https://www.vols4vets.com/og-card.jpg">\n  <link rel="stylesheet" href="/main.css">',
            1,
        )
    return html


HEADER_RE = re.compile(
    r'<a class="skip-link".*?</header>',
    re.S,
)
FOOTER_RE = re.compile(
    r'<footer class="site-footer">.*?</footer>',
    re.S,
)


def patch(path: Path) -> bool:
    raw = path.read_text(encoding='utf-8')
    original = raw
    if path.name == 'index.html':
        return False
    raw = inject_head(raw)
    if HEADER_RE.search(raw):
        raw = HEADER_RE.sub(CRISIS_HEADER, raw, count=1)
    if FOOTER_RE.search(raw):
        raw = FOOTER_RE.sub(FOOTER, raw, count=1)
    if '/sections/' in str(path) or path.name == 'sections.html':
        raw = raw.replace(
            '<a href="/resources">Resources</a><span aria-hidden="true">/</span><span>',
            '<a href="/sections">Book sections</a><span aria-hidden="true">/</span><span>',
        )
    # header search ids must be unique if a page already has nav-search — chrome is once per page
    if raw != original:
        path.write_text(raw, encoding='utf-8')
        return True
    return False


def main():
    changed = 0
    missing_header = []
    for path in sorted(ROOT.rglob('*.html')):
        if 'components' in path.parts:
            continue
        if path.name == 'index.html':
            continue
        before = path.read_text(encoding='utf-8')
        if not HEADER_RE.search(before) and path.name != 'index.html':
            missing_header.append(str(path.relative_to(ROOT)))
        if patch(path):
            changed += 1
    (ROOT / 'components' / 'header.html').write_text(CRISIS_HEADER + '\n', encoding='utf-8')
    (ROOT / 'components' / 'footer.html').write_text(FOOTER + '\n', encoding='utf-8')
    print('changed', changed)
    print('missing header', missing_header)


if __name__ == '__main__':
    main()
