import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import WaveMark from '../components/WaveMark';
import { ScrollToTop } from '../components/ScrollToTop';
import frame1_01 from '../../imports/NotWaiting_Frame1-01.png';
import frame1_02 from '../../imports/NotWaiting_Frame1-02.png';
import frame1_03 from '../../imports/NotWaiting_Frame1-03.png';
import frame2_01 from '../../imports/NotWaiting_Frame2-01.png';
import frame2_02 from '../../imports/NotWaiting_Frame2-02.png';
import frame2_03 from '../../imports/NotWaiting_Frame2-03.png';
import waveMarkSrc from '../../imports/mark.png';
import bgwaveMark from '../../imports/PATTERN2.png';

const MONO: React.CSSProperties = { fontFamily: 'Space Mono, monospace' };

function SectionHeader({ step, label }: { step?: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {step && (
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#DD3935] text-white flex-shrink-0"
          style={{ ...MONO, fontSize: '9px', fontWeight: 900 }}
        >
          {step}
        </span>
      )}
      <span style={{ ...MONO, fontSize: '10px', color: '#DD3935', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>
        {label}
      </span>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center justify-between w-full py-1.5 group">
      <span style={{ ...MONO, fontSize: '11px', color: '#444' }}>{label}</span>
      <div className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-[#DD3935]' : 'bg-[#ddd]'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
    </button>
  );
}

function SliderRow({ label, value, onChange, min = 0, max = 100, step = 1 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <label style={{ ...MONO, fontSize: '10px', color: '#666', textTransform: 'uppercase' as const }}>{label}</label>
        <span style={{ ...MONO, fontSize: '10px', color: '#999' }}>{typeof value === 'number' && step < 1 ? value.toFixed(1) : Math.round(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-[#e0e0e0] rounded-full outline-none cursor-pointer accent-[#DD3935]"
      />
    </div>
  );
}

function FieldInput({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <label style={{ ...MONO, fontSize: '10px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: '5px' }}>
        {label}
      </label>
      <input
        type="text" placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 bg-[#f5f5f5] border border-[#e0e0e0] focus:border-[#DD3935] outline-none px-3 transition-colors"
        style={{ ...MONO, fontSize: '11px', color: '#0C0C0A' }}
      />
    </div>
  );
}

export default function GetMark() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');
  const [selectedFrame, setSelectedFrame] = useState<string>(frame1_01);
  const [showFrame, setShowFrame] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showText, setShowText] = useState(true);
  const [photoX, setPhotoX] = useState(50);
  const [photoY, setPhotoY] = useState(50);
  const [photoScale, setPhotoScale] = useState(1);
  const [markX, setMarkX] = useState(50);
  const [markY, setMarkY] = useState(50);
  const [markScale, setMarkScale] = useState(50);
  const [markOpacity, setMarkOpacity] = useState(100);
  const [markRotation, setMarkRotation] = useState(0);
  const [format, setFormat] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [markColor, setMarkColor] = useState('#DD3935');
  const [isDragging, setIsDragging] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const frames = [
    { id: 'frame1-01', src: frame1_01, name: 'Frame 1' },
    { id: 'frame1-02', src: frame1_02, name: 'Frame 2' },
    { id: 'frame1-03', src: frame1_03, name: 'Frame 3' },
    { id: 'frame2-01', src: frame2_01, name: 'Frame 4' },
    { id: 'frame2-02', src: frame2_02, name: 'Frame 5' },
    { id: 'frame2-03', src: frame2_03, name: 'Frame 6' },
  ];

  const markColors = [
    { color: '#FFFFFF', label: 'White' },
    { color: '#DD3935', label: 'Red' },
    { color: '#EBBD06', label: 'Gold' },
    { color: '#027A4F', label: 'Green' },
    { color: '#0C0C0A', label: 'Black' },
  ];

  const [activeDrag, setActiveDrag] = useState<'photo' | 'mark' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Stores everything needed by the global mousemove handler without stale closures
  const dragState = useRef<{
    type: 'photo' | 'mark';
    startMouseX: number;
    startMouseY: number;
    startPhotoX: number;
    startPhotoY: number;
    photoScale: number;
    markClickOffsetX: number;
    markClickOffsetY: number;
    canvasRect: DOMRect;
  } | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const s = dragState.current;
      if (!s) return;
      const { canvasRect } = s;

      if (s.type === 'photo') {
        const dx = e.clientX - s.startMouseX;
        const dy = e.clientY - s.startMouseY;
        // 1 px mouse = 1 px visual movement, adjusted for zoom
        const sens = 1 / Math.max(s.photoScale - 0.5, 0.5);
        setPhotoX(Math.max(0, Math.min(100, s.startPhotoX + dx * sens)));
        setPhotoY(Math.max(0, Math.min(100, s.startPhotoY + dy * sens)));
      } else {
        // Mark follows mouse, offset-corrected so it doesn't jump on grab
        const rawX = ((e.clientX - s.markClickOffsetX - canvasRect.left) / canvasRect.width) * 100;
        const rawY = ((e.clientY - s.markClickOffsetY - canvasRect.top) / canvasRect.height) * 100;
        setMarkX(Math.max(0, Math.min(100, rawX)));
        setMarkY(Math.max(0, Math.min(100, rawY)));
      }
    };

    const onMouseUp = () => {
      dragState.current = null;
      setActiveDrag(null);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target?.result as string);
      setPhotoX(50); setPhotoY(50); setPhotoScale(1);
      setMarkX(50); setMarkY(50); setMarkScale(50);
      setMarkOpacity(100); setMarkRotation(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number, y: number, w: number, h: number,
    imageX = 50, imageY = 50, imageScale = 1
  ) => {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let baseW = w, baseH = h;
    if (imgRatio > canvasRatio) { baseH = h; baseW = baseH * imgRatio; }
    else { baseW = w; baseH = baseW / imgRatio; }
    const drawW = baseW * imageScale;
    const drawH = baseH * imageScale;
    const dx = x + (w - drawW) * (imageX / 100);
    const dy = y + (h - drawH) * (imageY / 100);
    ctx.drawImage(img, dx, dy, drawW, drawH);
  };

  const applyColorToMark = (sourceCanvas: HTMLCanvasElement, color: string): HTMLCanvasElement => {
    const output = document.createElement('canvas');
    output.width = sourceCanvas.width;
    output.height = sourceCanvas.height;
    const ctx = output.getContext('2d')!;
    ctx.drawImage(sourceCanvas, 0, 0);
    const imageData = ctx.getImageData(0, 0, output.width, output.height);
    const data = imageData.data;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    for (let i = 0; i < data.length; i += 4) {
      const brightness = data[i];
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = brightness;
    }
    ctx.putImageData(imageData, 0, 0);
    return output;
  };

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const renderToCanvas = async (): Promise<HTMLCanvasElement> => {
    if (!photo) throw new Error('No photo');
    const scale = 2;
    const { width: w, height: h } = currentDimensions;
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);
    const photoImg = await loadImage(photo);
    drawImageCover(ctx, photoImg, 0, 0, w, h, photoX, photoY, photoScale);
    if (showFrame) {
      try { const frameImg = await loadImage(selectedFrame); ctx.drawImage(frameImg, 0, 0, w, h); } catch {}
    }
    try {
      const markImg = await loadImage(waveMarkSrc);
      const markSize = (markScale / 50) * 120;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = markSize; tempCanvas.height = markSize;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.drawImage(markImg, 0, 0, markSize, markSize);
      const colorized = applyColorToMark(tempCanvas, markColor);
      const mx = (markX / 100) * w;
      const my = (markY / 100) * h;
      const rotation = (markRotation / 100) * 360 * (Math.PI / 180);
      ctx.save();
      ctx.globalAlpha = markOpacity / 100;
      ctx.translate(mx, my);
      ctx.rotate(rotation);
      ctx.drawImage(colorized, -markSize / 2, -markSize / 2, markSize, markSize);
      ctx.restore();
    } catch {}
    if (showText && (name || city || role)) {
      const pad = 16, boxH = 90;
      ctx.fillStyle = 'rgba(0,0,0,0.82)';
      ctx.fillRect(pad, h - boxH - pad, w - pad * 2, boxH);
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      if (name) { ctx.font = 'bold 18px "Space Mono", monospace'; ctx.fillStyle = '#ffffff'; ctx.fillText(name, pad + 16, h - boxH - pad + 14); }
      if (city) { ctx.font = '13px "Space Mono", monospace'; ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillText(city, pad + 16, h - boxH - pad + 38); }
      if (role) { ctx.font = '13px "Space Mono", monospace'; ctx.fillStyle = '#dd3935'; ctx.fillText(role.toUpperCase(), pad + 16, h - boxH - pad + 60); }
    }
    return canvas;
  };

  const handleDownload = async () => {
    if (!photo) { alert('Please upload a photo first'); return; }
    try {
      const canvas = await renderToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `notwaiting-wave-mark-${format}.png`;
          link.href = url; link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch { alert('Failed to download image. Please try again.'); }
  };

  const handleShare = async () => {
    if (!photo) { alert('Please upload a photo first'); return; }
    try {
      const canvas = await renderToCanvas();
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `notwaiting-wave-mark-${format}.png`, { type: 'image/png' });
          if (navigator.share && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: '#NotWaiting', text: 'I just joined #NotWaiting — the movement for African builders, creators, and innovators.' }); }
            catch {}
          } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `notwaiting-wave-mark-${format}.png`;
            link.href = url; link.click();
            URL.revokeObjectURL(url);
          }
        }
      }, 'image/png');
    } catch { alert('Failed to share image. Please try again.'); }
  };

  const handlePlatformShare = async (platform: string) => {
    if (!photo) { alert('Please upload a photo first'); return; }
    const shareText = encodeURIComponent('I just joined #NotWaiting — the movement for African builders, creators, and innovators. Africa is on a wave.');
    const shareUrl = encodeURIComponent(window.location.origin);
    switch (platform) {
      case 'Instagram':
        await handleDownload();
        alert('Image downloaded! Open Instagram and upload the image from your downloads.');
        break;
      case 'Twitter/X':
        window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank');
        break;
      case 'Copy Link':
        try { await navigator.clipboard.writeText(window.location.origin); alert('Link copied!'); }
        catch { alert('Failed to copy link'); }
        break;
    }
  };

  const canvasDimensions = {
    '1:1':  { width: 520, height: 520 },
    '9:16': { width: 390, height: 693 },
    '16:9': { width: 693, height: 390 },
  };
  const currentDimensions = canvasDimensions[format];

  const panX = (photoX - 50) * (photoScale - 0.5);
  const panY = (photoY - 50) * (photoScale - 0.5);
  const previewPhotoStyle: React.CSSProperties = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover',
    transform: `scale(${photoScale}) translateX(${panX}px) translateY(${panY}px)`,
    transformOrigin: 'center center',
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col overflow-hidden bg-white"
      style={{ backgroundImage: `url(${bgwaveMark})`, backgroundRepeat: 'repeat', backgroundSize: '540px auto', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-white/65 pointer-events-none" />

      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

        {/* Top bar */}
        <div className="w-full h-[46px] bg-[#EBBD06] flex items-center justify-between px-6 flex-shrink-0 border-b border-[#d4a900]">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <span style={{ ...MONO, fontSize: '10px', color: '#0C0C0A' }}>← Back to site</span>
          </button>
          <div className="flex items-center gap-2">
            <WaveMark size={18} color="#0C0C0A" />
            <span style={{ ...MONO, fontWeight: 800, fontSize: '11px', color: '#0C0C0A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Get The Mark — #NotWaiting
            </span>
          </div>
          <div className="w-24" />
        </div>

        <div className="flex-1 flex overflow-hidden">

          {/* ── LEFT PANEL ── */}
          <div className="w-[272px] flex-shrink-0 bg-white/95 border-r border-[#e8e8e8] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

              {/* 01 Upload */}
              <section>
                <SectionHeader step="01" label="Upload Photo" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`w-full border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${
                    isDragging
                      ? 'border-[#DD3935] bg-[#fff5f5]'
                      : photo
                      ? 'border-[#DD3935]/40 hover:border-[#DD3935]'
                      : 'border-[#ccc] hover:border-[#DD3935] hover:bg-[#fff5f5]'
                  }`}
                  style={{ height: photo ? '120px' : '110px' }}
                >
                  {photo ? (
                    <div className="relative w-full h-full group">
                      <img src={photo} alt="Uploaded" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span style={{ ...MONO, fontSize: '10px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span style={{ ...MONO, fontSize: '11px', color: '#999' }}>Click or drag a photo here</span>
                    </div>
                  )}
                </button>
              </section>

              {/* Divider */}
              <div className="border-t border-[#f0f0f0]" />

              {/* 02 Frame & Color */}
              <section>
                <SectionHeader step="02" label="Frame & Mark Color" />
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  {frames.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setSelectedFrame(frame.src)}
                      className="relative aspect-square border-2 overflow-hidden transition-all"
                      style={{ borderColor: selectedFrame === frame.src ? '#DD3935' : '#e0e0e0', borderRadius: '2px' }}
                      title={frame.name}
                    >
                      <img src={frame.src} alt={frame.name} className="w-full h-full object-cover" />
                      {selectedFrame === frame.src && (
                        <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-[#DD3935] rounded-full flex items-center justify-center">
                          <svg width="7" height="7" viewBox="0 0 10 10" fill="white"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div>
                  <label style={{ ...MONO, fontSize: '10px', color: '#666', textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                    Mark Color
                  </label>
                  <div className="flex gap-2">
                    {markColors.map((swatch) => (
                      <button
                        key={swatch.color}
                        onClick={() => setMarkColor(swatch.color)}
                        className="w-7 h-7 rounded-full transition-all"
                        style={{
                          backgroundColor: swatch.color,
                          border: swatch.color === '#FFFFFF' ? '1.5px solid #ccc' : '1.5px solid transparent',
                          outline: markColor === swatch.color ? '2.5px solid #DD3935' : 'none',
                          outlineOffset: '2px',
                        }}
                        title={swatch.label}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Divider */}
              <div className="border-t border-[#f0f0f0]" />

              {/* 03 Your Details */}
              <section>
                <SectionHeader step="03" label="Your Details" />
                <FieldInput label="Name" placeholder="Your name" value={name} onChange={setName} />
                <FieldInput label="City" placeholder="Your city" value={city} onChange={setCity} />
                <FieldInput label="Role" placeholder="What you do" value={role} onChange={setRole} />
              </section>

              {/* Divider */}
              <div className="border-t border-[#f0f0f0]" />

              {/* Advanced (collapsible) */}
              <section>
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="flex items-center justify-between w-full group"
                >
                  <span style={{ ...MONO, fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                    Advanced Settings
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className={`transition-transform text-[#999] ${advancedOpen ? 'rotate-180' : ''}`}
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  >
                    <path d="M3 5l4 4 4-4" />
                  </svg>
                </button>

                {advancedOpen && (
                  <div className="mt-4 space-y-4">
                    {/* Visibility toggles */}
                    <div>
                      <label style={{ ...MONO, fontSize: '10px', color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                        Visibility
                      </label>
                      <Toggle checked={showFrame} onChange={setShowFrame} label="Show Frame" />
                      <Toggle checked={showText} onChange={setShowText} label="Show Name & Details" />
                      <Toggle checked={showQR} onChange={setShowQR} label="Show QR Code" />
                    </div>

                    <div className="border-t border-[#f0f0f0] pt-4">
                      <label style={{ ...MONO, fontSize: '10px', color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                        Adjust Photo
                      </label>
                      <SliderRow label="Horizontal" value={photoX} onChange={setPhotoX} />
                      <SliderRow label="Vertical" value={photoY} onChange={setPhotoY} />
                      <SliderRow label="Zoom" value={photoScale} onChange={setPhotoScale} min={1} max={3} step={0.01} />
                    </div>

                    <div className="border-t border-[#f0f0f0] pt-4">
                      <label style={{ ...MONO, fontSize: '10px', color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                        Adjust Mark
                      </label>
                      <SliderRow label="Horizontal" value={markX} onChange={setMarkX} />
                      <SliderRow label="Vertical" value={markY} onChange={setMarkY} />
                      <SliderRow label="Size" value={markScale} onChange={setMarkScale} />
                      <SliderRow label="Opacity" value={markOpacity} onChange={setMarkOpacity} />
                      <SliderRow label="Rotation" value={markRotation} onChange={setMarkRotation} />
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* ── CENTER CANVAS ── */}
          <div className="flex-1 flex flex-col items-center justify-center bg-transparent p-8 overflow-auto">
            <div
              ref={canvasRef}
              className="relative bg-[#e8e8e8] flex items-center justify-center overflow-hidden shadow-2xl"
              style={{
                width: currentDimensions.width,
                height: currentDimensions.height,
                flexShrink: 0,
                cursor: activeDrag === 'photo' ? 'grabbing' : photo ? 'grab' : 'default',
              }}
              onMouseDown={(e) => {
                if (!photo || !canvasRef.current) return;
                e.preventDefault();
                dragState.current = {
                  type: 'photo',
                  startMouseX: e.clientX,
                  startMouseY: e.clientY,
                  startPhotoX: photoX,
                  startPhotoY: photoY,
                  photoScale,
                  markClickOffsetX: 0,
                  markClickOffsetY: 0,
                  canvasRect: canvasRef.current.getBoundingClientRect(),
                };
                setActiveDrag('photo');
              }}
            >
              {photo ? (
                <img src={photo} alt="Canvas" style={{ ...previewPhotoStyle, pointerEvents: 'none' }} />
              ) : (
                <div className="flex flex-col items-center gap-3 select-none">
                  <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <div style={{ ...MONO, fontSize: '13px', color: 'rgba(0,0,0,0.3)', textAlign: 'center' }}>
                    Upload a photo to get started
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 px-5 py-2 bg-[#DD3935] text-white hover:bg-[#C92F2B] transition-colors"
                    style={{ ...MONO, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                  >
                    Upload Photo
                  </button>
                </div>
              )}

              {photo && showFrame && (
                <img src={selectedFrame} alt="Frame" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ zIndex: 10 }} />
              )}

              {photo && showText && (name || city || role) && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 p-4 pointer-events-none" style={{ fontFamily: 'Space Mono, monospace', zIndex: 20 }}>
                  {name && <div className="text-white font-bold text-lg">{name}</div>}
                  {city && <div className="text-white/75 text-sm">{city}</div>}
                  {role && <div className="text-[#DD3935] text-sm uppercase">{role}</div>}
                </div>
              )}

              {photo && (
                <div
                  className="absolute"
                  style={{
                    left: `${markX}%`,
                    top: `${markY}%`,
                    transform: `translate(-50%, -50%) scale(${markScale / 50}) rotate(${(markRotation / 100) * 360}deg)`,
                    opacity: markOpacity / 100,
                    zIndex: 30,
                    cursor: activeDrag === 'mark' ? 'grabbing' : 'grab',
                  }}
                  onMouseDown={(e) => {
                    if (!canvasRef.current) return;
                    e.preventDefault();
                    e.stopPropagation(); // prevent canvas photo-drag from firing
                    const rect = e.currentTarget.getBoundingClientRect();
                    const canvasRect = canvasRef.current.getBoundingClientRect();
                    dragState.current = {
                      type: 'mark',
                      startMouseX: e.clientX,
                      startMouseY: e.clientY,
                      startPhotoX: photoX,
                      startPhotoY: photoY,
                      photoScale,
                      // offset of click within the mark's visual center so it doesn't jump
                      markClickOffsetX: e.clientX - (rect.left + rect.width / 2),
                      markClickOffsetY: e.clientY - (rect.top + rect.height / 2),
                      canvasRect,
                    };
                    setActiveDrag('mark');
                  }}
                >
                  <WaveMark size={120} color={markColor} />
                </div>
              )}
            </div>

            {/* Format picker below canvas */}
            <div className="flex gap-1.5 mt-5">
              {(['1:1', '9:16', '16:9'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className="px-4 h-8 border transition-all"
                  style={{
                    ...MONO, fontSize: '10px', fontWeight: 700,
                    borderColor: format === fmt ? '#DD3935' : '#ccc',
                    color: format === fmt ? '#DD3935' : '#888',
                    background: format === fmt ? '#fff5f5' : 'white',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="w-[220px] flex-shrink-0 bg-white/95 border-l border-[#e8e8e8] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

              {/* Primary actions */}
              <section>
                <SectionHeader label="Export" />
                <button
                  onClick={handleShare}
                  className="w-full h-11 bg-[#DD3935] hover:bg-[#C92F2B] text-white transition-colors mb-2 flex items-center justify-center gap-2"
                  style={{ ...MONO, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full h-11 bg-white hover:bg-[#fff5f5] border border-[#DD3935] transition-colors flex items-center justify-center gap-2"
                  style={{ ...MONO, fontWeight: 700, fontSize: '11px', color: '#DD3935', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DD3935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download
                </button>
              </section>

              <div className="border-t border-[#f0f0f0]" />

              {/* Platform share */}
              <section>
                <SectionHeader label="Share On" />
                <div className="flex flex-col gap-2">
                  {[
                    { platform: 'Instagram', icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                      </svg>
                    )},
                    { platform: 'Twitter / X', icon: (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )},
                    { platform: 'Copy Link', icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    )},
                  ].map(({ platform, icon }) => (
                    <button
                      key={platform}
                      onClick={() => handlePlatformShare(platform === 'Twitter / X' ? 'Twitter/X' : platform)}
                      className="h-9 border border-[#e0e0e0] hover:border-[#DD3935] hover:text-[#DD3935] bg-white transition-all flex items-center justify-center gap-2 text-[#555]"
                      style={{ ...MONO, fontSize: '10px', letterSpacing: '0.04em' }}
                    >
                      {icon}
                      {platform}
                    </button>
                  ))}
                </div>
              </section>

              {/* Bottom hint */}
              <div className="mt-auto pt-4 border-t border-[#f0f0f0]">
                <p style={{ ...MONO, fontSize: '10px', color: '#bbb', lineHeight: '1.6' }}>
                  Upload your photo, customize the wave mark, and share your #NotWaiting moment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ScrollToTop />
      </div>
    </div>
  );
}
