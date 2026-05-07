import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { QrCode, Copy } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Textarea } from '../components/Textarea';
import { ShareCard } from '../components/ShareCard';
import { CadenceCard } from '../components/CadenceCard';
import { Counter } from '../components/Counter';
import { Ticker } from '../components/Ticker';
import { copyToClipboard } from '../utils/clipboard';
import { signManifesto, generateCaption, publishStory, trackAction } from '../utils/api';
import waveMarkExample from '../../imports/image-2.png';
import heroImage from '../../imports/Untitled_design_(6).png';
import heroImage2 from '../../imports/image-4.png';
import waveImage from '../../imports/waves.png';
import patternBg from '../../imports/PATTERN2.png';
import patternBg2 from '../../imports/PATTERN_1-1.png';
import heroShapes from '../../imports/web_template.png';

const africanCountries = [
  { value: '', label: 'Select country' },
  { value: 'algeria', label: 'Algeria' },
  { value: 'angola', label: 'Angola' },
  { value: 'benin', label: 'Benin' },
  { value: 'botswana', label: 'Botswana' },
  { value: 'burkina-faso', label: 'Burkina Faso' },
  { value: 'burundi', label: 'Burundi' },
  { value: 'cabo-verde', label: 'Cabo Verde' },
  { value: 'cameroon', label: 'Cameroon' },
  { value: 'central-african-republic', label: 'Central African Republic' },
  { value: 'chad', label: 'Chad' },
  { value: 'comoros', label: 'Comoros' },
  { value: 'congo-brazzaville', label: 'Congo (Brazzaville)' },
  { value: 'congo-kinshasa', label: 'Congo (Kinshasa)' },
  { value: 'cote-divoire', label: "Côte d'Ivoire" },
  { value: 'djibouti', label: 'Djibouti' },
  { value: 'egypt', label: 'Egypt' },
  { value: 'equatorial-guinea', label: 'Equatorial Guinea' },
  { value: 'eritrea', label: 'Eritrea' },
  { value: 'eswatini', label: 'Eswatini' },
  { value: 'ethiopia', label: 'Ethiopia' },
  { value: 'gabon', label: 'Gabon' },
  { value: 'gambia', label: 'Gambia' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'guinea', label: 'Guinea' },
  { value: 'guinea-bissau', label: 'Guinea-Bissau' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'lesotho', label: 'Lesotho' },
  { value: 'liberia', label: 'Liberia' },
  { value: 'libya', label: 'Libya' },
  { value: 'madagascar', label: 'Madagascar' },
  { value: 'malawi', label: 'Malawi' },
  { value: 'mali', label: 'Mali' },
  { value: 'mauritania', label: 'Mauritania' },
  { value: 'mauritius', label: 'Mauritius' },
  { value: 'morocco', label: 'Morocco' },
  { value: 'mozambique', label: 'Mozambique' },
  { value: 'namibia', label: 'Namibia' },
  { value: 'niger', label: 'Niger' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'rwanda', label: 'Rwanda' },
  { value: 'sao-tome-and-principe', label: 'São Tomé and Príncipe' },
  { value: 'senegal', label: 'Senegal' },
  { value: 'seychelles', label: 'Seychelles' },
  { value: 'sierra-leone', label: 'Sierra Leone' },
  { value: 'somalia', label: 'Somalia' },
  { value: 'south-africa', label: 'South Africa' },
  { value: 'south-sudan', label: 'South Sudan' },
  { value: 'sudan', label: 'Sudan' },
  { value: 'tanzania', label: 'Tanzania' },
  { value: 'togo', label: 'Togo' },
  { value: 'tunisia', label: 'Tunisia' },
  { value: 'uganda', label: 'Uganda' },
  { value: 'western-sahara', label: 'Western Sahara' },
  { value: 'zambia', label: 'Zambia' },
  { value: 'zimbabwe', label: 'Zimbabwe' },
  { value: 'diaspora', label: 'African Diaspora' },
  { value: 'global', label: 'Global Supporter' }
];

// Aligned exactly with Stories page SECTORS array
const aiSectorOptions = [
  { value: '', label: 'Select sector' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'music', label: 'Music' },
  { value: 'health', label: 'Health' },
  { value: 'tech', label: 'Tech' },
  { value: 'education', label: 'Education' },
  { value: 'climate', label: 'Climate' },
  { value: 'media', label: 'Media' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'sports', label: 'Sports' },
  { value: 'film', label: 'Film' },
  { value: 'policy', label: 'Policy' },
  { value: 'other', label: 'Other' },
];

// Aligned exactly with Stories page SECTORS array (no 'other' in ticker)
const sectors = [
  'fintech',
  'agriculture',
  'music',
  'health',
  'tech',
  'education',
  'climate',
  'media',
  'fashion',
  'sports',
  'film',
  'policy'
];

