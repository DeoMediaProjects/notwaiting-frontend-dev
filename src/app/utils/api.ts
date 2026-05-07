// src/app/utils/api.ts
// All calls to the backend API go through this file.
// The base URL reads from the Vite env variable so it works
// in dev (localhost:3001) and production (your deployed server URL).

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`)
  return data as T
}

// ── Manifesto ─────────────────────────────────────────────────
export async function signManifesto(payload: {
  firstName: string
  country: string
  wave?: string
}) {
  return request<{ success: boolean; signerId: string }>('/api/manifesto', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getSignerCount() {
  return request<{ total_signers: number; total_countries: number }>('/api/manifesto/count')
}

// ── Claude AI ─────────────────────────────────────────────────
export async function generateCaption(payload: {
  waveTag: string
  subject: 'me' | 'someone' | 'organisation'
  detail?: string
  customPrompt?: string
}) {
  return request<{ caption: string }>('/api/claude', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ── Stories ───────────────────────────────────────────────────
export async function fetchStories(params?: {
  page?: number
  limit?: number
  wave?: string
  country?: string
}) {
  const qs = new URLSearchParams()
  if (params?.page !== undefined) qs.set('page', String(params.page))
  if (params?.limit !== undefined) qs.set('limit', String(params.limit))
  if (params?.wave) qs.set('wave', params.wave)
  if (params?.country) qs.set('country', params.country)
  return request<{ stories: Story[] }>(`/api/stories?${qs}`)
}

export async function publishStory(payload: {
  signerId: string
  caption: string
  waveTag: string
}) {
  return request<{ success: boolean; storyId: string }>('/api/stories', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ── Actions ───────────────────────────────────────────────────
export async function trackAction(payload: {
  signerId: string
  action: 'got_mark' | 'shared_social' | 'shared_story'
  metadata?: Record<string, unknown>
}) {
  return request<{ success: boolean }>('/api/actions', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).catch(() => {/* non-blocking — don't break UX if tracking fails */})
}

// ── Dashboard ─────────────────────────────────────────────────
export async function fetchDashboard(password: string) {
  return request<DashboardData>('/api/dashboard', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${password}`,
    },
  })
}

// ── Types ─────────────────────────────────────────────────────
export interface Story {
  id: string
  first_name: string
  country: string
  wave_tag: string
  caption: string
  created_at: string
}

export interface DashboardData {
  stats: {
    total_signers: number
    total_countries: number
    total_marks: number
    total_shares: number
    signed_today: number
    marks_today: number
    shares_today: number
  }
  waves: { wave_tag: string; signer_count: number }[]
  countries: { country: string; signer_count: number }[]
  recent: { first_name: string; country: string; wave_tag: string | null; created_at: string }[]
  last7Days: { signed: number; got_mark: number; shared_social: number; shared_story: number }
}
