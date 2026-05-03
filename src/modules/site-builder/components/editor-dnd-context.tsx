import React, { useState, createContext, useContext, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { Section, SectionType } from '../types/site-builder.types';
import { SectionRenderer } from './section-renderer';
import { Layout, Type, Image, Grid3X3, Mail, Minus, Video, MousePointerClick, Star, Quote, DollarSign, HelpCircle, Mailbox, Users, BarChart3, FileText, Code, MapPin, Timer, GitBranch, Share2, ListOrdered, Clock, Table2, LayoutGrid } from 'lucide-react';

// ── Types ────────────────────────────────────

interface ActiveDragData {
  fromPalette: boolean;
  sectionType?: SectionType;
  sectionId?: string;
}

interface EditorDndContextValue {
  activeDrag: ActiveDragData | null;
}

const DndCtx = createContext<EditorDndContextValue>({ activeDrag: null });
export const useEditorDnd = () => useContext(DndCtx);

// ── Icon map for palette overlay ─────────────

const SECTION_ICONS: Record<SectionType, React.ElementType> = {
  hero: Layout,
  text: Type,
  image: Image,
  gallery: Grid3X3,
  contact: Mail,
  spacer: Minus,
  video: Video,
  cta: MousePointerClick,
  features: Star,
  testimonials: Quote,
  pricing: DollarSign,
  faq: HelpCircle,
  newsletter: Mailbox,
  team: Users,
  stats: BarChart3,
  logos: LayoutGrid,
  blog: FileText,
  code: Code,
  map: MapPin,
  countdown: Timer,
  divider: GitBranch,
  social: Share2,
  accordion: ListOrdered,
  timeline: Clock,
  compare: Table2,
};

// ── Provider ─────────────────────────────────

interface EditorDndProviderProps {
  sections: Section[];
  onAddSection: (type: SectionType, atIndex?: number) => string;
  onReorderSections: (sections: Section[]) => void;
  onSelectSection?: (id: string) => void;
  children: React.ReactNode;
}

export function EditorDndProvider({
  sections,
  onAddSection,
  onReorderSections,
  onSelectSection,
  children,
}: EditorDndProviderProps) {
  const [activeDrag, setActiveDrag] = useState<ActiveDragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as ActiveDragData | undefined;
    if (data?.fromPalette) {
      setActiveDrag({ fromPalette: true, sectionType: data.sectionType });
    } else {
      setActiveDrag({ fromPalette: false, sectionId: String(event.active.id) });
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const data = active.data.current as ActiveDragData | undefined;

      setActiveDrag(null);

      if (data?.fromPalette && data.sectionType) {
        // Palette → Canvas: add new section
        let insertIndex: number | undefined;
        if (over) {
          const overIdx = sections.findIndex((s) => s.id === over.id);
          if (overIdx >= 0) insertIndex = overIdx + 1;
        }
        const newId = onAddSection(data.sectionType, insertIndex);
        onSelectSection?.(newId);
        return;
      }

      // Canvas reorder
      if (over && active.id !== over.id) {
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        if (oldIndex >= 0 && newIndex >= 0) {
          onReorderSections(arrayMove(sections, oldIndex, newIndex));
        }
      }
    },
    [sections, onAddSection, onReorderSections, onSelectSection]
  );

  // ── Drag Overlay ───────────────────────────

  const renderOverlay = () => {
    if (!activeDrag) return null;

    if (activeDrag.fromPalette && activeDrag.sectionType) {
      const Icon = SECTION_ICONS[activeDrag.sectionType] || Layout;
      return (
        <div className="flex items-center gap-4 px-6 py-4 bg-[#161B22] rounded-md shadow-2xl border border-[#2F81F7] min-w-[240px] pointer-events-none ring-4 ring-[#2F81F7]/10">
          <div className="w-11 h-11 rounded-md bg-[#0D1117] border border-[#30363D] flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#2F81F7]" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#E6EDF3] capitalize tracking-tight">{activeDrag.sectionType} Section</div>
            <div className="text-[11px] text-[#9DA7B3] font-medium mt-0.5">Drop anywhere on canvas</div>
          </div>
        </div>
      );
    }

    if (activeDrag.sectionId) {
      const section = sections.find((s) => s.id === activeDrag.sectionId);
      if (section) {
        return (
          <div className="bg-[#161B22] rounded-md shadow-2xl border-2 border-[#2F81F7] overflow-hidden max-w-[600px] opacity-95 pointer-events-none transform scale-[0.8]">
            <div className="pointer-events-none">
              <SectionRenderer section={section} />
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <DndCtx.Provider value={{ activeDrag }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
        <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
          {renderOverlay()}
        </DragOverlay>
      </DndContext>
    </DndCtx.Provider>
  );
}
