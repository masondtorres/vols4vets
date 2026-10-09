import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const script = fs.readFileSync(new URL('../search.js', import.meta.url), 'utf8');
let domReady;
function el(extra = {}) {
  return Object.assign({ value:'', checked:false, hidden:false, innerHTML:'', textContent:'', addEventListener() {}, closest(){return {addEventListener(){}};} }, extra);
}
const input=el();
const result=el();
const category=el();
const county=el();
const audience=el();
const urgent=el();
const official=el();
const count=el();
const empty=el();
const elements={'[data-site-search]':input,'[data-results]':result,'[data-category-filter]':category,'[data-county-filter]':county,'[data-audience-filter]':audience,'[data-urgent-filter]':urgent,'[data-official-filter]':official,'[data-result-count]':count,'[data-empty]':empty};
const injection='E & <img src=x onerror=alert(1)> "quote"';
const data=[{title:injection,description:'Resource information',purpose:'Resource information',category:injection,county:injection,audience:injection,official:false,url:'https://example.gov/'}];
const context={window:{VOLS4VETS_RESOURCES:data,VOLS4VETS_BOOK_RESOURCES:[]},document:{addEventListener(name,fn){if(name==='DOMContentLoaded')domReady=fn;},querySelector(selector){return elements[selector]}},history:{replaceState(){}},location:{search:'',pathname:'/search'},URLSearchParams,Set};
vm.runInNewContext(script,context);
assert.equal(typeof domReady,'function');
domReady();
for(const target of [category,county,audience]) {
  assert.equal(target.innerHTML.includes('<img'),false,'No unescaped HTML in filter options');
  assert.ok(target.innerHTML.includes('&lt;img'),'Filter values escaped');
  assert.ok(target.innerHTML.includes('&quot;quote&quot;'),'Filter quotes escaped');
  assert.ok(target.innerHTML.includes('&amp;'),'Ampersand escaped');
}
assert.equal(result.innerHTML.includes('<img'),false,'Result title escaped');
assert.ok(result.innerHTML.includes('&lt;img'));
console.log('search DOM escaping ok');
