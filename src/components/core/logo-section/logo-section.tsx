import { X, Rocket } from 'lucide-react';

interface LogoSectionProps {
  theme: string;
  open: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export const LogoSection = ({ open, isMobile, onClose }: Readonly<LogoSectionProps>) => {
  return (
    <div className="relative h-12 w-full flex items-center px-4 overflow-hidden">
      <div className={`flex items-center gap-3 transition-all duration-300 ${
        open || isMobile ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center shadow-md">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <span className="font-black text-xl tracking-tighter text-gray-900">
          VIBE<span className="text-gray-400 font-light italic">BUILDER</span>
        </span>
      </div>

      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
        open || isMobile ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center shadow-sm">
          <Rocket className="w-5 h-5 text-white" />
        </div>
      </div>

      {isMobile && (
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
