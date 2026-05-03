export const GET_VIBE_SITES_QUERY = `
  query GetVibeSites($input: DynamicQueryInput) {
    getVibeSites(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        CreatedDate
        CreatedBy
        LastUpdatedDate
        LastUpdatedBy
        ownerId
        siteName
        siteSlug
        metadata
        isPublished
      }
    }
  }
`;

export const GET_VIBE_PAGES_QUERY = `
  query GetVibePages($input: DynamicQueryInput) {
    getVibePages(input: $input) {
      hasNextPage
      hasPreviousPage
      totalCount
      totalPages
      pageSize
      pageNo
      items {
        ItemId
        CreatedDate
        CreatedBy
        LastUpdatedDate
        LastUpdatedBy
        siteId
        ownerId
        name
        slug
        sortOrder
        sections
      }
    }
  }
`;
