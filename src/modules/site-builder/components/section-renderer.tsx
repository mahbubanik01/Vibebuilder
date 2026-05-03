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
      className="relative flex flex-col items-center justify-center text-center py-48 px-6 overflow-hidden group animate-in fade-in duration-1000"
      style={
        hasBg
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(13,17,23,0.8), rgba(13,17,23,0.6)), url(${content.backgroundImageUrl})`,
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
      {/* Decorative background glow */}
      {!hasBg && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2" />
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        <h1 className="text-7xl md:text-9xl font-black tracking-tight mb-8 leading-[0.85] animate-in slide-in-from-bottom-8 duration-700 ease-out">
          {content.heading || 'Design with Vibe.'}
        </h1>
        {content.subheading && (
          <p className="text-xl md:text-2xl opacity-80 mb-12 max-w-3xl mx-auto font-medium leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-100 ease-out">
            {content.subheading}
          </p>
        )}
        {content.ctaText && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in slide-in-from-bottom-4 duration-700 delay-200 ease-out">
            <a
              href={content.ctaUrl || '#'}
              className="inline-flex items-center justify-center bg-[#2F81F7] text-white font-bold px-12 py-5 rounded-xl hover:bg-[#1F6FEB] hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 text-[16px]"
            >
              {content.ctaText}
            </a>
            {content.secondaryCta === 'true' && (
               <a
                href="#"
                className="inline-flex items-center justify-center backdrop-blur-md bg-white/5 border border-white/10 text-white font-bold px-12 py-5 rounded-xl hover:bg-white/10 transition-all active:scale-95 text-[16px]"
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
    <section className="py-32 px-6 max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="prose prose-slate lg:prose-xl max-w-none">
        <p className="text-[21px] leading-[1.7] text-[#1e293b] whitespace-pre-wrap font-medium opacity-90 tracking-tight">
          {content.body || 'Text content will appear here.'}
        </p>
      </div>
    </section>
  );
}

function ImageRenderer({ content }: { content: Record<string, string> }) {
  const hasSrc = content.src && content.src.trim() !== '';

  return (
    <section className="py-16 px-6 flex flex-col items-center animate-in zoom-in-95 duration-700">
      <div className="relative group">
        {hasSrc ? (
          <img
            src={content.src}
            alt={content.alt || ''}
            className="max-w-full max-h-[600px] rounded-2xl object-cover shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-[800px] h-[450px] bg-muted/30 rounded-2xl flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50">
            No image URL provided
          </div>
        )}
      </div>
      {content.caption && (
        <p className="mt-6 text-[15px] text-muted-foreground/80 italic font-medium tracking-tight">{content.caption}</p>
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
      <section className="py-20 px-6 max-w-5xl mx-auto text-center text-muted-foreground font-medium opacity-50 italic">
        Empty Gallery
      </section>
    );
  }

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((src, index) => (
          <div key={index} className="aspect-square bg-muted/20 rounded-2xl overflow-hidden flex items-center justify-center shadow-md hover:shadow-2xl transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ transitionDelay: `${index * 100}ms` }}>
            {src ? (
              <img src={src} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <span className="text-muted-foreground text-sm font-bold opacity-30">Image {index + 1}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactRenderer({ content }: { content: Record<string, string> }) {
  return (
    <section className="py-40 px-6 max-w-3xl mx-auto animate-in fade-in duration-1000">
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black tracking-tighter text-[#1e293b]">{content.title || 'Get in Touch'}</h2>
          <p className="text-[#64748b] text-lg font-medium">{content.subtitle || 'We usually respond within 24 hours.'}</p>
        </div>
        <form className="p-10 rounded-3xl bg-white border border-[#e2e8f0] shadow-2xl shadow-slate-200/50 space-y-10" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#94a3b8] ml-1">{content.nameLabel || 'Name'}</Label>
              <Input className="border-x-0 border-t-0 border-b-2 border-[#e2e8f0] rounded-none px-1 bg-transparent focus:border-[#2F81F7] transition-all h-12 text-[17px] focus-visible:ring-0 placeholder:text-[#cbd5e1]" placeholder="Jane Doe" readOnly />
            </div>
            <div className="space-y-3">
              <Label className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#94a3b8] ml-1">{content.emailLabel || 'Email'}</Label>
              <Input className="border-x-0 border-t-0 border-b-2 border-[#e2e8f0] rounded-none px-1 bg-transparent focus:border-[#2F81F7] transition-all h-12 text-[17px] focus-visible:ring-0 placeholder:text-[#cbd5e1]" type="email" placeholder="jane@studio.com" readOnly />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#94a3b8] ml-1">{content.messageLabel || 'Message'}</Label>
            <Textarea className="border-x-0 border-t-0 border-b-2 border-[#e2e8f0] rounded-none px-1 bg-transparent focus:border-[#2F81F7] transition-all min-h-[120px] text-[17px] focus-visible:ring-0 resize-none placeholder:text-[#cbd5e1]" placeholder="Tell us about your project..." readOnly />
          </div>
          <Button className="w-full h-16 bg-[#2F81F7] hover:bg-[#1F6FEB] text-white font-black rounded-xl shadow-xl shadow-blue-500/20 text-[16px] transition-all active:scale-[0.98]" size="lg">
            {content.buttonText || 'Send Message'}
          </Button>
        </form>
      </div>
    </section>
  );
}

function SpacerRenderer({ content }: { content: Record<string, string> }) {
  const height = parseInt(content.height || '80', 10);
  const showDivider = content.showDivider === 'true';

  return (
    <div style={{ height: `${height}px` }} className="w-full max-w-5xl mx-auto flex items-center justify-center">
      {showDivider && <Separator className="w-full opacity-50" />}
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
    <section className="py-24 px-6 max-w-6xl mx-auto animate-in zoom-in-95 duration-1000">
      <div className="aspect-video bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative group">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/40 bg-slate-900">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
               <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white/60 border-b-[10px] border-b-transparent ml-2" />
            </div>
            <p className="font-bold tracking-widest text-[11px] uppercase">Enter Video URL</p>
          </div>
        )}
      </div>
      {content.caption && (
        <p className="mt-8 text-center text-[15px] text-[#64748b] font-medium tracking-tight italic">{content.caption}</p>
      )}
    </section>
  );
}

function CTARenderer({ content }: { content: Record<string, string> }) {
  const align = content.align || 'center';

  return (
    <section className={`py-40 px-6 max-w-7xl mx-auto flex flex-col items-${align === 'center' ? 'center' : align === 'right' ? 'end' : 'start'} text-${align} animate-in fade-in slide-in-from-bottom-8 duration-1000`}>
      <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tight leading-[0.95] text-[#1e293b]">{content.title || 'Ready to launch your vision?'}</h2>
      {content.description && <p className="text-2xl text-[#64748b] mb-16 max-w-3xl font-medium leading-relaxed">{content.description}</p>}
      <Button 
        size="lg" 
        className="px-16 h-20 rounded-2xl font-black bg-[#2F81F7] hover:bg-[#1F6FEB] text-white shadow-2xl shadow-blue-500/30 border-none text-[18px] active:scale-95 transition-all"
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
    <section className="py-40 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-32 space-y-4">
        <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-[#1e293b]">{content.title || 'Studio Features'}</h2>
        {content.subtitle && <p className="text-xl text-[#64748b] font-medium">{content.subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex flex-col items-start group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ transitionDelay: `${i * 150}ms` }}>
            <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-10 group-hover:border-[#2F81F7] group-hover:bg-[#2F81F7]/5 group-hover:scale-110 transition-all duration-500 ease-out">
               <div className="text-3xl">{item.icon || '✨'}</div>
            </div>
            <h4 className="text-[26px] font-black mb-6 tracking-tight text-[#1e293b] group-hover:text-[#2F81F7] transition-colors">{item.title || 'Feature Title'}</h4>
            <p className="text-[#64748b] leading-relaxed text-[17px] font-medium">{item.desc || 'Feature description goes here.'}</p>
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
