import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import type { Language } from '../layouts/Root';
// import { useNavigate } from 'react-router';
// import { QrCode, Copy } from 'lucide-react';
// import { Button } from '../components/Button';
// import { Input } from '../components/Input';
// import { Select } from '../components/Select';
// import { Textarea } from '../components/Textarea';
// import { ShareCard } from '../components/ShareCard';
// import { CadenceCard } from '../components/CadenceCard';
// import { Counter } from '../components/Counter';
// import { Ticker } from '../components/Ticker';
// import { copyToClipboard } from '../utils/clipboard';
// import { signManifesto, generateCaption, publishStory, trackAction } from '../utils/api';
// import waveMarkExample from '../../imports/image-2.png';
// import heroImage from '../../imports/Untitled_design_(6).png';
// import heroImage2 from '../../imports/image-4.png';
// import waveImage from '../../imports/waves.png';
// import patternBg from '../../imports/PATTERN2.png';
// import patternBg2 from '../../imports/PATTERN_1-1.png';
// import heroShapes from '../../imports/web_template.png';
import slide1 from '../../styles/slide-1.webp';
import slide2 from '../../styles/slide-2.jpeg';
import slide3 from '../../styles/slide-3.jpeg';
import slide4 from '../../styles/slide-4.webp';
import slide5 from '../../styles/slide-5.jpeg';
import slide6 from '../../styles/slide-6.jpeg';

// desktop = landscape image, mobile = portrait image. One set for all languages.
// Date text is rendered in code and switches EN/FR via language toggle.
const SLIDE_MANIFEST = [
  { desktop: slide1, mobile: slide4, unlocksOn: null },
  { desktop: slide2, mobile: slide5, unlocksOn: '2026-05-15' },
  { desktop: slide3, mobile: slide6, unlocksOn: '2026-05-18' },
];

// Client-side fallback — mirrors what the backend endpoint computes.
// Returns manifest indices sorted latest-unlocked first.
function getActiveSlidesLocal(): number[] {
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  return SLIDE_MANIFEST
    .map((s, i) => ({ i, unlocksOn: s.unlocksOn }))
    .filter(({ unlocksOn }) => !unlocksOn || unlocksOn <= today)
    .map(({ i }) => i)
    .reverse(); // newest unlocked → index 0
}

