(function(){
  function text(item){
    return [item.title,item.description,item.purpose,item.eastTnNote,item.category,item.county,item.state,item.audience,(item.tags||[]).join(' '),item.phone,item.sourceType].join(' ').toLowerCase();
  }
  function unique(values){return Array.from(new Set(values.filter(Boolean))).sort();}
  function option(value){return '<option value="'+value+'">'+value+'</option>';}
  function external(url){return /^https?:\/\//.test(url);}
  function safe(value){return String(value||'').replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}
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
    var meta='<div class="result-meta"><span>'+safe(item.category)+'</span><span>'+safe(item.county)+'</span><span>'+safe(item.audience)+'</span>'+(item.official?'<span>Official source</span>':'')+(item.sourceType?'<span>'+safe(item.sourceType)+'</span>':'')+(checked?'<span>Last checked '+safe(checked)+'</span>':'')+'</div>';
    return '<article class="result-card"><h2>'+safe(item.title)+'</h2><p>'+safe(item.purpose||item.description)+'</p>'+note+phone+officialUrl+officialNote+safety+chapter+meta+'<a class="button" href="'+safe(url)+'"'+(external(url)?' target="_blank" rel="noopener noreferrer"':'')+'>'+(item.category==='Urgent help'?'Start here':'View resource')+'</a></article>';
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
    category.innerHTML='<option value="">All categories</option>'+unique(data.map(function(i){return i.category;})).map(option).join('');
    county.innerHTML='<option value="">All counties</option>'+unique(data.map(function(i){return i.county;})).map(option).join('');
    audience.innerHTML='<option value="">All audiences</option>'+unique(data.map(function(i){return i.audience;})).map(option).join('');
    input.value=new URLSearchParams(location.search).get('q')||'';
    function apply(){
      var q=input.value.trim().toLowerCase();
      var filtered=data.filter(function(item){
        return (!q||text(item).indexOf(q)>-1)&&(!category.value||item.category===category.value)&&(!county.value||item.county===county.value)&&(!audience.value||item.audience===audience.value)&&(!urgent.checked||item.category==='Urgent help'||(item.tags||[]).indexOf('housing')>-1)&&(!official.checked||item.official);
      });
      results.innerHTML=filtered.map(render).join('');
      count.textContent=filtered.length+' result'+(filtered.length===1?'':'s')+' shown.';
      empty.hidden=filtered.length!==0;
    }
    [input,category,county,audience,urgent,official].forEach(function(el){el.addEventListener('input',apply);el.addEventListener('change',apply);});
    form.addEventListener('submit',function(event){event.preventDefault();apply();});
    apply();
  });
})();
