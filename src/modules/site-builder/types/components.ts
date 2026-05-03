export type VibeComponentType = 
  | 'hero'
  | 'text'
  | 'image'
  | 'gallery'
  | 'contact-form'
  | 'cta'
  | 'video'
  | 'spacer'
  | 'columns';

export interface VibeComponent {
  id: string;
  type: VibeComponentType;
  props: Record<string, any>;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;
}

export interface TextProps {
  content: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  caption?: string;
}

export interface GalleryProps {
  images: Array<{ src: string; alt: string; caption?: string }>;
  columns: number;
  gap: number;
}

export interface ContactFormProps {
  title: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'textarea' | 'checkbox';
    required: boolean;
  }>;
  submitText?: string;
  backgroundColor?: string;
}

export interface CTAProps {
  title: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  buttonColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface VideoProps {
  url: string;
  type: 'youtube' | 'vimeo';
  autoplay?: boolean;
  loop?: boolean;
}

export interface SpacerProps {
  height: number;
}

export interface ColumnsProps {
  columns: number;
  gap: number;
  children: VibeComponent[];
}

export const COMPONENT_DEFAULTS: Record<VibeComponentType, Partial<VibeComponent['props']>> = {
  hero: {
    title: 'Welcome to My Site',
    subtitle: 'Add a compelling subtitle here',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    buttonText: 'Get Started',
    buttonUrl: '#',
    buttonColor: '#e94560',
  },
  text: {
    content: '<p>Click to edit this text block. Add your content here.</p>',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333333',
    align: 'left',
  },
  image: {
    src: '',
    alt: 'Image',
    objectFit: 'cover',
  },
  gallery: {
    images: [],
    columns: 3,
    gap: 16,
  },
  'contact-form': {
    title: 'Contact Us',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
    ],
    submitText: 'Send Message',
    backgroundColor: '#f8f9fa',
  },
  cta: {
    title: 'Ready to Get Started?',
    description: 'Join us today and start building your dreams.',
    buttonText: 'Sign Up Now',
    buttonUrl: '#',
    buttonColor: '#e94560',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
  },
  video: {
    url: '',
    type: 'youtube',
    autoplay: false,
    loop: false,
  },
  spacer: {
    height: 40,
  },
  columns: {
    columns: 2,
    gap: 24,
    children: [],
  },
};