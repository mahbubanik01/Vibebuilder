import { Outlet } from 'react-router-dom';
import { AlertTriangle, Rocket } from 'lucide-react';
import { useGetLoginOptions } from '@/modules/auth/hooks/use-auth';
import { useAuthState } from '@/state/client-middleware';
import { LanguageSelector, ThemeSwitcher } from '@/components/core';
import { DottedSurface } from '@/components/ui-kit/dotted-surface';

export const AuthLayout = () => {
  const { isLoading, error: loginOptionsError } = useGetLoginOptions();
  const { isMounted } = useAuthState();

  if (!isMounted) return null;

  const is404Error = (error: any) => {
    return (
      error?.message?.includes('HTTP 404') ||
      error?.message?.includes('HTTP 403') ||
      error?.message?.includes('HTTP 406') ||
      error?.message?.includes('HTTP 424') ||
      error?.response?.status === 404 ||
      error?.response?.status === 403 ||
      error?.response?.status === 406 ||
      error?.response?.status === 424 ||
      error?.status === 404 ||
      error?.status === 403 ||
      error?.status === 406 ||
      error?.status === 424
    );
  };

  const is500Error = (error: any) => {
    const status = error?.response?.status || error?.status;
    if (status && status >= 500 && status < 600) {
      return true;
    }

    if (error?.message) {
      const httpMatch = error.message.match(/HTTP (\d{3})/);
      if (httpMatch) {
        const statusFromMessage = parseInt(httpMatch[1], 10);
        return statusFromMessage >= 500 && statusFromMessage < 600;
      }
    }

    return false;
  };

  const renderAuthContent = () => {
    if (is404Error(loginOptionsError)) {
      return (
        <div className="w-full max-w-xl mx-auto">
          <div className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 to-transparent"></div>
            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-red-900 tracking-tight">
                  Incorrect Project Key
                </h2>
                <div className="space-y-3 text-red-700">
                  <p className="text-base leading-relaxed">
                    It seems your project is not set up in the Blocks Cloud.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Please create a project at{' '}
                    <a
                      href="https://cloud.seliseblocks.com"
                      className="font-semibold underline decoration-red-400 underline-offset-2 hover:decoration-red-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      cloud.seliseblocks.com
                    </a>
                    , then update your{' '}
                    <code className="inline-flex items-center px-2 py-1 rounded-md bg-red-200/60 text-red-800 font-mono text-xs border border-red-300/50">
                      .env
                    </code>{' '}
                    configuration in Construct accordingly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (is500Error(loginOptionsError)) {
      return (
        <div className="w-full max-w-xl mx-auto">
          <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-transparent"></div>
            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-orange-100 p-3">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-orange-900 tracking-tight">
                  Services Temporarily Unavailable
                </h2>
                <div className="space-y-3 text-orange-700">
                  <p className="text-base leading-relaxed">
                    The services are temporarily unavailable.
                  </p>
                  <p className="text-base leading-relaxed font-semibold">
                    Everything will be back to normal soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <Outlet />;
  };

  if (isLoading) return null;

  return (
    <div className="flex w-full flex-col h-screen bg-[#0D1117] overflow-hidden selection:bg-[#2F81F7]/30">
      <div className="flex w-full min-h-screen relative">
        {/* Left Side: Premium Three.js Animation */}
        <div className="hidden lg:flex w-[45%] relative flex-col items-center justify-center p-20 overflow-hidden border-r border-[#30363D]">
          <DottedSurface className="opacity-50" />
          
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-3 mb-12">
               <div className="w-12 h-12 rounded-xl bg-[#2F81F7] flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Rocket className="w-6 h-6 text-white" />
               </div>
               <h1 className="text-3xl font-bold tracking-tight text-[#E6EDF3]">VibeBuilder</h1>
            </div>
            
            <h2 className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Designing the future <br /> of the web.
            </h2>
            <p className="text-xl text-[#9DA7B3] leading-relaxed max-w-md">
              The high-fidelity visual engine for modern teams and creative designers.
            </p>
          </div>
          
          <div className="absolute bottom-12 left-12 z-20">
             <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                <p className="text-[#9DA7B3] text-xs font-bold uppercase tracking-[0.2em]">Build with Precision • Vibe v0.1</p>
             </div>
          </div>
        </div>

        {/* Right Side: Clean Login Area */}
        <div className="flex items-center justify-center w-full px-6 md:px-20 lg:w-[55%] lg:px-[10%] xl:px-[12%] bg-[#0D1117] relative">
          <div className="absolute top-8 right-8 z-50">
            <div className="flex flex-row items-center gap-4 p-1 rounded-full bg-[#161B22] border border-[#30363D] backdrop-blur-sm">
              <ThemeSwitcher />
              <div className="w-px h-4 bg-[#30363D]" />
              <LanguageSelector />
            </div>
          </div>
          
          <div className="w-full max-w-md relative">
            {/* Logo for mobile */}
            <div className="lg:hidden flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-lg bg-[#2F81F7] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-[#E6EDF3]">VibeBuilder</span>
            </div>

            <div className="relative z-10">
              {renderAuthContent()}
            </div>

            <div className="mt-12 pt-12 border-t border-[#30363D] text-center">
               <p className="text-[#9DA7B3] text-sm">
                 Build. Ship. Vibe. <br />
                 <span className="text-[10px] uppercase tracking-widest mt-2 block opacity-50">© 2024 VibeBuilder Engine</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
