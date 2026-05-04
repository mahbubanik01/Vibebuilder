import { graphqlClient } from '@/lib/graphql-client';
import {
  GET_VIBE_SITES_QUERY,
  GET_VIBE_PAGES_QUERY,
} from '../graphql/queries';
import {
  INSERT_VIBE_SITE_MUTATION,
  UPDATE_VIBE_SITE_MUTATION,
  DELETE_VIBE_SITE_MUTATION,
  INSERT_VIBE_PAGE_MUTATION,
  UPDATE_VIBE_PAGE_MUTATION,
  DELETE_VIBE_PAGE_MUTATION,
} from '../graphql/mutations';
import { normalizeScalar } from '@/lib/data-utils';

// --- VibeSite Services ---

export const getSites = async (context: {
  queryKey: [string, { pageNo: number; pageSize: number; filter?: string; sort?: string }];
}) => {
  const [, { pageNo, pageSize, filter, sort }] = context.queryKey;

  const input: any = {
    pageNo,
    pageSize,
  };

  // Only add filter/sort if provided (to avoid 400 errors with empty filter)
  if (filter) input.filter = filter;
  if (sort) input.sort = sort;

  return graphqlClient.query({
    query: GET_VIBE_SITES_QUERY,
    variables: {
      input,
    },
  });
};

export const createSite = async (params: { input: any }) => {
  return graphqlClient.mutate({
    query: INSERT_VIBE_SITE_MUTATION,
    variables: params,
  });
};

export const updateSite = async (params: { filter: string; input: any }) => {
  return graphqlClient.mutate({
    query: UPDATE_VIBE_SITE_MUTATION,
    variables: params,
  });
};

export const deleteSite = async (filter: string, input: { isHardDelete: boolean }) => {
  return graphqlClient.mutate({
    query: DELETE_VIBE_SITE_MUTATION,
    variables: {
      filter,
      input,
    },
  });
};

// --- VibePage Services ---

export const getPages = async (context: {
  queryKey: [string, { pageNo: number; pageSize: number; filter?: string; sort?: string }];
}) => {
  const [, { pageNo, pageSize, filter, sort }] = context.queryKey;

  const input: any = {
    pageNo,
    pageSize,
  };

  if (filter) input.filter = filter;
  if (sort) input.sort = sort;

  return graphqlClient.query({
    query: GET_VIBE_PAGES_QUERY,
    variables: {
      input,
    },
  });
};

export const createPage = async (params: { input: any }) => {
  return graphqlClient.mutate({
    query: INSERT_VIBE_PAGE_MUTATION,
    variables: params,
  });
};

export const updatePage = async (params: { filter: string; input: any }) => {
  return graphqlClient.mutate({
    query: UPDATE_VIBE_PAGE_MUTATION,
    variables: params,
  });
};

export const deletePage = async (filter: string, input: { isHardDelete: boolean }) => {
  return graphqlClient.mutate({
    query: DELETE_VIBE_PAGE_MUTATION,
    variables: {
      filter,
      input,
    },
  });
};

// --- Live Site Services (Public - No Auth Required) ---

export const getSiteBySlug = async (siteSlug: string) => {
  try {
    const result = await graphqlClient.query({
      query: GET_VIBE_SITES_QUERY,
      variables: {
        input: {
          filter: JSON.stringify({ siteSlug: { $eq: siteSlug } }),
          pageNo: 1,
          pageSize: 1,
        },
      },
    });
    
    const items = (result as any)?.getVibeSites?.items || (result as any)?.VibeSites?.items || [];
    
    // Fallback: Try matching by ItemId (if slug is actually the UUID)
    let matchingSite = items[0];
    if (!matchingSite) {
      const idResult = await graphqlClient.query({
        query: GET_VIBE_SITES_QUERY,
        variables: {
          input: {
            filter: JSON.stringify({ ItemId: { $eq: siteSlug } }),
            pageNo: 1,
            pageSize: 1,
          },
        },
      });
      const idItems = (idResult as any)?.getVibeSites?.items || (idResult as any)?.VibeSites?.items || [];
      matchingSite = idItems[0];
    }
    
    // Fallback: Memory-match from recent sites
    if (!matchingSite) {
      const fallbackResult = await graphqlClient.query({
        query: GET_VIBE_SITES_QUERY,
        variables: {
          input: { sort: JSON.stringify({ CreatedDate: -1 }), pageNo: 1, pageSize: 100 },
        },
      });
      const fallbackItems = (fallbackResult as any)?.getVibeSites?.items || (fallbackResult as any)?.VibeSites?.items || [];
      matchingSite = fallbackItems.find((s: any) => {
        const slug = normalizeScalar(s.siteSlug);
        const id = normalizeScalar(s.ItemId);
        return slug === siteSlug || id === siteSlug;
      });
    }

    if (matchingSite) {
      return {
        getVibeSites: {
          items: [matchingSite],
          totalCount: 1,
        }
      };
    }
    
    return { getVibeSites: { items: [], totalCount: 0 } };
  } catch (err: any) {
    throw err;
  }
};

export const getPagesBySiteId = async (siteId: string) => {
  try {
    const result = await graphqlClient.query({
      query: GET_VIBE_PAGES_QUERY,
      variables: {
        input: {
          filter: JSON.stringify({ siteId: { $eq: siteId } }),
          sort: JSON.stringify({ sortOrder: 1 }),
          pageNo: 1,
          pageSize: 50,
        },
      },
    });

    const items = (result as any)?.getVibePages?.items || (result as any)?.VibePages?.items || [];
    
    // Fallback: If DB strict match failed (e.g. array vs scalar issue), fetch recent pages and filter
    if (items.length === 0 && siteId && !siteId.startsWith('local-')) {
      const fallbackResult = await graphqlClient.query({
        query: GET_VIBE_PAGES_QUERY,
        variables: {
          input: { sort: JSON.stringify({ CreatedDate: -1 }), pageNo: 1, pageSize: 200 },
        },
      });
      const fallbackItems = (fallbackResult as any)?.getVibePages?.items || (fallbackResult as any)?.VibePages?.items || [];
      const matchingPages = fallbackItems.filter((p: any) => {
        const id = normalizeScalar(p.siteId);
        return id === siteId;
      });
      
      if (matchingPages.length > 0) {
        return {
          getVibePages: {
            items: matchingPages,
            totalCount: matchingPages.length,
          }
        };
      }
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};
