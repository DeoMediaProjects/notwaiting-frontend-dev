import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { fetchDashboard, type DashboardData } from '../utils/api';

function StatCard({ label, value, delta, accent = '#EBBD06' }: {
  label: string; value: number; delta: string; accent?: string;
}) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">{label}</p>
      <p className="text-4xl font-black" style={{ color: accent }}>{value.toLocaleString()}</p>
      <p className="text-xs text-[#027A4F] mt-2 font-mono">{delta}</p>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-mono mb-1 text-gray-400">
        <span className="capitalize">{label}</span>
        <span>{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 bg-[#2A2A2A] overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${Math.round((value / Math.max(max, 1)) * 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [token, setToken]         = useState<string | null>(null);
  const [data, setData]           = useState<DashboardData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadData = useCallback(async (jwt: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchDashboard(jwt);
      setData(result);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.message ?? 'Failed to load dashboard');
      // Token rejected — force re-login
      if (err.message?.includes('401') || err.message?.toLowerCase().includes('unauthorized')) {
        setToken(null);
        await supabase.auth.signOut();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token);
        loadData(session.access_token);
      }
    });
  }, [loadData]);

  // Auto-refresh every 60 s while authenticated
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => loadData(token), 60_000);
    return () => clearInterval(interval);
  }, [token, loadData]);

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.session) {
        setError(authError?.message ?? 'Sign-in failed');
        return;
      }

      const jwt = authData.session.access_token;
      setToken(jwt);
      await loadData(jwt);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setToken(null);
    setData(null);
    setEmail('');
    setPassword('');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0C0C0A] flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <h1 className="text-3xl font-black uppercase text-white mb-2">Dashboard</h1>
          <p className="text-gray-500 text-sm mb-8 font-mono">Admin access only</p>

          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            className="w-full bg-[#1A1A1A] border border-[#333] text-white px-4 py-3 mb-3 text-center font-mono focus:border-[#DD3935] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            className="w-full bg-[#1A1A1A] border border-[#333] text-white px-4 py-3 mb-3 text-center font-mono focus:border-[#DD3935] outline-none"
          />

          {error && <p className="text-[#DD3935] text-sm mb-3 font-mono">{error}</p>}

          <button
            onClick={handleSignIn}
            disabled={loading || !email || !password}
            className="w-full bg-[#DD3935] hover:bg-[#C92F2B] text-white py-3 font-black uppercase tracking-wide transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>
      </div>
    );
  }

  const s = data?.stats;
  const maxWave    = Math.max(...(data?.waves.map(w => w.signer_count)    ?? [1]));
  const maxCountry = Math.max(...(data?.countries.map(c => c.signer_count) ?? [1]));

  return (
    <div className="min-h-screen bg-[#0C0C0A] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black uppercase mb-1">Coalition Dashboard</h1>
            <p className="text-xs font-mono text-gray-500">
              {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : 'Loading...'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => token && loadData(token)}
              disabled={loading}
              className="border border-[#333] px-4 py-2 text-xs font-mono text-gray-400 hover:border-[#DD3935] hover:text-[#DD3935] transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : '↻ Refresh'}
            </button>
            <button
              onClick={handleSignOut}
              className="border border-[#333] px-4 py-2 text-xs font-mono text-gray-400 hover:border-white hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Signatures" value={s?.total_signers   ?? 0} delta={`+${s?.signed_today   ?? 0} today`} />
          <StatCard label="Wave Marks" value={s?.total_marks     ?? 0} delta={`+${s?.marks_today    ?? 0} today`} accent="#DD3935" />
          <StatCard label="Shares"     value={s?.total_shares    ?? 0} delta={`+${s?.shares_today   ?? 0} today`} accent="#027A4F" />
          <StatCard label="Countries"  value={s?.total_countries ?? 0} delta="represented"                        accent="#EBBD06" />
        </div>

        {data?.last7Days && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 mb-8">
            <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Last 7 days</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Signed',        value: data.last7Days.signed,        color: '#EBBD06' },
                { label: 'Got mark',      value: data.last7Days.got_mark,      color: '#DD3935' },
                { label: 'Shared social', value: data.last7Days.shared_social, color: '#027A4F' },
                { label: 'Stories',       value: data.last7Days.shared_story,  color: '#5B8FFF' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-2xl font-black" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs font-mono text-gray-500 mt-1 uppercase">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Top waves</p>
            {(data?.waves ?? []).map(w => (
              <BarRow key={w.wave_tag} label={w.wave_tag} value={w.signer_count} max={maxWave} color="#EBBD06" />
            ))}
          </div>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Top countries</p>
            {(data?.countries ?? []).slice(0, 8).map(c => (
              <BarRow key={c.country} label={c.country} value={c.signer_count} max={maxCountry} color="#DD3935" />
            ))}
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Recent signers</p>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                {['Name', 'Country', 'Wave', 'When'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs text-gray-600 uppercase tracking-wide font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.recent ?? []).map((r, i) => {
                const mins = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 60_000);
                const when = mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
                return (
                  <tr key={i} className="border-b border-[#1E1E1E] hover:bg-[#222]">
                    <td className="py-2 px-3 text-white">{r.first_name}</td>
                    <td className="py-2 px-3 text-gray-400">{r.country}</td>
                    <td className="py-2 px-3">
                      {r.wave_tag
                        ? <span className="text-[#DD3935] border border-[#DD3935]/30 px-2 py-0.5 text-xs uppercase">{r.wave_tag}</span>
                        : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="py-2 px-3 text-gray-600 text-xs">{when}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
