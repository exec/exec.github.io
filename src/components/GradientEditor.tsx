import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import {
  lerpHex,
  newStopId,
  stopsToCss,
  type GradientStop,
  type StyleState,
} from '../qr/style'

interface Props {
  stops: GradientStop[]
  gradientType: 'linear' | 'radial'
  rotation: number
  onChange: (patch: Partial<StyleState>) => void
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** Color at a given offset by interpolating between the surrounding stops. */
function colorAt(stops: GradientStop[], offset: number): string {
  const s = [...stops].sort((a, b) => a.offset - b.offset)
  if (offset <= s[0].offset) return s[0].color
  if (offset >= s[s.length - 1].offset) return s[s.length - 1].color
  for (let i = 0; i < s.length - 1; i++) {
    const a = s[i]
    const b = s[i + 1]
    if (offset >= a.offset && offset <= b.offset) {
      const t = (offset - a.offset) / (b.offset - a.offset || 1)
      return lerpHex(a.color, b.color, t)
    }
  }
  return s[0].color
}

export function GradientEditor({ stops, gradientType, rotation, onChange }: Props) {
  const barRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string>(stops[0]?.id ?? '')
  const draggingRef = useRef<string | null>(null)

  // Keep a valid selection if stops change underneath us (e.g. theme switch).
  useEffect(() => {
    if (!stops.some((s) => s.id === selectedId)) {
      setSelectedId(stops[0]?.id ?? '')
    }
  }, [stops, selectedId])

  const selected = stops.find((s) => s.id === selectedId) ?? stops[0]

  const offsetFromClientX = (clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect()
    if (!rect) return 0
    return clamp01((clientX - rect.left) / rect.width)
  }

  const updateStop = (id: string, patch: Partial<GradientStop>) =>
    onChange({ fgStops: stops.map((s) => (s.id === id ? { ...s, ...patch } : s)) })

  const startDrag = (id: string, e: React.PointerEvent) => {
    e.stopPropagation()
    setSelectedId(id)
    draggingRef.current = id
    const move = (ev: PointerEvent) => {
      if (draggingRef.current !== id) return
      updateStop(id, { offset: offsetFromClientX(ev.clientX) })
    }
    const up = () => {
      draggingRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const addStopAt = (clientX: number) => {
    const offset = offsetFromClientX(clientX)
    const id = newStopId()
    const next = [...stops, { id, offset, color: colorAt(stops, offset) }]
    setSelectedId(id)
    onChange({ fgStops: next })
  }

  const removeSelected = () => {
    if (stops.length <= 2 || !selected) return
    const next = stops.filter((s) => s.id !== selected.id)
    setSelectedId(next[0].id)
    onChange({ fgStops: next })
  }

  return (
    <div className="space-y-3">
      {/* Gradient bar with draggable stops */}
      <div className="pt-2">
        <div
          ref={barRef}
          onPointerDown={(e) => addStopAt(e.clientX)}
          className="relative h-8 cursor-copy rounded-lg ring-1 ring-white/15"
          style={{ background: stopsToCss(stops) }}
          title="Click to add a color stop"
        >
          {/* checkerboard hint sits under nothing here; bar is opaque colors */}
          {stops.map((s) => {
            const active = s.id === selectedId
            return (
              <button
                key={s.id}
                type="button"
                onPointerDown={(e) => startDrag(s.id, e)}
                onClick={(e) => e.stopPropagation()}
                style={{ left: `${s.offset * 100}%` }}
                className={`absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 shadow-md transition active:cursor-grabbing ${
                  active ? 'border-white scale-110 ring-2 ring-brand-400/70' : 'border-white/80'
                }`}
              >
                <span className="block h-full w-full rounded-full" style={{ background: s.color }} />
              </button>
            )
          })}
        </div>
        <p className="mt-1.5 text-[11px] text-white/35">
          Drag stops to reposition · click the bar to add · {stops.length} stops
        </p>
      </div>

      {/* Selected-stop controls */}
      {selected && (
        <div className="flex items-center gap-2">
          <label className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
            <span className="block h-full w-full" style={{ background: selected.color }} />
            <input
              type="color"
              value={selected.color}
              onChange={(e) => updateStop(selected.id, { color: e.target.value })}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
          <input
            type="text"
            value={selected.color}
            onChange={(e) => updateStop(selected.id, { color: e.target.value })}
            className="field !py-1.5 uppercase"
            spellCheck={false}
          />
          <div className="flex shrink-0 items-center gap-1 text-xs text-white/40">
            <input
              type="number"
              min={0}
              max={100}
              value={Math.round(selected.offset * 100)}
              onChange={(e) => updateStop(selected.id, { offset: clamp01(Number(e.target.value) / 100) })}
              className="field w-16 !py-1.5 text-center"
            />
            %
          </div>
          <button
            type="button"
            onClick={removeSelected}
            disabled={stops.length <= 2}
            title={stops.length <= 2 ? 'A gradient needs at least 2 stops' : 'Remove stop'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/12 text-white/55 transition enabled:hover:border-red-400/40 enabled:hover:text-red-300 disabled:opacity-30"
          >
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      )}

      {/* Type + angle */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex flex-wrap gap-1.5">
          {(['linear', 'radial'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ gradientType: t })}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                gradientType === t
                  ? 'border-brand-400/60 bg-brand-500/20 text-white'
                  : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {gradientType === 'linear' && (
          <div className="flex flex-1 items-center gap-2">
            <span className="text-xs text-white/40">Angle</span>
            <input
              type="range"
              min={0}
              max={360}
              value={rotation}
              onChange={(e) => onChange({ gradientRotation: Number(e.target.value) })}
              className="accent-brand-500 flex-1"
            />
            <span className="w-9 text-right text-xs text-white/55">{rotation}°</span>
          </div>
        )}
      </div>
    </div>
  )
}
