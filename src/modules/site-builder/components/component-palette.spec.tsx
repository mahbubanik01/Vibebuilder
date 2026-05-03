import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentPalette } from './component-palette';

describe('ComponentPalette', () => {
  const mockAddComponent = vi.fn();

  beforeEach(() => {
    mockAddComponent.mockClear();
  });

  it('renders all component groups', () => {
    render(<ComponentPalette onAddComponent={mockAddComponent} />);
    
    expect(screen.getByText('Layout')).toBeDefined();
    expect(screen.getByText('Content')).toBeDefined();
    expect(screen.getByText('Media')).toBeDefined();
  });

  it('renders all 6 components', () => {
    render(<ComponentPalette onAddComponent={mockAddComponent} />);
    
    expect(screen.getByText('Hero Section')).toBeDefined();
    expect(screen.getByText('Text Block')).toBeDefined();
    expect(screen.getByText('Single Image')).toBeDefined();
    expect(screen.getByText('Image Gallery')).toBeDefined();
    expect(screen.getByText('Contact Form')).toBeDefined();
    expect(screen.getByText('Spacer / Divider')).toBeDefined();
  });

  it('calls onAddComponent when component is clicked', () => {
    render(<ComponentPalette onAddComponent={mockAddComponent} />);
    
    const heroButton = screen.getByText('Hero Section');
    fireEvent.click(heroButton);
    
    expect(mockAddComponent).toHaveBeenCalledWith('hero');
  });

  it('calls onAddComponent with correct type for each component', () => {
    render(<ComponentPalette onAddComponent={mockAddComponent} />);
    
    fireEvent.click(screen.getByText('Text Block'));
    expect(mockAddComponent).toHaveBeenCalledWith('text');
    
    fireEvent.click(screen.getByText('Single Image'));
    expect(mockAddComponent).toHaveBeenCalledWith('image');
    
    fireEvent.click(screen.getByText('Image Gallery'));
    expect(mockAddComponent).toHaveBeenCalledWith('gallery');
    
    fireEvent.click(screen.getByText('Contact Form'));
    expect(mockAddComponent).toHaveBeenCalledWith('contact');
    
    fireEvent.click(screen.getByText('Spacer / Divider'));
    expect(mockAddComponent).toHaveBeenCalledWith('spacer');
  });

  it('renders component descriptions', () => {
    render(<ComponentPalette onAddComponent={mockAddComponent} />);
    
    expect(screen.getByText('Large header with background and CTA')).toBeDefined();
    expect(screen.getByText('Paragraphs of text and information')).toBeDefined();
  });
});