'use client'
import React, { useMemo, useState } from 'react'
import type { BollingerSettings as Settings } from '../types'

type Props = {
  initialSettings: Settings
  onClose: () => void
  onSave: (s: Settings) => void
}

const defaultSettings: Settings = {
  inputs: { length: 20, multiplier: 2, offset: 0, source: 'close' },
  style: {
    basis: { visible: true, color: '#F59E0B', width: 1, style: 'solid' },
    upper: { visible: true, color: '#10B981', width: 1, style: 'solid' },
    lower: { visible: true, color: '#EF4444', width: 1, style: 'solid' },
    background: { visible: true, opacity: 0.12, color: '#10B981' }
  }
}

export default function BollingerSettings({ initialSettings, onClose, onSave }: Props) {
  const init = useMemo<Settings>(() => ({ ...defaultSettings, ...initialSettings, style: { ...defaultSettings.style, ...(initialSettings?.style || {}) } }), [initialSettings])
  const [inputs, setInputs] = useState(init.inputs)
  const [style, setStyle] = useState(init.style)
  const [tab, setTab] = useState<'inputs' | 'style'>('inputs')

  const save = () => onSave({ inputs, style })

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="bg-[#071024] rounded p-6 w-[760px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Bollinger Bands Settings</h2>
          <button className="text-slate-300" onClick={onClose}>✕</button>
        </div>

        <div className="border-b border-slate-700 mb-4 flex gap-4">
          <button className={`py-2 ${tab==='inputs'?'text-white border-b-2 border-blue-500':'text-slate-400'}`} onClick={() => setTab('inputs')}>Inputs</button>
          <button className={`py-2 ${tab==='style'?'text-white border-b-2 border-blue-500':'text-slate-400'}`} onClick={() => setTab('style')}>Style</button>
        </div>

        {tab === 'inputs' && (
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              Length
              <input className="mt-1 p-2 bg-slate-800 rounded" type="number" value={inputs.length} onChange={e => setInputs({ ...inputs, length: Math.max(1, Number(e.target.value)) })} />
            </label>
            <label className="flex flex-col">
              Basic MA Type
              <select className="mt-1 p-2 bg-slate-800 rounded" value={'SMA'} onChange={() => {}}>
                <option value="SMA">SMA</option>
              </select>
            </label>
            <label className="flex flex-col">
              Source
              <select className="mt-1 p-2 bg-slate-800 rounded" value={inputs.source} onChange={e => setInputs({ ...inputs, source: e.target.value as any })}>
                <option value="close">Close</option>
              </select>
            </label>
            <label className="flex flex-col">
              StdDev (multiplier)
              <input className="mt-1 p-2 bg-slate-800 rounded" type="number" step="0.1" value={inputs.multiplier} onChange={e => setInputs({ ...inputs, multiplier: Number(e.target.value) })} />
            </label>
            <label className="flex flex-col">
              Offset
              <input className="mt-1 p-2 bg-slate-800 rounded" type="number" value={inputs.offset} onChange={e => setInputs({ ...inputs, offset: Number(e.target.value) })} />
            </label>
          </div>
        )}

        {tab === 'style' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 grid grid-cols-2 gap-4">
              {(['basis','upper','lower'] as const).map(key => (
                <div key={key} className="bg-slate-900/40 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="capitalize">{key} line</span>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={style[key].visible} onChange={e => setStyle({ ...style, [key]: { ...style[key], visible: e.target.checked } })} /> Visible
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex flex-col text-sm">
                      Color
                      <input type="color" className="mt-1 h-9 rounded bg-transparent" value={style[key].color} onChange={e => setStyle({ ...style, [key]: { ...style[key], color: e.target.value } })} />
                    </label>
                    <label className="flex flex-col text-sm">
                      Width
                      <input type="number" className="mt-1 p-2 bg-slate-800 rounded" min={1} max={5} value={style[key].width} onChange={e => setStyle({ ...style, [key]: { ...style[key], width: Number(e.target.value) } })} />
                    </label>
                    <label className="flex flex-col text-sm">
                      Style
                      <select className="mt-1 p-2 bg-slate-800 rounded" value={style[key].style} onChange={e => setStyle({ ...style, [key]: { ...style[key], style: e.target.value as any } })}>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-2 bg-slate-900/40 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span>Background fill</span>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={style.background.visible} onChange={e => setStyle({ ...style, background: { ...style.background, visible: e.target.checked } })} /> Visible
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col text-sm">
                  Color
                  <input type="color" className="mt-1 h-9 rounded bg-transparent" value={style.background.color} onChange={e => setStyle({ ...style, background: { ...style.background, color: e.target.value } })} />
                </label>
                <label className="flex flex-col text-sm">
                  Opacity
                  <input type="range" min={0} max={1} step={0.01} className="mt-1" value={style.background.opacity} onChange={e => setStyle({ ...style, background: { ...style.background, opacity: Number(e.target.value) } })} />
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button className="px-3 py-1 rounded bg-slate-700" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-600" onClick={() => save()}>Save</button>
        </div>
      </div>
    </div>
  )
}
