import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Layout, Globe, MoreVertical, Trash2, Edit3, ExternalLink, Rocket } from 'lucide-react';
import { useGetSites, useCreateSite, useDeleteSite } from '../hooks/use-sites';
import { useAuthStore } from '@/state/store/auth';
import { Button } from '@/components/ui-kit/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui-kit/dialog';
import { Input } from '@/components/ui-kit/input';
import { Label } from '@/components/ui-kit/label';

export function SiteListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const ownerId = (user as any)?.id || 'anonymous';

  // State
  const [pageNo] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');

  // Queries & Mutations
  const { data, isLoading, isError, error } = useGetSites({
    pageNo,
    pageSize: 50,
    filter: "{\"ownerId\":{\"$eq\":\"" + ownerId + "\"}}",
    sort: "{\"CreatedDate\":-1}",
  });
  const { mutateAsync: createSite, isPending: isCreating } = useCreateSite();
  const { mutateAsync: deleteSite } = useDeleteSite();

  // Check if schema is missing or auth failed
  const errorMsg = error?.message || '';
  const isSchemaMissing = isError && (errorMsg.includes('VibeSites') || errorMsg.includes('does not exist') || errorMsg.includes('field') || errorMsg.includes('401') || errorMsg.includes('400'));
  
  // Use local storage if schema is missing or user chooses "Standalone Mode"
  const [forceStandalone, setForceStandalone] = useState(localStorage.getItem('vibe-standalone-mode') === 'true');
  const isOfflineMode = isSchemaMissing || forceStandalone;

  // Local Storage Fallback Mode
  const [localSites, setLocalSites] = useState<any[]>(() => {
    const stored = localStorage.getItem('vibe-sites');
    return stored ? JSON.parse(stored) : [];
  });

  // Merge cloud and local sites
  const cloudSites = (data as any)?.getVibeSites?.items || (data as any)?.VibeSites?.items || [];
  const sites = [...localSites, ...cloudSites.filter((cs: any) => !localSites.find(ls => ls.siteSlug === cs.siteSlug))];

  const handleToggleStandalone = () => {
    const newVal = !forceStandalone;
    setForceStandalone(newVal);
    localStorage.setItem('vibe-standalone-mode', newVal.toString());
  };

  const handleCreateSite = async () => {
    if (!newSiteName.trim()) return;
    
    const siteSlug = newSiteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    if (isOfflineMode) {
      // Local Storage Mode
      const newSite = {
        ItemId: `local-${Date.now()}`,
        siteName: newSiteName,
        siteSlug,
        metadata: JSON.stringify({ title: newSiteName, description: 'Local project' }),
        isPublished: false,
        ownerId: 'local-user',
        CreatedDate: new Date().toISOString(),
      };
      const updated = [...localSites, newSite];
      setLocalSites(updated);
      localStorage.setItem('vibe-sites', JSON.stringify(updated));
      setIsCreateModalOpen(false);
      setNewSiteName('');
      navigate(`/site-builder/${newSite.ItemId}/home`);
      return;
    }
    
    try {
      const res = await createSite({
        input: {
          ownerId: ownerId,
          siteName: newSiteName,
          siteSlug: siteSlug,
          metadata: JSON.stringify({ title: newSiteName }),
        },
      }) as any;
      
      const itemId = res?.insertVibeSite?.itemId;
      setIsCreateModalOpen(false);
      setNewSiteName('');
      if (itemId) navigate(`/site-builder/${itemId}/home`);
    } catch (e) {
      // Fallback to local on error
      handleToggleStandalone();
    }
  };

  const handleDeleteSite = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this site?')) return;
    
    if (isOfflineMode || itemId.startsWith('local-')) {
      const updated = localSites.filter((s: any) => s.ItemId !== itemId);
      setLocalSites(updated);
      localStorage.setItem('vibe-sites', JSON.stringify(updated));
      return;
    }
    
    await deleteSite({ filter: JSON.stringify({ ItemId: itemId }), input: { isHardDelete: false } });
  };

  return (
    <div className="min-h-screen w-full bg-[#0D1117] pb-32 overflow-x-hidden selection:bg-[#2F81F7]/30">
      {/* Standalone Banner */}
      {isOfflineMode && (
        <div className="bg-[#1F6FEB] py-2 px-4 flex items-center justify-center gap-3 text-[11px] font-semibold text-white uppercase tracking-wider border-b border-[#30363D]">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Standalone Mode Active
        </div>
      )}

      <div className="w-full py-20 px-10 lg:px-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2F81F7] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[#E6EDF3]">VibeBuilder</h1>
            </div>
            <p className="text-[#9DA7B3] font-medium text-sm ml-1">Visual design engine for high-fidelity sites</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggleStandalone}
                className={`text-[12px] font-semibold h-10 px-5 rounded-md border ${isOfflineMode ? 'text-[#2F81F7] border-[#2F81F7]/30 bg-[#2F81F7]/10' : 'text-[#9DA7B3] border-[#30363D] hover:text-[#E6EDF3] hover:bg-[#161B22]'}`}
             >
               {isOfflineMode ? 'Cloud Mode' : 'Go Offline'}
             </Button>
             <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 h-11 px-8 bg-[#2F81F7] hover:bg-[#1F6FEB] text-white shadow-lg transition-all rounded-md font-semibold text-sm active:scale-95">
              <Plus className="w-4 h-4" /> New Project
            </Button>
          </div>
        </div>

        {isLoading && !isOfflineMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-white rounded-2xl border animate-pulse" />
            ))}
          </div>
        ) : sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-[#161B22] rounded-lg border border-[#30363D] px-6 text-center shadow-2xl">
            <div className="w-24 h-24 bg-[#0D1117] rounded-md flex items-center justify-center mb-10 border border-[#30363D]">
              <Layout className="w-10 h-10 text-[#2F81F7]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E6EDF3] mb-4 tracking-tighter">No projects found</h3>
            <p className="text-[#9DA7B3] max-w-sm mb-12 leading-relaxed text-[15px]">
              Ready to build something remarkable? Create your first website and start designing with Vibe.
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)} 
              size="lg" 
              className="h-14 px-12 bg-[#2F81F7] hover:bg-[#1F6FEB] text-white shadow-xl shadow-blue-500/10 rounded-md font-bold transition-all hover:scale-[1.02] active:scale-95 border-none"
            >
              <Plus className="w-5 h-5 mr-2" /> Create First Site
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sites.map((site: any) => (
              <div 
                key={site.ItemId} 
                className="group relative bg-[#161B22] rounded-lg border border-[#30363D] hover:border-[#484f58] transition-all duration-200 flex flex-col overflow-hidden shadow-sm"
              >
                <div 
                  className="aspect-[16/10] bg-[#0D1117] flex items-center justify-center relative cursor-pointer overflow-hidden border-b border-[#30363D]"
                  onClick={() => navigate(`/site-builder/${site.ItemId}/home`)}
                >
                  <Globe className="w-10 h-10 text-[#30363D] group-hover:text-[#2F81F7] group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button className="h-9 px-6 rounded-md font-semibold bg-[#2F81F7] hover:bg-[#1F6FEB] text-white shadow-xl border-none">
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#E6EDF3] truncate flex-1 pr-2 text-[15px]" title={site.siteName}>
                      {site.siteName}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D]">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-md bg-[#161B22] border-[#30363D] shadow-2xl">
                        <DropdownMenuItem onClick={() => navigate(`/site-builder/${site.ItemId}/home`)} className="gap-2 text-[#E6EDF3] focus:bg-[#30363D] focus:text-[#E6EDF3]">
                          <Edit3 className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/live/${site.siteSlug}/home`, '_blank')} className="gap-2 text-[#E6EDF3] focus:bg-[#30363D] focus:text-[#E6EDF3]">
                          <ExternalLink className="w-4 h-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[#f85149] focus:bg-[#f85149]/10 focus:text-[#f85149] gap-2" onClick={() => handleDeleteSite(site.ItemId)}>
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      (Array.isArray(site.isPublished) ? site.isPublished[0] : site.isPublished) === true ? 'bg-[#2F81F7]' : 'bg-[#30363D]'
                    }`} />
                    <span className="text-[11px] font-semibold text-[#9DA7B3]">
                      {(Array.isArray(site.isPublished) ? site.isPublished[0] : site.isPublished) === true ? 'Live' : 'Draft'}
                    </span>
                    <span className="text-[11px] text-[#30363D] px-1">•</span>
                    <span className="text-[11px] font-semibold text-[#9DA7B3]">
                      {site.ItemId.startsWith('local-') ? 'Local' : 'Cloud'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-[#161B22] border-[#30363D] text-[#E6EDF3] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-[#E6EDF3]">Create New Site</DialogTitle>
            <DialogDescription className="text-[14px] text-[#9DA7B3] mt-1">
              Give your new website a name. You can change this later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label htmlFor="siteName" className="text-[13px] font-semibold text-[#E6EDF3] mb-2 block">
              Site Name
            </Label>
            <Input
              id="siteName"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] placeholder:text-[#9DA7B3]/50 focus:border-[#2F81F7] transition-all h-11"
              placeholder="e.g. My Awesome Portfolio"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D]">
              Cancel
            </Button>
            <Button onClick={handleCreateSite} disabled={!newSiteName.trim() || isCreating} className="bg-[#2F81F7] hover:bg-[#1F6FEB] text-white px-8 font-semibold">
              {isCreating ? 'Creating...' : 'Create Site'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
