import { useGlobalQuery, useGlobalMutation } from '@/state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '@/hooks/use-error-handler';
import {
  getSites,
  createSite,
  updateSite,
  deleteSite,
} from '../services/site-builder.service';

interface SiteQueryParams {
  pageNo: number;
  pageSize: number;
  filter?: string;
  sort?: string;
}

export const useGetSites = (params: SiteQueryParams) => {
  return useGlobalQuery({
    queryKey: ['vibe-sites', params],
    queryFn: getSites,
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: () => {
      // Error handled globally by useGlobalQuery
    },
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationFn: (params: { input: any }) => createSite(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'vibe-sites',
      });

      if (data.insertVibeSite?.acknowledged) {
        toast({
          variant: 'success',
          title: t('SITE_CREATED'),
          description: t('SITE_CREATED_SUCCESSFULLY', 'Site created successfully'),
        });
      }
    },
    onError: () => {
      // Error handled globally by useGlobalMutation
    },
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: { filter: string; input: any }) => updateSite(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'vibe-sites',
      });

      if (data.updateVibeSite?.acknowledged) {
        // Optional toast on save, usually omitted for auto-save
      } else {
        handleError(
          { error: { title: 'UNABLE_UPDATE_SITE', message: t('UNABLE_UPDATE_SITE', 'Unable to update site') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: ({ filter, input }: { filter: string; input: { isHardDelete: boolean } }) =>
      deleteSite(filter, input),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'vibe-sites',
      });

      if (data.deleteVibeSite?.acknowledged) {
        toast({
          variant: 'success',
          title: t('SITE_DELETED'),
          description: t('SITE_DELETED_SUCCESSFULLY', 'Site deleted successfully'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_DELETE_SITE', message: t('UNABLE_DELETE_SITE', 'Unable to delete site') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};
