const fs = require('fs');
const path = require('path');

const root = process.cwd();
const sourceRoot = path.join(root, '.codex-tmp', 'rebuild', 'vols4vets_site_rebuild_v0_1', 'data');
const today = '2026-07-06';

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(sourceRoot, name), 'utf8'));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, 'utf8');
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function stripEmDash(value) {
  return String(value || '').replace(/\u2014/g, ' - ');
}

function clean(value) {
  return stripEmDash(value)
    .replace(/Confirm current details/gi, 'Confirm current details')
    .replace(/Recheck before relying on this/gi, 'Recheck before relying on this')
    .replace(/before relying on it/gi, 'before relying on it')
    .replace(/before relying on it/gi, 'before relying on it')
    .replace(/before relying on it/gi, 'before relying on it')
    .replace(/\s+/g, ' ')
    .trim();
}

function hrefForPath(routePath) {
  return routePath || '#';
}

function pageFileForRoute(routePath) {
  const cleanPath = routePath.replace(/^\/+/, '');
  return path.join(root, `${cleanPath}.html`);
}

function sectionRoute(section) {
  return `/sections/${section.slug}`;
}

function resourceTitle(resource) {
  return clean(resource['Resource name']);
}

function resourcePhone(resource) {
  return clean(resource.Phone || 'No phone listed');
}

function resourceUrl(resource) {
  return clean(resource['Official website']);
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(clean(value));
}

function firstSentence(value) {
  const text = clean(value);
  if (!text) return '';
  const match = text.match(/^(.+?[.!?])\s/);
  return match ? match[1] : text;
}

function layout({ title, description, route, main, extraHead = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)} | Vols4Vets</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="https://www.vols4vets.com${route}">
  <link rel="stylesheet" href="/main.css">
  ${extraHead}
  <script defer src="/site.js"></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<div class="crisis-bar">Veteran in crisis or worried about one? Call <a href="tel:988">988</a>, then press 1. Text <a href="sms:838255">838255</a>. If there is immediate danger, call <a href="tel:911">911</a>.</div>
<header class="site-header">
  <div class="nav-wrap">
    <a class="brand" href="/"><img class="brand-mark" src="/vols4vets-original-patch.webp" alt="" width="34" height="34"><span>Vols4Vets</span></a>
    <button class="nav-toggle" type="button" aria-controls="main-nav" aria-expanded="false" data-nav-toggle>Menu</button>
    <nav id="main-nav" class="main-nav" aria-label="Main navigation">
      <a href="/">Home</a>
      <a class="nav-cta" href="/find-my-next-step">Find My Next Step</a>
      <a href="/search">Search</a>
      <a href="/resources">Resources</a>
      <a href="/sections/start-here-when-it-is-urgent">Browse by Section</a>
      <a href="/about">About</a>
    </nav>
  </div>
