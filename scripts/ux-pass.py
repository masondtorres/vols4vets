#!/usr/bin/env python3
"""Post-deploy UX pass: chrome, SEO, sitemap, directory, titles, alt text."""
from __future__ import annotations

from datetime import date
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
CSS_V = "20260915-ux2"
TODAY = date.today().isoformat()
SKIP_SITEMAP = {"404.html", "removed-utility-content.html"}
FOOTER = (ROOT / "components" / "footer.html").read_text(encoding="utf-8").strip()

TITLE_FIXES = {
    "resources.html": (
        "East Tennessee Veteran Resources | Vols4Vets Directory",
        "Veteran Resource Directory | Vols4Vets",
    ),
    "resources-east-tennessee.html": (
        "East Tennessee Veteran Resources | Vols4Vets",
        "East Tennessee Resource Category | Vols4Vets",
    ),
}

DESC_FIXES = {
    "resources.html": "Browse Vols4Vets resource categories for crisis help, VA benefits, housing, jobs, legal aid, family support, discounts and East Tennessee offices.",
    "404.html": "That Vols4Vets page is no longer here. Use Search, Resources or Find My Next Step to continue.",
    "removed-utility-content.html": "Old unrelated utility pages were removed. Vols4Vets now points veterans and families to official-resource starting points.",
}


def html_files() -> list[Path]:
    files = []
    for path in ROOT.rglob("*.html"):
        if "components" in path.parts:
            continue
        files.append(path)
    return sorted(files)


def patch_head(html: str, path: Path) -> str:
    html = html.replace("/main.css?v=20260915-btn", f"/main.css?v={CSS_V}")
    html = html.replace('href="/main.css"', f'href="/main.css?v={CSS_V}"')
    html = html.replace(
        '<img class="brand-mark" src="/brand-mark.webp" alt=""',
        '<img class="brand-mark" src="/brand-mark.webp" alt="Vols4Vets"',
    )
    title_m = re.search(r"<title>(.*?)</title>", html, re.S)
    title = re.sub(r"\s+", " ", title_m.group(1)).strip() if title_m else "Vols4Vets"
    canon_m = re.search(r'rel="canonical" href="([^"]+)"', html)
    canon = canon_m.group(1) if canon_m else ""
    desc_m = re.search(r'name="description" content="([^"]*)"', html)
    desc = desc_m.group(1) if desc_m else ""

    if "og:title" not in html and title_m:
        insert = f'  <meta property="og:title" content="{title}">\n'
        html = html.replace("</title>", "</title>\n" + insert, 1)
    if canon and 'property="og:url"' not in html:
        html = html.replace(
            f'<link rel="canonical" href="{canon}">',
            f'<link rel="canonical" href="{canon}">\n  <meta property="og:url" content="{canon}">',
            1,
        )
    if desc and "og:description" not in html:
        html = html.replace(
            f'<meta name="description" content="{desc}">',
            f'<meta name="description" content="{desc}">\n  <meta property="og:description" content="{desc}">',
            1,
        )
    if path.name in DESC_FIXES and f'content="{DESC_FIXES[path.name]}"' not in html:
        if desc_m:
            html = html.replace(desc_m.group(0), f'<meta name="description" content="{DESC_FIXES[path.name]}">', 1)
        elif path.name == "404.html":
            html = html.replace(
                "<title>Page Not Found | Vols4Vets</title>",
                '<title>Page Not Found | Vols4Vets</title><meta name="description" content="'
                + DESC_FIXES[path.name]
                + '">',
                1,
            )
        elif path.name == "removed-utility-content.html":
            html = html.replace(
                '<meta name="robots" content="noindex,nofollow">',
                '<meta name="robots" content="noindex,nofollow"><meta name="description" content="'
                + DESC_FIXES[path.name]
                + '">',
                1,
            )
    if path.name in TITLE_FIXES:
        old, new = TITLE_FIXES[path.name]
        html = html.replace(f"<title>{old}</title>", f"<title>{new}</title>")
        html = html.replace(f'property="og:title" content="{old}"', f'property="og:title" content="{new}"')
    return html


def ensure_footer(html: str, path: Path) -> str:
    if "<footer class=\"site-footer\">" in html:
        return html
    if path.name == "404.html":
        return html
    if "</body>" in html:
        return html.replace("</body>", FOOTER + "\n</body>", 1)
    return html


def patch_search_form(html: str) -> str:
    html = html.replace(
        '<form class="search-form" role="search"><label class="sr-only" for="site-search">What do you need help with?</label><input id="site-search" type="search" placeholder="What do you need help with?" autocomplete="off" data-site-search><button class="button" type="submit">Search</button></form>',
        '<form class="search-form" action="/search" method="get" role="search"><label class="sr-only" for="site-search">What do you need help with?</label><input id="site-search" name="q" type="search" placeholder="What do you need help with?" autocomplete="off" data-site-search><button class="button" type="submit">Search</button></form>',
    )
    return html


