document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.classList.add('is-enhanced');
  var current = location.pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/';
  var nav = document.getElementById('main-nav');
  var button = document.querySelector('[data-nav-toggle]');

  if (nav) {
    nav.querySelectorAll('a[href]').forEach(function (link) {
      var href = (link.getAttribute('href') || '').replace(/\/$/, '').replace(/\.html$/, '') || '/';
      if (href === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function setNav(open) {
    if (!button || !nav) return;
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    button.textContent = open ? 'Close' : 'Menu';
  }

  if (button && nav) {
    button.addEventListener('click', function () {
      setNav(button.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setNav(false);
    });
  }

  var p = ['865', '771', '3114'].join('-');
  var e = ['vols4', 'vets', '@', 'gmail', '.', 'com'].join('');
  var tel = 'tel:+1' + p.replace(/-/g, '');
  var mail = 'mailto:' + e;
  document.querySelectorAll('a').forEach(function (link) {
    if (link.hasAttribute('data-direct-contact')) return;
    var href = link.getAttribute('href') || '';
    if (href === tel || href === mail) {
      link.setAttribute('href', '/about#contact');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.textContent = 'Protected contact section';
    }
  });

  var reveal = document.querySelector('[data-reveal-contact]');
  var target = document.querySelector('[data-contact-target]');
  if (reveal && target) {
    reveal.addEventListener('click', function () {
      target.hidden = false;
      target.innerHTML = '<h3>Contact details</h3><p><strong>Phone</strong><br><span>' + p + '</span></p><p><strong>Email</strong><br><span>' + e.replace('@', ' [at] ').replace('.', ' [dot] ') + '</span></p><p class="small">Copy the details manually. Direct call and email links are disabled to reduce bot scraping. Do not send Social Security numbers, claim numbers, medical records or passwords.</p>';
      reveal.setAttribute('aria-expanded', 'true');
      reveal.textContent = 'Contact details shown';
      reveal.disabled = true;
    });
  }

  var pathPages = [
    '/resources-crisis-support', '/resources-va-benefits-healthcare', '/resources-jobs-training', '/resources-travel-tickets', '/resources-discounts-deals', '/resources-banking-insurance', '/resources-housing-legal', '/resources-family-support', '/resources-east-tennessee', '/resources-national-global', '/resources-state-benefits', '/resources-education', '/resources-business-entrepreneurship', '/resources-disability-caregiver', '/resources-women-veterans', '/resources-retirees', '/resources-east-tennessee-discounts', '/resources-veteran-owned-businesses', '/east-tennessee-veteran-resources', '/sevierville-veteran-resources', '/sevier-county-veteran-resources', '/knoxville-veteran-resources', '/knox-county-veteran-resources', '/mountain-home-va-guide', '/tennessee-va-benefits-help', '/start-va-disability-claim', '/what-to-bring-vso', '/replace-dd214', '/homeless-veteran-help-east-tennessee', '/veteran-job-help-east-tennessee', '/veteran-legal-aid-east-tennessee', '/women-veterans-east-tennessee', '/military-family-caregiver-help', '/sevier-county-veteran-service-office-guide', '/knox-county-veteran-service-office-guide', '/mountain-home-va-location-checklist', '/american-job-center-east-tennessee-veterans', '/legal-aid-east-tennessee-veterans-guide', '/tennessee-department-veterans-services-guide', '/toolkits', '/va-claim-starter-checklist', '/housing-risk-action-checklist', '/veteran-job-search-starter-kit', '/dd214-replacement-checklist', '/vso-appointment-packet', '/mountain-home-va-appointment-prep', '/legal-aid-deadline-checklist', '/women-veterans-official-support-checklist', '/family-caregiver-support-checklist', '/tennessee-benefits-checklist', '/county-office-call-script', '/after-you-get-your-next-steps', '/most-used'
  ];
  var main = document.getElementById('main');
  if (pathPages.indexOf(current) > -1 && main) {
    var feedback = document.createElement('section');
    feedback.className = 'section section-compact no-print';
    feedback.innerHTML = '<div class="container"><div class="page-feedback"><h2>Did this give you a clear next step?</h2><div class="feedback-actions"><button type="button" data-feedback-answer="yes">Yes</button><button type="button" data-feedback-answer="not-yet">Not yet</button></div><p class="small" aria-live="polite" data-feedback-status></p><p class="small"><a href="/feedback-guidelines">Feedback guidelines</a>. Do not send private details.</p></div></div>';
    main.appendChild(feedback);
    feedback.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-feedback-answer]');
      if (!btn) return;
      var status = feedback.querySelector('[data-feedback-status]');
      if (status) {
        status.textContent = btn.getAttribute('data-feedback-answer') === 'yes'
          ? 'Thanks. Nothing private was collected.'
          : 'Thanks. Try Search, Resources or Report a broken link if a resource did not work. Nothing private was collected.';
      }
    });
  }

  if (main && (document.querySelector('.resource-card') || document.querySelector('.link-list'))) {
    if (!document.querySelector('.broken-link-report')) {
      var report = document.createElement('div');
      report.className = 'broken-link-report no-print';
      report.innerHTML = '<a href="/report-broken-link">Report a broken link</a>';
      var firstResource = document.querySelector('.resource-card,.link-list');
      var section = firstResource && firstResource.classList.contains('resource-card') ? firstResource.closest('.section') : null;
      if (firstResource && firstResource.classList.contains('link-list') && firstResource.parentNode) {
        firstResource.parentNode.insertBefore(report, firstResource);
      } else if (section && section.parentNode) {
        report.className = 'container broken-link-report no-print';
        section.parentNode.insertBefore(report, section);
      } else {
        main.appendChild(report);
      }
    }
  }

  var triageForm = document.querySelector('[data-triage-form]');
  var triageResult = document.querySelector('[data-triage-result]');
  if (triageForm && triageResult) {
    function selectedValue(name) {
      var input = triageForm.querySelector('[name="' + name + '"]:checked');
      return input ? input.value : '';
    }

    function syncAskGrok() {
      var existing = triageResult.querySelector('[data-ask-grok-wrap]');
      if (existing) return;
      if (!triageResult.querySelector('.action-plan-print')) return;

      var issue = selectedValue('issue');
      var locationValue = selectedValue('location');
      var urgency = selectedValue('urgency');
      var goal = selectedValue('goal');
      if (!issue || !locationValue || !urgency || !goal) return;
      if (/crisis|danger/i.test(issue) || urgency === 'Immediate danger') return;

      var wrap = document.createElement('div');
      wrap.className = 'no-print';
      wrap.setAttribute('data-ask-grok-wrap', '');
      wrap.innerHTML = '<div class="notice"><strong>Want a second opinion?</strong> Ask Grok opens in a new tab with only these four choices: issue, location, urgency and goal. It does not send your documents, checklist items, saved records or anything you typed elsewhere. AI can be wrong; verify rules, phone numbers, eligibility and deadlines with the official source.</div><div class="tool-actions"><button class="button button-secondary" type="button" data-ask-grok>Ask Grok about this plan</button></div>';
      var actions = triageResult.querySelector('.tool-actions');
      if (actions && actions.parentNode) actions.parentNode.insertBefore(wrap, actions.nextSibling);
      else triageResult.appendChild(wrap);

      var askButton = wrap.querySelector('[data-ask-grok]');
      askButton.addEventListener('click', function () {
        var prompt = [
          'I used the Vols4Vets Find My Next Step tool and want a second opinion on the safest next move.',
          'Issue: ' + issue + '.',
          'Location: ' + locationValue + '.',
          'Urgency: ' + urgency + '.',
          'Goal: ' + goal + '.',
          'Use current official government, VA, state, county, or accredited-provider sources for any factual claim. Distinguish confirmed facts from suggestions. Do not invent phone numbers, office hours, deadlines, eligibility rules, benefits, medical advice, or legal advice. Prefer direct official-source links. Keep the answer concise and give no more than five next actions. If the situation may actually be an emergency or crisis, stop general guidance and tell me to call 911 for immediate danger or contact the Veterans Crisis Line at 988 then press 1 or text 838255.'
        ].join('\n');
        window.open('https://grok.com/?q=' + encodeURIComponent(prompt), '_blank', 'noopener,noreferrer');
      });
    }

    var observer = new MutationObserver(syncAskGrok);
    observer.observe(triageResult, { childList: true, subtree: true });
    syncAskGrok();
  }
});
