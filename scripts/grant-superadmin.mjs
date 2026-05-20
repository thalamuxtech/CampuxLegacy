#!/usr/bin/env node
/**
 * Grant the `superadmin` custom claim to a Firebase Auth user by email.
 *
 * Run ONCE to bootstrap the first admin — after this, /admin/roles can mint
 * further roles through the UI.
 *
 * Usage:
 *   node scripts/grant-superadmin.mjs                       # defaults to thalamuxtech@gmail.com
 *   node scripts/grant-superadmin.mjs <email@example.com>   # any other email
 *
 * Requires:
 *   - planning/campuxlegacy-firebase-adminsdk-fbsvc-18ada4e625.json  (service-account JSON, gitignored)
 *   - Node 20+
 *
 * The script:
 *   1. Loads the service-account from the planning/ folder
 *   2. Looks up the user by email
 *   3. Merges `roles.superadmin: true` into existing custom claims
 *   4. Prints the final claim object
 *
 * The user must sign out and sign back in (or refresh their ID token) before
 * the new claim takes effect on the client.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const DEFAULT_EMAIL = 'thalamuxtech@gmail.com';
const email = process.argv[2] ?? DEFAULT_EMAIL;
if (!email) {
  console.error('Usage: node scripts/grant-superadmin.mjs [email]');
  process.exit(1);
}
console.log(`Granting superadmin to: ${email}`);

const saPath = resolve(
  process.cwd(),
  'planning/campuxlegacy-firebase-adminsdk-fbsvc-18ada4e625.json'
);

let sa;
try {
  sa = JSON.parse(readFileSync(saPath, 'utf8'));
} catch (err) {
  console.error(`Could not read service-account at ${saPath}`);
  console.error(err.message);
  process.exit(1);
}

initializeApp({ credential: cert(sa) });
const auth = getAuth();

try {
  const user = await auth.getUserByEmail(email);
  const existing = user.customClaims ?? {};
  const roles = { ...(existing.roles ?? {}), superadmin: true };
  await auth.setCustomUserClaims(user.uid, { ...existing, roles });
  const fresh = await auth.getUser(user.uid);
  console.log(`OK. ${email} (${user.uid}) is now superadmin.`);
  console.log('Custom claims:', JSON.stringify(fresh.customClaims, null, 2));
  console.log('\nTell the user to sign out and back in for the claim to take effect.');
  process.exit(0);
} catch (err) {
  if (err.code === 'auth/user-not-found') {
    console.error(`No Firebase user with email "${email}".`);
    console.error('Sign up at https://campuxlegacy.app/sign-up first, then re-run.');
  } else {
    console.error('Failed:', err.message);
  }
  process.exit(1);
}
