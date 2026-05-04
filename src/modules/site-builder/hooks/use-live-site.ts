import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { getSiteBySlug, getPagesBySiteId } from '../services/site-builder.service';
import type { Page, SiteData } from '../types/site-builder.types';
import { normalizeScalar, safeJsonParse } from '@/lib/data-utils';
import { useAuthStore } from '@/state/store/auth';

/**
 * Reads the publish cache from localStorage for a given siteSlug.
 * This is the primary data source for the live site — no auth required.
 */
function readPublishCache(siteSlug: string) {
  try {
    const raw = localStorage.getItem(`vibe-publish-cache-${siteSlug}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate basic structure
    if (parsed && parsed.site && Array.isArray(parsed.pages)) {
      return parsed as { site: any; pages: any[]; updatedAt: string };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * useLiveSite — The live site data hook.
 * 
 * Architecture:
 * 1. FIRST reads from localStorage publish cache (instant, no auth needed)
 * 2. THEN tries API if user is authenticated (for freshness)
 * 3. Merges results — API wins if available, cache is fallback
 * 
 * This solves:
 * - Zustand auth hydration race condition (new tab has no token initially)
 * - Public access without auth (visitors can see cached version)
 * - Instant loading (no API latency for cached data)
 */
export const useLiveSite = (siteSlug: string, pageSlug: string) => {
  // Read publish cache synchronously on mount (no auth needed)
  const [cache] = useState(() => readPublishCache(siteSlug));
  
  // Check if auth is available (may hydrate asynchronously in new tabs)
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasAuth = !!accessToken;

  // --- API Queries (only fire when authenticated) ---
  const siteQuery = useQuery({
    queryKey: ['live-site', siteSlug],
    queryFn: async () => {
      try {
        return await getSiteBySlug(siteSlug);
      } catch (e) {
        // API failed (401, network error, etc.) — not critical if we have cache
        console.warn('[LiveSite] API site query failed:', e);
        return { getVibeSites: { items: [], totalCount: 0 } };
      }
    },
    staleTime: 30 * 1000, // 30 seconds — much shorter for live site freshness
    gcTime: 2 * 60 * 1000,
    enabled: !!siteSlug && hasAuth, // Only query when we have auth
    retry: 1,
  });

  // Extract site from API response
  const siteRaw = siteQuery.data as any;
  const apiSiteItem = siteRaw?.getVibeSites?.items?.[0] || 
                    siteRaw?.VibeSites?.items?.[0] || 
                    siteRaw?.getVibeSite?.items?.[0] || 
                    siteRaw?.VibeSite?.items?.[0] || 
                    siteRaw?.items?.[0] || 
                    (siteRaw?.ItemId ? siteRaw : null);

  // Normalize API site
  const apiSite = apiSiteItem ? {
    ...apiSiteItem,
    siteName: normalizeScalar(apiSiteItem.siteName),
    siteSlug: normalizeScalar(apiSiteItem.siteSlug),
    isPublished: normalizeScalar(apiSiteItem.isPublished)
  } : null;

  // --- Determine effective site: API > Cache > null ---
  const site = apiSite || cache?.site || null;
  const siteId = site ? normalizeScalar(site.ItemId) : null;

  // --- Pages query (only fire when we have siteId AND auth) ---
  const pagesQuery = useQuery({
    queryKey: ['live-pages', siteId],
    queryFn: async () => {
      if (!siteId) return { getVibePages: { items: [], totalCount: 0 } };
      try {
        return await getPagesBySiteId(siteId);
      } catch (e) {
        console.warn('[LiveSite] API pages query failed:', e);
        return { getVibePages: { items: [], totalCount: 0 } };
      }
    },
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    enabled: !!siteId && hasAuth,
    retry: 1,
  });

  // Extract pages from API
  const rawApiPages = (
    (pagesQuery.data as any)?.getVibePages?.items || 
    (pagesQuery.data as any)?.VibePages?.items || 
    []
  ) as any[];

  // --- Determine effective pages: API > Cache > empty ---
  const effectiveRawPages = rawApiPages.length > 0 ? rawApiPages : (cache?.pages || []);

  // Normalize pages
  const pages: Page[] = useMemo(() => 
    effectiveRawPages.map((p: any) => ({
      ...p,
      name: normalizeScalar(p.name),
      slug: normalizeScalar(p.slug),
      // Handle sections: might be JSON string, array, or already parsed
      sections: Array.isArray(p.sections) && p.sections.length > 0 && typeof p.sections[0] === 'object'
        ? p.sections  // Already parsed array of section objects
        : safeJsonParse(normalizeScalar(p.sections), [])
    })),
    [effectiveRawPages]
  );

  const activePage = pages.find((p) => p.slug === pageSlug) || pages[0];

  const siteData: SiteData | null = site
    ? {
        ownerId: normalizeScalar(site.ownerId) || '',
        siteId: normalizeScalar(site.ItemId),
        metadata: {
          title: normalizeScalar(site.siteName),
          ...(typeof site.metadata === 'string' ? safeJsonParse(site.metadata, {}) : (site.metadata || {})),
        },
        pages: pages,
      }
    : null;

  // Compute loading/error states considering cache availability
  const isLoading = !cache && (siteQuery.isLoading || (!!siteId && pagesQuery.isLoading));
  const isError = !cache && (siteQuery.isError || pagesQuery.isError);
  const error = siteQuery.error || pagesQuery.error;

  return {
    siteQuery,
    pagesQuery,
    site,
    pages,
    activePage,
    siteData,
    error: isError ? error : null,
    hasCache: !!cache,
  };
};