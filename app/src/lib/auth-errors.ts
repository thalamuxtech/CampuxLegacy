/**
 * Map firebase auth error codes (e.g. "auth/wrong-password") to friendly copy.
 */
const MAP: Record<string, string> = {
  'auth/invalid-email': 'That doesn’t look like a valid email.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Wrong password. Try again or reset it.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/email-already-in-use': 'An account already exists with that email.',
  'auth/weak-password': 'Password is too weak — at least 6 characters.',
  'auth/popup-closed-by-user': 'Sign-in popup closed before finishing.',
  'auth/popup-blocked': 'Your browser blocked the sign-in popup.',
  'auth/network-request-failed': 'Network hiccup. Check your connection.',
  'auth/too-many-requests':
    'Too many attempts. Try again in a few minutes, or reset your password.',
};

export function authErrorMessage(err: unknown): string {
  if (!err) return 'Something went wrong.';
  const e = err as { code?: string; message?: string };
  if (e.code && MAP[e.code]) return MAP[e.code];
  if (e.message) {
    // Strip Firebase's "Firebase: " prefix when no code mapping exists.
    return e.message.replace(/^Firebase:\s*/i, '').replace(/\s*\(auth\/[^)]+\)\.?$/i, '');
  }
  return 'Something went wrong.';
}
