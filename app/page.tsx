'use client'
import React, { useEffect, useRef, useState } from 'react'
import Chart from '../components/Chart'
import BollingerSettings from '../components/BollingerSettings'
import type { BollingerSettings as Settings, OHLCV } from '../types'

export default function Home() {
  const [showSettings, setShowSettings] = useState(false)
  const [indicatorEnabled, setIndicatorEnabled] = useState(true)
  const [ohlcv, setOhlcv] = useState<OHLCV[]>([])
  const [settings, setSettings] = useState<Settings>({
    inputs: { length: 20, multiplier: 2, offset: 0, source: 'close' },
    style: {
      basis: { visible: true, color: '#F59E0B', width: 1, style: 'solid' },
      upper: { visible: true, color: '#10B981', width: 1, style: 'solid' },
      lower: { visible: true, color: '#EF4444', width: 1, style: 'solid' },
      background: { visible: true, opacity: 0.12, color: '#10B981' }
    }
  })

  useEffect(() => {
    let aborted = false
    const load = async () => {
      try {
        const res = await fetch('/data/ohlcv.json')
        if (!res.ok) return
        const json = await res.json()
        if (!aborted) setOhlcv(json)
      } catch {}
    }
    load()
    return () => { aborted = true }
  }, [])

  return (
    <div className="p-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Bollinger Bands - Demo</h1>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-slate-700 rounded"
              onClick={() => setIndicatorEnabled(v => !v)}
            >
              {indicatorEnabled ? 'Remove Indicator' : 'Add Indicator'}
            </button>
            <button
              className="px-3 py-1 bg-blue-600 rounded"
              onClick={() => setShowSettings(true)}
            >
              Settings
            </button>
          </div>
        </header>

        <div className="bg-[#071024] p-4 rounded">
          <Chart
            ohlcv={ohlcv}
            indicatorEnabled={indicatorEnabled}
            indicatorSettings={settings}
          />
        </div>
      </div>

      {showSettings && (
        <BollingerSettings
          initialSettings={settings}
          onClose={() => setShowSettings(false)}
          onSave={(s) => {
            setShowSettings(false)
            setSettings(s)
          }}
        />
      )}
    </div>
  )
}
