document.addEventListener('DOMContentLoaded',function(){
  var current=location.pathname.replace(/\/$/,'').replace(/\.html$/,'')||'/';
  var nav=document.getElementById('main-nav');

  if(current==='/'&&!document.getElementById('homepage-visual-finish')){
    var visual=document.createElement('style');
    visual.id='homepage-visual-finish';
    visual.textContent=".home-landing-hero{position:relative;overflow:hidden;background:linear-gradient(90deg,rgba(34,39,43,.86),rgba(34,39,43,.58)),url('/east-tennessee-hero.webp') center 46%/cover no-repeat!important;padding:3rem 0!important;color:#fff;border-bottom:4px solid var(--orange)}.home-landing-hero .page-intro{background:rgba(255,255,255,.94);color:var(--ink);border:1px solid rgba(255,130,0,.35);border-left:7px solid var(--orange);border-radius:22px;padding:clamp(1.25rem,4vw,2.25rem);box-shadow:0 24px 50px rgba(0,0,0,.28);backdrop-filter:blur(4px)}.home-brand-logo{filter:drop-shadow(0 12px 24px rgba(88,89,91,.22))}.home-brand-title{color:var(--smoky-dark)!important}.home-brand-subline{color:#3d464d!important;font-weight:700}.trust-line{background:#fff;color:var(--smoky-dark)}.card a.button,.route-card a.button,.next-step-panel a.button,.home-search .button{color:#fff!important;background:var(--orange)!important;border-color:var(--orange)!important;text-shadow:0 1px 1px rgba(0,0,0,.18)}.card a.button:hover,.route-card a.button:hover,.next-step-panel a.button:hover,.home-search .button:hover{color:#fff!important;background:#e67600!important;border-color:#e67600!important}.route-card{overflow:hidden;padding-top:0!important;border-radius:16px;background:#fff;border:1px solid #d8e0e6;box-shadow:0 12px 28px rgba(34,39,43,.1)}.route-card::before{content:'';display:block;height:72px;margin:-1.35rem -1.35rem 1rem;background:linear-gradient(120deg,rgba(255,130,0,.95),rgba(88,89,91,.74)),url('/east-tennessee-hero.webp') center/cover no-repeat}.route-icon{margin-top:-42px;position:relative;background:#fff!important;color:var(--orange-dark)!important;border:3px solid #fff!important;box-shadow:0 8px 18px rgba(34,39,43,.18);font-size:.92rem}.route-card h3{font-size:1.22rem;color:var(--smoky-dark)}.route-card p{color:#4d5963;font-weight:650}.card-critical::before{background:linear-gradient(120deg,rgba(180,35,24,.95),rgba(88,89,91,.72)),url('/east-tennessee-hero.webp') center/cover no-repeat}.card-local::before{background:linear-gradient(120deg,rgba(255,130,0,.98),rgba(191,87,0,.72)),url('/east-tennessee-hero.webp') center/cover no-repeat}@media(max-width:560px){.home-landing-hero{padding:1.9rem 0!important}.home-landing-hero .page-intro{border-radius:16px;padding:1rem}.route-card::before{height:64px}}";
    document.head.appendChild(visual);
  }

  if(nav&&!nav.querySelector('a[href="/find-my-next-step"]')){
    var cta=document.createElement('a');
    cta.className='nav-cta';
    cta.href='/find-my-next-step';
    cta.textContent='Find My Next Step';
    var home=nav.querySelector('a[href="/"]');
    if(home&&home.nextSibling){
      nav.insertBefore(cta,home.nextSibling);
    }else if(home){
      nav.appendChild(cta);
    }else{
      nav.insertBefore(cta,nav.firstChild);
    }
  }

  if(nav){
    nav.querySelectorAll('a[href]').forEach(function(link){
      var href=(link.getAttribute('href')||'').replace(/\/$/,'').replace(/\.html$/,'')||'/';
      if(href===current){
        link.setAttribute('aria-current','page');
      }else{
        link.removeAttribute('aria-current');
      }
    });
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
    if(link.hasAttribute('data-direct-contact'))return;
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

  var pathPages=[
    '/resources-crisis-support','/resources-va-benefits-healthcare','/resources-jobs-training','/resources-travel-tickets','/resources-discounts-deals','/resources-banking-insurance','/resources-housing-legal','/resources-family-support','/resources-east-tennessee','/resources-national-global','/resources-state-benefits','/resources-education','/resources-business-entrepreneurship','/resources-disability-caregiver','/resources-women-veterans','/resources-retirees','/resources-east-tennessee-discounts','/resources-veteran-owned-businesses','/east-tennessee-veteran-resources','/sevierville-veteran-resources','/sevier-county-veteran-resources','/knoxville-veteran-resources','/knox-county-veteran-resources','/mountain-home-va-guide','/tennessee-va-benefits-help','/start-va-disability-claim','/what-to-bring-vso','/replace-dd214','/homeless-veteran-help-east-tennessee','/veteran-job-help-east-tennessee','/veteran-legal-aid-east-tennessee','/women-veterans-east-tennessee','/military-family-caregiver-help','/sevier-county-veteran-service-office-guide','/knox-county-veteran-service-office-guide','/mountain-home-va-location-checklist','/american-job-center-east-tennessee-veterans','/legal-aid-east-tennessee-veterans-guide','/tennessee-department-veterans-services-guide','/toolkits','/va-claim-starter-checklist','/housing-risk-action-checklist','/veteran-job-search-starter-kit','/dd214-replacement-checklist','/vso-appointment-packet','/mountain-home-va-appointment-prep','/legal-aid-deadline-checklist','/women-veterans-official-support-checklist','/family-caregiver-support-checklist','/tennessee-benefits-checklist','/county-office-call-script','/after-you-get-your-next-steps','/most-used'
  ];
  var isPathPage=pathPages.indexOf(current)>-1;
  var main=document.getElementById('main');

  if(isPathPage&&main){
    var feedback=document.createElement('section');
    feedback.className='section section-compact no-print';
    feedback.innerHTML='<div class="container"><div class="page-feedback"><h2>Did this give you a clear next step?</h2><div class="feedback-actions"><button type="button" data-feedback-answer="yes">Yes</button><button type="button" data-feedback-answer="not-yet">Not yet</button></div><p class="small" aria-live="polite" data-feedback-status></p><p class="small"><a href="/feedback-guidelines">Feedback guidelines</a>. Do not send private details.</p></div></div>';
    main.appendChild(feedback);

    feedback.addEventListener('click',function(event){
      var button=event.target.closest('[data-feedback-answer]');
      if(!button)return;
      var status=feedback.querySelector('[data-feedback-status]');
      if(status){
        status.textContent=button.getAttribute('data-feedback-answer')==='yes'?'Thanks. Nothing private was collected.':'Thanks. Try Search, All Paths or Report a Broken Link if a resource did not work. Nothing private was collected.';
      }
    });
  }

  if(main&&(document.querySelector('.resource-card')||document.querySelector('.link-list'))){
    var report=document.createElement('div');
    report.className='broken-link-report no-print';
    report.innerHTML='<a href="/report-broken-link">Report a broken link</a>';
    var firstResource=document.querySelector('.resource-card,.link-list');
    var section=firstResource&&firstResource.classList.contains('resource-card')?firstResource.closest('.section'):null;
    if(firstResource&&firstResource.classList.contains('link-list')&&firstResource.parentNode){
      firstResource.parentNode.insertBefore(report,firstResource);
    }else if(section&&section.parentNode){
      report.className='container broken-link-report no-print';
      section.parentNode.insertBefore(report,section);
    }else{
      main.appendChild(report);
    }
  }
});