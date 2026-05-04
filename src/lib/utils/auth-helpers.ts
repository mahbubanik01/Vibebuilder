import { decodeJWT } from '@/lib/utils/decode-jwt-utils';

export function isJWTExpired(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const payload = decodeJWT(token) as any;
    const exp = typeof payload?.exp === 'number' ? payload.exp : null;
    if (exp == null) return false;
    return exp < Math.floor(Date.now() / 1000);
  } catch {
    // If decoding fails, do not immediately expire to avoid locking out users on decode errors
    return false;
  }
}
