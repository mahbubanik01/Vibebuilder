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
  console.log('[updateSite] Calling mutation with:', params);
  try {
    const result = await graphqlClient.mutate({
      query: UPDATE_VIBE_SITE_MUTATION,
      variables: params,
    });
    console.log('[updateSite] Result:', result);
    return result;
  } catch (err: any) {
    console.error('[updateSite] Error:', err.message || err);
    throw err;
  }
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
  console.log('[createPage] Calling mutation with:', params);
  try {
    const result = await graphqlClient.mutate({
      query: INSERT_VIBE_PAGE_MUTATION,
      variables: params,
    });
    console.log('[createPage] Result:', result);
    return result;
  } catch (err: any) {
    console.error('[createPage] Error:', err.message || err);
    throw err;
  }
};

export const updatePage = async (params: { filter: string; input: any }) => {
  console.log('[updatePage] Calling mutation with:', params);
  try {
    const result = await graphqlClient.mutate({
      query: UPDATE_VIBE_PAGE_MUTATION,
      variables: params,
    });
    console.log('[updatePage] Result:', result);
    return result;
  } catch (err: any) {
    console.error('[updatePage] Error:', err.message || err);
    throw err;
  }
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

// --- Live Site Services ---

export const getSiteBySlug = async (siteSlug: string) => {
  console.log('[LiveSite] Fetching site with slug:', siteSlug);
  
  try {
    // Query all sites and filter in JS - no filter to avoid 400 errors
    const result = await graphqlClient.query({
      query: GET_VIBE_SITES_QUERY,
      variables: {
        input: {
          sort: "{\"CreatedDate\":-1}",
          pageNo: 1,
          pageSize: 100,
        },
      },
    });
    
    console.log('[LiveSite] Query result:', result);
    
    // Filter to find matching siteSlug and isPublished
    const items = (result as any)?.getVibeSites?.items || (result as any)?.VibeSites?.items || [];
    console.log('[LiveSite] Total sites found:', items.length);
    
    const matchingSite = items.find((site: any) => {
      const isPublished = (Array.isArray(site.isPublished) ? site.isPublished[0] : site.isPublished) === true;
      const slug = site.siteSlug;
      const slugMatch = Array.isArray(slug) ? slug.includes(siteSlug) : slug === siteSlug;
      
      console.log(`[LiveSite] Checking site: "${site.siteName}" | Slug: ${JSON.stringify(slug)} | ItemId: ${JSON.stringify(site.ItemId)} | Published: ${isPublished} | Match: ${slugMatch}`);
      
      return isPublished && slugMatch;
    });
    
    // Return only the matching site wrapped in expected format
    if (matchingSite) {
      return {
        getVibeSites: {
          items: [matchingSite],
          totalCount: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          pageSize: 1,
          pageNo: 1,
          totalPages: 1
        }
      };
    }
    
    // Return empty result if no match
    return {
      getVibeSites: {
        items: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 0,
        pageNo: 1,
        totalPages: 0
      }
    };
  } catch (error) {
    console.error('[LiveSite] Query error:', error);
    throw error;
  }
};

export const getPagesBySiteId = async (siteId: string) => {
  console.log('[LiveSite] Fetching pages for siteId:', siteId);
  
  try {
    const result = await graphqlClient.query({
      query: GET_VIBE_PAGES_QUERY,
      variables: {
        input: {
          filter: "{\"siteId\":{\"$eq\":\"" + siteId + "\"}}",
          sort: "{\"sortOrder\":1}",
          pageNo: 1,
          pageSize: 50,
        },
      },
    });
    
    console.log('[LiveSite] Pages result:', result);
    return result;
  } catch (error) {
    console.error('[LiveSite] Pages query error:', error);
    throw error;
  }
};