def patch_triage(html: str) -> str:
    html = html.replace(
        '<label><input type="radio" name="issue" value="Crisis or immediate danger" checked> Crisis or immediate danger</label>',
        '<label><input type="radio" name="issue" value="Crisis or immediate danger" required> Crisis or immediate danger</label>',
    )
    html = html.replace(
        '<label><input type="radio" name="location" value="Sevier County" checked> Sevier County</label>',
        '<label><input type="radio" name="location" value="Sevier County" required> Sevier County</label>',
    )
    html = html.replace(
        '<label><input type="radio" name="urgency" value="Immediate danger" checked> Immediate danger</label>',
        '<label><input type="radio" name="urgency" value="Immediate danger" required> Immediate danger</label>',
    )
    html = html.replace(
        '<label><input type="radio" name="goal" value="Call the right official office" checked> Call the right official office</label>',
        '<label><input type="radio" name="goal" value="Call the right official office" required> Call the right official office</label>',
    )
    html = html.replace(
        '<p class="notice"><strong>Pick the closest answer.</strong> This does not submit anything.</p>',
        '<p class="notice"><strong>Nothing is pre-selected.</strong> Pick the closest answers. This does not submit anything to Vols4Vets.</p>',
    )
    return html


def patch_resources(html: str) -> str:
    html = re.sub(r"\n  <style>.*?</style>", "", html, count=1, flags=re.S)
    m = re.search(r'<section class="resource-search-shell".*?</section>\s*', html, re.S)
    if not m:
        return html
    shell = m.group(0).strip()
    html = html[: m.start()] + html[m.end() :]
    crumb = '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Resources</span></nav>'
    jump = """
  <nav class="dir-jump" aria-label="Directory sections">
    <a href="#dir-start">Start here</a>
    <a href="#dir-common">Common next steps</a>
    <a href="#dir-work">Work, housing, family</a>
    <a href="#dir-discounts">Discounts and travel</a>
    <a href="#dir-more">More categories</a>
    <a href="#dir-book">Book companion pages</a>
    <a href="#dir-cards">171 book resource cards</a>
  </nav>
"""
    if crumb in html:
        html = html.replace(crumb, crumb + "\n" + shell + jump, 1)
    html = html.replace("<h2>Start here first.</h2>", '<h2 id="dir-start">Start here first.</h2>', 1)
    html = html.replace("<h2>Most common next steps.</h2>", '<h2 id="dir-common">Most common next steps.</h2>', 1)
    html = html.replace("<h2>Work, housing and family</h2>", '<h2 id="dir-work">Work, housing and family</h2>', 1)
    html = html.replace(
        "<h2>Discounts, travel and local offers</h2>",
        '<h2 id="dir-discounts">Discounts, travel and local offers</h2>',
        1,
    )
    html = html.replace("<h2>More resource categories</h2>", '<h2 id="dir-more">More resource categories</h2>', 1)
    html = html.replace(
        '<p class="eyebrow">Book companion</p><h2>Browse the 70 chapter update pages.</h2>',
        '<p class="eyebrow" id="dir-book">Book companion</p><h2>Browse the 70 chapter update pages.</h2>',
        1,
    )
    html = html.replace(
        '<p class="eyebrow">171 book resource cards</p><h2>Official source first.</h2>',
        '<p class="eyebrow" id="dir-cards">171 book resource cards</p><h2>Official source first.</h2></div>\n      <details class="card-pack"><summary>Show the 171 book resource cards</summary>\n      <div class="section-heading">',
        1,
    )
    # Close details before the following trust section if we opened it
    if "<details class=\"card-pack\">" in html and "</details>" not in html.split("card-pack", 1)[-1][:8000]:
        html = html.replace(
            '<div><h2>Use the source before you act.</h2>',
            '</details>\n      <div><h2>Use the source before you act.</h2>',
            1,
        )
    return html


ABOUT_FAQ = """
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is Vols4Vets?","acceptedAnswer":{"@type":"Answer","text":"Vols4Vets is an independent veteran-owned companion site for the Vols4Vets Veteran Resource Guide. It points veterans and families to official-source starting points. The printed book is the stable path. This site keeps official links and phone numbers easier to check."}},{"@type":"Question","name":"Is Vols4Vets the VA?","acceptedAnswer":{"@type":"Answer","text":"No. Vols4Vets is not the Department of Veterans Affairs, not a crisis line, not a law firm, not a medical provider, not a benefits office and not an accredited claims representative."}},{"@type":"Question","name":"Is Vols4Vets the same as Vets4Vets?","acceptedAnswer":{"@type":"Answer","text":"No. The name is Vols4Vets, not Vets4Vets. It is an independent East Tennessee resource guide companion."}},{"@type":"Question","name":"What should I do in a veteran crisis?","acceptedAnswer":{"@type":"Answer","text":"If there is immediate danger, call 911. For veteran crisis support, call 988 then press 1 or text 838255. Vols4Vets does not monitor emergencies."}}]}</script>
"""