</header>
${main}
<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="brand" href="/"><img class="brand-mark" src="/vols4vets-original-patch.webp" alt="" width="34" height="34"><span>Vols4Vets</span></a><p>Independent veteran resource routing. Vols4Vets is not the VA, not a crisis line, not a law firm, not a medical provider, not a benefits office and not an accredited claims representative.</p></div><div><h3>Start</h3><ul class="footer-links"><li><a href="/">Home</a></li><li><a href="/search">Search</a></li><li><a href="/resources">Resources</a></li><li><a href="/find-my-next-step">Find My Next Step</a></li></ul></div><div><h3>Trust</h3><ul class="footer-links"><li><a href="/verification-policy">Verification Policy</a></li><li><a href="/privacy-safety">Privacy and Safety</a></li><li><a href="/no-claims-representation">No Claims Representation</a></li><li><a href="/report-broken-link">Report a Broken Link</a></li></ul></div></div><div class="footer-bottom">&copy; 2026 Vols4Vets LLC. Verify current information directly with each official source before you drive, apply, call or send records.</div></div></footer>
</body>
</html>
`;
}

function resourceCard(resource) {
  const title = resourceTitle(resource);
  const url = resourceUrl(resource);
  const phone = resourcePhone(resource);
  const checked = clean(resource['Date checked']);
  const safety = clean(resource['Safety note']);
  const best = clean(resource['Best first step'] || resource['Best use'] || resource['Print-safe wording']);
  const gather = clean(resource['What to gather']);
  const provider = clean(resource['Provider type']);
  const id = clean(resource.id);
  const officialLine = isHttpUrl(url)
    ? `<div class="resource-meta"><strong>Official website:</strong> <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></div>`
    : `<div class="resource-meta"><strong>Official website:</strong> ${escapeHtml(url || 'Check the official source for the current page')}</div>`;
  return `<article class="resource-card book-resource-card" id="${escapeHtml(id)}">
  <h3>${escapeHtml(title)}</h3>
  <p>${escapeHtml(best)}</p>
  <div class="resource-meta"><strong>Phone:</strong> ${escapeHtml(phone)}</div>
  ${officialLine}
  ${gather ? `<p class="small"><strong>What to gather:</strong> ${escapeHtml(gather)}</p>` : ''}
  ${provider ? `<p class="small"><strong>Source type:</strong> ${escapeHtml(provider)}</p>` : ''}
  ${checked ? `<p class="small"><strong>Date checked:</strong> ${escapeHtml(checked)}</p>` : ''}
  ${safety ? `<p class="small"><strong>Safety note:</strong> ${escapeHtml(safety)}</p>` : ''}
</article>`;
}

function chapterPage(chapter, section, resourcesForChapter) {
  const route = `/${chapter.slug}`;
  const sectionPath = sectionRoute(section);
  const mistakes = (chapter.mistakesToAvoid || []).map((item) => `<li>${escapeHtml(clean(item))}</li>`).join('');
  const resourceCards = resourcesForChapter.map(resourceCard).join('\n');
  const description = `Update page for ${chapter.title} from the Vols4Vets Veteran Resource Guide.`;
  const main = `<main id="main">
  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="${sectionPath}">${escapeHtml(section.title)}</a><span aria-hidden="true">/</span><span>${escapeHtml(chapter.title)}</span></nav>
  <section class="hero"><div class="container page-intro"><p class="eyebrow">Book update page</p><h1>${escapeHtml(chapter.title)}</h1><p class="lead">This Vols4Vets.com page keeps current links, phone numbers and source notes for the book chapter.</p></div></section>
  <section class="section"><div class="container content-narrow readable-stack">
    <div class="notice"><strong>Official-source caution:</strong> Vols4Vets.com is a routing companion to the book. Official agencies, crisis lines, providers and program pages control action, eligibility, deadlines, phone numbers and forms.</div>
    <h2>Who this helps</h2>
    <p>${escapeHtml(clean(chapter.whoThisChapterHelps || chapter.audienceNote))}</p>
    <h2>Best first step</h2>
    <p>${escapeHtml(clean(chapter.bestFirstStep))}</p>
    <h2>What to gather</h2>
    <p>${escapeHtml(clean(chapter.whatToGather || 'Use the linked official source to confirm what is needed before sharing records.'))}</p>
    ${mistakes ? `<h2>Safety notes</h2><ul class="plain-list">${mistakes}</ul>` : ''}
    <h2>Resource cards for this chapter</h2>
    <div class="grid grid-2">${resourceCards}</div>
    <h2>Website update page purpose</h2>
    <p>Use this page to check current official links, phone numbers and source notes that can change after the printed book.</p>
    <p><a class="button button-secondary" href="${sectionPath}">Back to ${escapeHtml(section.title)}</a></p>
    <p class="small"><strong>Last source package check:</strong> ${today}. This page does not provide legal, medical, tax, financial or VA claims advice.</p>
  </div></section>
