import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { Textarea } from './Textarea';
import { signManifesto, publishStory, trackAction } from '../utils/api';
import { AFRICAN_COUNTRIES_WITH_PLACEHOLDER } from '../constants/countries';
import waveImage from '../../imports/waves.png';

interface Props {
  onSuccess: (signerId: string, firstName: string) => void
}

const WAVE_OPTIONS = [
  { value: '',            label: 'Select your sector' },
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

export const ManifestoSignForm = forwardRef<HTMLDivElement, Props>(
  ({ onSuccess }, ref) => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
      firstName: '', country: '', wave: '', waveOther: '', subject: 'me', story: '',
    })
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [signerId, setSignerId] = useState<string | null>(null)

    const getManualShareText = () => {
      const story = formData.story.trim() || 'I just joined #NotWaiting — the movement for African builders, creators, and innovators. Africa is on a wave.'
      return `${story}\n\n#NotWaiting`
    }

    const trackSocial = async (platform: string) => {
      if (!signerId) return
      await trackAction({ signerId, action: 'shared_social', metadata: { platform, source: 'manual_manifesto' } })
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      if (!formData.story.trim()) {
        setError('Please write your story before publishing.')
        return
      }

      const effectiveWave = formData.wave === 'other'
        ? formData.waveOther.trim() || 'other'
        : formData.wave

      setLoading(true)
      try {
        const result = await signManifesto({
          firstName: formData.firstName,
          country: formData.country,
          wave: effectiveWave || undefined,
        })

        setSignerId(result.signerId)
        sessionStorage.setItem('nw_signer_id', result.signerId)
        sessionStorage.setItem('nw_first_name', formData.firstName)

        await publishStory({ signerId: result.signerId, caption: formData.story.trim(), waveTag: effectiveWave || 'other' })
        await trackAction({ signerId: result.signerId, action: 'shared_story', metadata: { source: 'manual_manifesto', subject: formData.subject } })

        setSubmitted(true)
        onSuccess(result.signerId, formData.firstName)
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    return (
      <section ref={ref} className="bg-[#F5F5F5] py-20 md:py-32 px-6">
        <div className="max-w-[1400px] mx-auto">
          {!submitted ? (
            <>
              <div className="text-center mb-14">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">Add Your Name.</h2>
                <p className="text-xl max-w-3xl mx-auto">Sign the manifesto, write your wave manually, and publish your story.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-10 items-start">
                <div className="relative w-full min-h-[760px] overflow-hidden -ml-20">
                  <img src={waveImage} alt="Wave manifesto" className="absolute inset-0 w-full h-full object-cover object-left" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input label="First name" type="text" required value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />

                  <Select label="Country" required options={AFRICAN_COUNTRIES_WITH_PLACEHOLDER} value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })} />

                  <div>
                    <label className="block mb-2 text-sm font-mono uppercase tracking-wide">
                      What's your wave? <span className="text-[#dd3935]">*</span>
                    </label>
                    <select required value={formData.wave}
                      onChange={(e) => setFormData({ ...formData, wave: e.target.value, waveOther: '' })}
                      className="w-full border-2 border-[#0C0C0A] bg-white px-4 py-3 font-mono text-sm focus:border-[#DD3935] outline-none">
                      {WAVE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {formData.wave === 'other' && (
                      <div className="mt-3">
                        <Input type="text" required maxLength={60} placeholder="Describe your wave..."
                          value={formData.waveOther} onChange={(e) => setFormData({ ...formData, waveOther: e.target.value })} />
                        <p className="text-xs text-gray-500 mt-1">{formData.waveOther.length}/60 characters</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-3 text-sm font-mono uppercase tracking-wide">Who is this about?</label>
                    <div className="flex gap-4 flex-wrap">
                      {['Me', 'Someone', 'Organisation'].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer px-4 py-3 border-2 border-[#0C0C0A] hover:bg-white transition-colors min-w-[120px]">
                          <input type="radio" name="manual-subject" value={option.toLowerCase()}
                            checked={formData.subject === option.toLowerCase()}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-5 h-5 accent-[#dd3935]" />
                          <span className="text-base">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Textarea label="Tell your story" rows={6} required maxLength={600}
                    placeholder="Write what you're building, creating, changing, or backing..."
                    value={formData.story} onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    className="bg-white" />
                  <p className="text-xs text-gray-500">{formData.story.length}/600 characters</p>

                  <Button type="submit" className="w-full text-lg py-5" disabled={loading}>
                    {loading ? 'Publishing...' : 'Sign and publish story →'}
                  </Button>

                  {error && <p className="text-[#dd3935] text-sm mt-2 text-center">{error}</p>}
                </form>
              </div>
            </>
          ) : (
            <div className="text-center space-y-8">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight">You're on the wave.</h2>
              <p className="text-2xl">Welcome, {formData.firstName}.</p>
              <p className="text-base text-gray-600">Your story has been published to the Stories wall.</p>

              <div className="flex flex-col md:flex-row gap-4 justify-center pt-8 flex-wrap">
                <Button onClick={() => navigate('/get-mark')} className="px-8 py-4">
                  Get the wave mark →
                </Button>
                <Button variant="secondary" onClick={async () => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getManualShareText())}`, '_blank')
                  await trackSocial('twitter')
                }} className="px-8 py-4">
                  Share #Notwaiting on X →
                </Button>
                <Button variant="secondary" onClick={async () => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`, '_blank')
                  navigator.clipboard.writeText(getManualShareText()).catch(() => {})
                  alert('Story copied. LinkedIn opened — paste your story into the post.')
                  await trackSocial('linkedin')
                }} className="px-8 py-4">
                  Share #Notwaiting on LinkedIn →
                </Button>
                <Button variant="secondary" onClick={async () => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank')
                  navigator.clipboard.writeText(getManualShareText()).catch(() => {})
                  alert('Story copied. Facebook opened — paste your story into the post.')
                  await trackSocial('facebook')
                }} className="px-8 py-4">
                  Share #Notwaiting on Facebook →
                </Button>
                <Button variant="secondary" onClick={async () => {
                  navigator.clipboard.writeText(getManualShareText()).catch(() => {})
                  alert('Story copied. You can now paste it on Instagram.')
                  await trackSocial('instagram')
                }} className="px-8 py-4">
                  Copy #Notwaiting for Instagram →
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }
)

ManifestoSignForm.displayName = 'ManifestoSignForm'
