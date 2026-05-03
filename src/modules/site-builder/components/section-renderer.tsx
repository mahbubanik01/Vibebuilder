import type { Section } from '../types/site-builder.types';
import { Button } from '@/components/ui-kit/button';
import { Input } from '@/components/ui-kit/input';
import { Textarea } from '@/components/ui-kit/textarea';
import { Label } from '@/components/ui-kit/label';
import { Separator } from '@/components/ui-kit/separator';
import { MapPin } from 'lucide-react';

function HeroRenderer({ content }: { content: Record<string, string> }) {
  const hasBg = content.backgroundImageUrl && content.backgroundImageUrl.trim() !== '';

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center py-40 px-6 overflow-hidden group"
      style={
        hasBg
          ? {
              backgroundImage: `linear-gradient(rgba(13,17,23,0.7), rgba(13,17,23,0.7)), url(${content.backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#E6EDF3'
            }
          : { 
              backgroundColor: content.bgColor || '#0D1117',
              color: content.textColor || '#E6EDF3'
            }
      }
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.95]" style={{ color: 'inherit' }}>
          {content.heading || 'Design with Vibe.'}
        </h1>
        {content.subheading && (
          <p className="text-lg md:text-xl opacity-70 mb-12 max-w-2xl mx-auto font-medium leading-relaxed" style={{ color: 'inherit' }}>
            {content.subheading}
          </p>
        )}
        {content.ctaText && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={content.ctaUrl || '#'}
              className="inline-flex items-center justify-center bg-[#2F81F7] text-white font-semibold px-10 py-4 rounded-md hover:bg-[#1F6FEB] transition-all active:scale-95 text-[15px]"
            >
              {content.ctaText}
            </a>
            {content.secondaryCta && (
               <a
                href="#"
                className="inline-flex items-center justify-center border border-white/20 text-white font-semibold px-10 py-4 rounded-md hover:bg-white/10 transition-all active:scale-95 text-[15px]"
              >
                Learn More
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TextRenderer({ content }: { content: Record<string, string> }) {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto">
      <div className="prose prose-slate lg:prose-xl max-w-none">
        <p className="text-[19px] leading-[1.8] text-[#1e293b] whitespace-pre-wrap font-medium opacity-90">
          {content.body || 'Text content will appear here.'}
        </p>
      </div>
    </section>
  );
}

function ImageRenderer({ content }: { content: Record<string, string> }) {
  const hasSrc = content.src && content.src.trim() !== '';

  return (
    <section className="py-10 px-6 flex flex-col items-center">
      {hasSrc ? (
        <img
          src={content.src}
          alt={content.alt || ''}
          className="max-w-full max-h-[500px] rounded-lg object-cover shadow-md"
        />
      ) : (
        <div className="w-full max-w-xl h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
          No image URL provided
        </div>
      )}
      {content.caption && (
        <p className="mt-3 text-sm text-muted-foreground italic">{content.caption}</p>
      )}
    </section>
  );
}

interface SectionRendererProps {
  section: Section;
}

function GalleryRenderer({ content }: { content: Record<string, string> }) {
  let images: string[] = [];
  try {
    images = JSON.parse(content.images || '[]');
  } catch {
    images = [];
  }

  if (images.length === 0) {
    return (
      <section className="py-10 px-6 max-w-5xl mx-auto text-center text-muted-foreground">
        Empty Gallery
      </section>
    );
  }

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            {src ? (
              <img src={src} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            ) : (
              <span className="text-muted-foreground text-sm">Image {index + 1}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactRenderer({ content }: { content: Record<string, string> }) {
  return (
    <section className="py-32 px-6 max-w-2xl mx-auto">
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tighter mb-4 text-[#1e293b]">Get in Touch</h2>
          <p className="text-[#64748b] text-[15px]">We usually respond within 24 hours.</p>
        </div>
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2 block">{content.nameLabel || 'Name'}</Label>
              <Input className="border-x-0 border-t-0 border-b border-[#e2e8f0] rounded-none px-0 bg-transparent focus:border-[#2F81F7] transition-all h-10 text-[15px] focus-visible:ring-0" placeholder="Jane Doe" readOnly />
            </div>
            <div>
              <Label className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2 block">{content.emailLabel || 'Email'}</Label>
              <Input className="border-x-0 border-t-0 border-b border-[#e2e8f0] rounded-none px-0 bg-transparent focus:border-[#2F81F7] transition-all h-10 text-[15px] focus-visible:ring-0" type="email" placeholder="jane@studio.com" readOnly />
            </div>
          </div>
          <div>
            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2 block">{content.messageLabel || 'Message'}</Label>
            <Textarea className="border-x-0 border-t-0 border-b border-[#e2e8f0] rounded-none px-0 bg-transparent focus:border-[#2F81F7] transition-all min-h-[100px] text-[15px] focus-visible:ring-0 resize-none" placeholder="Tell us about your project..." readOnly />
          </div>
          <Button className="w-full h-14 bg-[#2F81F7] hover:bg-[#1F6FEB] text-white font-bold rounded-md shadow-xl text-[15px]" size="lg">
            {content.buttonText || 'Send Message'}
          </Button>
        </form>
      </div>
    </section>
  );
}

function SpacerRenderer({ content }: { content: Record<string, string> }) {
  const height = parseInt(content.height || '40', 10);
  const showDivider = content.showDivider === 'true';

  return (
    <div style={{ height: `${height}px` }} className="w-full max-w-5xl mx-auto flex items-center justify-center">
      {showDivider && <Separator className="w-full" />}
    </div>
  );
}

function VideoRenderer({ content }: { content: Record<string, string> }) {
  const url = content.url || '';
  let embedUrl = '';

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.split('v=')[1] || url.split('/').pop();
    embedUrl = `https://www.youtube.com/embed/${id}`;
  } else if (url.includes('vimeo.com')) {
    const id = url.split('/').pop();
    embedUrl = `https://player.vimeo.com/video/${id}`;
  }

  return (
    <section className="py-12 px-6 max-w-5xl mx-auto">
      <div className="aspect-video bg-muted rounded-xl overflow-hidden shadow-lg border border-border/50">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <p>Enter a valid YouTube or Vimeo URL</p>
          </div>
        )}
      </div>
      {content.caption && (
        <p className="mt-4 text-center text-sm text-muted-foreground">{content.caption}</p>
      )}
    </section>
  );
}

