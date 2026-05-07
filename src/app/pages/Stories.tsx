import { useState, useEffect, useCallback } from 'react';
import { fetchStories, type Story } from '../utils/api';

// ── Sector config — aligned with Home.tsx sectors + AI form + manifesto form ──
const SECTORS = [
  { value: 'fintech',     label: 'Fintech',     color: '#027A4F', text: '#fff' },
  { value: 'agriculture', label: 'Agriculture', color: '#EBBD06', text: '#0C0C0A' },
  { value: 'music',       label: 'Music',       color: '#DD3935', text: '#fff' },
  { value: 'health',      label: 'Health',      color: '#0145F2', text: '#fff' },
  { value: 'tech',        label: 'Tech',        color: '#0C0C0A', text: '#fff' },
  { value: 'education',   label: 'Education',   color: '#EBBD06', text: '#0C0C0A' },
  { value: 'climate',     label: 'Climate',     color: '#027A4F', text: '#fff' },
  { value: 'media',       label: 'Media',       color: '#DD3935', text: '#fff' },
  { value: 'fashion',     label: 'Fashion',     color: '#0145F2', text: '#fff' },
  { value: 'sports',      label: 'Sports',      color: '#DD3935', text: '#fff' },
  { value: 'film',        label: 'Film',        color: '#0C0C0A', text: '#fff' },
  { value: 'policy',      label: 'Policy',      color: '#027A4F', text: '#fff' },
  { value: 'other',      label: 'Other',      color: '#18027a', text: '#fff' },
];

const SECTOR_MAP = Object.fromEntries(SECTORS.map(s => [s.value, s]));

