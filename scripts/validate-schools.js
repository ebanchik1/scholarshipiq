import SCHOOLS from '../src/schools.js';

const REQUIRED_FIELDS = [
  'name', 'usNews', 'tier', 'city', 'state',
  'median_lsat', 'p25_lsat', 'p75_lsat',
  'median_gpa', 'p25_gpa', 'p75_gpa',
  'tuition', 'pct_grant', 'pct_half', 'pct_full',
  'med_grant', 'p25_grant', 'p75_grant',
  'class_size', 'yield', 'seats_pct', 'accept_rate', 'wl_rate',
  'biglaw_fc_pct', 'bar_passage_rate', 'employment_rate'
];

const RANGES = {
  median_lsat: [120, 180], p25_lsat: [120, 180], p75_lsat: [120, 180],
  median_gpa: [2.0, 4.33], p25_gpa: [2.0, 4.33], p75_gpa: [2.0, 4.33],
  tuition: [5000, 100000],
  pct_grant: [0, 100], pct_half: [0, 100], pct_full: [0, 100],
  accept_rate: [0, 1], wl_rate: [0, 1], yield: [0, 1], seats_pct: [0, 1],
  class_size: [20, 1000],
  biglaw_fc_pct: [0, 100], bar_passage_rate: [0, 100], employment_rate: [0, 100],
};

const VALID_TIERS = ['T14', 'T25', 'T50', 'T100'];

let errors = 0;

function err(school, msg) {
  console.error(`  ERROR: ${school.name || '(unnamed)'}: ${msg}`);
  errors++;
}

console.log(`Validating ${SCHOOLS.length} schools...\n`);

const names = new Set();

for (const school of SCHOOLS) {
  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (school[field] === undefined || school[field] === null) {
      err(school, `missing field: ${field}`);
    }
  }

  // Check for NaN
  for (const field of Object.keys(RANGES)) {
    if (typeof school[field] === 'number' && isNaN(school[field])) {
      err(school, `NaN value for: ${field}`);
    }
  }

  // Check ranges
  for (const [field, [min, max]] of Object.entries(RANGES)) {
    if (typeof school[field] === 'number' && (school[field] < min || school[field] > max)) {
      err(school, `${field} = ${school[field]} out of range [${min}, ${max}]`);
    }
  }

  // Check tier
  if (!VALID_TIERS.includes(school.tier)) {
    err(school, `invalid tier: ${school.tier}`);
  }

  // Check LSAT ordering
  if (school.p25_lsat > school.median_lsat || school.median_lsat > school.p75_lsat) {
    err(school, `LSAT ordering wrong: p25=${school.p25_lsat} med=${school.median_lsat} p75=${school.p75_lsat}`);
  }

  // Check GPA ordering
  if (school.p25_gpa > school.median_gpa || school.median_gpa > school.p75_gpa) {
    err(school, `GPA ordering wrong: p25=${school.p25_gpa} med=${school.median_gpa} p75=${school.p75_gpa}`);
  }

  // Check duplicates
  if (names.has(school.name)) {
    err(school, `duplicate school name`);
  }
  names.add(school.name);
}

console.log(`\n${SCHOOLS.length} schools validated.`);
if (errors > 0) {
  console.error(`\n${errors} error(s) found!`);
  process.exit(1);
} else {
  console.log('All checks passed.');
}
