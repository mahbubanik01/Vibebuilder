import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionRenderer } from './section-renderer';
import type { Section } from '../types/site-builder.types';

describe('SectionRenderer', () => {
  const testSection = (type: string, content: Record<string, string>): Section => ({
    id: 'test-id',
    type: type as any,
    content,
  });

  describe('Hero Section', () => {
    it('renders hero with heading', () => {
      const section = testSection('hero', { heading: 'Welcome', subheading: 'Subtitle', ctaText: 'Click Me' });
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('Welcome')).toBeDefined();
      expect(screen.getByText('Subtitle')).toBeDefined();
      expect(screen.getByText('Click Me')).toBeDefined();
    });

    it('renders default heading when empty', () => {
      const section = testSection('hero', {});
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('Heading')).toBeDefined();
    });
  });

  describe('Text Block', () => {
    it('renders text content', () => {
      const section = testSection('text', { body: 'Hello World' });
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('Hello World')).toBeDefined();
    });

    it('renders default text when empty', () => {
      const section = testSection('text', {});
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('Text content will appear here.')).toBeDefined();
    });
  });

  describe('Image Block', () => {
    it('renders image when src provided', () => {
      const section = testSection('image', { src: 'https://example.com/image.jpg', alt: 'Test image' });
      render(<SectionRenderer section={section} />);
      const img = screen.getByAltText('Test image');
      expect(img).toBeDefined();
      expect(img.getAttribute('src')).toBe('https://example.com/image.jpg');
    });

    it('shows placeholder when no src', () => {
      const section = testSection('image', {});
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('No image URL provided')).toBeDefined();
    });

    it('renders caption when provided', () => {
      const section = testSection('image', { src: 'https://example.com/img.jpg', caption: 'Test caption' });
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('Test caption')).toBeDefined();
    });
  });

  describe('Image Gallery', () => {
    it('renders gallery with images', () => {
      const section = testSection('gallery', { images: JSON.stringify(['img1.jpg', 'img2.jpg']) });
      render(<SectionRenderer section={section} />);
      const images = screen.getAllByRole('img');
      expect(images.length).toBe(2);
    });

    it('shows empty state when no images', () => {
      const section = testSection('gallery', { images: '[]' });
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('Empty Gallery')).toBeDefined();
    });
  });

  describe('Contact Form', () => {
    it('renders contact form with custom labels', () => {
      const section = testSection('contact', {
        nameLabel: 'Your Name',
        emailLabel: 'Email Address',
        messageLabel: 'Your Message',
        buttonText: 'Submit',
      });
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('Your Name')).toBeDefined();
      expect(screen.getByText('Email Address')).toBeDefined();
      expect(screen.getByText('Your Message')).toBeDefined();
      expect(screen.getByText('Submit')).toBeDefined();
    });

    it('renders default labels when empty', () => {
      const section = testSection('contact', {});
      render(<SectionRenderer section={section} />);
      expect(screen.getByText('Name')).toBeDefined();
      expect(screen.getByText('Email')).toBeDefined();
      expect(screen.getByText('Message')).toBeDefined();
      expect(screen.getByText('Send')).toBeDefined();
    });
  });

  describe('Spacer', () => {
    it('renders spacer with custom height', () => {
      const section = testSection('spacer', { height: '100' });
      render(<SectionRenderer section={section} />);
      const spacer = document.querySelector('[style*="height: 100px"]');
      expect(spacer).toBeDefined();
    });

    it('renders default height', () => {
      const section = testSection('spacer', {});
      render(<SectionRenderer section={section} />);
      const spacer = document.querySelector('[style*="height: 40px"]');
      expect(spacer).toBeDefined();
    });

    it('renders separator when showDivider is true', () => {
      const section = testSection('spacer', { height: '50', showDivider: 'true' });
      render(<SectionRenderer section={section} />);
      const separator = document.querySelector('[data-slot="separator"]');
      expect(separator).toBeDefined();
    });
  });

  describe('Unknown section type', () => {
    it('renders unknown type message', () => {
      const section = testSection('unknown', {});
      render(<SectionRenderer section={section} />);
      expect(screen.getByText(/Unknown section type/)).toBeDefined();
    });
  });
});