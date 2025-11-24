import { cache } from 'react';
import { auth } from '@/lib/auth';

export const getCachedSession = cache(async () => {
  const session = await auth();
  return session;
});
