(function (root) {
  var LANES = {
    'free-verified': 'free-verified',
    'community-referral': 'community-referral',
    sponsored: 'sponsored'
  };

  function text(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function clip(value, max) {
    return text(value).slice(0, max);
  }

  function looksSensitive(value) {
    var v = String(value || '');
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(v)) return true;
    if (/\b\d{9}\b/.test(v)) return true;
    if (/social\s+security|\bssn\b|claim\s+number|va\s+file\s+number|password|medical\s+record|dd-?214\s*(upload|copy|scan|pdf)/i.test(v)) return true;
    return false;
  }

  function validateReferral(input, ctx) {
    input = input || {};
    ctx = ctx || {};
    var now = typeof ctx.now === 'number' ? ctx.now : Date.now();
    var errors = [];
    var lane = LANES[input.lane] || '';
    if (!lane) errors.push('Choose free verified consideration, a community referral, or sponsorship interest.');
    if (text(input.honeypot)) errors.push('This submission could not be accepted.');
    if (typeof ctx.startedAt === 'number' && now - ctx.startedAt < 4000) {
      errors.push('Please take a moment to review the form before sending it.');
    }

    var organizationName = clip(input.organizationName, 140);
    var website = clip(input.website, 300);
    var serviceOffered = clip(input.serviceOffered, 600);
    var whoItServes = clip(input.whoItServes, 300);
    var geographicArea = clip(input.geographicArea, 200);
    var cost = clip(input.cost, 40);
    var licensing = clip(input.licensing, 300);
    var relationship = clip(input.relationship, 40);
    var relationshipDetail = clip(input.relationshipDetail, 300);
    var contactName = clip(input.contactName, 120);
    var contactEmail = clip(input.contactEmail, 160);
    var contactPhone = clip(input.contactPhone, 30);
    var publicNotes = clip(input.publicNotes, 800);
    var claimsRelated = input.claimsRelated === 'yes';
    var claimsAccreditation = clip(input.claimsAccreditation, 300);

    if (organizationName.length < 2) errors.push('Enter the organization name.');
    if (!/^https?:\/\/[^\s]+\.[^\s]+$/i.test(website)) errors.push('Enter a public website starting with http:// or https://.');
    if (serviceOffered.length < 8) errors.push('Describe the service in a sentence or two.');
    if (whoItServes.length < 3) errors.push('Say who the service is for.');
    if (geographicArea.length < 2) errors.push('Enter the geographic service area.');
    if (['free', 'paid', 'both', 'unknown'].indexOf(cost) === -1) errors.push('Say whether the service is free, paid, both, or unknown.');
    if (['none', 'referral', 'affiliate', 'unsure'].indexOf(relationship) === -1) errors.push('Say whether there is a referral or affiliate relationship.');
    if ((relationship === 'referral' || relationship === 'affiliate') && relationshipDetail.length < 8) {
      errors.push('Describe the referral or affiliate relationship.');
    }
    if (contactName.length < 2) errors.push('Enter a contact name for the reviewer.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) errors.push('Enter a contact email so a reviewer can reply.');
    if (contactPhone && !/^[0-9+().\-\s]{7,30}$/.test(contactPhone)) errors.push('Enter a phone number using only numbers and normal phone symbols, or leave it blank.');
    if (!input.attested) errors.push('Confirm that this suggestion contains no private case information and is not a request to publish automatically.');

    if (claimsRelated) {
      if (!/accredited/i.test(claimsAccreditation) || claimsAccreditation.length < 12) {
        errors.push('Claims-related businesses must name a VA-accredited status a reviewer can check. Unaccredited claims help is not accepted.');
      }
    }

    [organizationName, website, serviceOffered, whoItServes, geographicArea, licensing, relationshipDetail, contactName, publicNotes, claimsAccreditation].forEach(function (value) {
      if (looksSensitive(value)) errors.push('Remove Social Security numbers, claim numbers, medical records, passwords, and document uploads. Vols4Vets does not take private case files.');
    });

    var unique = [];
    errors.forEach(function (error) {
      if (unique.indexOf(error) === -1) unique.push(error);
    });

    var packet = {
      status: 'draft-not-sent',
      published: false,
      listingLane: lane,
      resourceName: organizationName,
      officialWebsite: website,
      shortDescription: serviceOffered,
      personServed: whoItServes,
      geographicServiceArea: geographicArea,
      cost: cost,
      accreditedOrLicensedStatus: licensing,
      claimsRelated: claimsRelated,
      claimsAccreditation: claimsRelated ? claimsAccreditation : '',
      affiliateRelationship: relationship === 'none' ? '' : relationshipDetail || relationship,
      sponsorRelationship: lane === 'sponsored' ? 'interest-only-not-paid' : '',
      submitter: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone
      },
      publicNotes: publicNotes,
      doNotPublish: true,
      sensitiveDataAccepted: false
    };

    return { ok: unique.length === 0, errors: unique, packet: packet };
  }

  root.Vols4VetsReferral = { validateReferral: validateReferral, looksSensitive: looksSensitive };
})(typeof globalThis !== 'undefined' ? globalThis : this);
