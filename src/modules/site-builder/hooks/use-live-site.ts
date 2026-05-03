import { useGlobalQuery } from '@/state/query-client/hooks';
import { getSiteBySlug, getPagesBySiteId } from '../services/site-builder.service';
import type { Page, SiteData } from '../types/site-builder.types';

export const useLiveSite = (siteSlug: string, pageSlug: string) => {
  console.log('[LiveSiteHook] Running for slug:', siteSlug);
  const siteQuery = useGlobalQuery({
    queryKey: ['live-site', siteSlug],
    queryFn: () => getSiteBySlug(siteSlug),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!siteSlug,
    retry: 1,
  });

  console.log('[LiveSiteHook] siteQuery.data:', siteQuery.data);
  const siteRaw = (siteQuery.data as any);
  const siteRawItem = siteRaw?.getVibeSites?.items?.[0] || 
                    siteRaw?.VibeSites?.items?.[0] || 
                    siteRaw?.getVibeSite?.items?.[0] || 
                    siteRaw?.VibeSite?.items?.[0] || 
                    siteRaw?.items?.[0] || 
                    (siteRaw?.ItemId ? siteRaw : null);
                    
  const site = siteRawItem ? {
    ...siteRawItem,
    siteName: Array.isArray(siteRawItem.siteName) ? siteRawItem.siteName[0] : siteRawItem.siteName,
    siteSlug: Array.isArray(siteRawItem.siteSlug) ? siteRawItem.siteSlug[0] : siteRawItem.siteSlug,
    isPublished: (Array.isArray(siteRawItem.isPublished) ? siteRawItem.isPublished[0] : siteRawItem.isPublished) === true
  } : null;

  console.log('[LiveSiteHook] Extracted site:', site);
  console.log('[LiveSiteHook] Final extracted site properties:', Object.keys(site || {}));
  const siteId = Array.isArray(site?.ItemId) ? site?.ItemId[0] : site?.ItemId;

  const pagesQuery = useGlobalQuery({
    queryKey: ['live-pages', siteId],
    queryFn: () => {
      if (!siteId) throw new Error('siteId is required');
      return getPagesBySiteId(siteId);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!siteId,
    retry: 1,
  });

  console.log('[LiveSiteHook] pagesQuery.data:', pagesQuery.data);
  const rawPages = ((pagesQuery.data as any)?.getVibePages?.items || (pagesQuery.data as any)?.VibePages?.items || []) as any[];
  
  const pages: Page[] = rawPages.map(p => ({
    ...p,
    name: Array.isArray(p.name) ? p.name[0] : p.name,
    slug: Array.isArray(p.slug) ? p.slug[0] : p.slug,
    sections: typeof p.sections === 'string' ? JSON.parse(p.sections || '[]') : (p.sections || [])
  }));

  console.log('[LiveSiteHook] Extracted pages count:', pages.length);
  const activePage = pages.find((p) => p.slug === pageSlug) || pages[0];

  const siteData: SiteData | null = site
    ? {
        ownerId: site.ownerId || '',
        siteId: site.ItemId,
        metadata: {
          title: site.siteName,
          ...(typeof site.metadata === 'string' ? JSON.parse(site.metadata || '{}') : (site.metadata || {})),
        },
        pages: pages,
      }
    : null;

  return {
    siteQuery,
    pagesQuery,
    site,
    pages,
    activePage,
    siteData,
    error: siteQuery.error || pagesQuery.error,
  };
};