// ── Countries — aligned with Home.tsx africanCountries list ──
const COUNTRIES = [
  { value: 'all',                     label: 'All Countries' },
  { value: 'algeria',                 label: 'Algeria' },
  { value: 'angola',                  label: 'Angola' },
  { value: 'benin',                   label: 'Benin' },
  { value: 'botswana',                label: 'Botswana' },
  { value: 'burkina-faso',            label: 'Burkina Faso' },
  { value: 'burundi',                 label: 'Burundi' },
  { value: 'cabo-verde',              label: 'Cabo Verde' },
  { value: 'cameroon',                label: 'Cameroon' },
  { value: 'central-african-republic',label: 'Central African Republic' },
  { value: 'chad',                    label: 'Chad' },
  { value: 'comoros',                 label: 'Comoros' },
  { value: 'congo-brazzaville',       label: 'Congo (Brazzaville)' },
  { value: 'congo-kinshasa',          label: 'Congo (Kinshasa)' },
  { value: 'cote-divoire',            label: "Côte d'Ivoire" },
  { value: 'djibouti',               label: 'Djibouti' },
  { value: 'egypt',                   label: 'Egypt' },
  { value: 'equatorial-guinea',       label: 'Equatorial Guinea' },
  { value: 'eritrea',                 label: 'Eritrea' },
  { value: 'eswatini',                label: 'Eswatini' },
  { value: 'ethiopia',                label: 'Ethiopia' },
  { value: 'gabon',                   label: 'Gabon' },
  { value: 'gambia',                  label: 'Gambia' },
  { value: 'ghana',                   label: 'Ghana' },
  { value: 'guinea',                  label: 'Guinea' },
  { value: 'guinea-bissau',           label: 'Guinea-Bissau' },
  { value: 'kenya',                   label: 'Kenya' },
  { value: 'lesotho',                 label: 'Lesotho' },
  { value: 'liberia',                 label: 'Liberia' },
  { value: 'libya',                   label: 'Libya' },
  { value: 'madagascar',              label: 'Madagascar' },
  { value: 'malawi',                  label: 'Malawi' },
  { value: 'mali',                    label: 'Mali' },
  { value: 'mauritania',              label: 'Mauritania' },
  { value: 'mauritius',               label: 'Mauritius' },
  { value: 'morocco',                 label: 'Morocco' },
  { value: 'mozambique',              label: 'Mozambique' },
  { value: 'namibia',                 label: 'Namibia' },
  { value: 'niger',                   label: 'Niger' },
  { value: 'nigeria',                 label: 'Nigeria' },
  { value: 'rwanda',                  label: 'Rwanda' },
  { value: 'sao-tome-and-principe',   label: 'São Tomé and Príncipe' },
  { value: 'senegal',                 label: 'Senegal' },
  { value: 'seychelles',              label: 'Seychelles' },
  { value: 'sierra-leone',            label: 'Sierra Leone' },
  { value: 'somalia',                 label: 'Somalia' },
  { value: 'south-africa',            label: 'South Africa' },
  { value: 'south-sudan',             label: 'South Sudan' },
  { value: 'sudan',                   label: 'Sudan' },
  { value: 'tanzania',                label: 'Tanzania' },
  { value: 'togo',                    label: 'Togo' },
  { value: 'tunisia',                 label: 'Tunisia' },
  { value: 'uganda',                  label: 'Uganda' },
  { value: 'western-sahara',          label: 'Western Sahara' },
  { value: 'zambia',                  label: 'Zambia' },
  { value: 'zimbabwe',                label: 'Zimbabwe' },
  { value: 'diaspora',                label: 'African Diaspora' },
  { value: 'global',                  label: 'Global Supporter' },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

function StoryCard({ story }: { story: Story }) {
  const sector = SECTOR_MAP[story.wave_tag] ?? { color: '#0C0C0A', text: '#fff', label: story.wave_tag };

  return (
    <div className="bg-white border-2 border-[#0C0C0A] p-8 hover:border-[#dd3935] transition-colors">
      {/* Sector badge with its own colour */}
      <div
        className="inline-block text-xs font-mono uppercase font-black mb-3 px-2 py-1"
        style={{ backgroundColor: sector.color, color: sector.text }}
      >
        {sector.label}
      </div>

      <h2 className="text-2xl font-black uppercase mb-1">{story.first_name}</h2>
      <div className="text-sm text-gray-500 mb-4">
        {story.country} · {timeAgo(story.created_at)}
      </div>

      <div
        className="border-l-4 pl-4"
        style={{ borderColor: sector.color }}
      >
        <p className="text-base leading-relaxed whitespace-pre-line">{story.caption}</p>
      </div>
    </div>
  );
}

export default function Stories() {
  const [selectedSector, setSelectedSector]   = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [stories, setStories]                 = useState<Story[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const [page, setPage]                       = useState(0);
  const [hasMore, setHasMore]                 = useState(true);

  const load = useCallback(async (
    sector: string,
    country: string,
    pageNum: number,
    append = false
  ) => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchStories({
        page: pageNum,
        wave: sector === 'all' ? undefined : sector,
      });

      // Country filtering is done client-side since the API only supports wave filter
      let filtered = result.stories;
      if (country !== 'all') {
        filtered = filtered.filter(
          s => s.country?.toLowerCase().replace(/\s+/g, '-') === country ||
               s.country?.toLowerCase() === country
        );
      }

      setStories(prev => append ? [...prev, ...filtered] : filtered);
      setHasMore(result.stories.length === 12);
    } catch (err: any) {
      setError(err.message ?? 'Could not load stories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    load(selectedSector, selectedCountry, 0, false);
  }, [selectedSector, selectedCountry, load]);

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8 text-center">
            Wave Stories
          </h1>
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto">
            Real builders. Real innovation. These are the people who are #NotWaiting.
          </p>

          {/* ── Filters ────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">

            {/* Country filter */}
            <div className="flex flex-col items-center md:items-start">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                Filter by country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border-2 border-[#0C0C0A] px-4 py-2 font-mono text-sm focus:border-[#DD3935] outline-none min-w-[200px]"
              >
                {COUNTRIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Country filter */}
            <div className="flex flex-col items-center md:items-start">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
                Filter by sector
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="border-2 border-[#0C0C0A] px-4 py-2 font-mono text-sm focus:border-[#DD3935] outline-none min-w-[200px]"
              >
                <option value="all">All Sectors</option>
                {SECTORS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Sector pill filters ────────────────────────── */}
          <div className="flex flex-wrap gap-2 justify-center mb-16">
            <button
              onClick={() => setSelectedSector('all')}
              className="px-4 py-1.5 text-xs font-mono uppercase font-bold border-2 transition-colors"
              style={{
                borderColor: selectedSector === 'all' ? '#0C0C0A' : '#ddd',
                backgroundColor: selectedSector === 'all' ? '#0C0C0A' : 'transparent',
                color: selectedSector === 'all' ? '#fff' : '#888',
              }}
            >
              All
            </button>
            {SECTORS.map(s => (
              <button
                key={s.value}
                onClick={() => setSelectedSector(s.value)}
                className="px-4 py-1.5 text-xs font-mono uppercase font-bold border-2 transition-all"
                style={{
                  borderColor: selectedSector === s.value ? s.color : '#ddd',
                  backgroundColor: selectedSector === s.value ? s.color : 'transparent',
                  color: selectedSector === s.value ? s.text : '#888',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* ── States ────────────────────────────────────── */}
          {loading && page === 0 && (
            <div className="text-center py-16 text-gray-500">Loading stories...</div>
          )}
          {error && (
            <div className="text-center py-16 text-[#dd3935]">{error}</div>
          )}
          {!loading && stories.length === 0 && !error && (
            <div className="text-center py-16">
              <p className="text-xl mb-4">No stories yet for this filter.</p>
              <p className="text-gray-500">
                Use the AI caption tool on the home page to write and share yours!
              </p>
            </div>
          )}

          {/* ── Grid ──────────────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* ── Load more ─────────────────────────────────── */}
          {hasMore && !loading && stories.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  const n = page + 1;
                  setPage(n);
                  load(selectedSector, selectedCountry, n, true);
                }}
                className="border-2 border-[#0C0C0A] px-8 py-3 font-bold hover:bg-[#0C0C0A] hover:text-white transition-colors"
              >
                Load more
              </button>
            </div>
          )}

          {loading && page > 0 && (
            <div className="text-center mt-8 text-gray-500">Loading more...</div>
          )}

          {/* ── CTA ───────────────────────────────────────── */}
          <div className="bg-[#0C0C0A] text-white p-12 text-center mt-16">
            <h2 className="text-4xl font-black uppercase mb-4">Your Story Belongs Here</h2>
            <p className="text-xl mb-2">Use the AI helper on the home page to craft your wave.</p>
          </div>
        </div>
      </section>
    </div>
  );
}