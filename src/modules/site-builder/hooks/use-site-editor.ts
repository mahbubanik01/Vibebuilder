import { useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import type { Page, Section, SectionType } from '../types/site-builder.types';
import { DEFAULT_CONTENT } from '../types/site-builder.types';

// ── Actions ──────────────────────────────────

type EditorAction =
  | { type: 'ADD_SECTION'; payload: { sectionType: SectionType; id?: string; atIndex?: number } }
  | { type: 'UPDATE_SECTION'; payload: { id: string; content: Record<string, string> } }
  | { type: 'MOVE_SECTION'; payload: { id: string; direction: 'up' | 'down' } }
  | { type: 'REMOVE_SECTION'; payload: { id: string } }
  | { type: 'REORDER_SECTIONS'; payload: { sections: Section[] } }
  | { type: 'DUPLICATE_SECTION'; payload: { id: string } }
  | { type: 'SET_PAGE'; payload: Page };

// ── Reducer ──────────────────────────────────

function editorReducer(state: Page, action: EditorAction): Page {
  switch (action.type) {
    case 'ADD_SECTION': {
      const newSection: Section = {
        id: action.payload.id || uuid(),
        type: action.payload.sectionType,
        content: { ...DEFAULT_CONTENT[action.payload.sectionType] },
      };
      if (action.payload.atIndex !== undefined) {
        const sections = [...state.sections];
        sections.splice(action.payload.atIndex, 0, newSection);
        return { ...state, sections };
      }
      return { ...state, sections: [...state.sections, newSection] };
    }

    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.payload.id
            ? { ...s, content: { ...s.content, ...action.payload.content } }
            : s
        ),
      };

    case 'MOVE_SECTION': {
      const { id, direction } = action.payload;
      const sections = [...state.sections];
      const idx = sections.findIndex((s) => s.id === id);
      if (idx < 0) return state;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= sections.length) return state;

      [sections[idx], sections[targetIdx]] = [sections[targetIdx], sections[idx]];
      return { ...state, sections };
    }

    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.filter((s) => s.id !== action.payload.id),
      };

    case 'REORDER_SECTIONS':
      return {
        ...state,
        sections: action.payload.sections,
      };

    case 'DUPLICATE_SECTION': {
      const idx = state.sections.findIndex((s) => s.id === action.payload.id);
      if (idx < 0) return state;

      const original = state.sections[idx];
      const duplicated: Section = {
        ...original,
        id: uuid(),
        content: { ...original.content }, // Shallow copy is fine for string records
      };

      const newSections = [...state.sections];
      newSections.splice(idx + 1, 0, duplicated);

      return { ...state, sections: newSections };
    }

    case 'SET_PAGE':
      return action.payload;

    default:
      return state;
  }
}

// ── Hook ─────────────────────────────────────

const INITIAL_PAGE: Page = {
  name: 'Home',
  slug: 'home',
  sections: [],
};

export function useSiteEditor(initialPage?: Page) {
  const [page, dispatch] = useReducer(editorReducer, initialPage ?? INITIAL_PAGE);

  const addSection = (sectionType: SectionType, atIndex?: number): string => {
    const id = uuid();
    dispatch({ type: 'ADD_SECTION', payload: { sectionType, id, atIndex } });
    return id;
  };

  const updateSection = (id: string, content: Record<string, string>) =>
    dispatch({ type: 'UPDATE_SECTION', payload: { id, content } });

  const moveSection = (id: string, direction: 'up' | 'down') =>
    dispatch({ type: 'MOVE_SECTION', payload: { id, direction } });

  const removeSection = (id: string) =>
    dispatch({ type: 'REMOVE_SECTION', payload: { id } });

  const reorderSections = (sections: Section[]) =>
    dispatch({ type: 'REORDER_SECTIONS', payload: { sections } });

  const duplicateSection = (id: string) =>
    dispatch({ type: 'DUPLICATE_SECTION', payload: { id } });

  const loadPage = (newPage: Page) => dispatch({ type: 'SET_PAGE', payload: newPage });

  return {
    page,
    addSection,
    updateSection,
    moveSection,
    removeSection,
    reorderSections,
    duplicateSection,
    loadPage,
  };
}
