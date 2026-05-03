import { useState } from 'react';
import { useGetPreSignedUrlForUpload } from '@/lib/api/hooks/use-storage';
import { ModuleName } from '@/constant/modules.constants';

const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: getPreSignedUrlAsync } = useGetPreSignedUrlForUpload();

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const data = await getPreSignedUrlAsync({
        name: file.name,
        projectKey: projectKey,
        itemId: '',
        metaData: '',
        accessModifier: 'Public',
        configurationName: 'Default',
        parentDirectoryId: '',
        tags: '',
        moduleName: ModuleName.DefaultConstruct, // Or another appropriate module ID
      });

      if (!data.isSuccess || !data.uploadUrl) {
        setIsUploading(false);
        return null;
      }

      await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-ms-blob-type': 'BlockBlob',
        },
      });

      setIsUploading(false);
      // The public URL is the presigned URL minus the query parameters
      return data.uploadUrl.split('?')[0];
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      return null;
    }
  };

  return { uploadFile, isUploading };
};
