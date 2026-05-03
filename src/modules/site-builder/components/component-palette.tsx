import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, Image, Layout, Grid3X3, Mail, Minus, Video, MousePointerClick, Star, Quote, Search, GripVertical, DollarSign, HelpCircle, Mailbox, Users, BarChart3, LayoutGrid, FileText, Code, MapPin, Timer, GitBranch, Share2, ListOrdered, Clock, Table2 } from 'lucide-react';
import type { SectionType } from '../types/site-builder.types';

interface ComponentPaletteProps {
  onAddComponent: (type: SectionType) => void;
}

const COMPONENT_GROUPS = [
  {
    title: 'Hero & Header',
    items: [
      { type: 'hero' as SectionType, label: 'Hero Banner', icon: Layout, desc: 'Full-width landing header' },
    ],
  },
  {
    title: 'Content',
    items: [
      { type: 'text' as SectionType, label: 'Text Block', icon: Type, desc: 'Rich content area' },
      { type: 'code' as SectionType, label: 'Code Block', icon: Code, desc: 'Syntax highlighted code' },
      { type: 'accordion' as SectionType, label: 'Accordion', icon: ListOrdered, desc: 'Expandable content' },
      { type: 'timeline' as SectionType, label: 'Timeline', icon: Clock, desc: 'Chronological events' },
    ],
  },
  {
    title: 'Media',
    items: [
      { type: 'image' as SectionType, label: 'Single Image', icon: Image, desc: 'Visual asset' },
      { type: 'gallery' as SectionType, label: 'Image Gallery', icon: Grid3X3, desc: 'Media collection' },
      { type: 'video' as SectionType, label: 'Video Embed', icon: Video, desc: 'YouTube/Vimeo' },
    ],
  },
  {
    title: 'Conversion',
    items: [
      { type: 'cta' as SectionType, label: 'Call to Action', icon: MousePointerClick, desc: 'Lead generation' },
      { type: 'contact' as SectionType, label: 'Contact Form', icon: Mail, desc: 'Communication block' },
      { type: 'newsletter' as SectionType, label: 'Newsletter', icon: Mailbox, desc: 'Email signup form' },
    ],
  },
  {
    title: 'Features',
    items: [
      { type: 'features' as SectionType, label: 'Feature Grid', icon: Star, desc: 'Benefit showcase' },
      { type: 'pricing' as SectionType, label: 'Pricing Cards', icon: DollarSign, desc: 'Pricing tables' },
      { type: 'faq' as SectionType, label: 'FAQ', icon: HelpCircle, desc: 'Questions & answers' },
      { type: 'compare' as SectionType, label: 'Compare Table', icon: Table2, desc: 'Plan comparison' },
    ],
  },
  {
    title: 'Social Proof',
    items: [
      { type: 'testimonials' as SectionType, label: 'Testimonials', icon: Quote, desc: 'Customer reviews' },
      { type: 'stats' as SectionType, label: 'Stats Counter', icon: BarChart3, desc: 'Animated numbers' },
      { type: 'team' as SectionType, label: 'Team Members', icon: Users, desc: 'Staff profiles' },
      { type: 'logos' as SectionType, label: 'Client Logos', icon: LayoutGrid, desc: 'Brand showcase' },
    ],
  },
  {
    title: 'Blog & Content',
    items: [
      { type: 'blog' as SectionType, label: 'Blog Posts', icon: FileText, desc: 'Article previews' },
    ],
  },
  {
    title: 'Interactive',
    items: [
      { type: 'countdown' as SectionType, label: 'Countdown Timer', icon: Timer, desc: 'Event timer' },
      { type: 'map' as SectionType, label: 'Map Location', icon: MapPin, desc: 'Address embed' },
      { type: 'social' as SectionType, label: 'Social Links', icon: Share2, desc: 'Social media icons' },
    ],
  },
  {
    title: 'Layout',
    items: [
      { type: 'spacer' as SectionType, label: 'Spacer', icon: Minus, desc: 'White space divider' },
      { type: 'divider' as SectionType, label: 'Divider', icon: GitBranch, desc: 'Visual separator' },
    ],
  },
];

// ── Draggable Palette Item ───────────────────

interface DraggablePaletteItemProps {
  type: SectionType;
  label: string;
  desc: string;
  icon: React.ElementType;
  onClick: () => void;
}

function DraggablePaletteItem({ type, label, desc, icon: Icon, onClick }: DraggablePaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { fromPalette: true, sectionType: type },
  });

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 text-left group border border-transparent ${
        isDragging
          ? 'opacity-40 scale-95'
          : 'hover:bg-[#30363D]/50 hover:border-[#30363D]'
      }`}
    >
      {/* Icon Area */}
      <div className="w-9 h-9 rounded-md bg-[#0D1117] flex items-center justify-center border border-[#30363D] group-hover:border-[#2F81F7] transition-colors flex-shrink-0">
        <Icon className="w-4 h-4 text-[#9DA7B3] group-hover:text-[#2F81F7]" />
      </div>

      {/* Label Area */}
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-[#E6EDF3] leading-tight truncate group-hover:text-[#2F81F7] transition-colors">{label}</div>
        <div className="text-[11px] text-[#9DA7B3] leading-tight mt-1 truncate">{desc}</div>
      </div>
      
      <div 
        {...attributes}
        {...listeners}
        className="ml-auto p-1.5 text-[#30363D] hover:text-[#9DA7B3] cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </button>
  );
}

// ── Component Palette ────────────────────────

export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const [search, setSearch] = useState('');

  const filteredGroups = COMPONENT_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="w-[280px] bg-[#161B22] h-full flex flex-col z-30 relative overflow-hidden border-r border-[#30363D]">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h2 className="text-[14px] font-bold text-[#E6EDF3]">Components</h2>
        <p className="text-[12px] text-[#9DA7B3] mt-0.5 font-medium">Add elements to your site</p>
      </div>

      {/* Search */}
      <div className="px-5 pb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9DA7B3]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search elements..."
            className="w-full h-10 pl-9 pr-4 rounded-md bg-[#0D1117] border border-[#30363D] text-[13px] text-[#E6EDF3] placeholder:text-[#9DA7B3]/50 focus:outline-none focus:border-[#2F81F7] transition-all"
          />
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto px-3 pb-8 space-y-6 custom-scrollbar">
        {filteredGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[11px] font-bold text-[#9DA7B3] uppercase tracking-wider mb-2 px-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <DraggablePaletteItem
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  desc={item.desc}
                  icon={item.icon}
                  onClick={() => onAddComponent(item.type)}
                />
              ))}
            </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="text-center py-10 text-[#9DA7B3] text-[12px]">No components found</div>
        )}
      </div>
    </div>
  );
}
