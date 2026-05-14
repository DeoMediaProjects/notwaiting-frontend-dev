import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { getSignerCount } from '../utils/api';
import { Counter } from './Counter';
import { Ticker } from './Ticker';
import { Button } from './Button';
import { TICKER_SECTORS } from '../constants/sectors';

interface Props {
  onJoinClick: () => void
}

export interface StatsSectionHandle {
  refresh: () => void
}

export const StatsSection = forwardRef<StatsSectionHandle, Props>(
  ({ onJoinClick }, ref) => {
    const [stats, setStats] = useState({ total_signers: 0, total_countries: 0 })

    const load = useCallback(async () => {
      try {
        const data = await getSignerCount()
        setStats({ total_signers: data.total_signers ?? 0, total_countries: data.total_countries ?? 0 })
      } catch {
        // Non-critical — counter stays at last known value
      }
    }, [])

    useImperativeHandle(ref, () => ({ refresh: load }))

    useEffect(() => { load() }, [load])

    return (
      <section className="relative bg-white text-[#0C0C0A] py-18 md:py-28 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Counter target={stats.total_signers} />

          <p className="text-3xl md:text-5xl font-black mt-6 mb-4">
            People are on the <span className="text-[#C9A228]">wave.</span>
          </p>

          <div className="inline-flex items-center gap-6 bg-[#0C0C0A]/5 rounded-full px-6 py-2 mb-12">
            <span className="text-base md:text-lg text-[#0C0C0A]/80">
              <span className="text-[#DD3935] font-black text-xl">{stats.total_signers.toLocaleString()}</span>{' '}people
            </span>
            <span className="w-px h-4 bg-[#0C0C0A]/20" />
            <span className="text-base md:text-lg text-[#0C0C0A]/80">
              <span className="text-[#DD3935] font-black text-xl">{stats.total_countries}</span>{' '}countries
            </span>
          </div>

          <div className="py-8 border-y border-[#0C0C0A]/20">
            <Ticker items={TICKER_SECTORS} />
          </div>
{/* 
          <div className="mt-12">
            <Button onClick={onJoinClick} className="text-lg px-12 py-5">
              Join the movement →
            </Button>
          </div> */}
        </div>
      </section>
    )
  }
)

StatsSection.displayName = 'StatsSection'
