(function(){
  var PAGE=25;
  var STOP={a:1,an:1,the:1,for:1,of:1,and:1,or:1,to:1,in:1,on:1,with:1,help:1};
  var SYNONYMS={
    dd214:['dd-214','dd 214','discharge papers','discharge document','military records','service records'],
    crisis:['988','suicide','veterans crisis line','vcl','emergency'],
    housing:['homeless','homelessness','eviction','hud-vash','shelter','housing risk'],
    vso:['veteran service officer','veterans service officer','county veteran service','service officer'],
    claim:['disability claim','va claim','compensation','pact act','benefits claim'],
    'mountain home':['quillen','johnson city va','mountain home va'],
    sevier:['sevierville','pigeon forge','gatlinburg','sevier county'],
    knox:['knoxville','knox county'],
    caregiver:['family caregiver','caregiver support','champva'],
    jobs:['employment','resume','skillbridge','usajobs','job help','workforce'],
    legal:['legal aid','court','eviction','attorney','lawyer'],
    discounts:['veterans day','id.me','sheerid','military discount']
  };
  function text(item){
    return [item.title,item.description,item.purpose,item.eastTnNote,item.category,item.county,item.state,item.audience,(item.tags||[]).join(' '),item.phone,item.sourceType].join(' ').toLowerCase();
  }
  function unique(values){return Array.from(new Set(values.filter(Boolean))).sort();}
  function option(value){return '<option value="'+value+'">'+value+'</option>';}
  function external(url){return /^https?:\/\//.test(url);}
  function safe(value){return String(value||'').replace(/[&<>"']/g,function(char){return {'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[char];});}
  function normalize(value){
    return String(value||'').toLowerCase()
      .replace(/dd[-\s]?214/g,'dd214')
      .replace(/veterans?\s+service\s+officers?/g,'vso')
      .replace(/[^a-z0-9+#]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function tokens(value){
    return normalize(value).split(' ').filter(function(part){return part && !STOP[part];});
  }
  function expand(query){
    var parts=tokens(query);
    var extra=[];
    Object.keys(SYNONYMS).forEach(function(key){
      var hay=normalize(query);
      if(hay.indexOf(normalize(key))>-1){
        extra=extra.concat(SYNONYMS[key].map(normalize));
      }
      SYNONYMS[key].forEach(function(alias){
        if(hay.indexOf(normalize(alias))>-1) extra.push(normalize(key));
      });
    });
    return {parts:parts, extra:extra, raw:normalize(query)};
  }
  function score(item, parsed){
    var title=normalize(item.title);
    var blob=normalize(text(item));
    var pts=0;
    if(!parsed.raw) return item.official?12:0;
    if(title===parsed.raw) pts+=120;
    if(title.indexOf(parsed.raw)===0) pts+=55;
    else if(title.indexOf(parsed.raw)>-1) pts+=36;
    parsed.parts.forEach(function(part){
      if(title.indexOf(part)===0) pts+=28;
      else if(title.indexOf(part)>-1) pts+=18;
      else if(blob.indexOf(part)>-1) pts+=8;
      else pts-=14;
    });
    parsed.extra.forEach(function(part){
      if(title.indexOf(part)>-1) pts+=14;
      else if(blob.indexOf(part)>-1) pts+=7;
    });
    if(item.official) pts+=12;
    if(item.category==='Urgent help') pts+=10;
    var urgentQuery=/crisis|988|suicide|homeless|housing|danger|evict/.test(parsed.raw);
    if(urgentQuery && (item.category==='Urgent help'||(item.tags||[]).indexOf('housing')>-1)) pts+=22;
    return pts;
  }
  function matchesFilters(item, q, category, county, audience, urgent, official){
    if(category && item.category!==category) return false;
    if(county && item.county!==county) return false;
    if(audience && item.audience!==audience) return false;
    if(urgent && !(item.category==='Urgent help'||(item.tags||[]).indexOf('housing')>-1)) return false;
    if(official && !item.official) return false;
    if(!q) return true;
    var parsed=expand(q);
    if(!parsed.parts.length) return text(item).indexOf(q)>-1;
    var blob=normalize(text(item)+' '+item.title);
    var andHit=parsed.parts.every(function(part){return blob.indexOf(part)>-1;});
    if(andHit) return true;
    var orHit=parsed.parts.some(function(part){return blob.indexOf(part)>-1;}) || parsed.extra.some(function(part){return blob.indexOf(part)>-1;});
    return orHit && score(item, parsed)>0;
  }
  function render(item){
    var url=item.url||'#';
    var note=item.eastTnNote?'<p class="small"><strong>East TN note:</strong> '+safe(item.eastTnNote)+'</p>':'';
    var checked=item.lastVerified||item.lastChecked;
    var visibleUrl=item.officialUrl||(/^https?:\/\//.test(url)?url:'');
    var phone=item.phone&&item.phone!=='No phone'?'<p class="small"><strong>Phone:</strong> '+safe(item.phone)+'</p>':'';
    var officialUrl=visibleUrl?'<p class="small"><strong>Official website:</strong> <a href="'+safe(visibleUrl)+'" target="_blank" rel="noopener noreferrer">'+safe(visibleUrl)+'</a></p>':'';
    var officialNote=item.officialWebsiteNote?'<p class="small"><strong>Official website:</strong> '+safe(item.officialWebsiteNote)+'</p>':'';
    var safety=item.safetyNote?'<p class="small"><strong>Safety note:</strong> '+safe(item.safetyNote)+'</p>':'';
    var chapter=item.chapterPath?'<p class="small"><a href="'+safe(item.chapterPath)+'">Open related chapter update page</a></p>':'';
    var officialBadge=item.official?'<span class="badge-official">Official source</span>':'';
    var meta='<div class="result-meta">'+officialBadge+'<span>'+safe(item.category)+'</span><span>'+safe(item.county)+'</span><span>'+safe(item.audience)+'</span>'+(item.sourceType?'<span>'+safe(item.sourceType)+'</span>':'')+(checked?'<span>Last checked '+safe(checked)+'</span>':'')+'</div>';
    return '<article class="result-card'+(item.official?' is-official':'')+'"><h2>'+safe(item.title)+'</h2><p>'+safe(item.purpose||item.description)+'</p>'+note+phone+officialUrl+officialNote+safety+chapter+meta+'<a class="button" href="'+safe(url)+'"'+(external(url)?' target="_blank" rel="noopener noreferrer"':'')+'>'+(item.category==='Urgent help'?'Start here':'View resource')+'</a></article>';
  }
  document.addEventListener('DOMContentLoaded',function(){
    var data=(window.VOLS4VETS_RESOURCES||[]).concat(window.VOLS4VETS_BOOK_RESOURCES||[]);
    var input=document.querySelector('[data-site-search]');
    var results=document.querySelector('[data-results]');
    if(!input||!results){return;}
    var form=input.closest('form');
    var category=document.querySelector('[data-category-filter]');
    var county=document.querySelector('[data-county-filter]');
    var audience=document.querySelector('[data-audience-filter]');
    var urgent=document.querySelector('[data-urgent-filter]');
    var official=document.querySelector('[data-official-filter]');
    var count=document.querySelector('[data-result-count]');
    var empty=document.querySelector('[data-empty]');
    var shown=PAGE;
    category.innerHTML='<option value="">All categories</option>'+unique(data.map(function(i){return i.category;})).map(option).join('');
    county.innerHTML='<option value="">All counties</option>'+unique(data.map(function(i){return i.county;})).map(option).join('');
    audience.innerHTML='<option value="">All audiences</option>'+unique(data.map(function(i){return i.audience;})).map(option).join('');
    input.value=new URLSearchParams(location.search).get('q')||'';
    function syncUrl(q){
      if(!history.replaceState) return;
      var url=q?('/search?q='+encodeURIComponent(q)):'/search';
      if(location.pathname.replace(/\/$/,'')==='/search' && location.search.replace(/^\?q=/,'')!==q){
        history.replaceState(null,'',url);
      }
    }
    function ranked(){
      var q=input.value.trim();
      var parsed=expand(q);
      var filtered=data.filter(function(item){
        return matchesFilters(item, q.toLowerCase(), category.value, county.value, audience.value, urgent.checked, official.checked);
      });
      filtered.sort(function(a,b){return score(b, parsed)-score(a, parsed);});
      var seen={};
      return filtered.filter(function(item){
        var key=((item.officialUrl||item.url||'')+'|'+item.title).toLowerCase();
        if(seen[key]) return false;
        seen[key]=true;
        return true;
      });
    }
    function apply(resetPage){
      if(resetPage) shown=PAGE;
      var q=input.value.trim();
      var filtered=ranked();
      var visible=filtered.slice(0, shown);
      results.innerHTML=visible.map(render).join('')+(filtered.length>visible.length?'<p><button class="button button-secondary" type="button" data-show-more>Show more results</button></p>':'');
      count.textContent=filtered.length+' result'+(filtered.length===1?'':'s')+' shown'+(q?' for “'+q+'”':'')+'. Official sources are listed first when they match.';
      empty.hidden=filtered.length!==0;
      syncUrl(q);
    }
    results.addEventListener('click',function(event){
      if(event.target.closest('[data-show-more]')){
        shown+=PAGE;
        apply(false);
      }
    });
    [input,category,county,audience,urgent,official].forEach(function(el){el.addEventListener('input',function(){apply(true);});el.addEventListener('change',function(){apply(true);});});
    form.addEventListener('submit',function(event){event.preventDefault();apply(true);});
    apply(true);
  });
})();
