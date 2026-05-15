import { useState, forwardRef } from 'react';
import { Copy } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { generateCaption, publishStory, trackAction } from '../utils/api';
import { copyToClipboard } from '../utils/clipboard';

interface Props {
  signerId: string | null
  firstName: string
}

const SECTOR_OPTIONS = [
  { value: 'fintech',     label: 'Fintech' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'music',       label: 'Music' },
  { value: 'health',      label: 'Health' },
  { value: 'tech',        label: 'Tech' },
  { value: 'education',   label: 'Education' },
  { value: 'climate',     label: 'Climate' },
  { value: 'media',       label: 'Media' },
  { value: 'fashion',     label: 'Fashion' },
  { value: 'sports',      label: 'Sports' },
  { value: 'film',        label: 'Film' },
  { value: 'policy',      label: 'Policy' },
  { value: 'other',       label: 'Other' },
]

export const AiCaptionHelper = forwardRef<HTMLElement, Props>(
  ({ signerId, firstName }, ref) => {
    const [category, setCategory]         = useState('')
    const [customCategory, setCustomCategory] = useState('')
    const [about, setAbout]               = useState('me')
    const [name, setName]                 = useState('')
    const [detail, setDetail]             = useState('')
    const [prompt, setPrompt]             = useState('Write a caption about someone building in fintech')
    const [currentText, setCurrentText]   = useState('')
    const [previousText, setPreviousText] = useState('')
    const [rewriteCount, setRewriteCount] = useState(0)
    const [loading, setLoading]           = useState(false)
    const [copied, setCopied]             = useState(false)

    const buildPrompt = (aboutVal: string, cat: string, nameVal: string) => {
      const wave = cat || 'tech'
      if (aboutVal === 'me') return `Write a caption about ${firstName || 'myself'} building in ${wave}`
      if (aboutVal === 'someone') return `Write a caption about ${nameVal || 'someone'} building in ${wave}`
      return `Write a caption about ${nameVal || 'an organisation'} building in ${wave}`
    }

    const effectiveCategory = () => category === 'other' ? customCategory || 'tech' : category || 'tech'

    const generate = async (style?: 'shorter' | 'bold') => {
      setLoading(true)
      try {
        let result
        if (style) {
          result = await generateCaption({
            waveTag: effectiveCategory(),
            subject: about as 'me' | 'someone' | 'organisation',
            customPrompt: `${prompt}. Make it ${style === 'shorter' ? 'shorter and punchier' : 'bolder and more powerful'}.`,
          })
        } else {
          result = await generateCaption({
            waveTag: effectiveCategory(),
            subject: about as 'me' | 'someone' | 'organisation',
            detail: detail || undefined,
            customPrompt: prompt || undefined,
          })
        }

        setPreviousText(currentText)
        setCurrentText(result.caption)
        setRewriteCount(prev => currentText ? prev + 1 : 0)
      } catch (err: any) {
        alert(err.message ?? 'Could not generate caption. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    const handleCopy = async (text: string) => {
      await copyToClipboard(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    const shareOnPlatform = async (platform: string, openUrl?: string) => {
      if (openUrl) window.open(openUrl, '_blank')
      if (platform !== 'twitter') {
        await copyToClipboard(`${currentText}\n\n#NotWaiting`)
        if (platform === 'linkedin') alert('Caption copied! LinkedIn is open — paste it into your post.')
        if (platform === 'facebook') alert('Caption copied! Facebook is open — paste it into your post.')
        if (platform === 'instagram') alert('Caption copied! Open Instagram to paste it.')
      }
      if (signerId) {
        trackAction({ signerId, action: 'shared_social', metadata: { platform } })
      }
    }

    const postToWall = async () => {
      if (!signerId) {
        alert('Sign the manifesto first, then you can share to the Stories wall!')
        return
      }
      try {
        await publishStory({ signerId, caption: currentText, waveTag: effectiveCategory() })
        trackAction({ signerId, action: 'shared_story', metadata: { source: 'ai_helper' } })
        alert('Your story is live on the Stories wall! 🌊')
      } catch (err: any) {
        alert(err.message ?? 'Could not publish story')
      }
    }

    return (
      <section ref={ref as React.RefObject<HTMLElement>} className="bg-white py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 text-center">
            Not sure what to write?
          </h2>
          <p className="text-center text-base mb-12">Let us help you craft your wave message.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ── Inputs ─── */}
            <div className="space-y-6 md:pr-4">
              <div>
                <label className="block mb-2 text-sm font-mono uppercase tracking-wide">What's your wave?</label>
                <select value={category} onChange={(e) => {
                  setCategory(e.target.value)
                  setCustomCategory('')
                  setPrompt(buildPrompt(about, e.target.value === 'other' ? '' : e.target.value, name))
                }} className="w-full border-2 border-[#0C0C0A] bg-white px-4 py-3 font-mono text-sm focus:border-[#DD3935] outline-none">
                  <option value="">Select sector</option>
                  {SECTOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {category === 'other' && (
                  <div className="mt-3">
                    <Input type="text" placeholder="Describe your sector..." maxLength={60} value={customCategory}
                      onChange={(e) => {
                        setCustomCategory(e.target.value)
                        setPrompt(buildPrompt(about, e.target.value, name))
                      }} />
                    <p className="text-xs text-gray-500 mt-1">{customCategory.length}/60 characters</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-3 text-sm font-mono uppercase tracking-wide">Who is this about?</label>
                <div className="flex gap-4 flex-wrap">
                  {['Me', 'Someone', 'Organisation'].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-[#0C0C0A] hover:bg-[#F5F5F5] transition-colors min-w-[120px]">
                      <input type="radio" name="about" value={option.toLowerCase()} checked={about === option.toLowerCase()}
                        onChange={(e) => {
                          const val = e.target.value
                          setAbout(val)
                          setName(val === 'me' ? '' : name)
                          setPrompt(buildPrompt(val, effectiveCategory(), val === 'me' ? '' : name))
                        }} className="w-5 h-5 accent-[#dd3935]" />
                      <span className="text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {about !== 'me' && (
                <div>
                  <label className="block mb-2 text-sm font-mono uppercase tracking-wide">
                    {about === 'someone' ? 'Person name' : 'Organisation name'}
                  </label>
                  <Input type="text" placeholder={about === 'someone' ? 'Enter their name' : 'Enter organisation name'}
                    value={name} onChange={(e) => {
                      setName(e.target.value)
                      setPrompt(buildPrompt(about, effectiveCategory(), e.target.value))
                    }} />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-mono uppercase tracking-wide">Optional detail</label>
                <Input type="text" maxLength={120} placeholder="Add a short detail (optional)" value={detail}
                  onChange={(e) => setDetail(e.target.value)} />
                <p className="text-xs text-gray-500 mt-2">{detail.length}/120 characters</p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-mono uppercase tracking-wide">Prompt</label>
                <Textarea rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to write about..." className="bg-[#F5F5F5]" />
                <p className="text-xs text-gray-500 mt-2">Edit this prompt to customize your caption</p>
              </div>

              <Button onClick={() => generate()} className="w-full py-5 text-lg" disabled={loading}>
                {loading ? 'Writing…' : 'Write my wave →'}
              </Button>
            </div>

            {/* ── Output ─── */}
            <div className="md:pl-4">
              <div className="bg-[#F5F5F5] border-2 border-[#0C0C0A] min-h-[500px] flex flex-col">
                <div className="flex-1 p-6">
                  {!currentText && !loading && (
                    <div className="bg-white border-2 border-[#0C0C0A] p-4">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Tell me what you're trying to say — I'll help you write it.
                      </p>
                    </div>
                  )}

                  {loading && (
                    <div className="bg-white border-2 border-[#0C0C0A] p-4">
                      <p className="text-sm text-gray-500">Writing your wave...</p>
                    </div>
                  )}

                  {currentText && !loading && (
                    <div>
                      <div className="bg-white border-2 border-[#0C0C0A] p-4 mb-4">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{currentText}</p>
                      </div>

                      <p className="text-xs text-gray-400 mb-3">
                        {rewriteCount < 2
                          ? `${2 - rewriteCount} rewrite${2 - rewriteCount === 1 ? '' : 's'} remaining`
                          : 'Max rewrites reached — use undo or start fresh'}
                      </p>

                      <div className="flex gap-2 flex-wrap mb-3">
                        <Button onClick={() => handleCopy(currentText)} className="px-4 py-2 text-sm">
                          <Copy size={14} className="inline mr-2" />
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button variant="secondary" onClick={() => generate()}
                          className="px-4 py-2 text-sm" disabled={rewriteCount >= 2 || loading}>
                          Rewrite →
                        </Button>
                        {previousText && (
                          <Button variant="secondary" onClick={() => {
                            setCurrentText(previousText)
                            setPreviousText('')
                            setRewriteCount(prev => Math.max(0, prev - 1))
                          }} className="px-4 py-2 text-sm border-[#EBBD06] text-[#0C0C0A] bg-[#EBBD06] hover:bg-[#D4A900]">
                            ← Undo
                          </Button>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap mb-3">
                        {(['shorter', 'bold'] as const).map(style => (
                          <button key={style} onClick={() => generate(style)}
                            disabled={rewriteCount >= 2 || loading}
                            className="px-3 py-1.5 text-xs border border-[#0C0C0A] hover:bg-[#0C0C0A] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                            {style === 'shorter' ? 'Make shorter' : 'More bold'}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => shareOnPlatform('twitter',
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${currentText}\n\n#NotWaiting`)}`)}
                          className="px-3 py-1.5 text-xs bg-[#0C0C0A] text-white hover:bg-[#DD3935] transition-colors">
                          Share on X →
                        </button>
                        <button onClick={() => shareOnPlatform('linkedin',
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`)}
                          className="px-3 py-1.5 text-xs bg-[#0C0C0A] text-white hover:bg-[#DD3935] transition-colors">
                          Share on LinkedIn →
                        </button>
                        <button onClick={() => shareOnPlatform('facebook',
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`)}
                          className="px-3 py-1.5 text-xs bg-[#0C0C0A] text-white hover:bg-[#DD3935] transition-colors">
                          Share on Facebook →
                        </button>
                        <button onClick={() => shareOnPlatform('instagram')}
                          className="px-3 py-1.5 text-xs bg-[#0C0C0A] text-white hover:bg-[#DD3935] transition-colors">
                          Copy for Instagram →
                        </button>
                        <button onClick={postToWall}
                          className="px-3 py-1.5 text-xs border border-[#EBBD06] text-[#0C0C0A] bg-[#EBBD06] hover:bg-[#D4A900] transition-colors">
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
    )
  }
)

AiCaptionHelper.displayName = 'AiCaptionHelper'
