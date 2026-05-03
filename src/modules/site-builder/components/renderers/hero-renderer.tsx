import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-kit/button';
import type { HeroProps } from '../../types/components';

interface HeroRendererProps {
  props: HeroProps;
  isEditable?: boolean;
  onEdit?: () => void;
}

export function HeroRenderer({ props, isEditable, onEdit }: HeroRendererProps) {
  const {
    title = 'Welcome',
    subtitle = '',
    backgroundImage,
    backgroundColor = '#1a1a2e',
    textColor = '#ffffff',
    buttonText,
    buttonUrl,
    buttonColor = '#e94560',
  } = props;

  const style: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div
      className={cn(
        'relative py-20 px-6 text-center min-h-[400px] flex items-center justify-center',
        'before:absolute before:inset-0 before:bg-black/40',
        isEditable && 'cursor-pointer hover:ring-2 hover:ring-blue-500'
      )}
      style={style}
      onClick={isEditable ? onEdit : undefined}
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl mb-8 opacity-90">{subtitle}</p>}
        {buttonText && buttonUrl && (
          <Button
            style={{ backgroundColor: buttonColor }}
            className="text-white px-8 py-3 text-lg"
            onClick={(e) => {
              if (isEditable) e.stopPropagation();
              window.open(buttonUrl, '_blank');
            }}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}