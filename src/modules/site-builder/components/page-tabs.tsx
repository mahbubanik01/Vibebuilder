import { useState } from 'react';
import { Plus, FileText, MoreVertical, Trash2, Check, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
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
import { Label } from '@/components/ui-kit/label';
import { cn } from '@/lib/utils';
import type { Page } from '../types/site-builder.types';

interface PageTabsProps {
  pages: Page[];
  activePageId?: string;
  onPageSelect: (pageId: string) => void;
  onPageCreate: (name: string, slug: string) => void;
  onPageDelete: (pageId: string) => void;
  onPageUpdate: (pageId: string, name: string, slug: string) => void;
}

export function PageTabs({ pages, activePageId, onPageSelect, onPageCreate, onPageDelete, onPageUpdate }: PageTabsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  const handleCreateSubmit = () => {
    if (newPageName.trim()) {
      const slug = newPageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      onPageCreate(newPageName.trim(), slug);
      setNewPageName('');
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateSubmit();
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewPageName('');
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {pages.map((page) => {
        const isActive = activePageId === page.slug;
        
        return (
          <div
            key={page.slug}
            className={cn(
              "group relative flex items-center h-10 pl-4 pr-1 rounded-md text-[13px] font-semibold border transition-all duration-200 flex-shrink-0 cursor-pointer select-none",
              isActive 
                ? "bg-[#161B22] border-[#2F81F7] text-[#E6EDF3] shadow-lg shadow-blue-500/5" 
                : "bg-[#0D1117] border-[#30363D] text-[#9DA7B3] hover:border-[#2F81F7]/50 hover:text-[#E6EDF3]"
            )}
            onClick={() => onPageSelect(page.slug)}
          >
            <FileText className={cn("w-3.5 h-3.5 mr-2", isActive ? "text-[#2F81F7]" : "text-[#9DA7B3]")} />
            <span className="mr-1 tracking-tight">{page.name}</span>
            
            {pages.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#30363D]",
                      isActive && "opacity-100"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-[#9DA7B3]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#161B22] border-[#30363D] text-[#E6EDF3] p-1 shadow-2xl">
                  <DropdownMenuItem 
                    className="hover:bg-[#30363D] focus:bg-[#30363D] cursor-pointer rounded-md h-9 text-[13px] font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPage(page);
                      setEditName(page.name);
                      setEditSlug(page.slug);
                      setIsSettingsOpen(true);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2.5 text-[#9DA7B3]" /> Page Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-[#f85149] hover:bg-[#f85149]/10 focus:bg-[#f85149]/10 cursor-pointer rounded-md h-9 text-[13px] font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete page "${page.name}"?`)) {
                        onPageDelete(page.slug);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2.5" /> Delete Page
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}

      {isCreating ? (
        <div className="flex items-center h-10 px-1 rounded-md bg-[#0D1117] border border-[#2F81F7] shadow-sm flex-shrink-0 min-w-[180px]">
          <Input
            autoFocus
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 border-none shadow-none focus-visible:ring-0 px-3 flex-1 text-[13px] bg-transparent text-[#E6EDF3]"
            placeholder="New page name..."
          />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#2F81F7] hover:bg-[#2F81F7]/10" onClick={handleCreateSubmit}>
            <Check className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9DA7B3] hover:bg-[#30363D]" onClick={() => setIsCreating(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-10 border border-dashed border-[#30363D] text-[#9DA7B3] hover:text-[#E6EDF3] hover:border-[#2F81F7]/50 hover:bg-[#161B22] rounded-md px-4 font-semibold text-[13px] transition-all"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Page
        </Button>
      )}

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#161B22] border-[#30363D] text-[#E6EDF3]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold tracking-tight text-[#E6EDF3]">Page Settings</DialogTitle>
            <DialogDescription className="text-[#9DA7B3] text-[14px] mt-1">
              Manage your page name and URL slug.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-[12px] font-semibold text-[#9DA7B3]">Page Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug" className="text-[12px] font-semibold text-[#9DA7B3]">URL Slug</Label>
              <div className="flex items-center gap-2 relative">
                <span className="text-[#9DA7B3] text-sm absolute left-3">/</span>
                <Input
                  id="slug"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all h-10 pl-6"
                />
              </div>
              <p className="text-[11px] text-[#9DA7B3]/60 italic mt-1">Slugs should only contain letters, numbers, and dashes.</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsSettingsOpen(false)} className="text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D] px-6">Cancel</Button>
            <Button 
              className="bg-[#2F81F7] hover:bg-[#1F6FEB] text-white px-8 font-semibold shadow-xl border-none h-10"
              onClick={() => {
                if (editingPage && editName.trim() && editSlug.trim()) {
                  onPageUpdate(editingPage.slug, editName.trim(), editSlug.trim());
                  setIsSettingsOpen(false);
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
