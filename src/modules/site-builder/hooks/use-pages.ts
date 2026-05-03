import { useGlobalQuery, useGlobalMutation } from '@/state/query-client/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from '@/hooks/use-error-handler';
import {
  getPages,
  createPage,
  updatePage,
  deletePage,
} from '../services/site-builder.service';

interface PageQueryParams {
  pageNo: number;
  pageSize: number;
  filter?: string;
  sort?: string;
}

export const useGetPages = (params: PageQueryParams) => {
  return useGlobalQuery({
    queryKey: ['vibe-pages', params],
    queryFn: getPages,
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => {
      void error;
      // Error handled globally by useGlobalQuery
    },
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useGlobalMutation({
    mutationFn: (params: { input: any }) => createPage(params),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'vibe-pages',
      });

      if (data.insertVibePage?.acknowledged) {
        toast({
          variant: 'success',
          title: t('PAGE_CREATED'),
          description: t('PAGE_CREATED_SUCCESSFULLY', 'Page created successfully'),
        });
      }
    },
    onError: () => {
      // Error handled globally by useGlobalMutation
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: (params: { filter: string; input: any }) => updatePage(params),
    onSuccess: (data: any) => {
      // Aggressively invalidate and refetch
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'vibe-pages',
      });
      // Force refetch
      queryClient.refetchQueries({
        predicate: (query) => query.queryKey[0] === 'vibe-pages',
      });

      if (data.updateVibePage?.acknowledged) {
        // Optional toast on save, usually omitted for auto-save
      } else {
        handleError(
          { error: { title: 'UNABLE_UPDATE_PAGE', message: t('UNABLE_UPDATE_PAGE', 'Unable to update page') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  return useGlobalMutation({
    mutationFn: ({ filter, input }: { filter: string; input: { isHardDelete: boolean } }) =>
      deletePage(filter, input),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'vibe-pages',
      });

      if (data.deleteVibePage?.acknowledged) {
        toast({
          variant: 'success',
          title: t('PAGE_DELETED'),
          description: t('PAGE_DELETED_SUCCESSFULLY', 'Page deleted successfully'),
        });
      } else {
        handleError(
          { error: { title: 'UNABLE_DELETE_PAGE', message: t('UNABLE_DELETE_PAGE', 'Unable to delete page') } },
          { variant: 'destructive' }
        );
      }
    },
    onError: (error) => {
      handleError(error, { variant: 'destructive' });
    },
  });
};
