import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates and sanitizes internal application return paths to prevent open redirect vulnerabilities.
 * Only permits relative paths starting with '/' and disallows protocol-relative or backslash paths.
 */
export function getSafeInternalPath(url: string | null | undefined, defaultPath = '/'): string {
  if (!url || typeof url !== 'string') return defaultPath;
  const trimmed = url.trim();
  if (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !trimmed.startsWith('/\\') &&
    !trimmed.includes('://')
  ) {
    return trimmed;
  }
  return defaultPath;
}
