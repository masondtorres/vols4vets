document.addEventListener('DOMContentLoaded',function(){
  var button=document.querySelector('[data-nav-toggle]');
  var nav=document.getElementById('main-nav');
  if(button&&nav){
    button.addEventListener('click',function(){
      var open=button.getAttribute('aria-expanded')==='true';
      button.setAttribute('aria-expanded',String(!open));
      nav.classList.toggle('is-open',!open);
    });
  }

  var reveal=document.querySelector('[data-reveal-contact]');
  var target=document.querySelector('[data-contact-target]');
  if(reveal&&target){
    reveal.addEventListener('click',function(){
      var p=['865','771','3114'].join('-');
      var e=['vols4','vets','@','gmail','.','com'].join('');
      target.hidden=false;
      target.innerHTML='<h3>Contact details</h3><p><strong>Phone</strong><br><span>'+p+'</span></p><p><strong>Email</strong><br><span>'+e.replace('@',' [at] ').replace('.', ' [dot] ')+'</span></p><p class="small">Copy the details manually. Direct call and email links are disabled to reduce bot scraping. Do not send Social Security numbers, claim numbers, medical records or passwords.</p>';
      reveal.setAttribute('aria-expanded','true');
      reveal.textContent='Contact details shown';
      reveal.disabled=true;
    });
  }
});
