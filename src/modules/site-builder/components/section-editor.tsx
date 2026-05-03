import { Input } from '@/components/ui-kit/input';
import { Textarea } from '@/components/ui-kit/textarea';
import { Label } from '@/components/ui-kit/label';
import { Button } from '@/components/ui-kit/button';
import { Slider } from '@/components/ui-kit/slider';
import { Switch } from '@/components/ui-kit/switch';
import { Plus, Trash2 } from 'lucide-react';
import type { Section } from '../types/site-builder.types';
import { ImageUploadButton } from './image-upload-button';

interface SectionEditorProps {
  section: Section;
  onChange: (id: string, content: Record<string, string>) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function HeroEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Content</h5>
        <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Heading</Label>
          <Input
            value={content.heading ?? ''}
            onChange={(e) => onUpdate({ heading: e.target.value })}
            placeholder="Enter heading"
            className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md h-10"
          />
        </div>
        <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Subheading</Label>
          <Input
            value={content.subheading ?? ''}
            onChange={(e) => onUpdate({ subheading: e.target.value })}
            placeholder="Enter subheading"
            className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md h-10"
          />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-[#30363D]">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Styling</h5>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">BG Color</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={content.bgColor ?? '#0D1117'} 
                  onChange={(e) => onUpdate({ bgColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-[#30363D] bg-[#0D1117]"
                />
                <span className="text-[11px] font-mono text-[#9DA7B3] uppercase">{content.bgColor ?? '#0D1117'}</span>
              </div>
           </div>
           <div>
              <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Text Color</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={content.textColor ?? '#E6EDF3'} 
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-[#30363D] bg-[#0D1117]"
                />
                <span className="text-[11px] font-mono text-[#9DA7B3] uppercase">{content.textColor ?? '#E6EDF3'}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-[#30363D]">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Media</h5>
        <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Background Image</Label>
          <div className="flex gap-2">
            <ImageUploadButton onUploadSuccess={(url) => onUpdate({ backgroundImageUrl: url })} className="w-full" />
          </div>
          {content.backgroundImageUrl && (
            <div className="mt-3 relative group overflow-hidden rounded-md border border-[#30363D]">
              <img src={content.backgroundImageUrl} className="h-20 w-full object-cover" alt="bg" />
              <button 
                onClick={() => onUpdate({ backgroundImageUrl: '' })}
                className="absolute top-1 right-1 bg-black/60 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TextEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Body Content</Label>
        <Textarea
          value={content.body ?? ''}
          onChange={(e) => onUpdate({ body: e.target.value })}
          placeholder="Write your text content here..."
          className="min-h-[200px] bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md leading-relaxed"
        />
      </div>
    </div>
  );
}

function ImageEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Media</h5>
        <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Image Source</Label>
          <div className="flex gap-2">
            <Input
              value={content.src ?? ''}
              onChange={(e) => onUpdate({ src: e.target.value })}
              placeholder="https://..."
              className="flex-1 bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
            />
            <ImageUploadButton onUploadSuccess={(url) => onUpdate({ src: url })} />
          </div>
          {content.src && (
            <div className="mt-3 overflow-hidden rounded-md border border-[#30363D]">
              <img src={content.src} className="h-24 w-full object-cover" alt="preview" />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4 pt-6 border-t border-[#30363D]">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Details</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Alt Text</Label>
            <Input
              value={content.alt ?? ''}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Description"
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
            />
          </div>
          <div>
            <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Caption</Label>
            <Input
              value={content.caption ?? ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Optional"
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  let images: string[] = [];
  try {
    images = JSON.parse(content.images || '[]');
  } catch {
    images = [];
  }

  const handleAdd = () => {
    onUpdate({ images: JSON.stringify([...images, '']) });
  };

  const handleUpdate = (index: number, val: string) => {
    const newImages = [...images];
    newImages[index] = val;
    onUpdate({ images: JSON.stringify(newImages) });
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onUpdate({ images: JSON.stringify(newImages) });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider">Gallery Images</h5>
        <Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] px-3 text-[#2F81F7] hover:bg-[#2F81F7]/10"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Image</Button>
      </div>
      {images.map((img, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={img}
            onChange={(e) => handleUpdate(i, e.target.value)}
            placeholder="Image URL"
            className="flex-1 bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
          />
          <ImageUploadButton onUploadSuccess={(url) => handleUpdate(i, url)} />
          <Button variant="ghost" size="icon" onClick={() => handleRemove(i)} className="text-[#9DA7B3] hover:text-[#f85149] hover:bg-[#f85149]/10 flex-shrink-0 h-10 w-10 border border-[#30363D]">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function ContactEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Form Fields</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Name Label</Label>
            <Input value={content.nameLabel ?? ''} onChange={(e) => onUpdate({ nameLabel: e.target.value })} placeholder="Name" className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md" />
          </div>
          <div>
            <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Email Label</Label>
            <Input value={content.emailLabel ?? ''} onChange={(e) => onUpdate({ emailLabel: e.target.value })} placeholder="Email" className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Message Label</Label>
            <Input value={content.messageLabel ?? ''} onChange={(e) => onUpdate({ messageLabel: e.target.value })} placeholder="Message" className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md" />
          </div>
          <div>
            <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Button Text</Label>
            <Input value={content.buttonText ?? ''} onChange={(e) => onUpdate({ buttonText: e.target.value })} placeholder="Send" className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacerEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  const height = parseInt(content.height || '40', 10);
  const showDivider = content.showDivider === 'true';

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label className="text-[12px] text-[#9DA7B3] block font-medium">Height (px)</Label>
          <span className="text-xs text-[#9DA7B3] font-mono bg-[#0D1117] px-2 py-0.5 rounded border border-[#30363D]">{height}px</span>
        </div>
        <Slider
          value={[height]}
          onValueChange={([val]) => onUpdate({ height: val.toString() })}
          max={200}
          min={10}
          step={5}
          className="w-full"
        />
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-[#30363D]">
        <Label className="text-[12px] text-[#9DA7B3] block font-medium">Show Line Divider</Label>
        <Switch
          checked={showDivider}
          onCheckedChange={(checked) => onUpdate({ showDivider: checked.toString() })}
        />
      </div>
    </div>
  );
}

function VideoEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Video</h5>
        <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">URL (YouTube / Vimeo)</Label>
          <Input
            value={content.url ?? ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
          />
        </div>
        <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Caption</Label>
          <Input
            value={content.caption ?? ''}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Video description"
            className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

function CTAEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
         <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Content</h5>
         <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Title</Label>
          <Input
            value={content.title ?? ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Ready to get started?"
            className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
          />
        </div>
        <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Description</Label>
          <Textarea
            value={content.description ?? ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Call to action details"
            className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
          />
        </div>
      </div>
      
      <div className="space-y-4 pt-6 border-t border-[#30363D]">
        <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider mb-3">Action</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Button Text</Label>
            <Input
              value={content.buttonText ?? ''}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              placeholder="Action Label"
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
            />
          </div>
          <div>
            <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">URL</Label>
            <Input
              value={content.url ?? ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://..."
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  let items: any[] = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  const handleAdd = () => {
    onUpdate({ items: JSON.stringify([...items, { icon: '✨', title: '', desc: '' }]) });
  };

  const handleUpdate = (index: number, field: string, val: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    onUpdate({ items: JSON.stringify(newItems) });
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onUpdate({ items: JSON.stringify(newItems) });
  };

  return (
    <div className="space-y-6">
       <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label>
          <Input
            value={content.title ?? ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Our Features"
            className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
          />
       </div>

       <div className="space-y-4 pt-6 border-t border-[#30363D]">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider">Features List</h5>
            <Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] px-3 text-[#2F81F7] hover:bg-[#2F81F7]/10"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Feature</Button>
          </div>
          {items.map((item: any, i: number) => (
            <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-4 relative group">
              <button 
                onClick={() => handleRemove(i)}
                className="absolute -top-1 -right-1 bg-[#161B22] shadow-sm border border-[#30363D] rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#f85149]" />
              </button>
              <div className="flex gap-4">
                 <div className="w-16">
                    <Label className="text-[11px] text-[#9DA7B3] mb-1.5 block font-medium">Icon</Label>
                    <Input
                      value={item.icon || ''}
                      onChange={(e) => handleUpdate(i, 'icon', e.target.value)}
                      placeholder="✨"
                      className="px-1 text-center bg-[#161B22] border-[#30363D]"
                    />
                 </div>
                 <div className="flex-1">
                    <Label className="text-[11px] text-[#9DA7B3] mb-1.5 block font-medium">Title</Label>
                    <Input
                      value={item.title || ''}
                      onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                      placeholder="Feature Title"
                      className="bg-[#161B22] border-[#30363D]"
                    />
                 </div>
              </div>
              <div>
                <Label className="text-[11px] text-[#9DA7B3] mb-1.5 block font-medium">Description</Label>
                <Textarea
                  value={item.desc || ''}
                  onChange={(e) => handleUpdate(i, 'desc', e.target.value)}
                  placeholder="Describe this feature..."
                  className="bg-[#161B22] border-[#30363D] text-[13px] min-h-[80px]"
                />
              </div>
            </div>
          ))}
       </div>
    </div>
  );
}

function TestimonialsEditor({
  content,
  onUpdate,
}: {
  content: Record<string, string>;
  onUpdate: (c: Record<string, string>) => void;
}) {
  let items: any[] = [];
  try {
    items = JSON.parse(content.items || '[]');
  } catch {
    items = [];
  }

  const handleAdd = () => {
    onUpdate({ items: JSON.stringify([...items, { quote: '', author: '', role: '' }]) });
  };

  const handleUpdate = (index: number, field: string, val: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    onUpdate({ items: JSON.stringify(newItems) });
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onUpdate({ items: JSON.stringify(newItems) });
  };

  return (
    <div className="space-y-6">
       <div>
          <Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label>
          <Input
            value={content.title ?? ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Trusted by Creators"
            className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] transition-all rounded-md"
          />
       </div>

       <div className="space-y-4 pt-6 border-t border-[#30363D]">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase tracking-wider">Testimonials</h5>
            <Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] px-3 text-[#2F81F7] hover:bg-[#2F81F7]/10"><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Testimonial</Button>
          </div>
          {items.map((item: any, i: number) => (
            <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-4 relative group">
              <button 
                onClick={() => handleRemove(i)}
                className="absolute -top-1 -right-1 bg-[#161B22] shadow-sm border border-[#30363D] rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#f85149]" />
              </button>
              <div>
                <Label className="text-[11px] text-[#9DA7B3] mb-1.5 block font-medium">Quote</Label>
                <Textarea
                  value={item.quote || ''}
                  onChange={(e) => handleUpdate(i, 'quote', e.target.value)}
                  placeholder="They loved it!"
                  className="bg-[#161B22] border-[#30363D] text-[13px] min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label className="text-[11px] text-[#9DA7B3] mb-1.5 block font-medium">Author</Label>
                    <Input
                      value={item.author || ''}
                      onChange={(e) => handleUpdate(i, 'author', e.target.value)}
                      placeholder="Jane Doe"
                      className="bg-[#161B22] border-[#30363D]"
                    />
                 </div>
                 <div>
                    <Label className="text-[11px] text-[#9DA7B3] mb-1.5 block font-medium">Role</Label>
                    <Input
                      value={item.role || ''}
                      onChange={(e) => handleUpdate(i, 'role', e.target.value)}
                      placeholder="Designer"
                      className="bg-[#161B22] border-[#30363D]"
                    />
                 </div>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
}

function PricingEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let plans: any[] = [];
  try { plans = JSON.parse(content.plans || '[]'); } catch { plans = []; }

  const handleAdd = () => onUpdate({ plans: JSON.stringify([...plans, { name: 'New Plan', price: '$99', period: '/month', features: 'Feature 1,Feature 2', highlighted: 'false', cta: 'Choose' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...plans]; p[i] = { ...p[i], [field]: val }; onUpdate({ plans: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...plans]; p.splice(i, 1); onUpdate({ plans: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Pricing Plans</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Plan</Button></div>
        {plans.map((plan, i) => (
          <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-3 relative group">
            <button onClick={() => handleRemove(i)} className="absolute -top-1 -right-1 bg-[#161B22] border border-[#30363D] rounded-md p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-[#f85149]" /></button>
            <div className="grid grid-cols-2 gap-3"><div><Label className="text-[11px] text-[#9DA7B3]">Name</Label><Input value={plan.name} onChange={(e) => handleUpdate(i, 'name', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div><div><Label className="text-[11px] text-[#9DA7B3]">Price</Label><Input value={plan.price} onChange={(e) => handleUpdate(i, 'price', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div></div>
            <div className="grid grid-cols-2 gap-3"><div><Label className="text-[11px] text-[#9DA7B3]">Period</Label><Input value={plan.period} onChange={(e) => handleUpdate(i, 'period', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div><div><Label className="text-[11px] text-[#9DA7B3]">CTA</Label><Input value={plan.cta} onChange={(e) => handleUpdate(i, 'cta', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div></div>
            <div><Label className="text-[11px] text-[#9DA7B3]">Features (comma separated)</Label><Input value={plan.features} onChange={(e) => handleUpdate(i, 'features', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
            <div className="flex items-center gap-2"><Label className="text-[11px] text-[#9DA7B3]">Highlighted</Label><input type="checkbox" checked={plan.highlighted === 'true'} onChange={(e) => handleUpdate(i, 'highlighted', e.target.checked.toString())} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let items: any[] = [];
  try { items = JSON.parse(content.items || '[]'); } catch { items = []; }
  const handleAdd = () => onUpdate({ items: JSON.stringify([...items, { question: '', answer: '' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...items]; p[i] = { ...p[i], [field]: val }; onUpdate({ items: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...items]; p.splice(i, 1); onUpdate({ items: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">FAQ Items</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add FAQ</Button></div>
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-3 relative group">
            <button onClick={() => handleRemove(i)} className="absolute -top-1 -right-1 bg-[#161B22] border border-[#30363D] rounded-md p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-[#f85149]" /></button>
            <div><Label className="text-[11px] text-[#9DA7B3]">Question</Label><Input value={item.question} onChange={(e) => handleUpdate(i, 'question', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
            <div><Label className="text-[11px] text-[#9DA7B3]">Answer</Label><Textarea value={item.answer} onChange={(e) => handleUpdate(i, 'answer', e.target.value)} className="bg-[#161B22] border-[#30363D] min-h-[80px]" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Stay Updated" className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Description</Label><Textarea value={content.description ?? ''} onChange={(e) => onUpdate({ description: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="grid grid-cols-2 gap-4"><div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Placeholder</Label><Input value={content.placeholder ?? ''} onChange={(e) => onUpdate({ placeholder: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div><div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Button Text</Label><Input value={content.buttonText ?? ''} onChange={(e) => onUpdate({ buttonText: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div></div>
    </div>
  );
}

function TeamEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let members: any[] = [];
  try { members = JSON.parse(content.members || '[]'); } catch { members = []; }
  const handleAdd = () => onUpdate({ members: JSON.stringify([...members, { name: '', role: '', image: '', bio: '' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...members]; p[i] = { ...p[i], [field]: val }; onUpdate({ members: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...members]; p.splice(i, 1); onUpdate({ members: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Subtitle</Label><Input value={content.subtitle ?? ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Team Members</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Member</Button></div>
        {members.map((m, i) => (
          <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-3 relative group">
            <button onClick={() => handleRemove(i)} className="absolute -top-1 -right-1 bg-[#161B22] border border-[#30363D] rounded-md p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-[#f85149]" /></button>
            <div className="grid grid-cols-2 gap-3"><div><Label className="text-[11px] text-[#9DA7B3]">Name</Label><Input value={m.name} onChange={(e) => handleUpdate(i, 'name', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div><div><Label className="text-[11px] text-[#9DA7B3]">Role</Label><Input value={m.role} onChange={(e) => handleUpdate(i, 'role', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div></div>
            <div><Label className="text-[11px] text-[#9DA7B3]">Image URL</Label><Input value={m.image} onChange={(e) => handleUpdate(i, 'image', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
            <div><Label className="text-[11px] text-[#9DA7B3]">Bio</Label><Textarea value={m.bio} onChange={(e) => handleUpdate(i, 'bio', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let items: any[] = [];
  try { items = JSON.parse(content.items || '[]'); } catch { items = []; }
  const handleAdd = () => onUpdate({ items: JSON.stringify([...items, { value: '0', label: '', icon: '⚡' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...items]; p[i] = { ...p[i], [field]: val }; onUpdate({ items: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...items]; p.splice(i, 1); onUpdate({ items: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Stats</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Stat</Button></div>
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-3 relative group">
            <button onClick={() => handleRemove(i)} className="absolute -top-1 -right-1 bg-[#161B22] border border-[#30363D] rounded-md p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-[#f85149]" /></button>
            <div className="grid grid-cols-3 gap-3"><div><Label className="text-[11px] text-[#9DA7B3]">Value</Label><Input value={item.value} onChange={(e) => handleUpdate(i, 'value', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div><div className="col-span-2"><Label className="text-[11px] text-[#9DA7B3]">Label</Label><Input value={item.label} onChange={(e) => handleUpdate(i, 'label', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogosEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let items: any[] = [];
  try { items = JSON.parse(content.items || '[]'); } catch { items = []; }
  const handleAdd = () => onUpdate({ items: JSON.stringify([...items, { name: '', url: '' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...items]; p[i] = { ...p[i], [field]: val }; onUpdate({ items: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...items]; p.splice(i, 1); onUpdate({ items: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Subtitle</Label><Input value={content.subtitle ?? ''} onChange={(e) => onUpdate({ subtitle: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Logos</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Logo</Button></div>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2"><Input value={item.name} onChange={(e) => handleUpdate(i, 'name', e.target.value)} placeholder="Brand Name" className="flex-1 bg-[#0D1117] border-[#30363D]" /><Button variant="ghost" size="icon" onClick={() => handleRemove(i)} className="text-[#9DA7B3] hover:text-[#f85149]"><Trash2 className="w-4 h-4" /></Button></div>
        ))}
      </div>
    </div>
  );
}

function BlogEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let posts: any[] = [];
  try { posts = JSON.parse(content.posts || '[]'); } catch { posts = []; }
  const handleAdd = () => onUpdate({ posts: JSON.stringify([...posts, { title: '', excerpt: '', date: '', readTime: '', image: '' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...posts]; p[i] = { ...p[i], [field]: val }; onUpdate({ posts: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...posts]; p.splice(i, 1); onUpdate({ posts: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Blog Posts</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Post</Button></div>
        {posts.map((post, i) => (
          <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-3 relative group">
            <button onClick={() => handleRemove(i)} className="absolute -top-1 -right-1 bg-[#161B22] border border-[#30363D] rounded-md p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-[#f85149]" /></button>
            <div><Label className="text-[11px] text-[#9DA7B3]">Title</Label><Input value={post.title} onChange={(e) => handleUpdate(i, 'title', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
            <div><Label className="text-[11px] text-[#9DA7B3]">Excerpt</Label><Textarea value={post.excerpt} onChange={(e) => handleUpdate(i, 'excerpt', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
            <div className="grid grid-cols-3 gap-3"><div><Label className="text-[11px] text-[#9DA7B3]">Date</Label><Input value={post.date} onChange={(e) => handleUpdate(i, 'date', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div><div className="col-span-2"><Label className="text-[11px] text-[#9DA7B3]">Image URL</Label><Input value={post.image} onChange={(e) => handleUpdate(i, 'image', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Language</Label><Input value={content.language ?? ''} onChange={(e) => onUpdate({ language: e.target.value })} placeholder="javascript" className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Code</Label><Textarea value={content.code ?? ''} onChange={(e) => onUpdate({ code: e.target.value })} className="bg-[#0D1117] border-[#30363D] font-mono min-h-[200px]" /></div>
    </div>
  );
}

function MapEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Address</Label><Input value={content.address ?? ''} onChange={(e) => onUpdate({ address: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Embed URL (Google Maps)</Label><Input value={content.embedUrl ?? ''} onChange={(e) => onUpdate({ embedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." className="bg-[#0D1117] border-[#30363D]" /></div>
    </div>
  );
}

function CountdownEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Target Date</Label><Input type="date" value={content.targetDate ?? ''} onChange={(e) => onUpdate({ targetDate: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Message</Label><Input value={content.message ?? ''} onChange={(e) => onUpdate({ message: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
    </div>
  );
}

function DividerEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Style</Label><select value={content.style ?? 'gradient'} onChange={(e) => onUpdate({ style: e.target.value })} className="w-full bg-[#0D1117] border-[#30363D] rounded-md h-10 px-3"><option value="gradient">Gradient</option><option value="solid">Solid</option><option value="dotted">Dotted</option><option value="double">Double</option></select></div>
      <div className="grid grid-cols-2 gap-4"><div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Height (px)</Label><Input type="number" value={parseInt(content.height || '1')} onChange={(e) => onUpdate({ height: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div><div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Width (%)</Label><Input type="number" value={parseInt(content.width || '100')} onChange={(e) => onUpdate({ width: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Center Text</Label><Input value={content.text ?? ''} onChange={(e) => onUpdate({ text: e.target.value })} placeholder="or" className="bg-[#0D1117] border-[#30363D]" /></div>
    </div>
  );
}

function SocialEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let platforms: any[] = [];
  try { platforms = JSON.parse(content.platforms || '[]'); } catch { platforms = []; }
  const handleAdd = () => onUpdate({ platforms: JSON.stringify([...platforms, { name: '', url: '', icon: '' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...platforms]; p[i] = { ...p[i], [field]: val }; onUpdate({ platforms: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...platforms]; p.splice(i, 1); onUpdate({ platforms: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Platforms</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Platform</Button></div>
        {platforms.map((p, i) => (
          <div key={i} className="flex gap-2"><Input value={p.name} onChange={(e) => handleUpdate(i, 'name', e.target.value)} placeholder="Platform Name" className="flex-1 bg-[#0D1117] border-[#30363D]" /><Input value={p.url} onChange={(e) => handleUpdate(i, 'url', e.target.value)} placeholder="URL" className="flex-1 bg-[#0D1117] border-[#30363D]" /><Button variant="ghost" size="icon" onClick={() => handleRemove(i)} className="text-[#9DA7B3] hover:text-[#f85149]"><Trash2 className="w-4 h-4" /></Button></div>
        ))}
      </div>
    </div>
  );
}

function AccordionEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let items: any[] = [];
  try { items = JSON.parse(content.items || '[]'); } catch { items = []; }
  const handleAdd = () => onUpdate({ items: JSON.stringify([...items, { title: '', content: '' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...items]; p[i] = { ...p[i], [field]: val }; onUpdate({ items: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...items]; p.splice(i, 1); onUpdate({ items: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Items</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Item</Button></div>
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-3 relative group">
            <button onClick={() => handleRemove(i)} className="absolute -top-1 -right-1 bg-[#161B22] border border-[#30363D] rounded-md p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-[#f85149]" /></button>
            <div><Label className="text-[11px] text-[#9DA7B3]">Title</Label><Input value={item.title} onChange={(e) => handleUpdate(i, 'title', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
            <div><Label className="text-[11px] text-[#9DA7B3]">Content</Label><Textarea value={item.content} onChange={(e) => handleUpdate(i, 'content', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let items: any[] = [];
  try { items = JSON.parse(content.items || '[]'); } catch { items = []; }
  const handleAdd = () => onUpdate({ items: JSON.stringify([...items, { year: '', title: '', description: '' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...items]; p[i] = { ...p[i], [field]: val }; onUpdate({ items: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...items]; p.splice(i, 1); onUpdate({ items: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Timeline Items</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Item</Button></div>
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-3 relative group">
            <button onClick={() => handleRemove(i)} className="absolute -top-1 -right-1 bg-[#161B22] border border-[#30363D] rounded-md p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-[#f85149]" /></button>
            <div className="grid grid-cols-2 gap-3"><div><Label className="text-[11px] text-[#9DA7B3]">Year</Label><Input value={item.year} onChange={(e) => handleUpdate(i, 'year', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div><div><Label className="text-[11px] text-[#9DA7B3]">Title</Label><Input value={item.title} onChange={(e) => handleUpdate(i, 'title', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div></div>
            <div><Label className="text-[11px] text-[#9DA7B3]">Description</Label><Textarea value={item.description} onChange={(e) => handleUpdate(i, 'description', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareEditor({ content, onUpdate }: { content: Record<string, string>; onUpdate: (c: Record<string, string>) => void }) {
  let plans: any[] = [];
  try { plans = JSON.parse(content.plans || '[]'); } catch { plans = []; }
  const handleAdd = () => onUpdate({ plans: JSON.stringify([...plans, { name: 'Plan', price: '$0', features: 'Feature 1,Feature 2' }]) });
  const handleUpdate = (i: number, field: string, val: string) => { const p = [...plans]; p[i] = { ...p[i], [field]: val }; onUpdate({ plans: JSON.stringify(p) }); };
  const handleRemove = (i: number) => { const p = [...plans]; p.splice(i, 1); onUpdate({ plans: JSON.stringify(p) }); };

  return (
    <div className="space-y-6">
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Section Title</Label><Input value={content.title ?? ''} onChange={(e) => onUpdate({ title: e.target.value })} className="bg-[#0D1117] border-[#30363D]" /></div>
      <div><Label className="text-[12px] text-[#9DA7B3] mb-1.5 block font-medium">Highlight Plan</Label><Input value={content.highlightPlan ?? ''} onChange={(e) => onUpdate({ highlightPlan: e.target.value })} placeholder="Pro" className="bg-[#0D1117] border-[#30363D]" /></div>
      <div className="space-y-4 pt-4 border-t border-[#30363D]">
        <div className="flex justify-between items-center"><h5 className="text-[11px] font-bold text-[#E6EDF3] uppercase">Plans</h5><Button variant="ghost" size="sm" onClick={handleAdd} className="h-7 text-[11px] text-[#2F81F7]"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Plan</Button></div>
        {plans.map((plan, i) => (
          <div key={i} className="p-4 bg-[#0D1117] rounded-md border border-[#30363D] space-y-3 relative group">
            <button onClick={() => handleRemove(i)} className="absolute -top-1 -right-1 bg-[#161B22] border border-[#30363D] rounded-md p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-[#f85149]" /></button>
            <div className="grid grid-cols-2 gap-3"><div><Label className="text-[11px] text-[#9DA7B3]">Name</Label><Input value={plan.name} onChange={(e) => handleUpdate(i, 'name', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div><div><Label className="text-[11px] text-[#9DA7B3]">Price</Label><Input value={plan.price} onChange={(e) => handleUpdate(i, 'price', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div></div>
            <div><Label className="text-[11px] text-[#9DA7B3]">Features (comma separated)</Label><Input value={plan.features} onChange={(e) => handleUpdate(i, 'features', e.target.value)} className="bg-[#161B22] border-[#30363D]" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionEditor({
  section,
  onChange,
}: Readonly<SectionEditorProps>) {
  const handleUpdate = (content: Record<string, string>) => {
    onChange(section.id, content);
  };

  return (
    <div className="space-y-6">
      {(() => {
        switch (section.type) {
          case 'hero':
            return <HeroEditor content={section.content} onUpdate={handleUpdate} />;
          case 'text':
            return <TextEditor content={section.content} onUpdate={handleUpdate} />;
          case 'image':
            return <ImageEditor content={section.content} onUpdate={handleUpdate} />;
          case 'gallery':
            return <GalleryEditor content={section.content} onUpdate={handleUpdate} />;
          case 'contact':
            return <ContactEditor content={section.content} onUpdate={handleUpdate} />;
          case 'spacer':
            return <SpacerEditor content={section.content} onUpdate={handleUpdate} />;
          case 'video':
            return <VideoEditor content={section.content} onUpdate={handleUpdate} />;
          case 'cta':
            return <CTAEditor content={section.content} onUpdate={handleUpdate} />;
          case 'features':
            return <FeaturesEditor content={section.content} onUpdate={handleUpdate} />;
          case 'testimonials':
            return <TestimonialsEditor content={section.content} onUpdate={handleUpdate} />;
          case 'pricing':
            return <PricingEditor content={section.content} onUpdate={handleUpdate} />;
          case 'faq':
            return <FAQEditor content={section.content} onUpdate={handleUpdate} />;
          case 'newsletter':
            return <NewsletterEditor content={section.content} onUpdate={handleUpdate} />;
          case 'team':
            return <TeamEditor content={section.content} onUpdate={handleUpdate} />;
          case 'stats':
            return <StatsEditor content={section.content} onUpdate={handleUpdate} />;
          case 'logos':
            return <LogosEditor content={section.content} onUpdate={handleUpdate} />;
          case 'blog':
            return <BlogEditor content={section.content} onUpdate={handleUpdate} />;
          case 'code':
            return <CodeEditor content={section.content} onUpdate={handleUpdate} />;
          case 'map':
            return <MapEditor content={section.content} onUpdate={handleUpdate} />;
          case 'countdown':
            return <CountdownEditor content={section.content} onUpdate={handleUpdate} />;
          case 'divider':
            return <DividerEditor content={section.content} onUpdate={handleUpdate} />;
          case 'social':
            return <SocialEditor content={section.content} onUpdate={handleUpdate} />;
          case 'accordion':
            return <AccordionEditor content={section.content} onUpdate={handleUpdate} />;
          case 'timeline':
            return <TimelineEditor content={section.content} onUpdate={handleUpdate} />;
          case 'compare':
            return <CompareEditor content={section.content} onUpdate={handleUpdate} />;
          default:
            return <div className="p-4 text-sm text-[#9DA7B3]">Editor not available for {section.type}</div>;
        }
      })()}
    </div>
  );
}
