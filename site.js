document.documentElement.classList.add('is-enhanced');
document.addEventListener('DOMContentLoaded', function () {
  var current = location.pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/';
  var nav = document.getElementById('main-nav');
  var button = document.querySelector('[data-nav-toggle]');

  if (nav) {
    // One navigation definition for all existing pages; older static menus remain a fallback.
    nav.innerHTML = '<a href="/resources">Find help</a>' +
      '<a href="/resources-family-support">Family</a>' +
      '<a href="/east-tennessee-veteran-resources">East Tennessee</a>' +
      '<a href="/sections">Book companion</a>' +
      '<a href="/search">Search</a>' +
      '<a href="/contact">Contact Us</a>' +
      '<a class="nav-cta" href="/find-my-next-step">My next step</a>';
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
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) setNav(false);
    });
  }

  var e = ['vols4', 'vets', '@', 'gmail', '.', 'com'].join('');
  var mail = 'mailto:' + e;

  var reveal = document.querySelector('[data-reveal-contact]');
  var target = document.querySelector('[data-contact-target]');
  if (reveal && target) {
    reveal.addEventListener('click', function () {
      target.hidden = false;
      var display = e.replace('@', ' [at] ').replace('.', ' [dot] ');
      target.innerHTML = '<h3>Email Vols4Vets</h3><p><strong>Email only</strong><br><a href="' + mail + '">' + display + '</a></p><p class="small">We prefer email. We do not accept telephone calls from website visitors. Do not send Social Security numbers, claim numbers, medical records or passwords. Vols4Vets is not an emergency service.</p>';
      reveal.setAttribute('aria-expanded', 'true');
      reveal.textContent = 'Email shown';
      reveal.disabled = true;
    });
  }

  var pathPages = [
    '/resources-crisis-support', '/resources-va-benefits-healthcare', '/resources-jobs-training', '/resources-travel-tickets', '/resources-discounts-deals', '/resources-banking-insurance', '/resources-housing-legal', '/resources-family-support', '/resources-east-tennessee', '/resources-national-global', '/resources-state-benefits', '/resources-education', '/resources-business-entrepreneurship', '/resources-disability-caregiver', '/resources-women-veterans', '/resources-retirees', '/resources-east-tennessee-discounts', '/resources-veteran-owned-businesses', '/east-tennessee-veteran-resources', '/sevierville-veteran-resources', '/sevier-county-veteran-resources', '/knoxville-veteran-resources', '/knox-county-veteran-resources', '/mountain-home-va-guide', '/tennessee-va-benefits-help', '/start-va-disability-claim', '/what-to-bring-vso', '/replace-dd214', '/homeless-veteran-help-east-tennessee', '/veteran-job-help-east-tennessee', '/veteran-legal-aid-east-tennessee', '/women-veterans-east-tennessee', '/military-family-caregiver-help', '/sevier-county-veteran-service-office-guide', '/knox-county-veteran-service-office-guide', '/mountain-home-va-location-checklist', '/american-job-center-east-tennessee-veterans', '/legal-aid-east-tennessee-veterans-guide', '/tennessee-department-veterans-services-guide', '/toolkits', '/va-claim-starter-checklist', '/housing-risk-action-checklist', '/veteran-job-search-starter-kit', '/dd214-replacement-checklist', '/vso-appointment-packet', '/mountain-home-va-appointment-prep', '/legal-aid-deadline-checklist', '/women-veterans-official-support-checklist', '/family-caregiver-support-checklist', '/tennessee-benefits-checklist', '/county-office-call-script', '/after-you-get-your-next-steps', '/most-used'
  ];
  var main = document.getElementById('main');
  if (pathPages.indexOf(current) > -1 && main) {
    var help = document.createElement('section');
    help.className = 'section section-compact no-print';
    help.innerHTML = '<div class="container"><div class="page-feedback"><h2>Still need help?</h2><p>Get a step-by-step plan, or report a problem by email. No answers are silently submitted and no private records are collected.</p><div class="feedback-actions"><a class="button" href="/find-my-next-step">Get a starting plan</a><a class="button button-secondary" href="/contact">Report a problem by email</a></div></div></div>';
    main.appendChild(help);
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