</main>`;
  return layout({ title: chapter.title, description, route, main });
}

function sectionPage(section, chaptersForSection) {
  const route = sectionRoute(section);
  const chapterLinks = chaptersForSection.map((chapter) => `<li><a href="/${chapter.slug}">${escapeHtml(chapter.title)}</a></li>`).join('');
  const main = `<main id="main">
  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/resources">Resources</a><span aria-hidden="true">/</span><span>${escapeHtml(section.title)}</span></nav>
  <section class="hero"><div class="container page-intro"><p class="eyebrow">Book section</p><h1>${escapeHtml(section.title)}</h1><p class="lead">${escapeHtml(clean(section.description))}</p></div></section>
  <section class="section"><div class="container content-narrow readable-stack">
    <div class="notice"><strong>Use official sources before you act.</strong> Vols4Vets.com updates links and plain routing details, but official agencies and providers control forms, eligibility, schedules, phone routing and deadlines.</div>
    <h2>Plain description</h2>
    <p>${escapeHtml(clean(section.whoThisSectionHelps || section.description))}</p>
    <h2>Chapters in this section</h2>
    <ol class="plain-list">${chapterLinks}</ol>
    <h2>When to come back</h2>
    <p>${escapeHtml(clean(section.whenToComeBack || 'Come back when status, family needs, location, health coverage, money, housing or work changes.'))}</p>
  </div></section>
