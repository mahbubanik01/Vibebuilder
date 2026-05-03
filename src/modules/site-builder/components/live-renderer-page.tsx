import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Rocket, AlertTriangle, Database } from 'lucide-react';
import { useLiveSite } from '../hooks/use-live-site';
import { SectionRenderer } from './section-renderer';
import type { Section } from '../types/site-builder.types';

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2F81F7] mx-auto mb-6" />
        <p className="text-[#9DA7B3] font-medium tracking-wide">Loading Site...</p>
      </div>
    </div>
  );
}

function ErrorState({ title, message, backendError = false }: { title: string; message: string; backendError?: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
      <div className="text-center max-w-lg px-6">
        {backendError ? (
          <Database className="w-16 h-16 text-[#f85149] mx-auto mb-6" />
        ) : (
          <AlertTriangle className="w-16 h-16 text-[#f85149] mx-auto mb-6" />
        )}
        <h1 className="text-4xl font-bold text-[#E6EDF3] mb-4 tracking-tighter">{title}</h1>
        <p className="text-[#9DA7B3] mb-8 text-lg">{message}</p>
        
        <Link 
          to="/site-builder" 
          className="inline-flex items-center justify-center bg-[#2F81F7] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#1F6FEB] transition-all"
        >
          Go to Site Builder
        </Link>
      </div>
    </div>
  );
}

export function LiveRendererPage() {
  const { siteSlug, pageSlug = 'home' } = useParams<{ siteSlug: string; pageSlug?: string }>();
  const [errorInfo, setErrorInfo] = useState<string>('');

  const { siteQuery, pagesQuery, site, pages, activePage, error } = useLiveSite(siteSlug || '', pageSlug);
  console.log('[LiveRendererPage] state:', { site, pages, activePage, error });

  useEffect(() => {
    if (error) {
      console.error('Live site error:', error);
      const errorStr = String(error);
      setErrorInfo(errorStr);
    }
  }, [error]);

  const displaySiteName = Array.isArray(site?.siteName) ? site?.siteName[0] : (site?.siteName || 'Vibe Site');

  useEffect(() => {
    if (site && activePage) {
      document.title = `${activePage.name} | ${displaySiteName} - VibeBuilder`;
      
      try {
        const metadata = typeof site.metadata === 'string' ? JSON.parse(site.metadata || '{}') : site.metadata;
        if (metadata?.description) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', metadata.description);
        }
      } catch (e) {
        console.error('Error parsing site metadata', e);
      }
    }
  }, [site, activePage]);

  if (!siteSlug) {
    return <ErrorState title="404" message="No site specified" />;
  }

  const isLoading = siteQuery.isLoading || pagesQuery.isLoading;
  const isError = siteQuery.isError || pagesQuery.isError;

  // Check if the error is about missing backend schema
  const isSchemaError = errorInfo.includes('does not exist') || errorInfo.includes('Cannot read');

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState 
        title={isSchemaError ? "Backend Not Configured" : "Error"} 
        message={isSchemaError 
          ? "The VibeSite database table is not set up in Selise Blocks. Please contact your administrator to create the schema." 
          : `Failed to load site: ${errorInfo || 'Unknown error'}`}
        backendError={isSchemaError}
      />
    );
  }

  if (!site) {
    return (
      <ErrorState 
        title="Site Not Found" 
        message={`The site "${siteSlug}" doesn't exist or is not published.`}
      />
    );
  }

  const isPublished = (Array.isArray(site?.isPublished) ? site?.isPublished[0] : site?.isPublished) === true;

  if (!isPublished) {
    return (
      <ErrorState 
        title="Site Not Published" 
        message={`This site exists but is not yet published. Publish it from the Site Builder.`}
      />
    );
  }

  if (!activePage) {
    return (
      <ErrorState 
        title="Page Not Found" 
        message={`The page "${pageSlug}" doesn't exist.`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      <nav className="bg-[#161B22] border-b border-[#30363D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to={`/live/${siteSlug}`} className="text-[17px] font-bold text-[#E6EDF3] tracking-tight hover:text-[#2F81F7] transition-colors">
                {displaySiteName}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  to={`/live/${siteSlug}/${page.slug}`}
                  className={`text-[13px] font-semibold px-4 py-1.5 rounded-md transition-all ${
                    page.slug === activePage?.slug
                      ? 'text-[#2F81F7] bg-[#2F81F7]/10'
                      : 'text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D]'
                  }`}
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full flex flex-col">
        {(!activePage.sections || activePage.sections.length === 0) ? (
          <div className="flex-1 flex flex-col items-center justify-center py-40 px-6">
            <div className="max-w-md w-full text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#161B22] border border-[#30363D] mb-4">
                <Database className="w-8 h-8 text-[#2F81F7]" />
              </div>
              <p className="text-[#9DA7B3] text-lg font-medium">This page is empty.</p>
              <p className="text-[#64748b] text-sm">Add sections in the Site Builder to see your content here.</p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {(activePage.sections as Section[]).map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#0D1117] border-t border-[#30363D] py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <Link to="/" className="group flex flex-col items-center gap-4 no-underline">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-[#161B22] rounded-full border border-[#30363D] group-hover:border-[#2F81F7] transition-all duration-300">
               <span className="text-[11px] font-bold uppercase tracking-widest text-[#9DA7B3]">Built with</span>
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#2F81F7] rounded-md shadow-lg shadow-blue-500/20 flex items-center justify-center">
                    <Rocket className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold tracking-tighter text-[#E6EDF3]">VIBEBUILDER</span>
               </div>
            </div>
          </Link>
          <p className="text-[11px] text-[#9DA7B3]/60 mt-8 uppercase tracking-[0.2em] font-medium">© {new Date().getFullYear()} {displaySiteName}. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}