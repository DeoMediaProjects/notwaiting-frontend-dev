import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { ManifestoSignForm } from '../components/ManifestoSignForm';
import { AiCaptionHelper } from '../components/AiCaptionHelper';
import { StatsSection, type StatsSectionHandle } from '../components/StatsSection';
import heroImage  from '../../imports/Untitled_design_(6).png';
import heroImage2 from '../../imports/image-4.png';
import heroShapes from '../../imports/web_template.png';
import patternBg  from '../../imports/PATTERN2.png';
import patternBg2 from '../../imports/PATTERN_1-1.png';
import waveMarkExample from '../../imports/image-2.png';
import { useNavigate } from 'react-router';

export default function Home() {
  const navigate = useNavigate()

  // Lifted state — shared between ManifestoSignForm and AiCaptionHelper
  const [signerId, setSignerId]   = useState<string | null>(() => sessionStorage.getItem('nw_signer_id'))
  const [firstName, setFirstName] = useState<string>(() => sessionStorage.getItem('nw_first_name') ?? '')

  const [activeHero, setActiveHero] = useState(0)

  const signOnRef  = useRef<HTMLDivElement>(null)
  const aiRef      = useRef<HTMLElement>(null)
  const statsRef   = useRef<StatsSectionHandle>(null)

  // Hero auto-advance
  useEffect(() => {
    const timer = setInterval(() => setActiveHero(prev => (prev === 0 ? 1 : 0)), 6000)
    return () => clearInterval(timer)
  }, [])

  const scrollToSignOn   = () => signOnRef.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToAiHelper = () => aiRef.current?.scrollIntoView({ behavior: 'smooth' })

  const handleSignSuccess = (id: string, name: string) => {
    setSignerId(id)
    setFirstName(name)
    statsRef.current?.refresh()
  }

  return (
    <div className="min-h-screen bg-white">


      {/* ── Hero slider ─── */}
      <section className="relative min-h-screen bg-white text-[#0C0C0A] overflow-hidden">
        {/* Slide 1 */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeHero === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-[#DD3935]">
              <div className="absolute inset-y-0 right-0 w-[70%] bg-[#DD3935]">
                <img src={heroImage} alt="#NotWaiting campaign portrait" className="absolute inset-0 w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#DD3935] via-[#DD3935]/70 via-[#DD3935]/25 to-transparent pointer-events-none" style={{ width: '44%' }} />
              </div>
            </div>
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="w-[70%] flex justify-center">
                <div className="relative w-[900px] max-w-[90vw] h-[600px]">
                  <img src={heroShapes} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" style={{ transform: 'scale(1.3)' }} />
                  <div className="absolute left-[18%] top-[28%] max-w-[460px]">
                    <p className="font-mono text-xs md:text-sm uppercase text-black font-black mb-2">Entertainment, Tech, Finance, Agriculture & More</p>
                    <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-[#DD3935] mb-4">Join The Wave</h1>
                    <p className="font-black text-sm md:text-base leading-tight text-black mb-8">
                      Africa is building, creating and leading right now.<br />
                      On the 25th of May, we make it impossible to ignore.<br />
                      Wear the Mark. Declare Your Wave. Pass it on.
                    </p>
                  </div>
                  <p onClick={scrollToSignOn} className="absolute left-[30%] bottom-[20%] text-sm md:text-base font-black uppercase text-[#DD3935] cursor-pointer hover:underline underline-offset-4">
                    Ready to join the movement?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${activeHero === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="w-[30%] bg-[#0C0C0A]" />
              <div className="w-[70%] bg-[#0C0C0A] relative">
                <img src={heroImage2} alt="#NotWaiting campaign portrait" className="absolute inset-0 w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0A] via-[#0C0C0A]/70 via-[#0C0C0A]/30 to-transparent pointer-events-none" style={{ width: '50%' }} />
              </div>
            </div>
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="w-[70%] flex justify-center">
                <div className="relative w-[900px] max-w-[90vw] h-[600px]">
                  <img src={heroShapes} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" style={{ transform: 'scale(1.3)' }} />
                  <div className="absolute left-[18%] top-[28%] max-w-[460px]">
                    <p className="font-mono text-xs md:text-sm uppercase text-black font-black mb-2">Entertainment, Tech, Finance, Agriculture & More</p>
                    <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-[#DD3935] mb-4">25 May 2026</h2>
                    <p className="font-black text-sm md:text-base leading-tight text-black mb-8">One day. One mark. One continent<br />already moving</p>
                  </div>
                  <p onClick={scrollToSignOn} className="absolute left-[30%] bottom-[20%] text-sm md:text-base font-black uppercase text-[#DD3935] cursor-pointer hover:underline underline-offset-4">
                    Ready to join the movement?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {[0, 1].map(i => (
            <button key={i} onClick={() => setActiveHero(i)}
              className={`h-3 w-3 rounded-full transition ${activeHero === i ? 'bg-[#DD3935]' : 'bg-white/40'}`}
              aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-30 grid grid-cols-3 h-[5px]">
          <div className="bg-[#DD3935]" /><div className="bg-[#EBBD06]" /><div className="bg-[#027A4F]" />
        </div>
      </section>

      {/* ── Manifesto text ─── */}
      <section className="relative bg-white py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <img src={patternBg2} alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="space-y-8 text-lg md:text-xl leading-relaxed">
            <p>I believe in my country and I believe in Africa.</p>
            <p>I believe in the people, places, ideas, and bold actions moving this continent forward every day.</p>
            <div className="border-l-4 border-[#dd3935] pl-6 my-12 py-6">
              <p className="text-xl md:text-2xl font-bold leading-relaxed">
                By signing this manifesto and joining the Opportunity Africa wave, I commit to using my voice, my work, and my platforms to show the progress we are making.
              </p>
            </div>
            <div className="bg-[#F5F5F5] p-8 my-12">
              <p className="text-2xl md:text-3xl font-black leading-tight text-center">
                Because what we see, we believe in.<br />What we believe in, we back.<br />What we back, we build.
              </p>
            </div>
            <p className="text-2xl md:text-3xl font-black text-center">I am #NotWaiting.</p>
          </div>
          <div className="text-center mt-16">
            <p onClick={scrollToSignOn} className="text-xl md:text-2xl font-black uppercase text-[#DD3935] cursor-pointer hover:underline underline-offset-4 inline">
              Ready to join the movement?
            </p>
          </div>
        </div>
      </section>

      {/* ── Sign form ─── */}
      <ManifestoSignForm ref={signOnRef} onSuccess={handleSignSuccess} />

      {/* ── Wave mark teaser ─── */}
      <section className="bg-[#EBBD06] text-[#0C0C0A] py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <p className="font-mono text-2xl md:text-4xl uppercase font-black tracking-widest text-[#DD3935]">Step 2</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
                GET THE WAVE<br /><span className="text-[#DD3935]"> MARK</span>
              </h2>
              <p className="text-base md:text-lg text-[#0C0C0A]/90 leading-relaxed max-w-xl">
                The wave mark is the symbol of the African continent. Use it on every post, every profile, and every platform where you share your wave.
              </p>
              {[
                { n: '01', title: 'Apply the mark → Frame your work', desc: 'Add it to your profile picture, cover photo, or content.' },
                { n: '02', title: 'Share your wave → Post with #NotWaiting', desc: 'Include the hashtag and the wave mark in everything you post.' },
                { n: '03', title: 'Tag someone. Circle back on this.', desc: 'Invite others to join the coalition and wear the mark.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-4">
                  <span className="text-[#DD3935] font-black font-mono text-lg flex-shrink-0">{n}</span>
                  <div><h3 className="font-black text-lg mb-1">{title}</h3><p className="text-sm text-[#0C0C0A]/80">{desc}</p></div>
                </div>
              ))}
              <Button onClick={() => navigate('/get-mark')} className="text-base px-8 py-4">Open the wave mark tool →</Button>
            </div>
            <div className="space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img src={waveMarkExample} alt="Example of wave mark applied to profile photo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats section ─── */}
      <StatsSection ref={statsRef} onJoinClick={scrollToSignOn} />

      {/* ── AI caption helper ─── */}
      <AiCaptionHelper ref={aiRef} signerId={signerId} firstName={firstName} />

      {/* ── Protocol ─── */}
      <section className="bg-[#F5F5F5] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-12 text-center">The Protocol</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'BUILD',  desc: 'Create something that matters' },
              { step: '02', title: 'MARK',   desc: 'Add the wave mark' },
              { step: '03', title: 'SHARE',  desc: 'Post with #NotWaiting' },
              { step: '04', title: 'TAG',    desc: 'Invite others to join' },
              { step: '05', title: 'GROW',   desc: 'Build the movement' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white border-2 border-[#0C0C0A] p-6 text-center">
                <div className="text-sm font-mono text-[#EBBD06] font-black mb-2">{step}</div>
                <h3 className="text-xl font-black uppercase mb-2">{title}</h3>
                <p className="text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
