const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = process.cwd();
const sourceRoot = path.join(root, '.codex-tmp', 'rebuild', 'vols4vets_site_rebuild_v0_1', 'data');
const failures = [];
const warnings = [];

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(sourceRoot, name), 'utf8'));
}

function readSourceData() {
  if (fs.existsSync(path.join(sourceRoot, 'sections.json'))) {
    return {
      sections: readJson('sections.json'),
      chapters: readJson('chapters.json'),
      resources: readJson('resources.json').map((resource) => ({ id: resource.id }))
    };
  }
  const context = { window: {} };
  vm.runInNewContext(text('book-resources-data.js'), context);
  return {
    sections: context.window.VOLS4VETS_BOOK_SECTIONS || [],
    chapters: context.window.VOLS4VETS_BOOK_CHAPTERS || [],
    resources: context.window.VOLS4VETS_BOOK_RESOURCES || []
  };
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function text(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function localHrefToFile(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('http') || clean.startsWith('tel:') || clean.startsWith('sms:') || clean.startsWith('mailto:')) return null;
  if (/\.(css|js|webp|png|jpg|jpeg|svg|ico|xml|txt|json)$/i.test(clean)) return null;
  if (clean === '/') return 'index.html';
  return `${clean.replace(/^\/+/, '')}.html`;
}

function checkNoForbiddenText(file, content) {
  [
    /QR placeholder/i,
    /source gap/i,
    /internal production note/i,
    /TODO/i,
    /FIXME/i
  ].forEach((pattern) => {
    if (pattern.test(content)) fail(`${file} contains forbidden placeholder or production text: ${pattern}`);
  });
}

function checkSafetyClaims(file, content) {
  if (/Vols4Vets is VA/i.test(content)) fail(`${file} may claim Vols4Vets is VA`);
  if (/Vols4Vets provides (legal|medical|tax|financial|VA claims)/i.test(content)) fail(`${file} may claim Vols4Vets provides advice`);
}

function checkGeneratedLinks(file, content) {
  const hrefs = [...content.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1]);
  hrefs.forEach((href) => {
    const target = localHrefToFile(href);
    if (target && !exists(target)) fail(`${file} links to missing local target ${href}`);
  });
}

function main() {
  const { sections, chapters, resources } = readSourceData();
  const generatedFiles = [];

  ['index.html', 'resources.html', 'search.html'].forEach((file) => {
    if (!exists(file)) fail(`${file} is missing`);
  });

  chapters.forEach((chapter) => {
    const file = `${chapter.slug}.html`;
    if (!exists(file)) fail(`Missing chapter route ${file}`);
    else generatedFiles.push(file);
  });

  sections.forEach((section) => {
    const file = `sections/${section.slug}.html`;
    if (!exists(file)) fail(`Missing section route ${file}`);
    else generatedFiles.push(file);
  });

  if (!exists('book-resources-data.js')) fail('book-resources-data.js is missing');
  else {
    const dataText = text('book-resources-data.js');
    if (!dataText.includes('window.VOLS4VETS_BOOK_RESOURCES')) fail('book resource data export is missing');
    if ((dataText.match(/"id":"book-/g) || []).length !== resources.length) fail('book resource data count does not match source package');
  }

  [...generatedFiles, 'index.html', 'resources.html', 'search.html'].forEach((file) => {
    if (!exists(file)) return;
    const content = text(file);
    checkNoForbiddenText(file, content);
    checkSafetyClaims(file, content);
    checkGeneratedLinks(file, content);
    if (generatedFiles.includes(file) && content.includes('\u2014')) warn(`${file} contains an em dash`);
  });

  chapters.forEach((chapter) => {
    const content = text(`${chapter.slug}.html`);
    ['Who this helps', 'Best first step', 'What to gather', 'Official-source caution', 'Website update page purpose'].forEach((label) => {
      if (!content.includes(label)) fail(`${chapter.slug}.html missing ${label}`);
    });
  });

  sections.forEach((section) => {
    const content = text(`sections/${section.slug}.html`);
    if (!content.includes('Chapters in this section')) fail(`sections/${section.slug}.html missing chapter list`);
    if (!content.includes('official sources')) fail(`sections/${section.slug}.html missing official-source caution`);
  });

  const reports = [
    'codex-output/STATIC_REBUILD_PLAN.md',
    'codex-output/STATIC_REBUILD_CHANGE_LOG.md',
    'codex-output/STATIC_REBUILD_QA.md',
    'codex-output/STATIC_REBUILD_ROUTE_CHECK.md'
  ];
  reports.forEach((file) => {
    if (!exists(file)) fail(`${file} is missing`);
  });

  if (warnings.length) {
    console.log('Warnings:');
    warnings.forEach((message) => console.log(`- ${message}`));
  }

  if (failures.length) {
    console.error('Static rebuild validation failed:');
    failures.forEach((message) => console.error(`- ${message}`));
    process.exit(1);
  }

  console.log(`Static rebuild validation passed for ${chapters.length} chapter routes, ${sections.length} section routes and ${resources.length} book resources.`);
}

main();
