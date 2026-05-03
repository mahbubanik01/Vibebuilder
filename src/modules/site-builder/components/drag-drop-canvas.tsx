import React from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Section } from '../types/site-builder.types';
import { SectionRenderer } from './section-renderer';
import { GripVertical, Trash2, Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui-kit/button';

// ── Sortable Section Card ────────────────────

interface SortableSectionProps {
  section: Section;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function SortableSection({
  section,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(section.id)}
      className={`relative group mb-3 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
        isDragging
          ? 'opacity-40 scale-[0.98]'
          : isSelected
            ? 'ring-2 ring-[#2F81F7] shadow-2xl'
            : 'hover:ring-1 hover:ring-[#30363D]'
      }`}
    >
      {/* Floating toolbar — visible on hover or when selected */}
      <div
        className={`absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#161B22] border border-[#30363D] rounded-md shadow-2xl px-1 py-1 transition-all duration-200 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="p-1.5 text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D] rounded cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="w-px h-4 bg-[#30363D]" />
        <span className="px-3 text-[11px] font-bold text-[#E6EDF3] uppercase tracking-widest select-none">
          {section.type}
        </span>
      </div>

      {/* Action buttons — top right */}
      <div
        className={`absolute top-3 right-3 z-20 flex items-center gap-1 bg-[#161B22] border border-[#30363D] rounded-md shadow-2xl px-1 py-1 transition-all duration-200 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onDuplicate(section.id); }}
          title="Duplicate"
          className="h-8 w-8 p-0 text-[#9DA7B3] hover:text-[#2F81F7] hover:bg-[#2F81F7]/10"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onRemove(section.id); }}
          title="Delete"
          className="h-8 w-8 p-0 text-[#9DA7B3] hover:text-[#f85149] hover:bg-[#f85149]/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Live rendered section */}
      <div className="pointer-events-none">
        <SectionRenderer section={section} />
      </div>
    </div>
  );
}

// ── Canvas ───────────────────────────────────

interface DragDropCanvasProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelect: (id: string) => void;
  onReorder: (sections: Section[]) => void;
  onUpdate: (id: string, content: Record<string, string>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onLoadDemo?: () => void;
}

export function DragDropCanvas({
  sections,
  selectedSectionId,
  onSelect,
  onRemove,
  onDuplicate,
  onLoadDemo,
}: DragDropCanvasProps) {
  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <div className="w-24 h-24 rounded-2xl bg-[#161B22] border border-[#30363D] flex items-center justify-center mb-10 shadow-2xl relative">
          <div className="absolute inset-0 bg-[#2F81F7]/20 blur-2xl rounded-full" />
          <Sparkles className="w-10 h-10 text-[#2F81F7] relative z-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#E6EDF3] mb-4 tracking-tighter">Start building your masterpiece</h3>
        <p className="text-[#9DA7B3] max-w-sm mb-12 leading-relaxed text-[15px]">
          Drag components from the left panel or click them to add sections. 
          Your creation will render live as you build.
        </p>
        {onLoadDemo && (
          <Button
            onClick={onLoadDemo}
            className="gap-2 px-10 h-14 rounded-md bg-[#2F81F7] hover:bg-[#1F6FEB] text-white shadow-xl shadow-blue-500/10 transition-all border-none font-bold text-[15px]"
          >
            <Sparkles className="w-5 h-5" />
            Load Example Site
          </Button>
        )}
      </div>
    );
  }

  return (
    <SortableContext
      items={sections.map((s) => s.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="pb-24 space-y-0">
        {sections.map((section) => (
          <SortableSection
            key={section.id}
            section={section}
            isSelected={selectedSectionId === section.id}
            onSelect={onSelect}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
          />
        ))}
      </div>
    </SortableContext>
  );
}
