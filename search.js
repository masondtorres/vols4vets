(function(){
  function text(item){
    return [item.title,item.description,item.category,item.county,item.state,item.audience,(item.tags||[]).join(' '),item.phone].join(' ').toLowerCase();
  }
  function unique(values){return Array.from(new Set(values.filter(Boolean))).sort();}
  function option(value){return '<option value="'+value+'">'+value+'</option>';}
  function render(item){
    return '<article class="result-card"><h2>'+item.title+'</h2><p>'+item.description+'</p><div class="result-meta"><span>'+item.category+'</span><span>'+item.county+'</span><span>'+item.audience+'</span>'+(item.official?'<span>Official source</span>':'')+'<span>Last verified '+item.lastVerified+'</span></div><a class="button" href="'+item.url+'">'+(item.category==='Urgent help'?'Start here':'View resource')+'</a></article>';
  }
  document.addEventListener('DOMContentLoaded',function(){
    var data=window.VOLS4VETS_RESOURCES||[];
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
