// ── Demo Site: "Vibe Studio" — High-Fidelity Design Platform ──

import type { Section } from '../types/site-builder.types';

const homeSections: Section[] = [
  {
    id: 'demo-home-hero',
    type: 'hero',
    content: {
      heading: 'Precision Design. Zero Friction.',
      subheading:
        'Vibe Studio is the high-fidelity design engine built for creators who demand perfection. Craft, prototype, and launch production-grade experiences in record time.',
      ctaText: 'Start Building',
      ctaUrl: '#pricing',
      bgColor: '#0D1117',
      textColor: '#E6EDF3',
    },
  },
  {
    id: 'demo-home-features',
    type: 'features',
    content: {
      title: 'Built for the modern workflow',
      items: JSON.stringify([
        {
          icon: '📐',
          title: 'Advanced Layouts',
          desc: 'Harness the power of CSS Grid and Flexbox through a visual interface. No constraints, just pure creative freedom.',
        },
        {
          icon: '✨',
          title: 'High-Fidelity Assets',
          desc: 'Optimized media delivery and svg support out of the box. Your assets always look crisp on every screen size.',
        },
        {
          icon: '⚡',
          title: 'Surgical Speed',
          desc: 'Lightweight runtime and optimized static generation ensures your site loads instantly, every time.',
        },
      ]),
    },
  },
  {
    id: 'demo-home-testimonials',
    type: 'testimonials',
    content: {
      title: 'Trusted by world-class designers',
      items: JSON.stringify([
        {
          quote:
            'Vibe Studio is the first visual builder that doesn\'t feel like it\'s compromising my design intent. It\'s surgical.',
          author: 'David Hellmann',
          role: 'Creative Director',
        },
        {
          quote:
            'The separation of logic and presentation is handled beautifully. It feels like writing code, but at the speed of thought.',
          author: 'Jessica Hische',
          role: 'Lettering Artist & Designer',
        },
      ]),
    },
  },
  {
    id: 'demo-home-cta',
    type: 'cta',
    content: {
      title: 'Elevate your digital presence.',
      description:
        'Start building with Vibe Studio today. Join the community of designers shaping the future of the web.',
      buttonText: 'Launch Studio',
      url: '#',
    },
  },
];

const aboutSections: Section[] = [
  {
    id: 'demo-about-hero',
    type: 'hero',
    content: {
      heading: 'We believe in the craft.',
      subheading:
        'Vibe Studio was born out of a frustration with tools that prioritized "easy" over "excellent". We build for the 1%.',
      ctaText: '',
      ctaUrl: '',
      bgColor: '#0D1117',
      textColor: '#E6EDF3',
    },
  },
  {
    id: 'demo-about-text',
    type: 'text',
    content: {
      body: '### Our Philosophy\n\nMost website builders are toys. They make it easy to get something online, but hard to make it perfect. Vibe Studio is a tool. It requires a designer\'s eye and an appreciation for the details.\n\nWe don\'t use templates. We don\'t use "magic" AI that creates generic layouts. We provide the primitives of the web in a visual format that allows you to express your unique vibe without limits.',
    },
  },
  {
    id: 'demo-about-features',
    type: 'features',
    content: {
      title: 'Our Standards',
      items: JSON.stringify([
        {
          icon: '🌑',
          title: 'Minimalist Core',
          desc: 'We remove the noise so you can focus on the signal. No bloat, no unnecessary features.',
        },
        {
          icon: '💎',
          title: 'Quality First',
          desc: 'We prioritize performance and accessibility in every line of code we generate.',
        },
        {
          icon: '🌐',
          title: 'Open Future',
          desc: 'Your data is yours. Export your code, host anywhere, and stay in control of your work.',
        },
      ]),
    },
  },
  {
    id: 'demo-about-spacer',
    type: 'spacer',
    content: { height: '100', showDivider: 'true' },
  },
];

const pricingSections: Section[] = [
  {
    id: 'demo-pricing-hero',
    type: 'hero',
    content: {
      heading: 'Invest in your studio.',
      subheading: 'Straightforward plans for solo creators and high-growth teams.',
      ctaText: '',
      ctaUrl: '',
      bgColor: '#161B22',
      textColor: '#E6EDF3',
    },
  },
  {
    id: 'demo-pricing-features',
    type: 'features',
    content: {
      title: 'Membership Plans',
      items: JSON.stringify([
        {
          icon: '🖋️',
          title: 'Solo — $12/mo',
          desc: '1 Project, 10GB bandwidth, basic analytics. Perfect for personal portfolios.',
        },
        {
          icon: '🏢',
          title: 'Studio — $48/mo',
          desc: 'Unlimited projects, custom domains, advanced SEO, and team collaboration.',
        },
        {
          icon: '⚡',
          title: 'Agency — $120/mo',
          desc: 'White-labeling, client billing, priority support, and dedicated performance node.',
        },
      ]),
    },
  },
  {
    id: 'demo-pricing-contact',
    type: 'contact',
    content: {
      nameLabel: 'Your Name',
      emailLabel: 'Studio Email',
      messageLabel: 'Tell us about your project',
      buttonText: 'Request Access',
    },
  },
  {
    id: 'demo-pricing-cta',
    type: 'cta',
    content: {
      title: 'Still wondering?',
      description:
        'Schedule a 1-on-1 walkthrough with our design lead to see if Vibe Studio is right for you.',
      buttonText: 'Book a Demo',
      url: '#',
    },
  },
];

export const DEMO_SITE_NAME = 'Vibe Studio';
export const DEMO_SITE_SLUG = 'vibe-studio-demo';
export const DEMO_SITE_DESCRIPTION =
  'The high-fidelity design platform for modern creative professionals.';

export const DEMO_PAGES = [
  { name: 'Home', slug: 'home', sections: homeSections },
  { name: 'About', slug: 'about', sections: aboutSections },
  { name: 'Pricing', slug: 'pricing', sections: pricingSections },
];
