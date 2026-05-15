import { useState } from 'react';
import { signManifesto } from '../utils/api';

export function ManifestoInlineForm() {
  const [form, setForm] = useState({ firstName: '', country: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signed, setSigned] = useState(false)

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signManifesto({
        firstName: form.firstName.trim(),
        country: form.country.trim(),
        email: form.email.trim() || undefined,
      })
      setSigned(true)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (signed) {
    return (
      <div className="mt-6 flex items-center gap-3 text-[#027A4F]">
        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#027A4F] flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="font-black text-lg">You've signed the manifesto, {form.firstName}.</p>
          <p className="text-sm text-[#0C0C0A]/70 font-mono">Welcome to the wave. #NotWaiting</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5 text-xs font-mono uppercase tracking-widest text-[#0C0C0A]/60">
            Full name <span className="text-[#DD3935]">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={60}
            placeholder="Your full name"
            value={form.firstName}
            onChange={set('firstName')}
            className="w-full px-4 py-3 bg-white border-2 border-[#0C0C0A] text-sm font-mono focus:border-[#027A4F] focus:outline-none transition-colors placeholder:text-[#0C0C0A]/30"
          />
        </div>
        <div>
          <label className="block mb-1.5 text-xs font-mono uppercase tracking-widest text-[#0C0C0A]/60">
            Country <span className="text-[#DD3935]">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={80}
            placeholder="Your country"
            value={form.country}
            onChange={set('country')}
            className="w-full px-4 py-3 bg-white border-2 border-[#0C0C0A] text-sm font-mono focus:border-[#027A4F] focus:outline-none transition-colors placeholder:text-[#0C0C0A]/30"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1.5 text-xs font-mono uppercase tracking-widest text-[#0C0C0A]/60">
          Email
        </label>
        <input
          type="email"
          maxLength={254}
          placeholder="your@email.com"
          value={form.email}
          onChange={set('email')}
          className="w-full px-4 py-3 bg-white border-2 border-[#0C0C0A] text-sm font-mono focus:border-[#027A4F] focus:outline-none transition-colors placeholder:text-[#0C0C0A]/30"
        />
      </div>

      {error && (
        <p className="text-[#DD3935] text-sm font-mono">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3 bg-[#DD3935] text-white font-black uppercase tracking-wide text-sm hover:bg-[#c42f2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing…' : 'Sign →'}
      </button>
    </form>
  )
}