// const africanCountries = [
//   { value: '', label: 'Select country' },
//   { value: 'algeria', label: 'Algeria' },
//   { value: 'angola', label: 'Angola' },
//   { value: 'benin', label: 'Benin' },
//   { value: 'botswana', label: 'Botswana' },
//   { value: 'burkina-faso', label: 'Burkina Faso' },
//   { value: 'burundi', label: 'Burundi' },
//   { value: 'cabo-verde', label: 'Cabo Verde' },
//   { value: 'cameroon', label: 'Cameroon' },
//   { value: 'central-african-republic', label: 'Central African Republic' },
//   { value: 'chad', label: 'Chad' },
//   { value: 'comoros', label: 'Comoros' },
//   { value: 'congo-brazzaville', label: 'Congo (Brazzaville)' },
//   { value: 'congo-kinshasa', label: 'Congo (Kinshasa)' },
//   { value: 'cote-divoire', label: "Côte d'Ivoire" },
//   { value: 'djibouti', label: 'Djibouti' },
//   { value: 'egypt', label: 'Egypt' },
//   { value: 'equatorial-guinea', label: 'Equatorial Guinea' },
//   { value: 'eritrea', label: 'Eritrea' },
//   { value: 'eswatini', label: 'Eswatini' },
//   { value: 'ethiopia', label: 'Ethiopia' },
//   { value: 'gabon', label: 'Gabon' },
//   { value: 'gambia', label: 'Gambia' },
//   { value: 'ghana', label: 'Ghana' },
//   { value: 'guinea', label: 'Guinea' },
//   { value: 'guinea-bissau', label: 'Guinea-Bissau' },
//   { value: 'kenya', label: 'Kenya' },
//   { value: 'lesotho', label: 'Lesotho' },
//   { value: 'liberia', label: 'Liberia' },
//   { value: 'libya', label: 'Libya' },
//   { value: 'madagascar', label: 'Madagascar' },
//   { value: 'malawi', label: 'Malawi' },
//   { value: 'mali', label: 'Mali' },
//   { value: 'mauritania', label: 'Mauritania' },
//   { value: 'mauritius', label: 'Mauritius' },
//   { value: 'morocco', label: 'Morocco' },
//   { value: 'mozambique', label: 'Mozambique' },
//   { value: 'namibia', label: 'Namibia' },
//   { value: 'niger', label: 'Niger' },
//   { value: 'nigeria', label: 'Nigeria' },
//   { value: 'rwanda', label: 'Rwanda' },
//   { value: 'sao-tome-and-principe', label: 'São Tomé and Príncipe' },
//   { value: 'senegal', label: 'Senegal' },
//   { value: 'seychelles', label: 'Seychelles' },
//   { value: 'sierra-leone', label: 'Sierra Leone' },
//   { value: 'somalia', label: 'Somalia' },
//   { value: 'south-africa', label: 'South Africa' },
//   { value: 'south-sudan', label: 'South Sudan' },
//   { value: 'sudan', label: 'Sudan' },
//   { value: 'tanzania', label: 'Tanzania' },
//   { value: 'togo', label: 'Togo' },
//   { value: 'tunisia', label: 'Tunisia' },
//   { value: 'uganda', label: 'Uganda' },
//   { value: 'western-sahara', label: 'Western Sahara' },
//   { value: 'zambia', label: 'Zambia' },
//   { value: 'zimbabwe', label: 'Zimbabwe' },
//   { value: 'diaspora', label: 'African Diaspora' },
//   { value: 'global', label: 'Global Supporter' }
// ];

// const aiSectorOptions = [
//   { value: '', label: 'Select sector' },
//   { value: 'fintech', label: 'Fintech' },
//   { value: 'agriculture', label: 'Agriculture' },
//   { value: 'music', label: 'Music' },
//   { value: 'health', label: 'Health' },
//   { value: 'tech', label: 'Tech' },
//   { value: 'education', label: 'Education' },
//   { value: 'climate', label: 'Climate' },
//   { value: 'media', label: 'Media' },
//   { value: 'fashion', label: 'Fashion' },
//   { value: 'sports', label: 'Sports' },
//   { value: 'film', label: 'Film' },
//   { value: 'policy', label: 'Policy' },
//   { value: 'other', label: 'Other' },
// ];

// const sectors = [
//   'fintech',
//   'agriculture',
//   'music',
//   'health',
//   'tech',
//   'education',
//   'climate',
//   'media',
//   'fashion',
//   'sports',
//   'film',
//   'policy'
// ];

