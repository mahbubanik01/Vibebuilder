import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { DragDropCanvas } from './drag-drop-canvas';
import { ComponentPalette } from './component-palette';
import { PageTabs } from './page-tabs';
import { EditorDndProvider } from './editor-dnd-context';
import { useSiteEditor } from '../hooks/use-site-editor';
import { DEFAULT_SITE_DATA, type Page } from '../types/site-builder.types';
import { useGetSites, useUpdateSite, useCreateSite } from '../hooks/use-sites';
import { useGetPages, useCreatePage, useDeletePage, useUpdatePage } from '../hooks/use-pages';
import { DEMO_SITE_NAME, DEMO_SITE_SLUG, DEMO_SITE_DESCRIPTION, DEMO_PAGES } from '../data/demo-seed';
import { Button } from '@/components/ui-kit/button';
import { Rocket, Globe, ExternalLink, RefreshCcw, Settings, X, Monitor, Tablet, Smartphone, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/state/store/auth';
import { normalizeScalar, safeJsonParse } from '@/lib/data-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { Label } from '@/components/ui-kit/label';
import { Input } from '@/components/ui-kit/input';
import { Textarea } from '@/components/ui-kit/textarea';
import { SectionEditor } from './section-editor';

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<ViewportMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function EditorPage() {
  const { siteId, pageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const ownerId = (user as any)?.id || 'anonymous';
  
  const isLocalSite = siteId?.startsWith('local-');

  // State
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isSiteSettingsOpen, setIsSiteSettingsOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Fetch Site Data
  const { data: siteDataRes, isLoading: isSiteLoading } = useGetSites({
    pageNo: 1,
    pageSize: 1,
    filter: siteId ? JSON.stringify({ ItemId: siteId }) : undefined,
  });

  // Fetch Pages Data
  const { data: pagesDataRes, isLoading: isPagesLoading } = useGetPages({
    pageNo: 1,
    pageSize: 50,
    filter: siteId ? JSON.stringify({ siteId: siteId }) : undefined,
  });

  const { mutateAsync: createPage } = useCreatePage();
  const { mutateAsync: deletePage } = useDeletePage();
  const { mutateAsync: updatePage } = useUpdatePage();
  const { mutateAsync: updateSite, isPending: isPublishing } = useUpdateSite();
  const { mutateAsync: createSite } = useCreateSite();

  // Robustly extract site and pages
  const site = (siteDataRes as any)?.getVibeSites?.items?.[0] || 
               (siteDataRes as any)?.VibeSites?.items?.[0] || 
               (isLocalSite ? JSON.parse(localStorage.getItem('vibe-sites') || '[]').find((s: any) => s.ItemId === siteId) : null);

const rawPages = (pagesDataRes as any)?.getVibePages?.items || 
                   (pagesDataRes as any)?.VibePages?.items || 
                   (pagesDataRes as any)?.VibePage?.items ||
                   (pagesDataRes as any)?.getVibePage?.items ||
                   (pagesDataRes as any)?.data?.getVibePages?.items ||
                   [];
                   
  console.log('[Editor] Raw pages - trying all paths, found:', rawPages.length);
  console.log('[Editor] Data keys:', Object.keys(pagesDataRes || {}));
                    
  const pages: Page[] = Array.isArray(rawPages) ? rawPages.map(p => ({
    ...p,
    ItemId: normalizeScalar(p.ItemId),
    name: normalizeScalar(p.name),
    slug: normalizeScalar(p.slug),
    sections: safeJsonParse(p.sections, [])
  })) : [];

  // Debug: Show first page's sections count
  if (pages.length > 0) {
    console.log('[Editor] First page sections:', pages[0].sections?.length);
    console.log('[Editor] First page sections content:', JSON.stringify(pages[0].sections).substring(0, 200));
  }
  
  const {
    page: editorPage,
    addSection,
    updateSection,
    removeSection,
    reorderSections,
    duplicateSection,
    loadPage,
  } = useSiteEditor(activePage ?? (pages[0] || DEFAULT_SITE_DATA.pages[0]));

  // Debounce the editor state to auto-save
  const [debouncedEditorPage] = useDebounce(editorPage, 1500);

  const isCreatingPage = useRef(false);
  const hasNavigated = useRef(false);

  // 1. Initial Page Sync: Ensure URL pageId matches activePage
  useEffect(() => {
    if (isPagesLoading) return;

    if (pages.length > 0) {
      const targetPage = pages.find((p) => p.slug === pageId) || pages[0];

      // If URL slug is missing or wrong, navigate to the correct one
      if (pageId !== targetPage.slug && !hasNavigated.current) {
        hasNavigated.current = true;
        navigate(`/site-builder/${siteId}/${targetPage.slug}`, { replace: true });
        return;
      }

      // Sync editor with the target page if it changed
      if (targetPage.slug !== activePage?.slug || targetPage.ItemId !== activePage?.ItemId) {
        console.log('[EditorPage] Loading page:', targetPage.slug);
        setActivePage(targetPage);
        loadPage(targetPage);
      }
    } else if (siteId && !isLocalSite && !isCreatingPage.current) {
      // Create home page if site exists but has no pages
      console.log('[EditorPage] No pages found, creating home...');
      isCreatingPage.current = true;
      const home = DEFAULT_SITE_DATA.pages[0];
      createPage({
        input: {
          siteId: [siteId],
          name: [home.name],
          slug: [home.slug],
          sections: JSON.stringify(home.sections),
          sortOrder: 0
        }
      });
    }
  }, [pageId, pages, isPagesLoading, siteId, navigate, loadPage, activePage?.slug, activePage?.ItemId, isLocalSite, createPage]);

  // 2. Auto-save Logic
  useEffect(() => {
    if (!activePage || isLocalSite) return;

    const hasChanges = JSON.stringify(activePage.sections) !== JSON.stringify(debouncedEditorPage.sections);
    
    if (hasChanges && debouncedEditorPage.slug === activePage.slug) {
      console.log('[AUTO-SAVE] Saving changes for:', activePage.slug);
      setIsAutoSaving(true);
      
      updatePage({
        filter: JSON.stringify({ slug: activePage.slug, siteId: siteId }),
        input: {
          sections: JSON.stringify(debouncedEditorPage.sections),
        }
      }).then(() => {
        setActivePage(debouncedEditorPage);
      }).catch(err => {
        console.error('[AUTO-SAVE] Failed:', err);
      }).finally(() => {
        setIsAutoSaving(false);
      });
    }
  }, [debouncedEditorPage, activePage, updatePage, isLocalSite]);

  // 3. Local Site Auto-save
  useEffect(() => {
    if (!activePage || !isLocalSite) return;
    
    if (JSON.stringify(activePage.sections) !== JSON.stringify(debouncedEditorPage.sections)) {
      const allPages = JSON.parse(localStorage.getItem(`vibe-pages-${siteId}`) || '[]');
      const idx = allPages.findIndex((p: any) => p.slug === activePage.slug);
      if (idx !== -1) {
        allPages[idx] = debouncedEditorPage;
        localStorage.setItem(`vibe-pages-${siteId}`, JSON.stringify(allPages));
        setActivePage(debouncedEditorPage);
      }
    }
  }, [debouncedEditorPage, activePage, isLocalSite, siteId]);

const handleManualSave = async () => {
    if (!activePage) {
      console.log('[SAVE] No activePage, returning');
      return;
    }
    
    console.log('[SAVE] Manual save for:', activePage.slug, 'siteId:', siteId, 'isLocalSite:', isLocalSite);
    setIsAutoSaving(true);

    if (isLocalSite) {
      const allPages = JSON.parse(localStorage.getItem(`vibe-pages-${siteId}`) || '[]');
      const idx = allPages.findIndex((p: any) => p.slug === activePage.slug);
      if (idx !== -1) {
        allPages[idx] = activePage;
        localStorage.setItem(`vibe-pages-${siteId}`, JSON.stringify(allPages));
      }
      toast({ title: 'Saved Locally' });
      setIsAutoSaving(false);
      return;
    }
    
try {
      // Use ItemId in filter - more precise
      const pageItemId = activePage?.ItemId || activePage?.itemId;
      const filter = pageItemId 
        ? JSON.stringify({ ItemId: pageItemId })
        : JSON.stringify({ slug: activePage.slug, siteId: siteId });
      console.log('[SAVE] Using filter:', filter);
      console.log('[SAVE] Sections data:', activePage.sections);
      console.log('[SAVE] Sections JSON:', JSON.stringify(activePage.sections).substring(0,100));
       
      const res: any = await updatePage({
        filter: filter,
        input: {
          sections: JSON.stringify(activePage.sections),
        }
      });
      
      console.log('[SAVE] API response:', res);
      toast({ title: 'Saved Successfully' });
      // Don't force reload - let the query refetch
    } catch (err) {
      toast({ variant: 'destructive', title: 'Save Failed' });
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Sync site settings
  useEffect(() => {
    if (site) {
      setSiteTitle(site.siteName);
      try {
        const meta = typeof site.metadata === 'string' ? JSON.parse(site.metadata || '{}') : site.metadata;
        setSiteDescription(meta?.description || '');
      } catch {
        // Ignore parse errors for invalid metadata
      }
    }
  }, [site]);

  const handlePublish = async () => {
    if (!site) return;
    if (isLocalSite) {
       const allSites = JSON.parse(localStorage.getItem('vibe-sites') || '[]');
       const idx = allSites.findIndex((s: any) => s.ItemId === siteId);
       if (idx !== -1) {
         allSites[idx].isPublished = !allSites[idx].isPublished;
         localStorage.setItem('vibe-sites', JSON.stringify(allSites));
         toast({ title: 'Local Status Updated', description: 'Publication toggled locally.' });
       }
       return;
    }
    
    const currentStatus = (Array.isArray(site.isPublished) ? site.isPublished[0] : site.isPublished) === true;
    const newStatus = !currentStatus;

    try {
      const res: any = await updateSite({
        filter: "{\"ItemId\":\"" + siteId + "\"}",
        input: { isPublished: newStatus }
      });
      console.log('Publish result:', res);
      
      if (!res?.updateVibeSite?.acknowledged) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update publication status.' });
        return;
      }
    } catch (err) {
      console.error('Publish error:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to publish site. Check console for details.' });
      return;
    }

    const isPublishing = newStatus;
    // Handle siteSlug as array
    const slug = Array.isArray(site.siteSlug) ? site.siteSlug[0] : site.siteSlug;
    const liveUrl = slug ? `/live/${slug}/home` : '';

    toast({
      variant: isPublishing ? 'success' : 'default',
      title: isPublishing ? 'Site Published' : 'Site Unpublished',
      description: isPublishing 
        ? (slug ? `Live at ${liveUrl}` : 'Your site is now live!')
        : 'Your site is no longer publicly accessible.',
      action: isPublishing && slug ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
          onClick={() => window.open(liveUrl, '_blank')}
        >
          View Site
        </Button>
      ) : undefined,
    });
  };

  const handleUpdateSiteSettings = async () => {
    if (!site) return;
    if (isLocalSite) {
       const allSites = JSON.parse(localStorage.getItem('vibe-sites') || '[]');
       const idx = allSites.findIndex((s: any) => s.ItemId === siteId);
       if (idx !== -1) {
          allSites[idx].siteName = siteTitle;
          allSites[idx].metadata = JSON.stringify({ description: siteDescription });
          localStorage.setItem('vibe-sites', JSON.stringify(allSites));
          setIsSiteSettingsOpen(false);
toast({ title: 'Settings Saved' });
        }
        return;
    }
    await updateSite({
      filter: "{\"ItemId\":\"" + siteId + "\"}",
      input: {
        siteName: siteTitle,
        metadata: JSON.stringify({ description: siteDescription })
      }
    });
    setIsSiteSettingsOpen(false);
    toast({
      variant: 'success',
      title: 'Settings Saved',
      description: 'Your global site settings have been updated.',
    });
  };

  const handlePageSelect = (slug: string) => {
    navigate(`/site-builder/${siteId}/${slug}`);
  };

  const handlePageCreate = async (name: string, slug: string) => {
    if (isLocalSite) {
      const allPages = JSON.parse(localStorage.getItem(`vibe-pages-${siteId}`) || '[]');
      allPages.push({ name, slug, sections: [] });
      localStorage.setItem(`vibe-pages-${siteId}`, JSON.stringify(allPages));
      navigate(`/site-builder/${siteId}/${slug}`);
      return;
    }
    console.log('Creating page:', { name, slug, siteId });
    try {
      const res = await createPage({
        input: {
          siteId: [siteId],
          name: [name],
          slug: [slug],
          sections: JSON.stringify([]),
        }
      });
      console.log('Page creation result:', res);
      navigate(`/site-builder/${siteId}/${slug}`);
    } catch (err) {
      console.error('Page creation error:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create page.' });
    }
  };

  const handlePageDelete = async (slug: string) => {
    if (isLocalSite) {
       const allPages = JSON.parse(localStorage.getItem(`vibe-pages-${siteId}`) || '[]');
       const filtered = allPages.filter((p: any) => p.slug !== slug);
       localStorage.setItem(`vibe-pages-${siteId}`, JSON.stringify(filtered));
       if (pageId === slug) navigate(`/site-builder/${siteId}/home`);
       return;
    }
    await deletePage({
      filter: "{\"slug\":{\"$eq\":\"" + slug + "\"},\"siteId\":{\"$eq\":\"" + siteId + "\"}}",
      input: { isHardDelete: false }
    });
    if (pageId === slug) {
      navigate(`/site-builder/${siteId}`);
    }
  };

  const handlePageUpdate = async (oldSlug: string, name: string, slug: string) => {
    if (isLocalSite) {
       const allPages = JSON.parse(localStorage.getItem(`vibe-pages-${siteId}`) || '[]');
       const idx = allPages.findIndex((p: any) => p.slug === oldSlug);
       if (idx !== -1) {
          allPages[idx].name = name;
          allPages[idx].slug = slug;
          localStorage.setItem(`vibe-pages-${siteId}`, JSON.stringify(allPages));
          if (oldSlug !== slug) navigate(`/site-builder/${siteId}/${slug}`);
       }
       return;
    }
    await updatePage({
      filter: "{\"slug\":{\"$eq\":\"" + oldSlug + "\"},\"siteId\":{\"$eq\":\"" + siteId + "\"}}",
      input: { name: [name], slug: [slug] }
    });
    if (oldSlug !== slug) {
      navigate(`/site-builder/${siteId}/${slug}`);
    }
  };

  // Demo loading
  const handleLoadDemo = useCallback(async () => {
    if (isLocalSite) {
       localStorage.setItem(`vibe-pages-${siteId}`, JSON.stringify(DEMO_PAGES));
       navigate(`/site-builder/${siteId}/home`);
       toast({ title: 'Demo Loaded Locally' });
       return;
    }
    try {
      const res = await createSite({
        input: {
          ownerId: [ownerId],
          siteName: [DEMO_SITE_NAME],
          siteSlug: [`${DEMO_SITE_SLUG}-${Date.now()}`],
          metadata: JSON.stringify({ description: DEMO_SITE_DESCRIPTION }),
        },
      });

      const newSiteId = (res as any)?.insertVibeSite?.itemId;
      if (!newSiteId) return;

      for (const page of DEMO_PAGES) {
        await createPage({
          input: {
            siteId: newSiteId,
            name: page.name,
            slug: page.slug,
            sections: JSON.stringify(page.sections),
          },
        });
      }

      navigate(`/site-builder/${newSiteId}/home`);
      toast({
        variant: 'success',
        title: 'Demo Loaded',
        description: 'A complete example site has been created for you.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load the demo site. Please try again.',
      });
    }
  }, [createSite, createPage, navigate, toast, ownerId, isLocalSite, siteId]);

  const handleSelectSection = useCallback((id: string) => {
    setSelectedSectionId(id);
  }, []);

  if (isSiteLoading || isPagesLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0D1117]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full border-4 border-[#2F81F7] border-t-transparent animate-spin shadow-2xl shadow-blue-500/20" />
          <p className="text-[13px] font-bold text-[#9DA7B3] uppercase tracking-[0.2em]">Initializing Workspace</p>
        </div>
      </div>
    );
  }

  const selectedSection = (editorPage?.sections || []).find(s => s.id === selectedSectionId);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-[#0D1117] selection:bg-[#2F81F7]/30">

      {/* ── Standalone Navigation ────────────────── */}
      <div className="flex-none h-[64px] bg-[#161B22] border-b border-[#30363D] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/site-builder')}
            className="h-9 w-9 rounded-md text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D] transition-all border border-[#30363D]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-4 border-l border-[#30363D] pl-4">
            <div className="flex flex-col">
              <h1 className="text-[13px] font-semibold text-[#E6EDF3] truncate max-w-[200px]">
                {site?.siteName || 'Vibe Editor'}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  (Array.isArray(site?.isPublished) ? site?.isPublished[0] : site?.isPublished) === true 
                    ? 'bg-[#2F81F7] shadow-[0_0_8px_#2F81F7]' 
                    : 'bg-[#30363D]'
                }`} />
                <span className="text-[11px] text-[#9DA7B3] flex items-center gap-1.5">
                  {normalizeScalar(site?.isPublished) === true ? (
                    <>
                      Live • 
                      <a 
                        href={`/live/${normalizeScalar(site?.siteSlug)}/home`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[#2F81F7] hover:underline flex items-center gap-0.5"
                      >
                        view site <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </>
                  ) : 'Draft'} • {isLocalSite ? 'Local' : 'Cloud'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Improved Page Tabs with Saving Indicator */}
        <div className="flex-1 flex items-center justify-center max-w-[600px] mx-4 relative">
          <div className="bg-[#0D1117] p-1 rounded-lg border border-[#30363D]">
            <PageTabs
              pages={pages}
              activePageId={editorPage.slug}
              onPageSelect={handlePageSelect}
              onPageCreate={handlePageCreate}
              onPageDelete={handlePageDelete}
              onPageUpdate={handlePageUpdate}
            />
          </div>
          
          {isAutoSaving && (
            <div className="absolute -right-24 flex items-center gap-2 text-[10px] font-bold text-[#2F81F7] uppercase tracking-widest animate-pulse">
              <RefreshCcw className="w-3 h-3 animate-spin" />
              Saving...
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0D1117] rounded-lg p-1 border border-[#30363D] mr-2">
            {([
              { mode: 'desktop' as ViewportMode, icon: Monitor },
              { mode: 'tablet' as ViewportMode, icon: Tablet },
              { mode: 'mobile' as ViewportMode, icon: Smartphone },
            ]).map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewport(mode)}
                className={`p-1.5 rounded-md transition-all ${
                  viewport === mode
                    ? 'bg-[#30363D] text-[#E6EDF3]'
                    : 'text-[#9DA7B3] hover:text-[#E6EDF3]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleManualSave}
            disabled={isAutoSaving}
            className="h-9 px-4 rounded-md font-medium transition-all active:scale-95 bg-[#30363D] text-[#E6EDF3] hover:bg-[#484f58] mr-2"
          >
            {isAutoSaving ? <RefreshCcw className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            Save
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isPublishing}
            className={`h-9 px-4 rounded-md font-medium transition-all active:scale-95 ${
              normalizeScalar(site?.isPublished) === true
                ? 'bg-[#30363D] text-[#E6EDF3] hover:bg-[#484f58]' 
                : 'bg-[#2F81F7] hover:bg-[#1F6FEB] text-white'
            }`}
          >
            {isPublishing ? (
              <RefreshCcw className="w-3.5 h-3.5 animate-spin mr-2" />
            ) : normalizeScalar(site?.isPublished) === true ? (
              <Globe className="w-3.5 h-3.5 mr-2" />
            ) : (
              <Rocket className="w-3.5 h-3.5 mr-2" />
            )}
            {normalizeScalar(site?.isPublished) === true ? 'Unpublish' : 'Publish'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSiteSettingsOpen(true)}
            className="h-9 w-9 rounded-md text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D] transition-all border border-[#30363D]"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Main Canvas ────────────────────────── */}
      <EditorDndProvider
        sections={editorPage.sections}
        onAddSection={addSection}
        onReorderSections={reorderSections}
        onSelectSection={handleSelectSection}
      >
        <div className="flex flex-1 min-h-0 bg-[#0D1117] relative">
          
          <ComponentPalette onAddComponent={(type) => {
            const newId = addSection(type);
            setSelectedSectionId(newId);
          }} />

          {/* Canvas Studio Area */}
          <div className="flex-1 overflow-y-auto studio-bg p-12 scroll-smooth border-x border-[#30363D]">
            <div
              className="mx-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ width: VIEWPORT_WIDTHS[viewport] }}
            >
              <div className="bg-white rounded-md shadow-2xl min-h-[85vh] overflow-hidden border border-[#30363D] relative">
                <DragDropCanvas
                  sections={editorPage.sections}
                  selectedSectionId={selectedSectionId}
                  onSelect={setSelectedSectionId}
                  onReorder={reorderSections}
                  onUpdate={updateSection}
                  onRemove={(id) => {
                    removeSection(id);
                    if (selectedSectionId === id) setSelectedSectionId(null);
                  }}
                  onDuplicate={duplicateSection}
                  onLoadDemo={handleLoadDemo}
                />
              </div>
            </div>
          </div>

          {/* Improved Right Sidebar */}
          <div
            className={`bg-[#161B22] border-l border-[#30363D] flex flex-col z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              selectedSection ? 'w-[400px]' : 'w-0 opacity-0 pointer-events-none'
            }`}
          >
            {selectedSection && (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#30363D]">
                  <div>
                    <h3 className="text-[10px] font-bold text-[#2F81F7] uppercase tracking-wider">
                      {selectedSection.type}
                    </h3>
                    <p className="text-[14px] font-semibold text-[#E6EDF3] mt-0.5">Configuration</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedSectionId(null)}
                    className="h-8 w-8 rounded-md text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar text-[#E6EDF3]">
                  <SectionEditor section={selectedSection} onChange={updateSection} />
                </div>
              </>
            )}
          </div>
        </div>
      </EditorDndProvider>

      {/* ── Site Settings Dialog ─────────────────── */}
      <Dialog open={isSiteSettingsOpen} onOpenChange={setIsSiteSettingsOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#161B22] border-[#30363D] text-[#E6EDF3]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-[#E6EDF3]">Site Settings</DialogTitle>
            <DialogDescription className="text-[#9DA7B3]">Configure global settings for your website.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="siteTitle" className="text-xs font-semibold uppercase tracking-wider text-[#9DA7B3]">Website Name</Label>
              <Input
                id="siteTitle"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all h-11 text-base"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="siteDesc" className="text-xs font-semibold uppercase tracking-wider text-[#9DA7B3]">Meta Description (SEO)</Label>
              <Textarea
                id="siteDesc"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="Briefly describe your website for search engines..."
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsSiteSettingsOpen(false)} className="px-6 text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D]">Cancel</Button>
            <Button
              className="bg-[#2F81F7] hover:bg-[#1F6FEB] text-white shadow-md px-8 font-semibold border-none"
              onClick={handleUpdateSiteSettings}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
