import vm from 'node:vm';
import fs from 'node:fs';

const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../referral-validate.js', import.meta.url), 'utf8'), context);
const validate = context.Vols4VetsReferral.validateReferral;
const now = Date.parse('2026-10-09T22:00:00Z');
let failed = 0;
function check(name, cond) {
  if (!cond) {
    failed += 1;
    console.error('FAIL ' + name);
  }
}

const good = {
  lane: 'free-verified',
  organizationName: 'Example County Veteran Service Office',
  website: 'https://example.gov/veterans',
  serviceOffered: 'Helps veterans find the county office that handles state benefit questions.',
  whoItServes: 'Veterans and surviving spouses',
  geographicArea: 'One county',
  cost: 'free',
  licensing: '',
  relationship: 'none',
  relationshipDetail: '',
  contactName: 'Alex Review',
  contactEmail: 'alex@example.gov',
  contactPhone: '',
  publicNotes: '',
  claimsRelated: 'no',
  claimsAccreditation: '',
  attested: true,
  honeypot: ''
};

const ok = validate(good, { now, startedAt: now - 5000 });
check('valid free resource', ok.ok && ok.packet.status === 'draft-not-sent' && ok.packet.published === false && ok.packet.listingLane === 'free-verified');

const ssn = validate(Object.assign({}, good, { publicNotes: 'SSN 123-45-6789' }), { now, startedAt: now - 5000 });
check('rejects SSN', !ssn.ok);

const fast = validate(good, { now, startedAt: now - 500 });
check('rejects instant submit', !fast.ok);

const claims = validate(Object.assign({}, good, { lane: 'sponsored', claimsRelated: 'yes', claimsAccreditation: 'not licensed' }), { now, startedAt: now - 5000 });
check('rejects unaccredited claims sponsor', !claims.ok && claims.packet.published === false);

const accredited = validate(Object.assign({}, good, {
  lane: 'sponsored',
  claimsRelated: 'yes',
  claimsAccreditation: 'VA accredited attorney, confirm on the VA accreditation search'
}), { now, startedAt: now - 5000 });
check('holds accredited claims interest unpublished', accredited.ok && accredited.packet.status === 'draft-not-sent' && accredited.packet.sponsorRelationship === 'interest-only-not-paid');

const bot = validate(Object.assign({}, good, { honeypot: 'https://spam.example' }), { now, startedAt: now - 5000 });
check('rejects honeypot', !bot.ok);

if (failed) {
  console.error(failed + ' referral checks failed');
  process.exit(1);
}
console.log('referral-validate ok');