export default function Home() {
  // const navigate = useNavigate();

  // const [formSubmitted, setFormSubmitted] = useState(false);
  // const [formLoading, setFormLoading] = useState(false);
  // const [formError, setFormError] = useState('');
  // const [signerId, setSignerId] = useState<string | null>(null);

  // const [stats, setStats] = useState({
  //   total_signers: 0,
  //   total_countries: 0
  // });

  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   country: '',
  //   wave: '',
  //   waveOther: '',
  //   subject: 'me',
  //   story: ''
  // });

  // const [aiHelper, setAiHelper] = useState({
  //   category: '',
  //   customCategory: '',
  //   about: 'me',
  //   name: '',
  //   detail: '',
  //   currentText: '',
  //   previousText: '',
  //   rewriteCount: 0,
  //   loading: false,
  //   copied: false,
  // });

  // const [aiAssistant, setAiAssistant] = useState({
  //   prompt: 'Write a caption about someone building in fintech',
  //   messages: [
  //     {
  //       id: '1',
  //       role: 'assistant' as const,
  //       text: "Tell me what you're trying to say — I'll help you write it."
  //     }
  //   ]
  // });

  const { language } = useOutletContext<{ language: Language }>();

  // activeSlideIndices: manifest indices in display order (latest-unlocked first)
  const [activeSlideIndices, setActiveSlideIndices] = useState<number[]>(() => getActiveSlidesLocal());
  const [activeHero, setActiveHero] = useState(0);
  // const [showAiNudge, setShowAiNudge] = useState(false);

  // Active images, latest-unlocked first. Language only affects the date text overlay.
  const activeImages = activeSlideIndices.map(i => ({
    desktop: SLIDE_MANIFEST[i].desktop,
    mobile:  SLIDE_MANIFEST[i].mobile,
  }));

  // const signOnRef = useRef<HTMLDivElement>(null);
  // const waveMarkRef = useRef<HTMLDivElement>(null);
  // const aiHelperRef = useRef<HTMLDivElement>(null);

  // async function loadStats() {
  //   try {
  //     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stats`);
  //     if (!res.ok) throw new Error('Stats request failed');
  //     const data = await res.json();
  //     setStats({
  //       total_signers: data.total_signers ?? 0,
  //       total_countries: data.total_countries ?? 0
  //     });
  //   } catch (err) {
  //     console.error('Failed to load stats:', err);
  //   }
  // }

  // Fetch active slide config from backend; fall back to local date check
  useEffect(() => {
    fetch(`${(import.meta as any).env.VITE_API_URL}/api/slide-config`)
      .then((r) => r.json())
      .then((data: { activeSlides?: number[] }) => {
        if (Array.isArray(data.activeSlides)) {
          setActiveSlideIndices(data.activeSlides);
        } else {
          setActiveSlideIndices(getActiveSlidesLocal());
        }
      })
      .catch(() => setActiveSlideIndices(getActiveSlidesLocal()));
  }, []);

  // Reset to first slide whenever the active set changes
  useEffect(() => {
    setActiveHero(0);
  }, [activeSlideIndices]);

  // Hero slider auto-advance — adapts to however many slides are active
  useEffect(() => {
    if (activeImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % activeImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeImages.length]);

  // // Restore session if already signed
  // useEffect(() => {
  //   const storedSignerId = sessionStorage.getItem('nw_signer_id');
  //   const storedFirstName = sessionStorage.getItem('nw_first_name');
  //   if (storedSignerId) {
  //     setSignerId(storedSignerId);
  //     setFormSubmitted(true);
  //     if (storedFirstName) {
  //       setFormData((prev) => ({ ...prev, firstName: storedFirstName }));
  //     }
  //   }
  // }, []);

  // // Load stats on mount
  // useEffect(() => {
  //   loadStats();
  // }, []);

  // // Floating AI nudge — show after 400px scroll, hide when near AI section or above
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY;
  //     const aiSection = aiHelperRef.current;
  //     const aiSectionTop = aiSection
  //       ? aiSection.getBoundingClientRect().top + scrollY
  //       : Infinity;
  //     if (scrollY > 400 && scrollY < aiSectionTop - 200) {
  //       setShowAiNudge(true);
  //     } else {
  //       setShowAiNudge(false);
  //     }
  //   };
  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  // const scrollToSignOn = () => {
  //   signOnRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // const scrollToAiHelper = () => {
  //   aiHelperRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   setShowAiNudge(false);
  // };

  // const goToWaveMark = () => {
  //   navigate('/get-mark');
  // };

  // const getManualShareText = () => {
  //   const story = formData.story.trim()
  //     ? formData.story.trim()
  //     : 'I just joined #NotWaiting — the movement for African builders, creators, and innovators. Africa is on a wave.';
  //   return `${story}\n\n#NotWaiting`;
  // };

  // const trackManualSocialShare = async (platform: string) => {
  //   if (!signerId) return;
  //   await trackAction({ signerId, action: 'shared_social', metadata: { platform, source: 'manual_manifesto' } });
  //   await loadStats();
  // };

  // const shareManualToX = async () => {
  //   const text = encodeURIComponent(getManualShareText());
  //   window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  //   await trackManualSocialShare('twitter');
  // };

  // const shareManualToLinkedIn = async () => {
  //   const url = encodeURIComponent(window.location.origin);
  //   window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  //   await handleCopyText(getManualShareText());
  //   await trackManualSocialShare('linkedin');
  //   alert('Story copied. LinkedIn opened — paste your story into the post.');
  // };

  // const shareManualToFacebook = async () => {
  //   const url = encodeURIComponent(window.location.origin);
  //   window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  //   await handleCopyText(getManualShareText());
  //   await trackManualSocialShare('facebook');
  //   alert('Story copied. Facebook opened — paste your story into the post.');
  // };

  // const shareManualStory = async () => {
  //   await handleCopyText(getManualShareText());
  //   await trackManualSocialShare('instagram');
  //   alert('Story copied. You can now paste it on Instagram.');
  // };

  // const buildAiPrompt = (about: string, category: string, name: string) => {
  //   const wave = category || 'tech';
  //   if (about === 'me') {
  //     const myName = formData.firstName || 'myself';
  //     return `Write a caption about ${myName} building in ${wave}`;
  //   }
  //   if (about === 'someone') return `Write a caption about ${name || 'someone'} building in ${wave}`;
  //   return `Write a caption about ${name || 'an organisation'} building in ${wave}`;
  // };

  // const handleFormSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setFormError('');
  //   setFormLoading(true);
  //   if (!formData.story.trim()) {
  //     setFormError('Please write your story before publishing.');
  //     setFormLoading(false);
  //     return;
  //   }
  //   const effectiveWave = formData.wave === 'other' ? formData.waveOther.trim() || 'other' : formData.wave;
  //   try {
  //     const result = await signManifesto({ firstName: formData.firstName, country: formData.country, wave: effectiveWave || undefined });
  //     setSignerId(result.signerId);
  //     sessionStorage.setItem('nw_signer_id', result.signerId);
  //     sessionStorage.setItem('nw_first_name', formData.firstName);
  //     await publishStory({ signerId: result.signerId, caption: formData.story.trim(), waveTag: effectiveWave || 'other' });
  //     await trackAction({ signerId: result.signerId, action: 'shared_story', metadata: { source: 'manual_manifesto', subject: formData.subject } });
  //     setFormSubmitted(true);
  //     await loadStats();
  //   } catch (err: any) {
  //     setFormError(err.message ?? 'Something went wrong. Please try again.');
  //   } finally {
  //     setFormLoading(false);
  //   }
  // };

  // const generateAIWave = async (style?: string) => {
  //   setAiHelper((prev) => ({ ...prev, loading: true }));
  //   const effectiveCategory = aiHelper.category === 'other' ? aiHelper.customCategory || 'tech' : aiHelper.category || 'tech';
  //   try {
  //     let result;
  //     if (style === 'shorter' || style === 'bold') {
  //       result = await generateCaption({ waveTag: effectiveCategory, subject: aiHelper.about as 'me' | 'someone' | 'organisation', customPrompt: `${aiAssistant.prompt}. Make it ${style === 'shorter' ? 'shorter and punchier' : 'bolder and more powerful'}.` });
  //     } else {
  //       result = await generateCaption({ waveTag: effectiveCategory, subject: aiHelper.about as 'me' | 'someone' | 'organisation', detail: aiHelper.detail || undefined, customPrompt: aiAssistant.prompt || undefined });
  //     }
  //     setAiHelper((prev) => ({ ...prev, previousText: prev.currentText, currentText: result.caption, rewriteCount: prev.currentText ? prev.rewriteCount + 1 : 0, loading: false }));
  //   } catch (err: any) {
  //     setAiHelper((prev) => ({ ...prev, loading: false }));
  //     alert(err.message ?? 'Could not generate caption. Please try again.');
  //   }
  // };

  // const handleCopyText = async (text: string) => {
  //   await copyToClipboard(text);
  // };

  return (
    <div className="min-h-screen bg-white">

      {/* ── FLOATING AI NUDGE (commented out) ────────────────
      <div className={`fixed bottom-30 right-8 z-70 transition-all duration-500 ${showAiNudge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={scrollToAiHelper} className="group flex items-center gap-3 bg-[#DD3935] text-white px-5 py-3 shadow-lg hover:bg-[#C92F2B] transition-colors">
          <span className="relative flex h-3 w-3 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="text-sm font-black uppercase tracking-wide">Not sure what to write? <br /> Try our Ai text helper.</span>
          <span className="text-sm font-black">→</span>
        </button>
        <button onClick={() => setShowAiNudge(false)} className="absolute -top-2 -right-2 w-5 h-5 bg-[#0C0C0A] text-white text-xs flex items-center justify-center hover:bg-[#DD3935] transition-colors" aria-label="Dismiss">×</button>
      </div>
      ── END FLOATING AI NUDGE ── */}

      {/* ── HERO SLIDER ───────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden">

        {/* SLIDE 1 — Yellow */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeHero === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="relative h-full min-h-screen">
            {/* Left: text panel (commented out)
            <div className="w-[35%] bg-[#EBBD06] flex flex-col justify-center px-10 md:px-14 py-16">
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/50 mb-6">25 May 2026 · One Day · One Movement</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-[#FFFFFF] mb-6">Wear The<br />Mark.</h2>
              <p className="text-sm md:text-base font-semibold leading-relaxed text-white/80 mb-8">Every builder, creator and innovator on the continent united under one signal. Make it impossible to ignore.</p>
              <div className="flex flex-wrap gap-2">
                {['#NotWaiting', '#WearTheMark', '#May25', '#OneContinent'].map((tag) => (
                  <span key={tag} className="text-xs font-black text-white/40 uppercase tracking-wide">{tag}</span>
                ))}
              </div>
            </div>
            */}
            <img src={activeImages[0]?.mobile}  alt="#NotWaiting" className="md:hidden absolute inset-0 w-full h-full object-cover object-center" />
            <img src={activeImages[0]?.desktop} alt="#NotWaiting" className="hidden md:block absolute inset-0 w-full h-full object-cover object-center" />
          </div>
        </div>

        {/* SLIDE 2 — Green */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeHero === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="relative h-full min-h-screen">
            {/* Left: text panel (commented out)
            <div className="w-[35%] bg-[#027A4F] flex flex-col justify-center px-10 md:px-14 py-16">
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/70 mb-6">Fintech · Music · Health · Fashion · Policy & More</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-white mb-6">Declare<br />Your Wave.</h2>
              <p className="text-sm md:text-base font-semibold leading-relaxed text-white/90 mb-8">From Lagos to Nairobi, Accra to Cairo — your story is the movement. Sign the manifesto. Pass it on.</p>
              <div className="flex flex-wrap gap-2">
                {['#NotWaiting', '#DeclareYourWave', '#AfricaLeads', '#YourWave'].map((tag) => (
                  <span key={tag} className="text-xs font-black text-white/60 uppercase tracking-wide">{tag}</span>
                ))}
              </div>
            </div>
            */}
            <img src={activeImages[1]?.mobile}  alt="#NotWaiting" className="md:hidden absolute inset-0 w-full h-full object-cover object-center" />
            <img src={activeImages[1]?.desktop} alt="#NotWaiting" className="hidden md:block absolute inset-0 w-full h-full object-cover object-center" />
          </div>
        </div>

        {/* SLIDE 3 — Red */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeHero === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="relative h-full min-h-screen">
            {/* Left: text panel (commented out)
            <div className="w-[35%] bg-[#DD3935] flex flex-col justify-center px-10 md:px-14 py-16">
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/70 mb-6">Entertainment · Tech · Finance · Agriculture & More</p>
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-white mb-6">Africa Is<br />Building.</h1>
              <p className="text-sm md:text-base font-semibold leading-relaxed text-white/90 mb-8">The continent is not waiting for permission — it is creating, innovating and leading. Right now.</p>
              <div className="flex flex-wrap gap-2">
                {['#NotWaiting', '#AfricaRising', '#BuildAfrica', '#OpportunityAfrica'].map((tag) => (
                  <span key={tag} className="text-xs font-black text-white/60 uppercase tracking-wide">{tag}</span>
                ))}
              </div>
            </div>
            */}
            <img src={activeImages[2]?.mobile}  alt="#NotWaiting" className="md:hidden absolute inset-0 w-full h-full object-cover object-center" />
            <img src={activeImages[2]?.desktop} alt="#NotWaiting" className="hidden md:block absolute inset-0 w-full h-full object-cover object-center" />
          </div>
        </div>

        {/* DATE OVERLAY — sits above all slides, crossfades on language toggle */}
        <div className="absolute inset-x-0 bottom-[25%] md:bottom-[8%] z-20 text-center pointer-events-none select-none">
          {(['EN', 'FR'] as const).map((lang) => (
            <p
              key={lang}
              className={`transition-opacity duration-500 ${lang === 'EN' ? '' : 'absolute inset-0'}`}
              style={{
                fontFamily: "'DejaVu Sans', Arial, sans-serif",
                opacity: language === lang ? 1 : 0,
                fontSize: 'clamp(2rem, 6vw, 6rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              25 {lang === 'EN' ? 'May' : 'Mai'}&nbsp;
              <span style={{ fontWeight: 700 }}>2026</span>
            </p>
          ))}
        </div>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {activeImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHero(i)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${activeHero === i ? 'bg-white w-5' : 'bg-white/30'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* BOTTOM COLOUR RULE */}
        <div className="absolute bottom-0 left-0 right-0 z-30 grid grid-cols-3 h-[5px]">
          <div className="bg-[#DD3935]" />
          <div className="bg-[#EBBD06]" />
          <div className="bg-[#027A4F]" />
        </div>
      </section>

      {/* ── MANIFESTO (commented out) ─────────────────────────────────────────────────
      <section className="relative bg-white py-20 md:py-32 px-6 overflow-hidden">
        ...manifesto content...
      </section>
      ── END MANIFESTO ── */}

      {/* ── SIGN-ON SECTION (commented out) ──────────────────────────────────────────
      <section ref={signOnRef} className="bg-[#F5F5F5] py-20 md:py-32 px-6">
        ...sign-on form content...
      </section>
      ── END SIGN-ON ── */}

      {/* ── GET THE WAVE MARK (commented out) ────────────────────────────────────────
      <section ref={waveMarkRef} className="bg-[#EBBD06] text-[#0C0C0A] py-20 md:py-32 px-6">
        ...wave mark content...
      </section>
      ── END WAVE MARK ── */}

      {/* ── THE WALL (commented out) ──────────────────────────────────────────────────
      <section className="relative bg-white text-[#0C0C0A] py-20 md:py-32 px-6 overflow-hidden">
        ...counter, ticker, stats...
      </section>
      ── END THE WALL ── */}

      {/* ── AI ASSISTANT (commented out) ─────────────────────────────────────────────
      <section ref={aiHelperRef} className="bg-white py-20 md:py-32 px-6">
        ...AI helper form and output panel...
      </section>
      ── END AI ASSISTANT ── */}

      {/* ── PROTOCOL STRIP (commented out) ───────────────────────────────────────────
      <section className="bg-[#F5F5F5] py-20 px-6">
        ...protocol steps...
      </section>
      ── END PROTOCOL STRIP ── */}

    </div>
  );
}
