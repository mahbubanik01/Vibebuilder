export type SectionType = 
  | 'hero' 
  | 'text' 
  | 'image' 
  | 'gallery' 
  | 'contact' 
  | 'spacer' 
  | 'video' 
  | 'cta' 
  | 'features' 
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'newsletter'
  | 'team'
  | 'stats'
  | 'logos'
  | 'blog'
  | 'code'
  | 'map'
  | 'countdown'
  | 'divider'
  | 'social'
  | 'accordion'
  | 'timeline'
  | 'compare';

export interface Section {
  id: string;
  type: SectionType;
  content: Record<string, string>;
}

export interface Page {
  name: string;
  slug: string;
  sections: Section[];
}

export interface SiteMetadata {
  title: string;
  description?: string;
  favicon?: string;
  domain?: string;
}

export interface SiteData {
  ownerId?: string;
  siteId?: string;
  metadata: SiteMetadata;
  pages: Page[];
}

export const DEFAULT_SITE_DATA: SiteData = {
  ownerId: '',
  siteId: '',
  metadata: {
    title: 'My Vibe Site',
    description: 'Built with VibeBuilder',
  },
  pages: [
    {
      name: 'Home',
      slug: 'home',
      sections: [],
    },
  ],
};

export const DEFAULT_CONTENT: Record<SectionType, Record<string, string>> = {
  hero: {
    heading: 'Design at the speed of thought.',
    subheading: 'A high-fidelity visual engine for creators who demand perfection and performance in every pixel.',
    ctaText: 'Build your vibe',
    ctaUrl: '#',
    bgColor: '#000000',
    textColor: '#ffffff',
  },
  text: {
    body: '## Your Story Starts Here\n\nWrite something that captures the essence of your vision. Keep it clean, keep it bold, and let your work speak for itself.',
  },
  image: {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    alt: 'Studio Workspace',
    caption: 'Focus on the craft.',
  },
  gallery: {
    images: '[]',
  },
  contact: {
    nameLabel: 'Full Name',
    emailLabel: 'Email Address',
    messageLabel: 'How can we help?',
    buttonText: 'Send Message',
  },
  spacer: {
    height: '80',
    showDivider: 'false',
  },
  video: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    caption: 'Introduction Video',
  },
  cta: {
    title: 'Ready to launch your vision?',
    description: 'Join the next generation of creators building high-fidelity experiences with VibeBuilder.',
    buttonText: 'Get Started Free',
    url: '#',
  },
  features: {
    title: 'Precision Tools for Modern Design',
    items: JSON.stringify([
      { icon: '🎯', title: 'Pixel Perfection', desc: 'Every element is placed with surgical precision.' },
      { icon: '⚡', title: 'Instant Load', desc: 'Optimized performance for the modern web.' },
      { icon: '🛠️', title: 'Visual Logic', desc: 'No-code power with the flexibility of raw code.' }
    ]),
  },
  testimonials: {
    title: 'Loved by Creators',
    items: JSON.stringify([
      { quote: 'The only builder that doesn\'t get in the way of my creative flow.', author: 'Alex Rivera', role: 'Architect' }
    ]),
  },
  pricing: {
    title: 'Simple, Transparent Pricing',
    subtitle: 'Choose the plan that works for you',
    plans: JSON.stringify([
      { name: 'Starter', price: '$9', period: '/month', features: '5 Sites,Basic Analytics,24/7 Support', highlighted: 'false', cta: 'Start Free Trial' },
      { name: 'Professional', price: '$29', period: '/month', features: 'Unlimited Sites,Advanced Analytics,Priority Support,Custom Domains', highlighted: 'true', cta: 'Get Started' },
      { name: 'Enterprise', price: '$99', period: '/month', features: 'Everything in Pro,API Access,Dedicated Manager,Custom Integrations', highlighted: 'false', cta: 'Contact Sales' }
    ]),
  },
  faq: {
    title: 'Frequently Asked Questions',
    items: JSON.stringify([
      { question: 'How do I get started?', answer: 'Simply sign up for an account and you can start building your site immediately with our drag-and-drop interface.' },
      { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time with no questions asked.' },
      { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee for all our paid plans.' },
      { question: 'Can I use my own domain?', answer: 'Absolutely! You can connect your own domain or use our free subdomain.' }
    ]),
  },
  newsletter: {
    title: 'Stay in the Loop',
    description: 'Subscribe to our newsletter for the latest updates and exclusive offers.',
    buttonText: 'Subscribe',
    placeholder: 'Enter your email',
    successMessage: 'Thanks for subscribing!',
  },
  team: {
    title: 'Meet Our Team',
    subtitle: 'The talented people behind the magic',
    members: JSON.stringify([
      { name: 'Sarah Chen', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', bio: 'Visionary leader with 15+ years in tech.' },
      { name: 'Marcus Johnson', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', bio: 'Engineering mastermind and open source advocate.' },
      { name: 'Emily Rodriguez', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', bio: 'Award-winning designer with a passion for UX.' }
    ]),
  },
  stats: {
    title: 'Our Impact by the Numbers',
    items: JSON.stringify([
      { value: '10K+', label: 'Active Users', icon: '👥' },
      { value: '50M+', label: 'Pages Created', icon: '📄' },
      { value: '99.9%', label: 'Uptime', icon: '⚡' },
      { value: '24/7', label: 'Support', icon: '💬' }
    ]),
  },
  logos: {
    title: 'Trusted by Industry Leaders',
    subtitle: 'Join thousands of companies using our platform',
    items: JSON.stringify([
      { name: 'Acme Corp', url: '' },
      { name: 'TechStart', url: '' },
      { name: 'GlobalInc', url: '' },
      { name: 'FutureCo', url: '' },
      { name: 'InnovateLab', url: '' },
      { name: 'DataFlow', url: '' }
    ]),
  },
  blog: {
    title: 'Latest from Our Blog',
    subtitle: 'Insights, tips, and updates',
    posts: JSON.stringify([
      { title: '10 Tips for Better Web Design', excerpt: 'Learn the secrets to creating stunning websites that convert.', date: 'Jan 15, 2025', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop' },
      { title: 'The Future of No-Code', excerpt: 'Discover how no-code platforms are revolutionizing web development.', date: 'Jan 10, 2025', readTime: '7 min read', image: 'https://images.unsplash.com/photo-1461749280684-d3ba461f9b7a?w=600&h=400&fit=crop' },
      { title: 'Building for Scale', excerpt: 'Tips and tricks for building websites that can handle millions of visitors.', date: 'Jan 5, 2025', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop' }
    ]),
  },
  code: {
    title: 'Code Example',
    language: 'javascript',
    code: `// Example: Initialize your site\nconst site = new VibeBuilder({\n  theme: 'dark',\n  plugins: ['analytics', 'seo'],\n  analytics: {\n    trackingId: 'UA-XXXXX-X'\n  }\n});\n\nsite.init();`,
  },
  map: {
    title: 'Find Us',
    address: '123 Innovation Street, San Francisco, CA 94102',
    embedUrl: '',
  },
  countdown: {
    title: 'Something Exciting Coming Soon',
    targetDate: '2025-12-31',
    message: 'We are preparing something amazing for you!',
  },
  divider: {
    style: 'gradient',
    height: '2',
    width: '100',
    text: 'or',
  },
  social: {
    title: 'Follow Us',
    platforms: JSON.stringify([
      { name: 'Twitter', url: '#', icon: '𝕏' },
      { name: 'LinkedIn', url: '#', icon: 'in' },
      { name: 'Instagram', url: '#', icon: '📷' },
      { name: 'YouTube', url: '#', icon: '▶️' }
    ]),
  },
  accordion: {
    title: 'Learn More',
    items: JSON.stringify([
      { title: 'Getting Started', content: 'Sign up, choose a template, and start customizing. Our drag-and-drop builder makes it easy.' },
      { title: 'Customization Options', content: 'From colors to fonts to layouts, you have complete control over every aspect of your site.' },
      { title: 'Publishing Your Site', content: 'Publish with one click to our global CDN. Custom domains and SSL included.' },
      { title: 'Analytics & Insights', content: 'Track visitor behavior, monitor performance, and make data-driven decisions.' }
    ]),
  },
  timeline: {
    title: 'Our Journey',
    items: JSON.stringify([
      { year: '2020', title: 'Founded', description: 'Started with a vision to democratize web design.' },
      { year: '2021', title: 'First 10K Users', description: 'Reached our first major milestone.' },
      { year: '2022', title: 'Series A', description: 'Raised $10M to accelerate growth.' },
      { year: '2023', title: 'Global Expansion', description: 'Opened offices in Europe and Asia.' },
      { year: '2024', title: '1M+ Sites', description: 'Celebrated creating over a million websites.' }
    ]),
  },
  compare: {
    title: 'Compare Plans',
    subtitle: 'See what\'s included in each plan',
    plans: JSON.stringify([
      { name: 'Starter', price: '$0', features: '1 Site,500MB Storage,Basic Support,Community Access' },
      { name: 'Pro', price: '$29', features: 'Unlimited Sites,50GB Storage,Priority Support,Custom Domain,Analytics' },
      { name: 'Business', price: '$99', features: 'Everything in Pro,API Access,Dedicated Support,White Label,SSO' }
    ]),
    highlightPlan: 'Pro',
  },
};
