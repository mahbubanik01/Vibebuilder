import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PageTabs } from './page-tabs';
import type { Page } from '../types/site-builder.types';

describe('PageTabs', () => {
  const mockPages: Page[] = [
    { name: 'Home', slug: 'home', sections: [] },
    { name: 'About', slug: 'about', sections: [] },
    { name: 'Contact', slug: 'contact', sections: [] },
  ];

  const mockOnPageSelect = vi.fn();
  const mockOnPageCreate = vi.fn();
  const mockOnPageDelete = vi.fn();

  beforeEach(() => {
    mockOnPageSelect.mockClear();
    mockOnPageCreate.mockClear();
    mockOnPageDelete.mockClear();
  });

  it('renders all pages', () => {
    render(
      <PageTabs
        pages={mockPages}
        activePageId="home"
        onPageSelect={mockOnPageSelect}
        onPageCreate={mockOnPageCreate}
        onPageDelete={mockOnPageDelete}
        onPageUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByText('Contact')).toBeDefined();
  });

  it('shows Add Page button', () => {
    render(
      <PageTabs
        pages={mockPages}
        activePageId="home"
        onPageSelect={mockOnPageSelect}
        onPageCreate={mockOnPageCreate}
        onPageDelete={mockOnPageDelete}
        onPageUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('Add Page')).toBeDefined();
  });

  it('calls onPageSelect when page is clicked', () => {
    render(
      <PageTabs
        pages={mockPages}
        activePageId="home"
        onPageSelect={mockOnPageSelect}
        onPageCreate={mockOnPageCreate}
        onPageDelete={mockOnPageDelete}
        onPageUpdate={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('About'));
    expect(mockOnPageSelect).toHaveBeenCalledWith('about');
  });

  it('opens create mode when Add Page is clicked', () => {
    render(
      <PageTabs
        pages={mockPages}
        activePageId="home"
        onPageSelect={mockOnPageSelect}
        onPageCreate={mockOnPageCreate}
        onPageDelete={mockOnPageDelete}
        onPageUpdate={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Add Page'));
    expect(screen.getByPlaceholderText('Page name...')).toBeDefined();
  });

  it('creates page when name is entered and submitted', () => {
    render(
      <PageTabs
        pages={mockPages}
        activePageId="home"
        onPageSelect={mockOnPageSelect}
        onPageCreate={mockOnPageCreate}
        onPageDelete={mockOnPageDelete}
        onPageUpdate={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Add Page'));
    const input = screen.getByPlaceholderText('Page name...');
    fireEvent.change(input, { target: { value: 'Blog' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnPageCreate).toHaveBeenCalledWith('Blog', 'blog');
  });

  it('renders empty when no pages', () => {
    render(
      <PageTabs
        pages={[]}
        activePageId=""
        onPageSelect={mockOnPageSelect}
        onPageCreate={mockOnPageCreate}
        onPageDelete={mockOnPageDelete}
        onPageUpdate={vi.fn()}
      />
    );

    expect(screen.getByText('Add Page')).toBeDefined();
  });
});