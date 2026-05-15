import { useState, useEffect, useRef } from 'react';
import { generateCaption } from '../utils/api';

interface Props {
  subject: string;   // passed from the form's existing "Who is this about?" field
  wave: string;      // passed from the form's existing "What's your wave?" field
  onComplete: (caption: string) => void;
  onCancel: () => void;
}

const QUESTIONS = [
  {
    question: 'What are you building, creating, or changing?',
    hint: 'Be specific — one clear sentence is enough.',
    placeholder: 'e.g. Building a fintech platform for smallholder farmers in West Africa',
  },
  {
    question: "What's the impact or vision behind it?",
    hint: 'Optional — what does success look like for you?',
    placeholder: 'e.g. Making financial services accessible to 10M people across Africa',
  },
];

export function AiStoryQuestionnaire({ subject, wave, onComplete, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [doing, setDoing] = useState('');
  const [impact, setImpact] = useState('');
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [step]);

  const transition = (nextStep: number) => {
    const dir = nextStep > step ? 'left' : 'right';
    setSlideDir(dir);
    setVisible(false);
    setTimeout(() => {
      setStep(nextStep);
      setVisible(true);
    }, 200);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const detail = [doing.trim(), impact.trim()].filter(Boolean).join('. ');
      const result = await generateCaption({
        waveTag: wave || 'other',
        subject: (subject || 'me') as 'me' | 'someone' | 'organisation',
        detail: detail || undefined,
      });
      setGenerated(result.caption);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="border-2 border-[#DD3935]/30 bg-white flex flex-col items-center justify-center gap-3 py-12">
        <div className="w-5 h-5 border-2 border-[#DD3935] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-[#DD3935]">Crafting your story…</p>
      </div>
    );
  }

  // ── Generated result ──
  if (generated) {
    return (
      <div className="border-2 border-[#DD3935] bg-white" style={{ animation: 'fadeSlideIn 0.35s ease forwards' }}>
        <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div className="px-5 pt-4 pb-2 border-b border-[#f0f0f0] flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#DD3935] font-bold">AI Generated Story</span>
          <button onClick={() => setGenerated('')} className="text-[10px] font-mono uppercase text-gray-400 hover:text-gray-600 transition-colors">
            ← Edit answers
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed text-[#0C0C0A] mb-5 border-l-2 border-[#DD3935] pl-3">{generated}</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onComplete(generated)}
              className="px-4 py-2 bg-[#DD3935] text-white text-xs font-mono uppercase tracking-wide hover:bg-[#C92F2B] transition-colors"
            >
              Use this story →
            </button>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 border-2 border-[#0C0C0A] text-xs font-mono uppercase tracking-wide hover:bg-[#f5f5f5] transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wide text-gray-400 hover:text-gray-600 transition-colors"
            >
              Write myself
            </button>
          </div>
          {error && <p className="text-[#DD3935] text-xs mt-3 font-mono">{error}</p>}
        </div>
      </div>
    );
  }

  // ── Carousel ──
  const slideStyle: React.CSSProperties = {
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : slideDir === 'left' ? 'translateX(-16px)' : 'translateX(16px)',
  };

  return (
    <div className="border-2 border-[#0C0C0A] bg-white overflow-hidden">
      {/* Progress bar */}
      <div className="h-[3px] bg-[#f0f0f0]">
        <div className="h-full bg-[#DD3935] transition-all duration-300" style={{ width: step === 0 ? '50%' : '100%' }} />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1.5 items-center">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-5 bg-[#DD3935]' : i < step ? 'w-1.5 bg-[#DD3935]/40' : 'w-1.5 bg-[#e0e0e0]'
                }`}
              />
            ))}
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-2">
              {step + 1} of 2
            </span>
          </div>
          <button
            onClick={onCancel}
            className="text-[10px] font-mono uppercase tracking-wide text-gray-400 hover:text-gray-600 transition-colors"
          >
            Write myself ×
          </button>
        </div>

        {/* Animated card */}
        <div style={slideStyle}>
          <p className="text-sm font-black uppercase tracking-tight mb-0.5">{QUESTIONS[step].question}</p>
          <p className="text-[11px] text-gray-400 font-mono mb-3">{QUESTIONS[step].hint}</p>

          <textarea
            ref={textareaRef}
            rows={4}
            maxLength={120}
            value={step === 0 ? doing : impact}
            onChange={(e) => step === 0 ? setDoing(e.target.value) : setImpact(e.target.value)}
            placeholder={QUESTIONS[step].placeholder}
            className="w-full border-2 border-[#0C0C0A] focus:border-[#DD3935] outline-none p-3 resize-none text-sm font-mono bg-[#f9f9f9] focus:bg-white transition-colors"
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || e.shiftKey) return;
              e.preventDefault();
              if (step === 0 && doing.trim()) transition(1);
              else if (step === 1) handleGenerate();
            }}
          />
          <p className="text-[10px] text-gray-400 text-right mt-1 font-mono">
            {(step === 0 ? doing : impact).length}/120{step === 1 ? ' · optional' : ''}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => transition(0)}
            className={`text-xs font-mono uppercase tracking-wide text-gray-400 hover:text-gray-700 transition-all ${step === 0 ? 'invisible' : ''}`}
          >
            ← Back
          </button>

          {step === 0 ? (
            <button
              onClick={() => transition(1)}
              disabled={!doing.trim()}
              className="px-5 py-2 bg-[#0C0C0A] text-white text-xs font-mono uppercase tracking-wide hover:bg-[#DD3935] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="px-5 py-2 bg-[#DD3935] text-white text-xs font-mono uppercase tracking-wide hover:bg-[#C92F2B] transition-colors flex items-center gap-2"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate story
            </button>
          )}
        </div>

        {error && <p className="text-[#DD3935] text-xs mt-3 font-mono">{error}</p>}
      </div>
    </div>
  );
}
