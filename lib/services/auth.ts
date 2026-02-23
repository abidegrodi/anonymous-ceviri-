import api from '../api';

/**
 * Turnstile site key'ini döndürür.
 * Öncelik sırası:
 * 1. NEXT_PUBLIC_TURNSTILE_SITE_KEY env var (localhost geliştirme için)
 * 2. Backend API'den fetch
 */
export async function getSitekey(): Promise<string> {
  // Env var override - localhost geliştirme için
  const envKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (envKey) {
    return envKey;
  }

  const response = await api.get('/auth/sitekey');
  return response.data.data.siteKey;
}

/**
 * Turnstile'ın devre dışı bırakılıp bırakılmadığını kontrol eder.
 * NEXT_PUBLIC_SKIP_TURNSTILE=true olduğunda true döner.
 */
export function isTurnstileSkipped(): boolean {
  return process.env.NEXT_PUBLIC_SKIP_TURNSTILE === 'true';
}
