document.addEventListener('DOMContentLoaded',function(){
  var current=location.pathname.replace(/\/$/,'')||'/';
  var nav=document.getElementById('main-nav');
  var navLinks=[
    ['Home','/'],
    ['Find My Next Step','/find-my-next-step'],
    ['Search','/search'],
    ['Resources','/resources'],
    ['Urgent Help','/resources-crisis-support'],
    ['East Tennessee','/resources-east-tennessee'],
    ['About','/about']
  ];
  if(nav){
    nav.innerHTML=navLinks.map(function(item){
      var active=current===item[1]?' aria-current="page"':'';
      var cls=item[0]==='Find My Next Step'?' class="nav-cta"':'';
      return '<a href="'+item[1]+'"'+cls+active+'>'+item[0]+'</a>';
    }).join('');
  }

  document.querySelectorAll('.crisis-bar').forEach(function(bar){
    bar.innerHTML='Veteran in crisis or worried about one? Call <a href="tel:988">988</a>, then press 1. Text <a href="sms:838255">838255</a>. If there is immediate danger, call <a href="tel:911">911</a>.';
  });

  var footer=document.querySelector('.site-footer');
  if(footer){
    footer.innerHTML='<div class="container"><div class="footer-grid"><div><a class="brand" href="/"><img class="brand-mark" src="/vols4vets-original-patch.webp" alt="" width="34" height="34"><span>Vols4Vets</span></a><p>Independent veteran resource routing from Sevierville, Tennessee. Vols4Vets is not the VA, not a crisis line, not a law firm, not a medical provider, not an emergency service and not an accredited claims representative.</p></div><div><h3>Start</h3><ul class="footer-links"><li><a href="/resources">Resources</a></li><li><a href="/resources-crisis-support">Urgent Help</a></li><li><a href="/find-my-next-step">Find My Next Step</a></li><li><a href="/search">Search</a></li><li><a href="/about">About</a></li></ul></div><div><h3>Trust</h3><ul class="footer-links"><li><a href="/verification-policy">Verification Policy</a></li><li><a href="/correction-request">Correction Request</a></li><li><a href="/privacy-safety">Privacy and Safety</a></li><li><a href="/partner-sponsor-policy">Partner and Sponsor Policy</a></li><li><a href="/no-claims-representation">No Claims Representation</a></li><li><a href="/crisis-emergency-disclaimer">Crisis and Emergency Disclaimer</a></li><li><a href="/monthly-update-log">Monthly Update Log</a></li></ul></div></div><div class="footer-bottom">© 2026 Vols4Vets LLC. Verify current information directly with each official source before you drive, apply, call or send records.</div></div>';
  }

  var button=document.querySelector('[data-nav-toggle]');
  if(button&&nav){
    button.addEventListener('click',function(){
      var open=button.getAttribute('aria-expanded')==='true';
      button.setAttribute('aria-expanded',String(!open));
      nav.classList.toggle('is-open',!open);
    });
  }

  var p=['865','771','3114'].join('-');
  var e=['vols4','vets','@','gmail','.','com'].join('');
  var tel='tel:+1'+p.replace(/-/g,'');
  var mail='mailto:'+e;
  document.querySelectorAll('a').forEach(function(link){
    var href=link.getAttribute('href')||'';
    if(href===tel||href===mail){
      link.setAttribute('href','/about#contact');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.textContent='Protected contact section';
    }
  });

  var reveal=document.querySelector('[data-reveal-contact]');
  var target=document.querySelector('[data-contact-target]');
  if(reveal&&target){
    reveal.addEventListener('click',function(){
      target.hidden=false;
      target.innerHTML='<h3>Contact details</h3><p><strong>Phone</strong><br><span>'+p+'</span></p><p><strong>Email</strong><br><span>'+e.replace('@',' [at] ').replace('.', ' [dot] ')+'</span></p><p class="small">Copy the details manually. Direct call and email links are disabled to reduce bot scraping. Do not send Social Security numbers, claim numbers, medical records or passwords.</p>';
      reveal.setAttribute('aria-expanded','true');
      reveal.textContent='Contact details shown';
      reveal.disabled=true;
    });
  }
});
