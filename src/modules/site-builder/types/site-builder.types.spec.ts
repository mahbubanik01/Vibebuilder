import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SITE_DATA,
  DEFAULT_CONTENT,
  type SectionType,
  type Section,
  type Page,
  type SiteData,
} from './site-builder.types';

describe('Site Builder Types', () => {
  describe('DEFAULT_SITE_DATA', () => {
    it('has correct structure', () => {
      expect(DEFAULT_SITE_DATA.ownerId).toBe('local-user');
      expect(DEFAULT_SITE_DATA.siteId).toBe('local-site');
      expect(DEFAULT_SITE_DATA.metadata.title).toBe('Local Site Preview');
    });

    it('has default pages with home page', () => {
      expect(DEFAULT_SITE_DATA.pages.length).toBe(1);
      expect(DEFAULT_SITE_DATA.pages[0].name).toBe('Home');
      expect(DEFAULT_SITE_DATA.pages[0].slug).toBe('home');
    });

    it('home page has empty sections', () => {
      expect(DEFAULT_SITE_DATA.pages[0].sections).toEqual([]);
    });
  });

  describe('DEFAULT_CONTENT', () => {
    it('has hero content with all fields', () => {
      expect(DEFAULT_CONTENT.hero).toEqual({
        heading: '',
        subheading: '',
        ctaText: '',
        ctaUrl: '',
        backgroundImageUrl: '',
      });
    });

    it('has text content', () => {
      expect(DEFAULT_CONTENT.text).toEqual({ body: '' });
    });

    it('has image content', () => {
      expect(DEFAULT_CONTENT.image).toEqual({
        src: '',
        alt: '',
        caption: '',
      });
    });

    it('has gallery content with empty array', () => {
      expect(DEFAULT_CONTENT.gallery).toEqual({ images: '[]' });
    });

    it('has contact content with default labels', () => {
      expect(DEFAULT_CONTENT.contact).toEqual({
        nameLabel: 'Name',
        emailLabel: 'Email',
        messageLabel: 'Message',
        buttonText: 'Send',
      });
    });

    it('has spacer content with default height', () => {
      expect(DEFAULT_CONTENT.spacer).toEqual({
        height: '40',
        showDivider: 'false',
      });
    });
  });

  describe('SectionType', () => {
    it('allows all valid section types', () => {
      const validTypes: SectionType[] = ['hero', 'text', 'image', 'gallery', 'contact', 'spacer'];
      validTypes.forEach((type) => {
        const section: Section = { id: 'test', type, content: {} };
        expect(section.type).toBe(type);
      });
    });
  });

  describe('Page interface', () => {
    it('has required fields', () => {
      const page: Page = {
        name: 'Test Page',
        slug: 'test-page',
        sections: [],
      };

      expect(page.name).toBe('Test Page');
      expect(page.slug).toBe('test-page');
      expect(page.sections).toEqual([]);
    });
  });

  describe('SiteData interface', () => {
    it('has required fields', () => {
      const siteData: SiteData = {
        ownerId: 'user-123',
        siteId: 'site-456',
        metadata: { title: 'My Site' },
        pages: [],
      };

      expect(siteData.ownerId).toBe('user-123');
      expect(siteData.siteId).toBe('site-456');
      expect(siteData.metadata.title).toBe('My Site');
      expect(siteData.pages).toEqual([]);
    });
  });
});