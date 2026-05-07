import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import WaveMark from '../components/WaveMark';

export default function GetMark() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');
  const [showFrame, setShowFrame] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showText, setShowText] = useState(true);
  const [markX, setMarkX] = useState(50);
  const [markY, setMarkY] = useState(50);
  const [markScale, setMarkScale] = useState(50);
  const [markOpacity, setMarkOpacity] = useState(100);
  const [markRotation, setMarkRotation] = useState(0);
  const [format, setFormat] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [markColor, setMarkColor] = useState('#FFFFFF');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const location = useLocation();
  const isPhase2 = location.pathname.startsWith('/phase-2');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    console.log('Downloading wave mark...');
  };

  const handleShare = () => {
    console.log('Sharing wave mark...');
  };

  const canvasDimensions = {
    '1:1': { width: 520, height: 520 },
    '9:16': { width: 520, height: 925 },
    '16:9': { width: 700, height: 394 },
  };

  const currentDimensions = canvasDimensions[format];

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[#0D0D0D]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {isPhase2 && (
        <div className="w-full h-[44px] bg-[#0C0C0A] flex items-center justify-between px-[60px]">
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Africa Day — 25 May 2026
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '11px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Wear The Mark. Declare Your Wave. Pass It On.
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>
            #NotWaiting
          </div>
        </div>
      )}

      <div className="w-full h-[42px] bg-[#F6C14B] flex items-center justify-between px-[60px]">
        <WaveMark size={22} color="#0C0C0A" />
        <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 800, fontSize: '11px', color: '#0C0C0A', textTransform: 'uppercase' }}>
          Get The Wave Mark — #NotWaiting
        </div>
        <button
          onClick={() => navigate(isPhase2 ? '/phase-2' : '/home')}
          style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'rgba(12, 12, 10, 0.55)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Back to {isPhase2 ? 'Africa Day' : 'site'}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[240px] bg-[#1A1A1A] border-r border-[#2A2A2A] p-4 overflow-y-auto">
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>
            Photo
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-dashed border-[1.5px] border-[#3A3A3A] hover:border-[#F6C14B] p-3 mb-4 transition-colors flex flex-col items-center justify-center h-16"
          >
            {photo ? (
              <img src={photo} alt="Uploaded" className="w-full h-full object-cover" />
            ) : (
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#444' }}>
                Upload Photo
              </div>
            )}
          </button>

          <div className="border-t border-[#2A2A2A] pt-4 mb-4">
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>
              Details
            </div>

            <div className="mb-3">
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', display: 'block' }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[34px] bg-[#141414] border border-[#333] focus:border-[#F6C14B] outline-none px-3"
                style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#FFF' }}
              />
            </div>

            <div className="mb-3">
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', display: 'block' }}>
                City
              </label>
              <input
                type="text"
                placeholder="Your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-[34px] bg-[#141414] border border-[#333] focus:border-[#F6C14B] outline-none px-3"
                style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#FFF' }}
              />
            </div>

            <div className="mb-3">
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', display: 'block' }}>
                Role
              </label>
              <input
                type="text"
                placeholder="What you do"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-[34px] bg-[#141414] border border-[#333] focus:border-[#F6C14B] outline-none px-3"
                style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#FFF' }}
              />
            </div>
          </div>

          <div className="border-t border-[#2A2A2A] pt-4 mb-4">
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>
              Options
            </div>

            <div className="flex items-center gap-2 mb-3 h-7">
              <input
                type="checkbox"
                checked={showFrame}
                onChange={(e) => setShowFrame(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>Show Frame</span>
            </div>

            <div className="flex items-center gap-2 mb-3 h-7">
              <input
                type="checkbox"
                checked={showQR}
                onChange={(e) => setShowQR(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>Show QR</span>
            </div>

            <div className="flex items-center gap-2 mb-3 h-7">
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#888' }}>Show Text</span>
            </div>
          </div>

          <div className="border-t border-[#2A2A2A] pt-4 mb-4">
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>
              Adjust Mark
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'X', value: markX, setter: setMarkX },
                { label: 'Y', value: markY, setter: setMarkY },
                { label: 'Scale', value: markScale, setter: setMarkScale },
                { label: 'Opacity', value: markOpacity, setter: setMarkOpacity },
                { label: 'Rotation', value: markRotation, setter: setMarkRotation },
              ].map((slider) => (
                <div key={slider.label}>
                  <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
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
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>
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
                    borderColor: format === fmt ? '#F6C14B' : '#3A3A3A',
                    color: format === fmt ? '#F6C14B' : '#555',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#2A2A2A] pt-4">
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>
              Mark Color
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { color: '#FFFFFF', label: 'White' },
                { color: '#F6C14B', label: 'Gold' },
                { color: '#C7463A', label: 'Red' },
                { color: '#000000', label: 'Black' },
                { color: '#2F6F4E', label: 'Green' },
              ].map((swatch) => (
                <button
                  key={swatch.color}
                  onClick={() => setMarkColor(swatch.color)}
                  className="w-[22px] h-[22px] rounded-full transition-all"
                  style={{
                    backgroundColor: swatch.color,
                    outline: markColor === swatch.color ? '2px solid #FFF' : 'none',
                    outlineOffset: '2px',
                  }}
                  title={swatch.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-[#0D0D0D] p-10">
          <div
            className="relative bg-[#111] flex items-center justify-center"
            style={{
              width: currentDimensions.width,
              height: currentDimensions.height,
            }}
          >
            {photo ? (
              <img src={photo} alt="Canvas" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="text-[28px]" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>📤</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: 'rgba(255, 255, 255, 0.22)' }}>
                  Upload your photo
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: 'rgba(246, 193, 75, 0.6)' }}>
                  The wave mark will appear on your image
                </div>
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
                }}
              >
                <WaveMark size={120} color={markColor} />
              </div>
            )}
          </div>
        </div>

        <div className="w-[240px] bg-[#1A1A1A] border-l border-[#2A2A2A] p-4 overflow-y-auto">
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>
            Export
          </div>

          <div className="flex gap-2 mb-4">
            {(['1:1', '9:16', '16:9'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className="flex-1 h-9 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#333] transition-colors"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontWeight: 700,
                  fontSize: '10px',
                  color: format === fmt ? '#F6C14B' : '#777',
                }}
              >
                {fmt}
              </button>
            ))}
          </div>

          <button
            onClick={handleShare}
            className="w-full h-[42px] bg-[#C7463A] hover:bg-[#A83B30] mb-2 transition-colors"
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
            className="w-full h-[42px] bg-[#F6C14B] hover:bg-[#E8B33D] mb-4 transition-colors"
            style={{
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 700,
              fontSize: '12px',
              color: '#0C0C0A',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Download
          </button>

          <div className="border-t border-[#2A2A2A] pt-4">
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#F6C14B', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>
              Share On
            </div>

            <div className="flex flex-col gap-2">
              {['Instagram', 'TikTok', 'Copy Link'].map((platform) => (
                <button
                  key={platform}
                  className="h-[34px] border transition-colors"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '10px',
                    letterSpacing: '0.06em',
                    borderColor: platform === 'Instagram' ? '#E1306C' : platform === 'TikTok' ? '#000' : 'rgba(12, 12, 10, 0.2)',
                    color: platform === 'Instagram' ? '#E1306C' : platform === 'TikTok' ? '#000' : '#0C0C0A',
                  }}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
