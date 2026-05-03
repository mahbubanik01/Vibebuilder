export const INSERT_VIBE_SITE_MUTATION = `
  mutation InsertVibeSite($input: VibeSiteInsertInput!) {
    insertVibeSite(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_VIBE_SITE_MUTATION = `
  mutation UpdateVibeSite($filter: String!, $input: VibeSiteUpdateInput!) {
    updateVibeSite(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_VIBE_SITE_MUTATION = `
  mutation DeleteVibeSite($filter: String!, $input: VibeSiteDeleteInput!) {
    deleteVibeSite(filter: $filter, input: $input) {
      acknowledged
      totalImpactedData
    }
  }
`;

export const INSERT_VIBE_PAGE_MUTATION = `
  mutation InsertVibePage($input: VibePageInsertInput!) {
    insertVibePage(input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const UPDATE_VIBE_PAGE_MUTATION = `
  mutation UpdateVibePage($filter: String!, $input: VibePageUpdateInput!) {
    updateVibePage(filter: $filter, input: $input) {
      itemId
      totalImpactedData
      acknowledged
    }
  }
`;

export const DELETE_VIBE_PAGE_MUTATION = `
  mutation DeleteVibePage($filter: String!, $input: VibePageDeleteInput!) {
    deleteVibePage(filter: $filter, input: $input) {
      acknowledged
      totalImpactedData
    }
  }
`;