</main>`;
  return layout({ title: section.title, description: clean(section.description), route, main });
}

function normalizeResource(resource) {
  const title = resourceTitle(resource);
  const officialUrl = resourceUrl(resource);
  const category = clean(resource.sectionTitle || resource['Book section'] || 'Book resource');
  const audience = clean(resource['Who it helps'] || 'Veterans, service members, families and caregivers');
  const description = clean(resource['Best use'] || resource['Print-safe wording'] || resource['Website-expanded wording']);
  return {
    id: `book-${resource.id}`,
    title,
    url: isHttpUrl(officialUrl) ? officialUrl : `/${resource.chapterSlug}`,
    officialUrl: isHttpUrl(officialUrl) ? officialUrl : '',
    officialWebsiteNote: isHttpUrl(officialUrl) ? '' : officialUrl,
    phone: resourcePhone(resource),
    description,
    purpose: clean(resource['Best first step'] || description),
    category,
    county: category.includes('East Tennessee') ? 'East Tennessee' : 'National',
    state: category.includes('Tennessee') ? 'TN' : 'US',
    audience,
    tags: [
      'book resource',
      clean(resource.chapterTitle),
      clean(resource.sectionTitle),
      clean(resource['Provider type']),
      clean(resource['Best use'])
    ].filter(Boolean),
    official: ['Federal', 'State', 'Government'].some((needle) => clean(resource['Provider type']).includes(needle)),
    sourceType: clean(resource['Provider type']),
    lastVerified: clean(resource['Date checked']),
    lastChecked: clean(resource['Date checked']),
    safetyNote: clean(resource['Safety note']),
    chapterPath: `/${resource.chapterSlug}`,
    websitePage: clean(resource['Website page'])
  };
}

function bookDataFile(sections, chapters, resources) {
  const normalized = resources.map(normalizeResource);
  return `window.VOLS4VETS_BOOK_SECTIONS=${JSON.stringify(sections)};\nwindow.VOLS4VETS_BOOK_CHAPTERS=${JSON.stringify(chapters)};\nwindow.VOLS4VETS_BOOK_RESOURCES=${JSON.stringify(normalized)};\n`;
}

function homepage(sections) {
  const sectionLinks = sections.map((section) => `<a class="link-item" href="${sectionRoute(section)}">${escapeHtml(section.title)}<span>${escapeHtml(clean(section.description))}</span></a>`).join('');
  const homeStyles = `<style>
    .home-brand-lockup{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:1.15rem;margin-bottom:1rem}
    .home-brand-logo{width:clamp(72px,10vw,116px);height:auto;filter:drop-shadow(0 10px 18px rgba(88,89,91,.18))}
    .home-brand-title{margin:.1rem 0 .35rem;font-size:clamp(3rem,8vw,5.8rem);line-height:.92;color:var(--smoky-dark)}
    .home-brand-kicker{margin:0;color:var(--orange);font-size:.86rem;font-weight:900;letter-spacing:0;text-transform:uppercase}
    .home-brand-subline{max-width:760px;margin:0 auto 1rem;color:var(--smoky-dark);font-size:clamp(1.08rem,2.2vw,1.35rem);font-weight:800;line-height:1.45}
    .home-purpose-line{max-width:700px;margin:0 auto;color:var(--muted);font-size:1.02rem}
    .home-landing-hero{background:linear-gradient(180deg,#fff 0%,#fff7ef 58%,#f4f6f8 100%)}
    @media(max-width:640px){.home-brand-lockup{grid-template-columns:1fr;text-align:center}.home-brand-logo{margin:0 auto}.home-brand-title{font-size:3.25rem}}
  </style>`;
  const main = `<main id="main">
  <section class="hero router-hero home-landing-hero"><div class="container page-intro">
    <div class="home-brand-lockup">
      <img class="home-brand-logo" src="/vols4vets-original-patch.webp" alt="Vols4Vets Honor Serve Support patch" width="116" height="116">
      <div><p class="home-brand-kicker">Living companion site</p><h1 class="home-brand-title">Vols4Vets.com</h1></div>
    </div>
    <p class="home-brand-subline">East Tennessee roots. National reach. Current links, phone numbers and local details for the Vols4Vets Veteran Resource Guide.</p>
    <p class="home-purpose-line">The printed book gives the stable path. This site keeps source checks, dates, resource links and chapter updates easier to verify.</p>
    <p class="trust-line">Independent. Official sources first. Not the VA.</p>
  </div></section>
  <section class="section next-step-section"><div class="container"><div class="next-step-panel"><div><p class="eyebrow">Start here</p><h2>Need a clear first move?</h2><p>Use the book companion pages to choose the right official source before you call, drive, apply or send records.</p></div><a class="button button-large" href="/find-my-next-step">Find my starting point</a></div></div></section>
  <section class="section search-strip"><div class="container"><form action="/search" method="get" class="search-form home-search" role="search"><label class="sr-only" for="home-search">Search resources</label><input id="home-search" name="q" type="search" placeholder="Search crisis, DD214, VA.gov, caregivers, discounts, East Tennessee or records"><button class="button" type="submit">Search resources</button></form></div></section>
  <section class="section section-soft"><div class="container"><div class="section-heading"><p class="eyebrow">Clear paths</p><h2>Pick the lane that matches today.</h2></div><div class="grid grid-3 route-grid">
    <article class="card route-card card-critical"><span class="route-icon" aria-hidden="true">!</span><h3>Urgent help</h3><p>Crisis, homelessness, emergency communication and cannot-wait needs.</p><a class="button" href="/sections/start-here-when-it-is-urgent">Start urgent help</a></article>
    <article class="card route-card"><span class="route-icon" aria-hidden="true">?</span><h3>Find my starting point</h3><p>Answer a few questions and get a practical next path.</p><a class="button" href="/find-my-next-step">Open the tool</a></article>
    <article class="card route-card"><span class="route-icon" aria-hidden="true">#</span><h3>Browse by section</h3><p>Use the book structure to find the update page for your chapter.</p><a class="button" href="/sections/start-here-when-it-is-urgent">Browse sections</a></article>
    <article class="card route-card card-local"><span class="route-icon" aria-hidden="true">ET</span><h3>East Tennessee</h3><p>Sevier County, the Smokies, clinics, offices, local help and local offers.</p><a class="button" href="/sections/east-tennessee-and-the-smokies">Open East Tennessee</a></article>
    <article class="card route-card"><span class="route-icon" aria-hidden="true">$</span><h3>Discounts and travel</h3><p>Verify military discounts, travel, parks, tickets and Veterans Day offers.</p><a class="button" href="/sections/discounts-travel-parks-recreation-and-veterans-day-deals">Open discounts</a></article>
    <article class="card route-card"><span class="route-icon" aria-hidden="true">VA</span><h3>Records and VA starting points</h3><p>VA.gov, DD214, enrollment, claims starting points and official caution.</p><a class="button" href="/records-dd214-and-account-access">Start with records</a></article>
    <article class="card route-card"><span class="route-icon" aria-hidden="true">F</span><h3>Family and caregivers</h3><p>Support for spouses, caregivers, survivors and Gold Star families.</p><a class="button" href="/sections/family-caregivers-survivors-and-gold-star-families">Open family help</a></article>
  </div></div></section>
  <section class="section"><div class="container"><div class="section-heading"><p class="eyebrow">Book sections</p><h2>All 11 companion sections.</h2></div><div class="grid grid-3 compact-links">${sectionLinks}</div></div></section>
  <section class="cta-band"><div class="container split"><div><h2>Use official sources before you act.</h2><p>Vols4Vets.com helps you find the right door. The official source controls the rule, form, deadline and decision.</p></div><div class="actions"><a class="button" href="/resources-crisis-support">Urgent help</a><a class="button button-secondary" href="/search">Search resources</a></div></div></section>
</main>`;
  return layout({ title: 'Vols4Vets.com', description: 'Living companion site for the Vols4Vets Veteran Resource Guide.', route: '/', main, extraHead: `${homeStyles}\n  <script defer src="/book-resources-data.js"></script>` });
}

function insertBookSectionIntoResources(html, sections, resources) {
  const sectionCards = sections.map((section) => `<article class="card" data-resource-card data-counties="all-east-tn state national" data-category="book-companion"><h3>${escapeHtml(section.title)}</h3><p>${escapeHtml(clean(section.description))}</p><a href="${sectionRoute(section)}">Open section</a></article>`).join('');
  const resourceCards = resources.map((resource) => {
    const county = clean(resource.sectionTitle).includes('East Tennessee') ? 'all-east-tn sevier knox' : 'state national';
    const category = clean(resource.sectionTitle).includes('Discounts') ? 'discounts-travel-local-offers' : 'book-companion';
    const url = resourceUrl(resource);
    const official = isHttpUrl(url) ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>` : escapeHtml(url || 'Check the official source for the current page');
    const safety = clean(resource['Safety note']);
    return `<article class="card" data-resource-card data-counties="${county}" data-category="${category}"><h3>${escapeHtml(resourceTitle(resource))}</h3><p>${escapeHtml(clean(resource['Best use'] || resource['Best first step']))}</p><p class="small"><strong>Phone:</strong> ${escapeHtml(resourcePhone(resource))}</p><p class="small"><strong>Official website:</strong> ${official}</p><p class="small"><strong>Date checked:</strong> ${escapeHtml(clean(resource['Date checked']))}</p>${safety ? `<p class="small"><strong>Safety note:</strong> ${escapeHtml(safety)}</p>` : ''}<a href="/${escapeHtml(resource.chapterSlug)}">Open chapter page</a></article>`;
  }).join('');
  const block = `<section class="section" data-resource-group>
    <div class="container">
      <div class="section-heading"><p class="eyebrow">Book companion</p><h2>Browse the 70 chapter update pages.</h2><p>These pages carry current phone numbers, visible official URLs, source checks and safety notes for the book.</p></div>
      <div class="grid grid-3">${sectionCards}</div>
    </div>
  </section>
  <section class="section section-soft" data-resource-group>
    <div class="container">
      <div class="section-heading"><p class="eyebrow">171 book resource cards</p><h2>Official source first.</h2><p>Every card below comes from the source package and links back to its chapter update page.</p></div>
      <div class="grid grid-3">${resourceCards}</div>
    </div>
  </section>`;
  if (html.includes('<!-- BOOK_RESOURCE_SECTION -->')) {
    return html.replace(/<!-- BOOK_RESOURCE_SECTION -->[\s\S]*?<!-- \/BOOK_RESOURCE_SECTION -->/, `<!-- BOOK_RESOURCE_SECTION -->\n${block}\n<!-- /BOOK_RESOURCE_SECTION -->`);
  }
  return html.replace('<section class="cta-band">', `<!-- BOOK_RESOURCE_SECTION -->\n${block}\n<!-- /BOOK_RESOURCE_SECTION -->\n<section class="cta-band">`);
}