function CTARenderer({ content }: { content: Record<string, string> }) {
  const align = content.align || 'center';

  return (
    <section className={`py-32 px-6 max-w-7xl mx-auto flex flex-col items-${align === 'center' ? 'center' : align === 'right' ? 'end' : 'start'} text-${align}`}>
      <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter leading-[1.1]">{content.title || 'Ready to launch your vision?'}</h2>
      {content.description && <p className="text-xl text-[#64748b] mb-12 max-w-2xl font-medium">{content.description}</p>}
      <Button 
        size="lg" 
        className="px-12 h-16 rounded-md font-semibold bg-[#2F81F7] hover:bg-[#1F6FEB] text-white shadow-xl border-none text-lg active:scale-95 transition-all"
        onClick={() => content.url && window.open(content.url, '_blank')}
      >
        {content.buttonText || 'Get Started Free'}
      </Button>
    </section>
  );
}

function FeaturesRenderer({ content }: { content: Record<string, string> }) {
  let items = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 tracking-tighter">{content.title || 'Studio Features'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex flex-col items-start group">
            <div className="w-14 h-14 rounded-md bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-8 group-hover:border-[#2F81F7] transition-all duration-300">
               <div className="text-2xl">{item.icon || '✨'}</div>
            </div>
            <h4 className="text-[22px] font-bold mb-4 tracking-tight">{item.title || 'Feature Title'}</h4>
            <p className="text-[#64748b] leading-relaxed text-[15px]">{item.desc || 'Feature description goes here.'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsRenderer({ content }: { content: Record<string, string> }) {
  let items = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-24 tracking-tighter">{content.title || 'From the Community'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex flex-col">
            <p className="text-[24px] font-medium text-[#1e293b] mb-10 leading-tight tracking-tight">&ldquo;{item.quote || 'No testimonial text provided.'}&rdquo;</p>
            <div className="flex items-center gap-4 mt-auto pt-8 border-t border-[#f1f5f9]">
              <div className="w-12 h-12 rounded-full bg-[#f1f5f9]" />
              <div>
                <h5 className="font-bold text-[#1e293b] text-[15px]">{item.author || 'Anonymous'}</h5>
                <p className="text-[13px] text-[#94a3b8] font-medium">{item.role || 'Vibe User'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingRenderer({ content }: { content: Record<string, string> }) {
  let plans = [];
  try {
    plans = JSON.parse(content.plans || '[]');
  } catch {
    plans = [];
  }

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{content.title || 'Pricing'}</h2>
        {content.subtitle && <p className="text-lg text-[#64748b]">{content.subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan: any, i: number) => (
          <div key={i} className={`p-8 rounded-2xl border ${plan.highlighted === 'true' ? 'border-[#2F81F7] bg-[#2F81F7]/5 shadow-xl scale-105' : 'border-[#e2e8f0] bg-white'}`}>
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-[#64748b] ml-2">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.split(',').map((feature: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <span className="text-[#2F81F7]">✓</span> {feature}
                </li>
              ))}
            </ul>
            <Button className={`w-full h-12 rounded-lg font-semibold ${plan.highlighted === 'true' ? 'bg-[#2F81F7] text-white hover:bg-[#1F6FEB]' : 'bg-[#f1f5f9] text-[#1e293b] hover:bg-[#e2e8f0]'}`}>
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQRenderer({ content }: { content: Record<string, string> }) {
  let items = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  return (
    <section className="py-32 px-6 max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tighter">{content.title || 'FAQ'}</h2>
      <div className="space-y-4">
        {items.map((item: any, i: number) => (
          <div key={i} className="border border-[#e2e8f0] rounded-lg p-6">
            <h4 className="font-bold text-lg mb-3">{item.question}</h4>
            <p className="text-[#64748b] leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsletterRenderer({ content }: { content: Record<string, string> }) {
  return (
    <section className="py-24 px-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{content.title || 'Stay Updated'}</h2>
        <p className="text-[#64748b] mb-8">{content.description || 'Subscribe to our newsletter.'}</p>
        <div className="flex gap-4 max-w-md mx-auto">
          <Input className="flex-1 h-12" placeholder={content.placeholder || 'Enter your email'} />
          <Button className="h-12 px-8 bg-[#2F81F7] text-white font-semibold">{content.buttonText || 'Subscribe'}</Button>
        </div>
      </div>
    </section>
  );
}

function TeamRenderer({ content }: { content: Record<string, string> }) {
  let members = [];
  try {
    members = JSON.parse(content.members || '[]');
  } catch {
    members = [];
  }

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{content.title || 'Our Team'}</h2>
        {content.subtitle && <p className="text-lg text-[#64748b]">{content.subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member: any, i: number) => (
          <div key={i} className="text-center">
            <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-6" />
            <h4 className="text-xl font-bold">{member.name}</h4>
            <p className="text-[#2F81F7] font-medium mb-2">{member.role}</p>
            <p className="text-[#64748b] text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsRenderer({ content }: { content: Record<string, string> }) {
  let items = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tighter">{content.title || 'Our Stats'}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item: any, i: number) => (
          <div key={i} className="text-center">
            <div className="text-5xl mb-4">{item.icon}</div>
            <div className="text-4xl font-bold text-[#1e293b] mb-2">{item.value}</div>
            <div className="text-[#64748b] font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LogosRenderer({ content }: { content: Record<string, string> }) {
  let items = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">{content.title || 'Trusted By'}</h2>
        {content.subtitle && <p className="text-[#64748b]">{content.subtitle}</p>}
      </div>
      <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
        {items.map((item: any, i: number) => (
          <div key={i} className="text-xl font-bold text-[#64748b] grayscale hover:grayscale-0 transition-all">
            {item.name}
          </div>
        ))}
      </div>
    </section>
  );
}

function BlogRenderer({ content }: { content: Record<string, string> }) {
  let posts = [];
  try {
    posts = JSON.parse(content.posts || '[]');
  } catch {
    posts = [];
  }

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{content.title || 'Latest Posts'}</h2>
        {content.subtitle && <p className="text-lg text-[#64748b]">{content.subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post: any, i: number) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-video bg-[#f1f5f9] rounded-lg mb-4 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="text-sm text-[#64748b] mb-2">{post.date} · {post.readTime}</div>
            <h4 className="text-xl font-bold mb-2 group-hover:text-[#2F81F7] transition-colors">{post.title}</h4>
            <p className="text-[#64748b] line-clamp-2">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CodeRenderer({ content }: { content: Record<string, string> }) {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      {content.title && <h3 className="text-lg font-bold mb-4">{content.title}</h3>}
      <div className="bg-[#1e293b] rounded-lg p-6 overflow-x-auto">
        <pre className="text-sm text-[#e2e8f0] font-mono">
          <code>{content.code || '// Your code here'}</code>
        </pre>
      </div>
    </section>
  );
}

function MapRenderer({ content }: { content: Record<string, string> }) {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      {content.title && <h3 className="text-2xl font-bold text-center mb-8">{content.title}</h3>}
      <div className="aspect-video bg-[#f1f5f9] rounded-lg flex items-center justify-center">
        {content.embedUrl ? (
          <iframe src={content.embedUrl} className="w-full h-full rounded-lg" />
        ) : (
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto text-[#64748b] mb-4" />
            <p className="text-[#64748b]">{content.address || 'Add your address'}</p>
          </div>
        )}
      </div>
      {content.address && <p className="text-center mt-4 text-[#64748b]">{content.address}</p>}
    </section>
  );
}

function CountdownRenderer({ content }: { content: Record<string, string> }) {
  const targetDate = content.targetDate ? new Date(content.targetDate) : new Date('2025-12-31');
  const now = new Date();
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return (
    <section className="py-24 px-6 text-center">
      {content.title && <h2 className="text-3xl font-bold mb-8">{content.title}</h2>}
      <div className="flex justify-center gap-8 mb-8">
        {[
          { value: days, label: 'Days' },
          { value: hours, label: 'Hours' },
          { value: minutes, label: 'Minutes' },
          { value: seconds, label: 'Seconds' },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-5xl font-bold text-[#1e293b] mb-2">{String(item.value).padStart(2, '0')}</div>
            <div className="text-[#64748b] uppercase text-sm tracking-wider">{item.label}</div>
          </div>
        ))}
      </div>
      {content.message && <p className="text-[#64748b]">{content.message}</p>}
    </section>
  );
}

function DividerRenderer({ content }: { content: Record<string, string> }) {
  const styles: Record<string, string> = {
    gradient: 'bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent h-px',
    solid: 'bg-[#e2e8f0] h-px',
    dotted: 'border-b border-dotted border-[#e2e8f0]',
    double: 'border-b-2 border-t-2 border-[#e2e8f0] h-4',
  };

  const height = parseInt(content.height || '1', 10);
  const width = parseInt(content.width || '100', 10);

  return (
    <section className="py-8 px-6 flex justify-center">
      <div className={`${styles[content.style || 'gradient']}`} style={{ width: `${width}%`, height: `${height}px` }}>
        {content.text && <span className="block text-center text-[#94a3b8] text-sm -mt-2">{content.text}</span>}
      </div>
    </section>
  );
}

function SocialRenderer({ content }: { content: Record<string, string> }) {
  let platforms = [];
  try {
    platforms = JSON.parse(content.platforms || '[]');
  } catch {
    platforms = [];
  }

  return (
    <section className="py-16 px-6 text-center">
      {content.title && <h3 className="text-xl font-bold mb-8">{content.title}</h3>}
      <div className="flex justify-center gap-6">
        {platforms.map((platform: any, i: number) => (
          <a key={i} href={platform.url} className="w-12 h-12 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#2F81F7] hover:text-white transition-all text-lg">
            {platform.icon}
          </a>
        ))}
      </div>
    </section>
  );
}

function AccordionRenderer({ content }: { content: Record<string, string> }) {
  let items = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  return (
    <section className="py-16 px-6 max-w-3xl mx-auto">
      {content.title && <h2 className="text-3xl font-bold text-center mb-12">{content.title}</h2>}
      <div className="space-y-3">
        {items.map((item: any, i: number) => (
          <details key={i} className="group border border-[#e2e8f0] rounded-lg">
            <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold list-none">
              {item.title}
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="px-6 pb-6 text-[#64748b]">
              {item.content}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function TimelineRenderer({ content }: { content: Record<string, string> }) {
  let items = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  return (
    <section className="py-32 px-6 max-w-4xl mx-auto">
      {content.title && <h2 className="text-4xl font-bold text-center mb-16">{content.title}</h2>}
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#e2e8f0]" />
        {items.map((item: any, i: number) => (
          <div key={i} className={`flex items-center mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-1/2 pr-8 text-right">
              {i % 2 === 0 && <div className="text-2xl font-bold text-[#2F81F7]">{item.year}</div>}
            </div>
            <div className="w-4 h-4 rounded-full bg-[#2F81F7] border-4 border-white shadow-lg z-10" />
            <div className="w-1/2 pl-8">
              {i % 2 !== 0 && <div className="text-2xl font-bold text-[#2F81F7]">{item.year}</div>}
              <h4 className="font-bold text-lg mt-2">{item.title}</h4>
              <p className="text-[#64748b]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CompareRenderer({ content }: { content: Record<string, string> }) {
  let plans: { name: string; price: string; features: string }[] = [];
  try {
    plans = JSON.parse(content.plans || '[]');
  } catch {
    plans = [];
  }

  return (
    <section className="py-32 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">{content.title || 'Compare'}</h2>
        {content.subtitle && <p className="text-[#64748b]">{content.subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e2e8f0]">
              <th className="p-4 text-left font-bold">Features</th>
              {plans.map((plan, i) => (
                <th key={i} className={`p-4 text-center font-bold ${content.highlightPlan === plan.name ? 'bg-[#2F81F7]/10 text-[#2F81F7]' : ''}`}>
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans[0]?.features.split(',').map((_, i) => (
              <tr key={i} className="border-b border-[#f1f5f9]">
                <td className="p-4 font-medium">Feature {i + 1}</td>
                {plans.map((plan, j) => (
                  <td key={j} className={`p-4 text-center ${content.highlightPlan === plan.name ? 'bg-[#2F81F7]/5' : ''}`}>
                    ✓
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SectionRenderer({ section }: Readonly<SectionRendererProps>) {
  switch (section.type) {
    case 'hero':
      return <HeroRenderer content={section.content} />;
    case 'text':
      return <TextRenderer content={section.content} />;
    case 'image':
      return <ImageRenderer content={section.content} />;
    case 'gallery':
      return <GalleryRenderer content={section.content} />;
    case 'contact':
      return <ContactRenderer content={section.content} />;
    case 'spacer':
      return <SpacerRenderer content={section.content} />;
    case 'video':
      return <VideoRenderer content={section.content} />;
    case 'cta':
      return <CTARenderer content={section.content} />;
    case 'features':
      return <FeaturesRenderer content={section.content} />;
    case 'testimonials':
      return <TestimonialsRenderer content={section.content} />;
    case 'pricing':
      return <PricingRenderer content={section.content} />;
    case 'faq':
      return <FAQRenderer content={section.content} />;
    case 'newsletter':
      return <NewsletterRenderer content={section.content} />;
    case 'team':
      return <TeamRenderer content={section.content} />;
    case 'stats':
      return <StatsRenderer content={section.content} />;
    case 'logos':
      return <LogosRenderer content={section.content} />;
    case 'blog':
      return <BlogRenderer content={section.content} />;
    case 'code':
      return <CodeRenderer content={section.content} />;
    case 'map':
      return <MapRenderer content={section.content} />;
    case 'countdown':
      return <CountdownRenderer content={section.content} />;
    case 'divider':
      return <DividerRenderer content={section.content} />;
    case 'social':
      return <SocialRenderer content={section.content} />;
    case 'accordion':
      return <AccordionRenderer content={section.content} />;
    case 'timeline':
      return <TimelineRenderer content={section.content} />;
    case 'compare':
      return <CompareRenderer content={section.content} />;
    default:
      return (
        <div className="py-6 px-4 text-muted-foreground text-center">
          Unknown section type: {section.type}
        </div>
      );
  }
}
