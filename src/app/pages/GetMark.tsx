import { useState, useRef } from 'react';
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

export default function GetMark() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');
  const [selectedFrame, setSelectedFrame] = useState<string>(frame1_01);
  const [showFrame, setShowFrame] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showText, setShowText] = useState(true);

  // FIX: photoX and photoY are offsets in px (range -200 to 200), photoScale is 1.0–3.0
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

  const frames = [
    { id: 'frame1-01', src: frame1_01, name: 'Frame 1-01' },
    { id: 'frame1-02', src: frame1_02, name: 'Frame 1-02' },
    { id: 'frame1-03', src: frame1_03, name: 'Frame 1-03' },
    { id: 'frame2-01', src: frame2_01, name: 'Frame 2-01' },
    { id: 'frame2-02', src: frame2_02, name: 'Frame 2-02' },
    { id: 'frame2-03', src: frame2_03, name: 'Frame 2-03' },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setPhoto(event.target?.result as string);

        // Reset Adjust Photo sliders to defaults on every new upload
        setPhotoX(50);
        setPhotoY(50);
        setPhotoScale(1);

        // Reset Adjust Mark sliders to defaults on every new upload
        setMarkX(50);
        setMarkY(50);
        setMarkScale(50);
        setMarkOpacity(100);
        setMarkRotation(0);
      };

      reader.readAsDataURL(file);
    }
  };

  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    imageX = 50,
    imageY = 50,
    imageScale = 1
  ) => {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;

    let baseW = w;
    let baseH = h;

    if (imgRatio > canvasRatio) {
      baseH = h;
      baseW = baseH * imgRatio;
    } else {
      baseW = w;
      baseH = baseW / imgRatio;
    }

    const drawW = baseW * imageScale;
    const drawH = baseH * imageScale;

    // imageX/imageY are 0-100 representing position percentage
    const dx = x + (w - drawW) * (imageX / 100);
    const dy = y + (h - drawH) * (imageY / 100);

    ctx.drawImage(img, dx, dy, drawW, drawH);
  };

  const applyColorToMark = (
    sourceCanvas: HTMLCanvasElement,
    color: string
  ): HTMLCanvasElement => {
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

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = brightness;
    }

    ctx.putImageData(imageData, 0, 0);

    return output;
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const renderToCanvas = async (): Promise<HTMLCanvasElement> => {
    if (!photo) throw new Error('No photo');

    const scale = 2;
    const w = currentDimensions.width;
    const h = currentDimensions.height;

    const canvas = document.createElement('canvas');
    canvas.width  = w * scale;
    canvas.height = h * scale;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);

    const photoImg = await loadImage(photo);
    drawImageCover(ctx, photoImg, 0, 0, w, h, photoX, photoY, photoScale);

    if (showFrame) {
      try {
        const frameImg = await loadImage(selectedFrame);
        ctx.drawImage(frameImg, 0, 0, w, h);
      } catch {
        // Frame failed to load — continue without it
      }
    }

    try {
      const markImg = await loadImage(waveMarkSrc);
      const markSize = (markScale / 50) * 120;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width  = markSize;
      tempCanvas.height = markSize;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.drawImage(markImg, 0, 0, markSize, markSize);

      const colorized = applyColorToMark(tempCanvas, markColor);
      const mx       = (markX / 100) * w;
      const my       = (markY / 100) * h;
      const rotation = (markRotation / 100) * 360 * (Math.PI / 180);

      ctx.save();
      ctx.globalAlpha = markOpacity / 100;
      ctx.translate(mx, my);
      ctx.rotate(rotation);
      ctx.drawImage(colorized, -markSize / 2, -markSize / 2, markSize, markSize);
      ctx.restore();
    } catch {
      // Mark failed — continue without it
    }

    if (showText && (name || city || role)) {
      const pad  = 16;
      const boxH = 90;

      ctx.fillStyle = 'rgba(0,0,0,0.82)';
      ctx.fillRect(pad, h - boxH - pad, w - pad * 2, boxH);
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'top';

      if (name) {
        ctx.font      = 'bold 18px "Space Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(name, pad + 16, h - boxH - pad + 14);
      }
      if (city) {
        ctx.font      = '13px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.fillText(city, pad + 16, h - boxH - pad + 38);
      }
      if (role) {
        ctx.font      = '13px "Space Mono", monospace';
        ctx.fillStyle = '#dd3935';
        ctx.fillText(role.toUpperCase(), pad + 16, h - boxH - pad + 60);
      }
    }

    return canvas;
  };

  const handleDownload = async () => {
    if (!photo) {
      alert('Please upload a photo first');
      return;
    }

    try {
      const canvas = await renderToCanvas();

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');

          link.download = `notwaiting-wave-mark-${format}.png`;
          link.href = url;
          link.click();

          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleShare = async () => {
    if (!photo) {
      alert('Please upload a photo first');
      return;
    }

    try {
      const canvas = await renderToCanvas();

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `notwaiting-wave-mark-${format}.png`, {
            type: 'image/png',
          });

          if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: '#NotWaiting',
                text: 'I just joined #NotWaiting — the movement for African builders, creators, and innovators.',
              });
            } catch (err) {
              console.log('Share cancelled or failed:', err);
            }
          } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.download = `notwaiting-wave-mark-${format}.png`;
            link.href = url;
            link.click();

            URL.revokeObjectURL(url);
          }
        }
      }, 'image/png');
    } catch (error) {
      console.error('Share failed:', error);
      alert('Failed to share image. Please try again.');
    }
  };

  const handlePlatformShare = async (platform: string) => {
    if (!photo) {
      alert('Please upload a photo first');
      return;
    }

    const shareText = encodeURIComponent(
      'I just joined #NotWaiting — the movement for African builders, creators, and innovators. Africa is on a wave.'
    );
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
        try {
          await navigator.clipboard.writeText(window.location.origin);
          alert('Link copied to clipboard!');
        } catch {
          alert('Failed to copy link');
        }

        break;
    }
  };

  const canvasDimensions = {
    '1:1': { width: 520, height: 520 },
    '9:16': { width: 520, height: 925 },
    '16:9': { width: 700, height: 394 },
  };

  const currentDimensions = canvasDimensions[format];

  // Preview photo style: scale from center, pan with translateX/Y.
  // photoX/Y: 0-100 where 50=center. Pan range = ±50% of container at scale=1.
  // At higher zoom the pan range grows proportionally.
  const panX = (photoX - 50) * (photoScale - 0.5);
  const panY = (photoY - 50) * (photoScale - 0.5);
  const previewPhotoStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: `scale(${photoScale}) translateX(${panX}px) translateY(${panY}px)`,
    transformOrigin: 'center center',
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col overflow-hidden bg-white"
      style={{
        backgroundImage: `url(${bgwaveMark})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '540px auto',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-white/65 pointer-events-none" />

      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <div className="w-full h-[42px] bg-[#EBBD06] flex items-center justify-between px-[60px]">
          <WaveMark size={22} color="#0C0C0A" />

          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontWeight: 800,
              fontSize: '11px',
              color: '#0C0C0A',
              textTransform: 'uppercase',
            }}
          >
            Get The Mark — #NotWaiting
          </div>

          <button
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              color: 'rgba(12, 12, 10, 0.75)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ← Back to site
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-[240px] bg-white/95 border-r border-[#2A2A2A] p-4 overflow-y-auto">
            <div
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                color: '#dd3935',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '14px',
              }}
            >
              Photo
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-dashed border-[1.5px] border-[#3A3A3A] hover:border-[#dd3935] p-3 mb-4 transition-colors flex flex-col items-center justify-center h-16"
            >
              {photo ? (
                <img src={photo} alt="Uploaded" className="w-full h-full object-cover" />
              ) : (
                <div
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: '#444',
                  }}
                >
                  Upload Photo
                </div>
              )}
            </button>

            <div className="border-t border-[#2A2A2A] pt-4 mb-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#dd3935',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                Details
              </div>

              <div className="mb-3">
                <label
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '9px',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[34px] bg-[#f5f5f5] border border-[#333] focus:border-[#dd3935] outline-none px-3"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: '#0C0C0A',
                  }}
                />
              </div>

              <div className="mb-3">
                <label
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '9px',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  City
                </label>

                <input
                  type="text"
                  placeholder="Your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-[34px] bg-[#f5f5f5] border border-[#333] focus:border-[#dd3935] outline-none px-3"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: '#0C0C0A',
                  }}
                />
              </div>

              <div className="mb-3">
                <label
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '9px',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  Role
                </label>

                <input
                  type="text"
                  placeholder="What you do"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-[34px] bg-[#f5f5f5] border border-[#333] focus:border-[#dd3935] outline-none px-3"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    color: '#0C0C0A',
                  }}
                />
              </div>
            </div>

            <div className="border-t border-[#2A2A2A] pt-4 mb-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#dd3935',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                Frame Style
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame.src)}
                    className="relative aspect-square border-2 transition-all overflow-hidden"
                    style={{
                      borderColor: selectedFrame === frame.src ? '#dd3935' : '#3A3A3A',
                      backgroundColor: '#f5f5f5',
                    }}
                    title={frame.name}
                  >
                    <img src={frame.src} alt={frame.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#2A2A2A] pt-4 mb-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#dd3935',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                Options
              </div>

              <div className="flex items-center gap-2 mb-3 h-7">
                <input
                  type="checkbox"
                  checked={showFrame}
                  onChange={(e) => setShowFrame(e.target.checked)}
                  className="w-4 h-4"
                />

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#444' }}>
                  Show Frame
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 h-7">
                <input
                  type="checkbox"
                  checked={showQR}
                  onChange={(e) => setShowQR(e.target.checked)}
                  className="w-4 h-4"
                />

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#444' }}>
                  Show QR
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 h-7">
                <input
                  type="checkbox"
                  checked={showText}
                  onChange={(e) => setShowText(e.target.checked)}
                  className="w-4 h-4"
                />

                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#444' }}>
                  Show Text
                </span>
              </div>
            </div>

            <div className="border-t border-[#2A2A2A] pt-4 mb-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#dd3935',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                Adjust Photo
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Left/Right', value: photoX, setter: setPhotoX, min: 0, max: 100, step: 1 },
                  { label: 'UP/DOWN', value: photoY, setter: setPhotoY, min: 0, max: 100, step: 1 },
                  { label: 'Zoom', value: photoScale, setter: setPhotoScale, min: 1, max: 3, step: 0.01 },
                ].map((slider) => (
                  <div key={slider.label}>
                    <label
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '9px',
                        color: '#666',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {slider.label}
                    </label>

                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                      value={slider.value}
                      onChange={(e) => slider.setter(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#2A2A2A] pt-4 mb-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#dd3935',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                Adjust Mark
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Left/Right', value: markX, setter: setMarkX },
                  { label: 'UP/DOWN', value: markY, setter: setMarkY },
                  { label: 'Zoom', value: markScale, setter: setMarkScale },
                  { label: 'Opacity', value: markOpacity, setter: setMarkOpacity },
                  { label: 'Rotation', value: markRotation, setter: setMarkRotation },
                ].map((slider) => (
                  <div key={slider.label}>
                    <label
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '9px',
                        color: '#666',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {slider.label}
                    </label>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={slider.value}
                      onChange={(e) => slider.setter(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#2A2A2A] pt-4 mb-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#dd3935',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                Format
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['1:1', '9:16', '16:9'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className="h-9 border transition-colors"
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontWeight: 700,
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      borderColor: format === fmt ? '#dd3935' : '#3A3A3A',
                      color: format === fmt ? '#dd3935' : '#555',
                    }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#2A2A2A] pt-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#dd3935',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                Mark Color
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { color: '#FFFFFF', label: 'White' },
                  { color: '#DD3935', label: 'Red' },
                  { color: '#EBBD06', label: 'Gold' },
                  { color: '#027A4F', label: 'Green' },
                  { color: '#0C0C0A', label: 'Black' },
                ].map((swatch) => (
                  <button
                    key={swatch.color}
                    onClick={() => setMarkColor(swatch.color)}
                    className="w-[22px] h-[22px] rounded-full transition-all"
                    style={{
                      backgroundColor: swatch.color,
                      border: swatch.color === '#FFFFFF' ? '1px solid #333' : 'none',
                      outline: markColor === swatch.color ? '2px solid #DD3935' : 'none',
                      outlineOffset: '2px',
                    }}
                    title={swatch.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-transparent p-10">
            <div
              ref={canvasRef}
              className="relative bg-[#e0e0e0] flex items-center justify-center overflow-hidden"
              style={{
                width: currentDimensions.width,
                height: currentDimensions.height,
              }}
            >
              {photo ? (
                // FIX: Use objectPosition for pan (left/right, up/down) and width/height for zoom.
                // Centered with translate(-50%,-50%) so zoom grows from center.
                <img
                  src={photo}
                  alt="Canvas"
                  style={previewPhotoStyle}
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-[28px]" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
                    📤
                  </div>

                  <div
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '14px',
                      color: 'rgba(0, 0, 0, 0.35)',
                    }}
                  >
                    Upload your photo
                  </div>

                  <div
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '12px',
                      color: 'rgba(204, 0, 0, 0.5)',
                    }}
                  >
                    The wave mark will appear on your image
                  </div>
                </div>
              )}

              {photo && showFrame && (
                <img
                  src={selectedFrame}
                  alt="Frame overlay"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ zIndex: 10 }}
                />
              )}

              {photo && showText && (name || city || role) && (
                <div
                  className="absolute bottom-4 left-4 right-4 bg-black/80 p-4"
                  style={{ fontFamily: 'Space Mono, monospace', zIndex: 20 }}
                >
                  {name && <div className="text-white font-bold text-lg">{name}</div>}
                  {city && <div className="text-white/80 text-sm">{city}</div>}
                  {role && <div className="text-[#dd3935] text-sm uppercase">{role}</div>}
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
                  }}
                >
                  <WaveMark size={120} color={markColor} />
                </div>
              )}
            </div>
          </div>

          <div className="w-[240px] bg-white/95 border-l border-[#2A2A2A] p-4 overflow-y-auto">
            <div
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                color: '#dd3935',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: '14px',
              }}
            >
              Export
            </div>

            <div className="flex gap-2 mb-4">
              {(['1:1', '9:16', '16:9'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className="flex-1 h-9 bg-[#f5f5f5] hover:bg-[#e5e5e5] border border-[#333] transition-colors"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontWeight: 700,
                    fontSize: '10px',
                    color: format === fmt ? '#dd3935' : '#555',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <button
              onClick={handleShare}
              className="w-full h-[42px] bg-[#dd3935] hover:bg-[#AA0000] mb-2 transition-colors"
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Share
            </button>

            <button
              onClick={handleDownload}
              className="w-full h-[42px] bg-white hover:bg-[#f5f5f5] mb-4 transition-colors border border-[#dd3935]"
              style={{
                fontFamily: 'Helvetica Neue, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                color: '#dd3935',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Download
            </button>

            <div className="border-t border-[#2A2A2A] pt-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#dd3935',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: '14px',
                }}
              >
                Share On
              </div>

              <div className="flex flex-col gap-2">
                {['Instagram', 'Twitter/X', 'Copy Link'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformShare(platform)}
                    className="h-[34px] border border-[#333] hover:border-[#dd3935] transition-colors bg-[#f5f5f5]"
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.06em',
                      color: '#555',
                    }}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#2A2A2A] pt-4 mt-4">
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '9px',
                  color: '#666',
                  marginBottom: '8px',
                }}
              >
                <p className="text-xs leading-relaxed">
                  Upload your photo, customize the wave mark, and share your #NotWaiting moment with the world.
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