export default function Home() {
  const navigate = useNavigate();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [signerId, setSignerId] = useState<string | null>(null);

  const [stats, setStats] = useState({
    total_signers: 0,
    total_countries: 0
  });

  const [formData, setFormData] = useState({
    firstName: '',
    country: '',
    wave: '',
    waveOther: '',
    subject: 'me',
    story: ''
  });

  const [aiHelper, setAiHelper] = useState({
    category: '',
    customCategory: '',
    about: 'me',
    name: '',
    detail: '',
    currentText: '',
    previousText: '',
    rewriteCount: 0,
    loading: false,
    copied: false,
  });

  const [aiAssistant, setAiAssistant] = useState({
    prompt: 'Write a caption about someone building in fintech',
    messages: [
      {
        id: '1',
        role: 'assistant' as const,
        text: "Tell me what you're trying to say — I'll help you write it."
      }
    ]
  });

  const [activeHero, setActiveHero] = useState(0);
  const [showAiNudge, setShowAiNudge] = useState(false);

  const signOnRef = useRef<HTMLDivElement>(null);
  const waveMarkRef = useRef<HTMLDivElement>(null);
  const aiHelperRef = useRef<HTMLDivElement>(null);

  async function loadStats() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stats`);

      if (!res.ok) {
        throw new Error('Stats request failed');
      }

      const data = await res.json();

      setStats({
        total_signers: data.total_signers ?? 0,
        total_countries: data.total_countries ?? 0
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }

  // Hero slider auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((prev) => (prev === 0 ? 1 : 0));
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // Restore session if already signed
  useEffect(() => {
    const storedSignerId = sessionStorage.getItem('nw_signer_id');
    const storedFirstName = sessionStorage.getItem('nw_first_name');

    if (storedSignerId) {
      setSignerId(storedSignerId);
      setFormSubmitted(true);

      if (storedFirstName) {
        setFormData((prev) => ({
          ...prev,
          firstName: storedFirstName
        }));
      }
    }
  }, []);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  // Floating AI nudge — show after 400px scroll, hide when near AI section or above
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const aiSection = aiHelperRef.current;
      const aiSectionTop = aiSection
        ? aiSection.getBoundingClientRect().top + scrollY
        : Infinity;

      if (scrollY > 400 && scrollY < aiSectionTop - 200) {
        setShowAiNudge(true);
      } else {
        setShowAiNudge(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSignOn = () => {
    signOnRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAiHelper = () => {
    aiHelperRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowAiNudge(false);
  };

  const goToWaveMark = () => {
    navigate('/get-mark');
  };

  const getManualShareText = () => {
    const story = formData.story.trim()
      ? formData.story.trim()
      : 'I just joined #NotWaiting — the movement for African builders, creators, and innovators. Africa is on a wave.';

    return `${story}

#NotWaiting`;
  };

  const trackManualSocialShare = async (platform: string) => {
    if (!signerId) return;

    await trackAction({
      signerId,
      action: 'shared_social',
      metadata: {
        platform,
        source: 'manual_manifesto'
      }
    });

    await loadStats();
  };

  const shareManualToX = async () => {
    const text = encodeURIComponent(getManualShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    await trackManualSocialShare('twitter');
  };

  const shareManualToLinkedIn = async () => {
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    await handleCopyText(getManualShareText());
    await trackManualSocialShare('linkedin');
    alert('Story copied. LinkedIn opened — paste your story into the post.');
  };

  const shareManualToFacebook = async () => {
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    await handleCopyText(getManualShareText());
    await trackManualSocialShare('facebook');
    alert('Story copied. Facebook opened — paste your story into the post.');
  };

  const shareManualStory = async () => {
    await handleCopyText(getManualShareText());
    await trackManualSocialShare('instagram');
    alert('Story copied. You can now paste it on Instagram.');
  };

  const buildAiPrompt = (about: string, category: string, name: string) => {
    const wave = category || 'tech';

    if (about === 'me') {
      const myName = formData.firstName || 'myself';
      return `Write a caption about ${myName} building in ${wave}`;
    }

    if (about === 'someone') {
      return `Write a caption about ${name || 'someone'} building in ${wave}`;
    }

    return `Write a caption about ${name || 'an organisation'} building in ${wave}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    if (!formData.story.trim()) {
      setFormError('Please write your story before publishing.');
      setFormLoading(false);
      return;
    }

    // Resolve "other" to the custom text before sending
    const effectiveWave =
      formData.wave === 'other'
        ? formData.waveOther.trim() || 'other'
        : formData.wave;

    try {
      const result = await signManifesto({
        firstName: formData.firstName,
        country: formData.country,
        wave: effectiveWave || undefined
      });

      setSignerId(result.signerId);
      sessionStorage.setItem('nw_signer_id', result.signerId);
      sessionStorage.setItem('nw_first_name', formData.firstName);

      await publishStory({
        signerId: result.signerId,
        caption: formData.story.trim(),
        waveTag: effectiveWave || 'other'
      });

      await trackAction({
        signerId: result.signerId,
        action: 'shared_story',
        metadata: {
          source: 'manual_manifesto',
          subject: formData.subject
        }
      });

      setFormSubmitted(true);
      await loadStats();
    } catch (err: any) {
      setFormError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const generateAIWave = async (style?: string) => {
    setAiHelper((prev) => ({ ...prev, loading: true }));

    const effectiveCategory =
      aiHelper.category === 'other'
        ? aiHelper.customCategory || 'tech'
        : aiHelper.category || 'tech';

    try {
      let result;

      if (style === 'shorter' || style === 'bold') {
        result = await generateCaption({
          waveTag: effectiveCategory,
          subject: aiHelper.about as 'me' | 'someone' | 'organisation',
          customPrompt: `${aiAssistant.prompt}. Make it ${
            style === 'shorter' ? 'shorter and punchier' : 'bolder and more powerful'
          }.`
        });
      } else {
        result = await generateCaption({
          waveTag: effectiveCategory,
          subject: aiHelper.about as 'me' | 'someone' | 'organisation',
          detail: aiHelper.detail || undefined,
          customPrompt: aiAssistant.prompt || undefined
        });
      }

      // Replace current output; save previous for undo; first gen resets count to 0
      setAiHelper((prev) => ({
        ...prev,
        previousText: prev.currentText,
        currentText: result.caption,
        rewriteCount: prev.currentText ? prev.rewriteCount + 1 : 0,
        loading: false
      }));
    } catch (err: any) {
      setAiHelper((prev) => ({ ...prev, loading: false }));
      alert(err.message ?? 'Could not generate caption. Please try again.');
    }
  };

  const handleCopyText = async (text: string) => {
    await copyToClipboard(text);
  };

  return (
    <div className="min-h-screen bg-white">

     {/* ── FLOATING AI NUDGE ─────────────────────────────── */}
<div
  className={`fixed bottom-30 right-8 z-70 transition-all duration-500 ${
    showAiNudge
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-4 pointer-events-none'
  }`}
>
        <button
          onClick={scrollToAiHelper}
          className="group flex items-center gap-3 bg-[#DD3935] text-white px-5 py-3 shadow-lg hover:bg-[#C92F2B] transition-colors"
        >
          {/* Animated pulse dot */}
          <span className="relative flex h-3 w-3 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
          </span>

          <span className="text-sm font-black uppercase tracking-wide">
            Not sure what to write? <br></br> Try our Ai text helper.
          </span>

          <span className="text-sm font-black">→</span>
        </button>

        {/* Dismiss ✕ */}
        <button
          onClick={() => setShowAiNudge(false)}
          className="absolute -top-2 -right-2 w-5 h-5 bg-[#0C0C0A] text-white text-xs flex items-center justify-center hover:bg-[#DD3935] transition-colors"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* ── HERO SLIDER ───────────────────────────────────── */}
      <section className="relative min-h-screen bg-white text-[#0C0C0A] overflow-hidden">
        {/* SLIDE 1 */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            activeHero === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-[#DD3935]">
              <div className="absolute inset-y-0 right-0 w-[70%] bg-[#DD3935]">
                <img
                  src={heroImage}
                  alt="#NotWaiting campaign portrait"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#DD3935] via-[#DD3935]/70 via-[#DD3935]/25 to-transparent pointer-events-none"
                  style={{ width: '44%' }}
                />
                <div className="absolute inset-0 bg-[#DD3935]/10 pointer-events-none" />
              </div>
            </div>

            <div className="absolute inset-0 z-20 flex items-center">
              <div className="w-[70%] flex justify-center">
                <div className="relative w-[900px] max-w-[90vw] h-[600px]">
                  <img
                    src={heroShapes}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                    style={{ transform: 'scale(1.3)' }}
                  />

                  <div className="absolute left-[18%] top-[28%] max-w-[460px]">
                    <p className="font-mono text-xs md:text-sm uppercase text-black font-black mb-2">
                      Entertainment, Tech, Finance, Agriculture & More
                    </p>

                    <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-[#DD3935] mb-4">
                      Join The Wave
                    </h1>

                    <p className="font-black text-sm md:text-base leading-tight text-black mb-8">
                      Africa is building, creating and leading right now.
                      <br />
                      On the 25th of May, we make it impossible to ignore.
                      <br />
                      Wear the Mark. Declare Your Wave. Pass it on.
                    </p>
                  </div>

                  <Button
                    onClick={scrollToSignOn}
                    className="absolute left-[30%] bottom-[20%] bg-[#DD3935] hover:bg-[#C92F2B] text-white text-sm md:text-base px-8 py-3 rounded-full font-black uppercase"
                  >
                    Join the coalition →
                  </Button>
                </div>
              </div>

              <div className="w-[30%]" />
            </div>
          </div>
        </div>

        {/* SLIDE 2 */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            activeHero === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="w-[30%] bg-[#0C0C0A]" />
              <div className="w-[70%] bg-[#0C0C0A] relative">
                <img
                  src={heroImage2}
                  alt="#NotWaiting campaign portrait"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A] via-[#0C0C0A]/70 via-[#0C0C0A]/30 to-transparent pointer-events-none"
                  style={{ width: '50%' }}
                />
              </div>
            </div>

            <div className="absolute inset-0 z-20 flex items-center">
              <div className="w-[70%] flex justify-center">
                <div className="relative w-[900px] max-w-[90vw] h-[600px]">
                  <img
                    src={heroShapes}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                    style={{ transform: 'scale(1.3)' }}
                  />

                  <div className="absolute left-[18%] top-[28%] max-w-[460px]">
                    <p className="font-mono text-xs md:text-sm uppercase text-black font-black mb-2">
                      Entertainment, Tech, Finance, Agriculture & More
                    </p>

                    <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-[#DD3935] mb-4">
                      25 May 2026
                    </h2>

                    <p className="font-black text-sm md:text-base leading-tight text-black mb-8">
                      One day. One mark. One continent
                      <br />
                      already moving
                    </p>
                  </div>

                  <Button
                    onClick={scrollToSignOn}
                    className="absolute left-[30%] bottom-[20%] bg-[#DD3935] hover:bg-[#C92F2B] text-white text-sm md:text-base px-8 py-3 rounded-full font-black uppercase"
                  >
                    Join the coalition →
                  </Button>
                </div>
              </div>

              <div className="w-[30%]" />
            </div>
          </div>
        </div>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          <button
            onClick={() => setActiveHero(0)}
            className={`h-3 w-3 rounded-full transition ${
              activeHero === 0 ? 'bg-[#DD3935]' : 'bg-white/40'
            }`}
            aria-label="Go to slide 1"
          />

          <button
            onClick={() => setActiveHero(1)}
            className={`h-3 w-3 rounded-full transition ${
              activeHero === 1 ? 'bg-[#DD3935]' : 'bg-white/40'
            }`}
            aria-label="Go to slide 2"
          />
        </div>

        {/* BOTTOM COLOUR RULE */}
        <div className="absolute bottom-0 left-0 right-0 z-30 grid grid-cols-3 h-[5px]">
          <div className="bg-[#DD3935]" />
          <div className="bg-[#EBBD06]" />
          <div className="bg-[#027A4F]" />
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────── */}
      <section className="relative bg-white py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <img
            src={patternBg2}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="space-y-8 text-lg md:text-xl leading-relaxed">
            <p>I believe in my country and I believe in Africa.</p>

            <p>
              I believe in the people, places, ideas, and bold actions moving this continent forward
              every day.
            </p>

            <div className="border-l-4 border-[#dd3935] pl-6 my-12 py-6">
              <p className="text-xl md:text-2xl font-bold leading-relaxed">
                By signing this manifesto and joining the Opportunity Africa wave, I commit to using
                my voice, my work, and my platforms to show the progress we are making.
              </p>
            </div>

            <div className="bg-[#F5F5F5] p-8 my-12">
              <p className="text-2xl md:text-3xl font-black leading-tight text-center">
                Because what we see, we believe in.
                <br />
                What we believe in, we back.
                <br />
                What we back, we build.
              </p>
            </div>

            <p className="text-2xl md:text-3xl font-black text-center">I am #NotWaiting.</p>
          </div>

          <div className="text-center mt-16">
            <Button onClick={scrollToSignOn} className="text-lg px-12 py-5">
              Join the coalition →
            </Button>
          </div>
        </div>
      </section>

      {/* ── SIGN-ON SECTION — MANUAL STORY FORM ──────────── */}
      <section ref={signOnRef} className="bg-[#F5F5F5] py-20 md:py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          {!formSubmitted ? (
            <>
              {/* SECTION HEADER */}
              <div className="text-center mb-14">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
                  Add Your Name.
                </h2>

                <p className="text-xl max-w-3xl mx-auto">
                  Sign the manifesto, write your wave manually, and publish your story.
                </p>
              </div>

              {/* 2 COLUMN LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-10 items-start">
                {/* LEFT — IMAGE */}
                <div className="relative w-full min-h-[760px] overflow-hidden -ml-20">
                  <img
                    src={waveImage}
                    alt="Wave manifesto"
                    className="absolute inset-0 w-full h-full object-cover object-left"
                  />
                </div>

                {/* RIGHT — FORM */}
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <Input
                    label="First name"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />

                  <Select
                    label="Country"
                    required
                    options={africanCountries}
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />

                  {/* What's your wave? — sector dropdown */}
                  <div>
                    <label className="block mb-2 text-sm font-mono uppercase tracking-wide">
                      What's your wave? <span className="text-[#dd3935]">*</span>
                    </label>

                    <select
                      required
                      value={formData.wave}
                      onChange={(e) =>
                        setFormData({ ...formData, wave: e.target.value, waveOther: '' })
                      }
                      className="w-full border-2 border-[#0C0C0A] bg-white px-4 py-3 font-mono text-sm focus:border-[#DD3935] outline-none"
                    >
                      <option value="">Select your sector</option>
                      <option value="fintech">Fintech</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="music">Music</option>
                      <option value="health">Health</option>
                      <option value="tech">Tech</option>
                      <option value="education">Education</option>
                      <option value="climate">Climate</option>
                      <option value="media">Media</option>
                      <option value="fashion">Fashion</option>
                      <option value="sports">Sports</option>
                      <option value="film">Film</option>
                      <option value="policy">Policy</option>
                      <option value="other">Other</option>
                    </select>

                    {/* "Other" free-text field */}
                    {formData.wave === 'other' && (
                      <div className="mt-3">
                        <Input
                          type="text"
                          required
                          maxLength={60}
                          placeholder="Describe your wave..."
                          value={formData.waveOther}
                          onChange={(e) =>
                            setFormData({ ...formData, waveOther: e.target.value })
                          }
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.waveOther.length}/60 characters
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-mono uppercase tracking-wide">
                      Who is this about?
                    </label>

                    <div className="flex gap-4 flex-wrap">
                      {['Me', 'Someone', 'Organisation'].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-[#0C0C0A] hover:bg-white transition-colors min-w-[120px]"
                        >
                          <input
                            type="radio"
                            name="manual-subject"
                            value={option.toLowerCase()}
                            checked={formData.subject === option.toLowerCase()}
                            onChange={(e) =>
                              setFormData({ ...formData, subject: e.target.value })
                            }
                            className="w-5 h-5 accent-[#dd3935]"
                          />
                          <span className="text-base">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    label="Tell your story"
                    rows={6}
                    required
                    maxLength={600}
                    placeholder="Write what you're building, creating, changing, or backing..."
                    value={formData.story}
                    onChange={(e) =>
                      setFormData({ ...formData, story: e.target.value })
                    }
                    className="bg-white"
                  />

                  <p className="text-xs text-gray-500">{formData.story.length}/600 characters</p>

                  <Button
                    type="submit"
                    className="w-full text-lg py-5"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Publishing...' : 'Sign and publish story →'}
                  </Button>

                  {formError && (
                    <p className="text-[#dd3935] text-sm mt-2 text-center">{formError}</p>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="text-center space-y-8">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight">
                You're on the wave.
              </h2>

              <p className="text-2xl">Welcome, {formData.firstName}.</p>

              <p className="text-base text-gray-600">
                Your story has been published to the Stories wall.
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center pt-8 flex-wrap">
                <Button onClick={goToWaveMark} className="px-8 py-4">
                  Get the wave mark →
                </Button>

                <Button variant="secondary" onClick={shareManualToX} className="px-8 py-4">
                  Share #Notwaiting on X →
                </Button>

                <Button variant="secondary" onClick={shareManualToLinkedIn} className="px-8 py-4">
                  Share #Notwaiting on LinkedIn →
                </Button>

                <Button variant="secondary" onClick={shareManualToFacebook} className="px-8 py-4">
                  Share #Notwaiting on Facebook →
                </Button>

                <Button variant="secondary" onClick={shareManualStory} className="px-8 py-4">
                  Copy #Notwaiting for Instagram →
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── GET THE WAVE MARK ─────────────────────────────── */}
      <section ref={waveMarkRef} className="bg-[#EBBD06] text-[#0C0C0A] py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
                  THE WAVE MARK
                  <br />
                  <span className="text-[#DD3935]">IS REQUIRED.</span>
                </h2>
              </div>

              <p className="text-base md:text-lg text-[#0C0C0A]/90 leading-relaxed max-w-xl">
                The wave mark is the symbol of the African continent. It is the visual signature of
                the movement. Use it on every post, every profile, and every platform where you
                share your wave.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex gap-4">
                  <span className="text-[#DD3935] font-black font-mono text-lg flex-shrink-0">
                    01
                  </span>
                  <div>
                    <h3 className="font-black text-lg mb-1">Apply the mark → Frame your work</h3>
                    <p className="text-sm text-[#0C0C0A]/80">
                      Add it to your profile picture, cover photo, or content.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-[#DD3935] font-black font-mono text-lg flex-shrink-0">
                    02
                  </span>
                  <div>
                    <h3 className="font-black text-lg mb-1">
                      Share your wave → Post with #NotWaiting
                    </h3>
                    <p className="text-sm text-[#0C0C0A]/80">
                      Include the hashtag and the wave mark in everything you post.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-[#DD3935] font-black font-mono text-lg flex-shrink-0">
                    03
                  </span>
                  <div>
                    <h3 className="font-black text-lg mb-1">Tag someone. Circle back on this.</h3>
                    <p className="text-sm text-[#0C0C0A]/80">
                      Invite others to join the coalition and wear the mark.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={goToWaveMark} className="text-base px-8 py-4">
                  Open the wave mark tool →
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={waveMarkExample}
                  alt="Example of wave mark applied to profile photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE WALL ──────────────────────────────────────── */}
      <section className="relative bg-white text-[#0C0C0A] py-20 md:py-32 px-6 overflow-hidden">
        {/* BACKGROUND PATTERN OVERLAY */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <img
            src={patternBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Counter target={stats.total_signers} />

          <p className="text-2xl md:text-4xl mt-6 mb-4">People are on the wave.</p>

          <p className="text-lg md:text-xl text-[#0C0C0A]/80 mb-12">
            <span className="text-[#DD3935] font-black">
              {stats.total_signers.toLocaleString()}
            </span>{' '}
            people ·{' '}
            <span className="text-[#DD3935] font-black">{stats.total_countries}</span>{' '}
            countries
          </p>

          <div className="py-8 border-y border-[#0C0C0A]/20">
            <Ticker items={sectors} />
          </div>

          <div className="mt-12">
            <Button onClick={scrollToSignOn} className="text-lg px-12 py-5">
              Join the coalition →
            </Button>
          </div>
        </div>
      </section>

      {/* ── AI ASSISTANT ──────────────────────────────────── */}
      <section ref={aiHelperRef} className="bg-white py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 text-center">
            Not sure what to write?
          </h2>

          <p className="text-center text-base mb-12">
            Let us help you craft your wave message.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ── LEFT — inputs ──────────────────────────────── */}
            <div className="space-y-6 md:pr-4">

              {/* What's your wave? — sector dropdown (aligned with Stories page) */}
              <div>
                <label className="block mb-2 text-sm font-mono uppercase tracking-wide">
                  What's your wave?
                </label>

                <select
                  value={aiHelper.category}
                  onChange={(e) => {
                    const category = e.target.value;
                    setAiHelper((prev) => ({ ...prev, category, customCategory: '' }));
                    setAiAssistant((prev) => ({
                      ...prev,
                      prompt: buildAiPrompt(
                        aiHelper.about,
                        category === 'other' ? '' : category,
                        aiHelper.name
                      )
                    }));
                  }}
                  className="w-full border-2 border-[#0C0C0A] bg-white px-4 py-3 font-mono text-sm focus:border-[#DD3935] outline-none"
                >
                  <option value="">Select sector</option>
                  <option value="fintech">Fintech</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="music">Music</option>
                  <option value="health">Health</option>
                  <option value="tech">Tech</option>
                  <option value="education">Education</option>
                  <option value="climate">Climate</option>
                  <option value="media">Media</option>
                  <option value="fashion">Fashion</option>
                  <option value="sports">Sports</option>
                  <option value="film">Film</option>
                  <option value="policy">Policy</option>
                  <option value="other">Other</option>
                </select>

                {/* "Other" free-text field */}
                {aiHelper.category === 'other' && (
                  <div className="mt-3">
                    <Input
                      type="text"
                      placeholder="Describe your sector..."
                      maxLength={60}
                      value={aiHelper.customCategory}
                      onChange={(e) => {
                        const customCategory = e.target.value;
                        setAiHelper((prev) => ({ ...prev, customCategory }));
                        setAiAssistant((prev) => ({
                          ...prev,
                          prompt: buildAiPrompt(aiHelper.about, customCategory, aiHelper.name)
                        }));
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {aiHelper.customCategory.length}/60 characters
                    </p>
                  </div>
                )}
              </div>

              {/* Who is this about? */}
              <div>
                <label className="block mb-3 text-sm font-mono uppercase tracking-wide">
                  Who is this about?
                </label>

                <div className="flex gap-4 flex-wrap">
                  {['Me', 'Someone', 'Organisation'].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-[#0C0C0A] hover:bg-[#F5F5F5] transition-colors min-w-[120px]"
                    >
                      <input
                        type="radio"
                        name="about"
                        value={option.toLowerCase()}
                        checked={aiHelper.about === option.toLowerCase()}
                        onChange={(e) => {
                          const about = e.target.value;
                          const effectiveCategory =
                            aiHelper.category === 'other'
                              ? aiHelper.customCategory
                              : aiHelper.category;
                          setAiHelper((prev) => ({
                            ...prev,
                            about,
                            name: about === 'me' ? '' : prev.name
                          }));
                          setAiAssistant((prev) => ({
                            ...prev,
                            prompt: buildAiPrompt(
                              about,
                              effectiveCategory,
                              about === 'me' ? '' : aiHelper.name
                            )
                          }));
                        }}
                        className="w-5 h-5 accent-[#dd3935]"
                      />
                      <span className="text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Person / Org name */}
              {aiHelper.about !== 'me' && (
                <div>
                  <label className="block mb-2 text-sm font-mono uppercase tracking-wide">
                    {aiHelper.about === 'someone' ? 'Person name' : 'Organisation name'}
                  </label>
                  <Input
                    type="text"
                    placeholder={
                      aiHelper.about === 'someone'
                        ? 'Enter their name'
                        : 'Enter organisation name'
                    }
                    value={aiHelper.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const effectiveCategory =
                        aiHelper.category === 'other'
                          ? aiHelper.customCategory
                          : aiHelper.category;
                      setAiHelper((prev) => ({ ...prev, name }));
                      setAiAssistant((prev) => ({
                        ...prev,
                        prompt: buildAiPrompt(aiHelper.about, effectiveCategory, name)
                      }));
                    }}
                  />
                </div>
              )}

              {/* Optional detail */}
              <div>
                <label className="block mb-2 text-sm font-mono uppercase tracking-wide">
                  Optional detail
                </label>
                <Input
                  type="text"
                  maxLength={120}
                  placeholder="Add a short detail (optional)"
                  value={aiHelper.detail}
                  onChange={(e) => setAiHelper({ ...aiHelper, detail: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {aiHelper.detail.length}/120 characters
                </p>
              </div>

              {/* Prompt */}
              <div>
                <label className="block mb-2 text-sm font-mono uppercase tracking-wide">
                  Prompt
                </label>
                <Textarea
                  rows={3}
                  value={aiAssistant.prompt}
                  onChange={(e) =>
                    setAiAssistant((prev) => ({ ...prev, prompt: e.target.value }))
                  }
                  placeholder="Describe what you want to write about..."
                  className="bg-[#F5F5F5]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Edit this prompt to customize your caption
                </p>
              </div>

              <Button
                onClick={() => generateAIWave()}
                className="w-full py-5 text-lg"
                disabled={aiHelper.loading}
              >
                {aiHelper.loading ? 'Writing…' : 'Write my wave →'}
              </Button>
            </div>

            {/* ── RIGHT — output panel ────────────────────────── */}
            <div className="md:pl-4">
              <div className="bg-[#F5F5F5] border-2 border-[#0C0C0A] min-h-[500px] flex flex-col">
                <div className="flex-1 p-6">

                  {!aiHelper.currentText && !aiHelper.loading && (
                    <div className="bg-white border-2 border-[#0C0C0A] p-4">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Tell me what you're trying to say — I'll help you write it.
                      </p>
                    </div>
                  )}

                  {aiHelper.loading && (
                    <div className="bg-white border-2 border-[#0C0C0A] p-4">
                      <p className="text-sm text-gray-500">Writing your wave...</p>
                    </div>
                  )}

                  {aiHelper.currentText && !aiHelper.loading && (
                    <div>
                      <div className="bg-white border-2 border-[#0C0C0A] p-4 mb-4">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {aiHelper.currentText}
                        </p>
                      </div>

                      {/* Rewrite limit indicator */}
                      <p className="text-xs text-gray-400 mb-3">
                        {aiHelper.rewriteCount < 2
                          ? `${2 - aiHelper.rewriteCount} rewrite${
                              2 - aiHelper.rewriteCount === 1 ? '' : 's'
                            } remaining`
                          : 'Max rewrites reached — use undo or start fresh'}
                      </p>

                      {/* Primary actions row */}
                      <div className="flex gap-2 flex-wrap mb-3">
                        <Button
                          onClick={() => {
                            handleCopyText(aiHelper.currentText);
                            setAiHelper((prev) => ({ ...prev, copied: true }));
                            setTimeout(
                              () => setAiHelper((prev) => ({ ...prev, copied: false })),
                              2000
                            );
                          }}
                          className="px-4 py-2 text-sm"
                        >
                          <Copy size={14} className="inline mr-2" />
                          {aiHelper.copied ? 'Copied!' : 'Copy'}
                        </Button>

                        {/* Rewrite — replaces output, max 2 */}
                        <Button
                          variant="secondary"
                          onClick={() => generateAIWave()}
                          className="px-4 py-2 text-sm"
                          disabled={aiHelper.rewriteCount >= 2 || aiHelper.loading}
                        >
                          Rewrite →
                        </Button>

                        {/* Undo — only visible when a previous version exists */}
                        {aiHelper.previousText && (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              setAiHelper((prev) => ({
                                ...prev,
                                currentText: prev.previousText,
                                previousText: '',
                                rewriteCount: Math.max(0, prev.rewriteCount - 1)
                              }))
                            }
                            className="px-4 py-2 text-sm border-[#EBBD06] text-[#0C0C0A] bg-[#EBBD06] hover:bg-[#D4A900]"
                          >
                            ← Undo
                          </Button>
                        )}
                      </div>

                      {/* Style tweaks row */}
                      <div className="flex gap-2 flex-wrap mb-3">
                        <button
                          onClick={() => generateAIWave('shorter')}
                          disabled={aiHelper.rewriteCount >= 2 || aiHelper.loading}
                          className="px-3 py-1.5 text-xs border border-[#0C0C0A] hover:bg-[#0C0C0A] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Make shorter
                        </button>

                        <button
                          onClick={() => generateAIWave('bold')}
                          disabled={aiHelper.rewriteCount >= 2 || aiHelper.loading}
                          className="px-3 py-1.5 text-xs border border-[#0C0C0A] hover:bg-[#0C0C0A] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          More bold
                        </button>
                      </div>

                      {/* Social share row */}
                      <div className="flex gap-2 flex-wrap">
                        {/* Share on X */}
                        <button
                          onClick={() => {
                            const text = encodeURIComponent(
                              `${aiHelper.currentText}\n\n#NotWaiting`
                            );
                            window.open(
                              `https://twitter.com/intent/tweet?text=${text}`,
                              '_blank'
                            );
                            if (signerId) {
                              trackAction({
                                signerId,
                                action: 'shared_social',
                                metadata: { platform: 'twitter' }
                              });
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-[#0C0C0A] text-white hover:bg-[#DD3935] transition-colors"
                        >
                          Share on X →
                        </button>

                        {/* Share on LinkedIn */}
                        <button
                          onClick={async () => {
                            const url = encodeURIComponent(window.location.origin);
                            window.open(
                              `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                              '_blank'
                            );
                            await handleCopyText(`${aiHelper.currentText}\n\n#NotWaiting`);
                            alert('Caption copied! LinkedIn is open — paste it into your post.');
                            if (signerId) {
                              trackAction({
                                signerId,
                                action: 'shared_social',
                                metadata: { platform: 'linkedin' }
                              });
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-[#0C0C0A] text-white hover:bg-[#DD3935] transition-colors"
                        >
                          Share on LinkedIn →
                        </button>

                        {/* Share on Facebook */}
                        <button
                          onClick={async () => {
                            const url = encodeURIComponent(window.location.origin);
                            window.open(
                              `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                              '_blank'
                            );
                            await handleCopyText(`${aiHelper.currentText}\n\n#NotWaiting`);
                            alert('Caption copied! Facebook is open — paste it into your post.');
                            if (signerId) {
                              trackAction({
                                signerId,
                                action: 'shared_social',
                                metadata: { platform: 'facebook' }
                              });
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-[#0C0C0A] text-white hover:bg-[#DD3935] transition-colors"
                        >
                          Share on Facebook →
                        </button>

                        {/* Copy for Instagram */}
                        <button
                          onClick={async () => {
                            await handleCopyText(`${aiHelper.currentText}\n\n#NotWaiting`);
                            alert('Caption copied! Open Instagram to paste it.');
                            if (signerId) {
                              trackAction({
                                signerId,
                                action: 'shared_social',
                                metadata: { platform: 'instagram' }
                              });
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-[#0C0C0A] text-white hover:bg-[#DD3935] transition-colors"
                        >
                          Copy for Instagram →
                        </button>

                        {/* Post to Stories wall */}
                        <button
                          onClick={async () => {
                            if (!signerId) {
                              alert(
                                'Sign the manifesto first, then you can share to the Stories wall!'
                              );
                              return;
                            }
                            try {
                              await publishStory({
                                signerId,
                                caption: aiHelper.currentText,
                                waveTag:
                                  aiHelper.category === 'other'
                                    ? aiHelper.customCategory || 'other'
                                    : aiHelper.category || 'tech'
                              });
                              await trackAction({
                                signerId,
                                action: 'shared_story',
                                metadata: { source: 'ai_helper' }
                              });
                              await loadStats();
                              alert('Your story is live on the Stories wall! 🌊');
                            } catch (err: any) {
                              alert(err.message ?? 'Could not publish story');
                            }
                          }}
                          className="px-3 py-1.5 text-xs border border-[#EBBD06] text-[#0C0C0A] bg-[#EBBD06] hover:bg-[#D4A900] transition-colors"
                        >
                          Post to Stories wall →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROTOCOL STRIP ────────────────────────────────── */}
      <section className="bg-[#F5F5F5] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-12 text-center">
            The Protocol
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'BUILD', desc: 'Create something that matters' },
              { step: '02', title: 'MARK', desc: 'Add the wave mark' },
              { step: '03', title: 'SHARE', desc: 'Post with #NotWaiting' },
              { step: '04', title: 'TAG', desc: 'Invite others to join' },
              { step: '05', title: 'GROW', desc: 'Build the movement' }
            ].map((item) => (
              <div key={item.step} className="bg-white border-2 border-[#0C0C0A] p-6 text-center">
                <div className="text-sm font-mono text-[#EBBD06] font-black mb-2">
                  {item.step}
                </div>

                <h3 className="text-xl font-black uppercase mb-2">{item.title}</h3>

                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}