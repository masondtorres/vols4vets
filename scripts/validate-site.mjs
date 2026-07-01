import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = [];
const vercel = JSON.parse(read('vercel.json'));
const sitemap = read('sitemap.xml');
const resourcesData = read('resources-data.js');
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html'));
const routes = new Map();
for (const file of htmlFiles) routes.set('/' + file.replace(/\.html$/, '').replace(/^index$/, ''), file);
routes.set('/', 'index.html');
for (const rewrite of vercel.rewrites || []) {
  const destination = rewrite.destination?.replace(/^\//, '');
  if (!destination || !fs.existsSync(path.join(root, destination))) fail.push('Missing rewrite destination: ' + rewrite.source + ' -> ' + rewrite.destination);
  routes.set(rewrite.source, destination);
}
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
for (const loc of locs) {
  if (!loc.startsWith('https://www.vols4vets.com/')) fail.push('Bad sitemap host: ' + loc);
  const route = loc.replace('https://www.vols4vets.com', '') || '/';
  if (!routes.has(route)) fail.push('Sitemap route has no HTML or clean route: ' + route);
}
for (const file of htmlFiles) {
  const html = read(file);
  if (!html.includes('Veteran in crisis or worried about one?')) fail.push('Missing crisis bar: ' + file);
  if (!html.includes('id="main-nav"')) fail.push('Missing main nav: ' + file);
  if (!html.includes('class="site-footer"')) fail.push('Missing footer: ' + file);
}
const utilityPatterns = ['screen-flashlight','dvd-screensaver','glitch-screen','dead-pixel','best-screen-colors','backlight-bleed'];
for (const pattern of utilityPatterns) {
  if (sitemap.includes(pattern)) fail.push('Removed utility URL found in sitemap: ' + pattern);
}
vm.runInNewContext(resourcesData, { window: {} });
const required = ['/toolkits','/va-claim-starter-checklist','/housing-risk-action-checklist','/veteran-job-search-starter-kit','/dd214-replacement-checklist','/vso-appointment-packet','/mountain-home-va-appointment-prep','/legal-aid-deadline-checklist','/women-veterans-official-support-checklist','/family-caregiver-support-checklist','/tennessee-benefits-checklist','/county-office-call-script'];
for (const route of required) {
  if (!routes.has(route)) fail.push('Missing clean route: ' + route);
  if (!sitemap.includes('https://www.vols4vets.com' + route)) fail.push('Missing sitemap URL: ' + route);
  if (!resourcesData.includes("url:'" + route + "'") && !resourcesData.includes('url:"' + route + '"')) fail.push('Missing search index entry: ' + route);
}
if (fail.length) {
  console.error(fail.join('\n'));
  process.exit(1);
}
console.log('validate-site ok: ' + htmlFiles.length + ' HTML files, ' + locs.length + ' sitemap URLs');