function sitemapXml(existing, routes) {
  const routeSet = new Set(routes.map((route) => `https://www.vols4vets.com${route}`));
  existing = existing.replace(/  <url><loc>([^<]+)<\/loc><lastmod>[^<]+<\/lastmod><\/url>\r?\n/g, (line, loc) => {
    return routeSet.has(loc) ? '' : line;
  });
  const routeXml = routes.map((route) => `  <url><loc>https://www.vols4vets.com${route}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  return existing.replace('</urlset>', `${routeXml}\n</urlset>`);
}

function main() {
  const sections = readJson('sections.json');
  const chapters = readJson('chapters.json');
  const resources = readJson('resources.json');
  const sectionByNumber = new Map(sections.map((section) => [section.number, section]));
  const resourcesByChapter = new Map();
  resources.forEach((resource) => {
    const key = resource.chapterNumber;
    if (!resourcesByChapter.has(key)) resourcesByChapter.set(key, []);
    resourcesByChapter.get(key).push(resource);
  });

  write(path.join(root, 'book-resources-data.js'), bookDataFile(sections, chapters, resources));

  chapters.forEach((chapter) => {
    const section = sectionByNumber.get(chapter.sectionNumber);
    write(pageFileForRoute(`/${chapter.slug}`), chapterPage(chapter, section, resourcesByChapter.get(chapter.number) || []));
  });

  sections.forEach((section) => {
    const chaptersForSection = chapters.filter((chapter) => chapter.sectionNumber === section.number);
    write(pageFileForRoute(sectionRoute(section)), sectionPage(section, chaptersForSection));
  });

  write(path.join(root, 'index.html'), homepage(sections));

  const resourcesHtml = fs.readFileSync(path.join(root, 'resources.html'), 'utf8');
  write(path.join(root, 'resources.html'), insertBookSectionIntoResources(resourcesHtml, sections, resources));

  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const routes = [
    ...sections.map(sectionRoute),
    ...chapters.map((chapter) => `/${chapter.slug}`)
  ];
  write(path.join(root, 'sitemap.xml'), sitemapXml(sitemap, routes));

  ensureDir(path.join(root, 'codex-output'));
  write(path.join(root, 'codex-output', 'STATIC_REBUILD_PLAN.md'), `# Static Rebuild Plan

- Keep Vols4Vets.com as plain static HTML.
- Use the Drive rebuild ZIP only for sections.json, chapters.json, resources.json, route-map.csv, resources.csv and chapters.csv.
- Add book-resources-data.js for the 171 book resources without replacing existing resources-data.js.
- Generate 70 chapter update pages at the exact book route slugs.
- Generate 11 section pages under /sections/.
- Repair the homepage as a short book companion entry point.
- Validate generated routes, required pages, placeholder text, internal links and source-safety wording.
`);
  write(path.join(root, 'codex-output', 'STATIC_REBUILD_CHANGE_LOG.md'), `# Static Rebuild Change Log

- Created book-resources-data.js exposing VOLS4VETS_BOOK_RESOURCES, VOLS4VETS_BOOK_CHAPTERS and VOLS4VETS_BOOK_SECTIONS.
- Generated ${chapters.length} chapter update pages.
- Generated ${sections.length} section pages.
- Rebuilt the homepage around the book companion purpose and required starting paths.
- Added the book companion section and ${resources.length} visible book resource cards to resources.html.
- Added sitemap entries for generated section and chapter routes.
- Added scripts/generate-static-book-rebuild.js and scripts/validate-static-rebuild.js for repeatable local checks.
`);
  write(path.join(root, 'codex-output', 'STATIC_REBUILD_QA.md'), `# Static Rebuild QA

Source package counts:

- Sections: ${sections.length}
- Chapters: ${chapters.length}
- Resource cards: ${resources.length}

Static checks are run with scripts/validate-static-rebuild.js.

Drive write status: Google Drive read access worked. Google Drive write tools were not available in this environment, so reports were written to codex-output/.
`);
  write(path.join(root, 'codex-output', 'STATIC_REBUILD_ROUTE_CHECK.md'), `# Static Rebuild Route Check

Expected generated routes:

- Section routes: ${sections.length}
- Chapter routes: ${chapters.length}

Run:

\`\`\`
node scripts/validate-static-rebuild.js
\`\`\`
`);

  console.log(`Generated ${chapters.length} chapter pages, ${sections.length} section pages and ${resources.length} book resources.`);
}

main();
