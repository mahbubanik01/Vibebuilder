import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-kit/card';
import { loadSiteData } from '@/services/storage';
import { DEFAULT_SITE_DATA, type SiteData } from '../types/site-builder.types';
import { SectionRenderer } from './section-renderer';

interface PreviewPageProps {
  siteData?: SiteData;
}

export function PreviewPage({ siteData }: Readonly<PreviewPageProps>) {
  const [fetchedData, setFetchedData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(!siteData);

  useEffect(() => {
    if (siteData) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    
    loadSiteData(DEFAULT_SITE_DATA).then((data) => {
      if (!isMounted) return;
      setFetchedData(data);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [siteData]);

  const previewSiteData = siteData ?? fetchedData ?? DEFAULT_SITE_DATA;
  const page = previewSiteData.pages[0];

  if (isLoading) {
    return (
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed px-4 py-12 text-center text-sm text-muted-foreground animate-pulse">
            Loading preview...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{previewSiteData.metadata.title ?? 'Preview'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!page || page.sections.length === 0 ? (
          <div className="rounded-lg border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
            Add a section to see the preview.
          </div>
        ) : (
          page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

