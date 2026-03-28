

import { type User, MOCK_CURRENT_USER } from '@/lib/constants';

// This utility function can be used in both client and server components.
export function getCurrentUser(): User {
  // In a real app, this would be derived from a cookie, JWT, or session store.
  // Since login is bypassed, we always return the mock user.
  return MOCK_CURRENT_USER;
};