def patch_about(html: str) -> str:
    if "FAQPage" in html:
        return html
    return html.replace("</head>", ABOUT_FAQ + "</head>", 1)


def patch_privacy(html: str) -> str:
    needle = "Vols4Vets does not sell private user information."
    extra = " Vols4Vets does not use Google Analytics, advertising cookies or third-party tracking pixels."
    if needle in html and "Google Analytics" not in html:
        html = html.replace(needle, needle + extra, 1)
    return html


def patch_404(html: str) -> str:
    if 'name="robots"' not in html:
        html = html.replace(
            "<title>Page Not Found | Vols4Vets</title>",
            '<title>Page Not Found | Vols4Vets</title><meta name="robots" content="noindex, nofollow">',
            1,
        )
    # Avoid claiming /404 as a canonical public page
    html = re.sub(r'\n?\s*<link rel="canonical" href="https://www.vols4vets.com/404">', "", html)
    html = re.sub(r'\n?\s*<meta property="og:url" content="https://www.vols4vets.com/404">', "", html)
    return html


def write_sitemap() -> None:
    urls = []
    for path in html_files():
        if path.name in SKIP_SITEMAP:
            continue
        rel = path.relative_to(ROOT).as_posix()
        if rel.startswith("docs/") or rel.startswith("codex-output/") or rel.startswith("book-source/"):
            continue
        slug = "/" if path.name == "index.html" else "/" + rel.replace(".html", "")
        html = path.read_text(encoding="utf-8")
        if 'name="robots" content="noindex' in html:
            continue
        canon_m = re.search(r'rel="canonical" href="([^"]+)"', html)
        loc = canon_m.group(1) if canon_m else "https://www.vols4vets.com" + slug
        if "vols4vets.com" not in loc:
            continue
        urls.append(loc.rstrip("/") if loc != "https://www.vols4vets.com/" else loc)
    # stable unique
    seen = []
    for loc in urls:
        if loc not in seen:
            seen.append(loc)
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc in seen:
        lines.append(f"  <url><loc>{loc}</loc><lastmod>{TODAY}</lastmod></url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("sitemap urls", len(seen))


def write_vercel() -> None:
    data = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    host_redirects = [
        {
            "source": "/",
            "has": [{"type": "host", "value": "vols4vets.com"}],
            "destination": "https://www.vols4vets.com/",
            "permanent": True,
        },
        {
            "source": "/:path*",
            "has": [{"type": "host", "value": "vols4vets.com"}],
            "destination": "https://www.vols4vets.com/:path*",
            "permanent": True,
        },
        {
            "source": "/",
            "has": [{"type": "host", "value": "vols4vets.vercel.app"}],
            "destination": "https://www.vols4vets.com/",
            "permanent": True,
        },
        {
            "source": "/:path*",
            "has": [{"type": "host", "value": "vols4vets.vercel.app"}],
            "destination": "https://www.vols4vets.com/:path*",
            "permanent": True,
        },
    ]
    utilities = []
    for item in data.get("redirects", []):
        if item.get("destination") == "/removed-utility-content":
            item["permanent"] = True
            utilities.append(item)
        else:
            utilities.append(item)
    # keep only unique sources after host redirects
    data["redirects"] = host_redirects + utilities
    headers = []
    for block in data.get("headers", []):
        if block.get("source") == "/(.*)" :
            cleaned = [h for h in block["headers"] if h.get("key") != "X-Robots-Tag"]
            cleaned.append({"key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains"})
            block["headers"] = cleaned
        headers.append(block)
    headers.extend(
        [
            {
                "source": "/404",
                "headers": [{"key": "X-Robots-Tag", "value": "noindex, nofollow"}],
            },
            {
                "source": "/404.html",
                "headers": [{"key": "X-Robots-Tag", "value": "noindex, nofollow"}],
            },
        ]
    )
    data["headers"] = headers
    (ROOT / "vercel.json").write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    write_vercel()
    changed = 0
    for path in html_files():
        raw = path.read_text(encoding="utf-8")
        html = raw
        html = patch_head(html, path)
        html = ensure_footer(html, path)
        if path.name == "search.html":
            html = patch_search_form(html)
        if path.name == "find-my-next-step.html":
            html = patch_triage(html)
        if path.name == "resources.html":
            html = patch_resources(html)
        if path.name == "about.html":
            html = patch_about(html)
        if path.name == "privacy-safety.html":
            html = patch_privacy(html)
        if path.name == "404.html":
            html = patch_404(html)
        if html != raw:
            path.write_text(html, encoding="utf-8")
            changed += 1
    write_sitemap()
    print("html changed", changed)


if __name__ == "__main__":
    main()
