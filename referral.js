(function () {
  var STORAGE_KEY = 'vols4vets_referral_times';

  function field(form, name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'radio' || (el.length && el[0] && el[0].type === 'radio')) {
      var checked = form.querySelector('[name="' + name + '"]:checked');
      return checked ? checked.value : '';
    }
    return el.value || '';
  }

  function rateLimited(now) {
    var times = [];
    try { times = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { times = []; }
    times = times.filter(function (t) { return now - t < 60 * 60 * 1000; });
    return { limited: times.length >= 3, times: times };
  }

  function remember(times, now) {
    times.push(now);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(times.slice(-5))); } catch (e) { /* private mode */ }
  }

  function reference(now) {
    var d = new Date(now);
    var day = d.getUTCFullYear() + String(d.getUTCMonth() + 1).padStart(2, '0') + String(d.getUTCDate()).padStart(2, '0');
    var tail = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'V4V-' + day + '-' + tail;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-referral-form]');
    var errors = document.querySelector('[data-referral-errors]');
    var result = document.querySelector('[data-referral-result]');
    if (!form || !window.Vols4VetsReferral) return;
    var startedAt = Date.now();
    var claims = form.querySelector('[data-claims-fields]');
    function syncClaims() {
      if (!claims) return;
      claims.hidden = field(form, 'claimsRelated') !== 'yes';
    }
    form.addEventListener('change', syncClaims);
    syncClaims();

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var now = Date.now();
      var limit = rateLimited(now);
      var outcome = window.Vols4VetsReferral.validateReferral({
        lane: field(form, 'lane'),
        honeypot: field(form, 'company_website_confirm'),
        organizationName: field(form, 'organizationName'),
        website: field(form, 'website'),
        serviceOffered: field(form, 'serviceOffered'),
        whoItServes: field(form, 'whoItServes'),
        geographicArea: field(form, 'geographicArea'),
        cost: field(form, 'cost'),
        licensing: field(form, 'licensing'),
        relationship: field(form, 'relationship'),
        relationshipDetail: field(form, 'relationshipDetail'),
        contactName: field(form, 'contactName'),
        contactEmail: field(form, 'contactEmail'),
        contactPhone: field(form, 'contactPhone'),
        publicNotes: field(form, 'publicNotes'),
        claimsRelated: field(form, 'claimsRelated'),
        claimsAccreditation: field(form, 'claimsAccreditation'),
        attested: field(form, 'attested')
      }, { now: now, startedAt: startedAt });

      if (limit.limited) outcome.errors.push('This browser already prepared three review packets in the past hour. Wait and try again, or use the correction page if something already listed is wrong.');
      if (errors) {
        errors.hidden = outcome.errors.length === 0;
        errors.innerHTML = outcome.errors.length ? '<strong>Fix these before a review packet can be created.</strong><ul>' + outcome.errors.map(function (item) {
          return '<li>' + item.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</li>';
        }).join('') + '</ul>' : '';
      }
      if (!outcome.ok || limit.limited) {
        if (result) result.hidden = true;
        if (errors) errors.focus();
        return;
      }

      remember(limit.times, now);
      var ref = reference(now);
      var packet = outcome.packet;
      packet.reference = ref;
      packet.preparedAt = new Date(now).toISOString();
      var pretty = JSON.stringify(packet, null, 2);
      var mail = ['vols4', 'vets', '@', 'gmail', '.', 'com'].join('');
      var body = [
        'Vols4Vets resource suggestion ' + ref,
        'Status: received for review only if this email was actually sent and delivered. Nothing here authorizes publication.',
        '',
        pretty
      ].join('\n');
      if (result) {
        result.hidden = false;
        result.innerHTML = '<h2>Review packet prepared — not sent or published.</h2><p>Reference <strong>' + ref + '</strong>. This page has NOT submitted anything to Vols4Vets. To send your request, tap "Open email draft", then press Send in your email app. You can also copy the packet and send it yourself. This page cannot confirm whether an email is delivered. No listing goes live without editorial review of the official website, service area, costs, licensing, and any commercial relationship.</p><p><a class="button" data-direct-contact href="mailto:' + mail + '?subject=' + encodeURIComponent('Resource suggestion ' + ref) + '&body=' + encodeURIComponent(body) + '">Open email draft</a></p><label for="referral-packet">Review packet</label><textarea id="referral-packet" readonly rows="14">' + pretty.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</textarea><div class="tool-actions"><button class="button button-secondary" type="button" data-copy-packet>Copy review packet</button></div><p class="small" data-copy-packet-status aria-live="polite"></p><p class="small">Sponsorship interest is not payment and not approval. Claims help still has to be free accredited VSO help or a VA-accredited attorney or claims agent. Emergency pages do not take sponsors.</p>';
        var copy = result.querySelector('[data-copy-packet]');
        var status = result.querySelector('[data-copy-packet-status]');
        if (copy) copy.addEventListener('click', function () {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(pretty).then(function () {
              if (status) status.textContent = 'Copied. Your packet is NOT sent or published.';
            }, function () {
              if (status) status.textContent = 'Select the packet and copy it manually.';
            });
          } else if (status) status.textContent = 'Select the packet and copy it manually.';
        });
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      form.reset();
      syncClaims();
      startedAt = Date.now();
    });
  });
})();
