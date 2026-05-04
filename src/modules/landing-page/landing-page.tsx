import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/state/store/auth';
import { Button } from '@/components/ui-kit/button';
import { Rocket, Sparkles, Layout, Globe, Zap, Shield, ArrowRight, Layers, MousePointerClick, Palette } from 'lucide-react';
import { useEffect } from 'react';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] overflow-x-hidden selection:bg-[#2F81F7]/30">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#2F81F7]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#2F81F7]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#30363D]/50 bg-[#0D1117]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2F81F7] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">VibeBuilder</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth/signin')}
              className="text-[#9DA7B3] hover:text-[#E6EDF3] hover:bg-[#30363D] font-medium"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/auth/signup')}
              className="bg-[#2F81F7] hover:bg-[#1F6FEB] text-white shadow-lg shadow-blue-500/20 font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F81F7]/10 border border-[#2F81F7]/20 text-[#2F81F7] text-xs font-bold uppercase tracking-widest mb-10 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            Visual Website Builder — No Code Required
          </div>
          
          <h1 className="text-6xl md:text-[5.5rem] font-bold tracking-tighter mb-8 leading-[0.95]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#E6EDF3] via-[#E6EDF3] to-[#9DA7B3]">
              Design at the speed
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#E6EDF3] to-[#9DA7B3]/60">
              of thought.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#9DA7B3] max-w-2xl mx-auto mb-12 leading-relaxed">
            VibeBuilder is the visual engine for creating high-fidelity websites. 
            Drag components, customize everything, publish instantly — all with real-time cloud sync.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Button 
              size="lg"
              onClick={() => navigate('/auth/signup')}
              className="h-14 px-10 bg-[#2F81F7] hover:bg-[#1F6FEB] text-white text-lg font-bold rounded-xl shadow-2xl shadow-blue-500/30 group active:scale-95 transition-all"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/auth/signin')}
              className="h-14 px-10 border-[#30363D] text-[#E6EDF3] hover:bg-[#161B22] text-lg font-bold rounded-xl active:scale-95 transition-all"
            >
              Sign In to Dashboard
            </Button>
          </div>

          {/* Editor Preview Mockup */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#2F81F7]/10 via-transparent to-[#2F81F7]/10 rounded-3xl blur-xl opacity-50" />
            <div className="relative rounded-2xl border border-[#30363D] bg-[#161B22] overflow-hidden shadow-2xl shadow-black/60">
              {/* Fake title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0D1117] border-b border-[#30363D]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#f85149]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#d29922]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#3fb950]/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-[#161B22] border border-[#30363D] text-[11px] text-[#9DA7B3] font-mono">
                    vibebuilder.app/site-builder
                  </div>
                </div>
              </div>
              {/* Mockup content */}
              <div className="flex h-[340px]">
                {/* Sidebar */}
                <div className="w-56 bg-[#161B22] border-r border-[#30363D] p-4 space-y-3 flex-shrink-0">
                  <div className="text-[11px] font-bold text-[#9DA7B3] uppercase tracking-wider mb-4">Components</div>
                  {['Hero Banner', 'Feature Grid', 'Testimonials', 'Contact Form', 'Pricing Cards'].map((name, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[12px] font-medium transition-all ${i === 0 ? 'bg-[#2F81F7]/10 text-[#2F81F7] border border-[#2F81F7]/20' : 'text-[#9DA7B3] hover:bg-[#30363D]/30'}`}>
                      <div className={`w-7 h-7 rounded-md ${i === 0 ? 'bg-[#2F81F7]/20' : 'bg-[#0D1117]'} border border-[#30363D] flex items-center justify-center`}>
                        {i === 0 && <Layout className="w-3.5 h-3.5" />}
                        {i === 1 && <Layers className="w-3.5 h-3.5" />}
                        {i === 2 && <MousePointerClick className="w-3.5 h-3.5" />}
                        {i === 3 && <Palette className="w-3.5 h-3.5" />}
                        {i === 4 && <Globe className="w-3.5 h-3.5" />}
                      </div>
                      {name}
                    </div>
                  ))}
                </div>
                {/* Canvas */}
                <div className="flex-1 p-6" style={{ background: '#0D1117', backgroundImage: 'radial-gradient(#30363D 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  <div className="bg-white rounded-lg shadow-xl h-full overflow-hidden">
                    <div className="bg-gradient-to-br from-[#0D1117] to-[#161B22] h-1/2 flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-2">Design with Vibe.</div>
                        <div className="text-sm text-[#9DA7B3]">Your next great website starts here</div>
                        <div className="mt-4 inline-block bg-[#2F81F7] text-white text-xs font-bold px-6 py-2 rounded-lg">Get Started</div>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-3 gap-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="bg-[#f8fafc] rounded-md p-3 border border-[#e2e8f0]">
                          <div className="w-6 h-6 rounded bg-[#2F81F7]/10 mb-2" />
                          <div className="h-2 bg-[#e2e8f0] rounded w-3/4 mb-1.5" />
                          <div className="h-2 bg-[#f1f5f9] rounded w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Right panel */}
                <div className="w-48 bg-[#161B22] border-l border-[#30363D] p-4 flex-shrink-0">
                  <div className="text-[10px] font-bold text-[#2F81F7] uppercase tracking-wider mb-1">Hero</div>
                  <div className="text-[13px] font-semibold text-[#E6EDF3] mb-4">Configuration</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-[#9DA7B3] mb-1">Heading</div>
                      <div className="h-8 bg-[#0D1117] rounded border border-[#30363D]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#9DA7B3] mb-1">BG Color</div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded bg-[#0D1117] border border-[#30363D]" />
                        <div className="h-8 flex-1 bg-[#0D1117] rounded border border-[#30363D]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-[#0D1117] relative z-10 border-t border-[#30363D]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">Everything you need to ship.</h2>
            <p className="text-[#9DA7B3] text-lg max-w-xl mx-auto">A complete toolkit for creating, editing, and publishing modern websites — no code required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Layout,
                title: 'Visual Editor',
                desc: 'Drag, drop, and customize 25+ component types with a precision visual engine.'
              },
              {
                icon: Globe,
                title: 'Instant Publishing',
                desc: 'Ship your site live with a single click. Toggle between published and draft instantly.'
              },
              {
                icon: Zap,
                title: 'Real-time Sync',
                desc: 'Auto-save ensures your changes persist to the cloud instantly. Never lose work.'
              },
              {
                icon: Shield,
                title: 'Selise IAM Auth',
                desc: 'Enterprise-grade authentication via Selise Blocks with workspace isolation per user.'
              },
              {
                icon: Rocket,
                title: 'Multi-Page Sites',
                desc: 'Create Home, About, Services — any page structure. Each page has its own layout.'
              },
              {
                icon: Sparkles,
                title: 'Premium Components',
                desc: 'Hero sections, pricing tables, testimonials, galleries, contact forms and more.'
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-[#2F81F7]/40 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-[#2F81F7]/10 border border-[#2F81F7]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2F81F7]/15 transition-all duration-300">
                  <f.icon className="w-6 h-6 text-[#2F81F7]" />
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-[#2F81F7] transition-colors">{f.title}</h3>
                <p className="text-[#9DA7B3] leading-relaxed text-[15px]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden border-t border-[#30363D]/50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2F81F7]/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Ready to build?</h2>
          <p className="text-xl text-[#9DA7B3] mb-12 max-w-xl mx-auto">Create your free account and start designing your first website in minutes.</p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth/signup')}
            className="h-16 px-14 bg-[#E6EDF3] hover:bg-white text-[#0D1117] text-xl font-bold rounded-xl shadow-2xl active:scale-95 transition-all"
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[#30363D]/50 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[#9DA7B3] text-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#2F81F7] flex items-center justify-center">
              <Rocket className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-[#E6EDF3]">VibeBuilder</span>
            <span className="ml-3 text-[#9DA7B3]/60">© {new Date().getFullYear()} Built for the modern web.</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://github.com/mahbubanik01/Vibebuilder" target="_blank" rel="noreferrer" className="hover:text-[#E6EDF3] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
