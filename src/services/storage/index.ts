export const SITE_BUILDER_STORAGE_KEY = 'vibebuilder-site';

const getBrowserStorage = (): Storage | null => {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
};

export const browserStorage = {
  getItem(key: string): string | null {
    return getBrowserStorage()?.getItem(key) ?? null;
  },
  setItem(key: string, value: string): void {
    getBrowserStorage()?.setItem(key, value);
  },
  removeItem(key: string): void {
    getBrowserStorage()?.removeItem(key);
  },
  clear(): void {
    getBrowserStorage()?.clear();
  },
};

// Mocks to keep the build passing until Phase 2
export async function loadSiteData(fallback: any): Promise<any> { return fallback; }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function saveSiteData(_siteData: any): Promise<void> { /* mock */ }
export async function clearSiteData(): Promise<void> { /* mock */ }

