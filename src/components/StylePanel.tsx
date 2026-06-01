import { useRef } from 'react'
import { Icon } from './Icon'
import {
  PRESETS,
  type StyleState,
  type DotType,
  type CornerSquareType,
  type CornerDotType,
  type ErrorLevel,
} from '../qr/style'

interface Props {
  style: StyleState
  setStyle: (patch: Partial<StyleState>) => void
  applyPreset: (patch: Partial<StyleState>) => void
}

function ColorInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-950/60 p-1.5">
      <label className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
        <span className="block h-full w-full" style={{ background: value }} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-white/80 uppercase outline-none"
        spellCheck={false}
      />
    </div>
  )
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
            value === o.value
              ? 'border-brand-400/60 bg-brand-500/20 text-white'
              : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/80'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

const DOT_OPTS: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra round' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy round' },
]

const CORNER_SQ_OPTS: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra round' },
  { value: 'dot', label: 'Dot' },
]

const CORNER_DOT_OPTS: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dot', label: 'Dot' },
]

const ERROR_OPTS: { value: ErrorLevel; label: string }[] = [
  { value: 'L', label: 'L · 7%' },
  { value: 'M', label: 'M · 15%' },
  { value: 'Q', label: 'Q · 25%' },
  { value: 'H', label: 'H · 30%' },
]

function presetSwatch(p: (typeof PRESETS)[number]) {
  const s = p.patch
  const fg =
    s.fgType === 'gradient'
      ? `linear-gradient(135deg, ${s.fgColor}, ${s.fgColor2})`
      : (s.fgColor ?? '#000')
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-white/15"
      style={{ background: s.bgColor ?? '#fff' }}
    >
      <div className="h-5 w-5 rounded-[5px]" style={{ background: fg }} />
    </div>
  )
}

export function StylePanel({ style, setStyle, applyPreset }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null)

  const onLogo = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setStyle({ logo: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-7">
      {/* Presets */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/85">
          <Icon name="Sparkles" size={15} className="text-brand-400" />
          Presets
        </h3>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-8">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.name}
              onClick={() => applyPreset(p.patch)}
              className="group flex flex-col items-center gap-1.5"
            >
              <span className="rounded-xl p-0.5 ring-1 ring-transparent transition group-hover:ring-brand-400/50">
                {presetSwatch(p)}
              </span>
              <span className="truncate text-[10px] text-white/40 group-hover:text-white/70">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Icon name="Palette" size={15} className="text-brand-400" />
          Colors
        </h3>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="label mb-0">Foreground</span>
            <Segmented
              options={[
                { value: 'solid', label: 'Solid' },
                { value: 'gradient', label: 'Gradient' },
              ]}
              value={style.fgType}
              onChange={(v) => setStyle({ fgType: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ColorInput value={style.fgColor} onChange={(v) => setStyle({ fgColor: v })} />
            {style.fgType === 'gradient' && (
              <ColorInput value={style.fgColor2} onChange={(v) => setStyle({ fgColor2: v })} />
            )}
          </div>
          {style.fgType === 'gradient' && (
            <div className="mt-3 flex items-center gap-4">
              <Segmented
                options={[
                  { value: 'linear', label: 'Linear' },
                  { value: 'radial', label: 'Radial' },
                ]}
                value={style.gradientType}
                onChange={(v) => setStyle({ gradientType: v })}
              />
              {style.gradientType === 'linear' && (
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-xs text-white/40">Angle</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={style.gradientRotation}
                    onChange={(e) => setStyle({ gradientRotation: Number(e.target.value) })}
                    className="accent-brand-500 flex-1"
                  />
                  <span className="w-9 text-right text-xs text-white/55">
                    {style.gradientRotation}°
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="label mb-0">Background</span>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-white/55">
              <input
                type="checkbox"
                checked={style.bgTransparent}
                onChange={(e) => setStyle({ bgTransparent: e.target.checked })}
                className="accent-brand-500"
              />
              Transparent
            </label>
          </div>
          {!style.bgTransparent && (
            <ColorInput value={style.bgColor} onChange={(v) => setStyle({ bgColor: v })} />
          )}
        </div>
      </section>

      {/* Shape */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Icon name="Settings2" size={15} className="text-brand-400" />
          Shape
        </h3>
        <div>
          <span className="label">Dot style</span>
          <Segmented options={DOT_OPTS} value={style.dotStyle} onChange={(v) => setStyle({ dotStyle: v })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="label">Corner frame</span>
            <Segmented
              options={CORNER_SQ_OPTS}
              value={style.cornerSquareStyle}
              onChange={(v) => setStyle({ cornerSquareStyle: v })}
            />
          </div>
          <div>
            <span className="label">Corner dot</span>
            <Segmented
              options={CORNER_DOT_OPTS}
              value={style.cornerDotStyle}
              onChange={(v) => setStyle({ cornerDotStyle: v })}
            />
          </div>
        </div>
        <div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-white/55">
            <input
              type="checkbox"
              checked={style.cornerColorOverride}
              onChange={(e) => setStyle({ cornerColorOverride: e.target.checked })}
              className="accent-brand-500"
            />
            Custom corner color
          </label>
          {style.cornerColorOverride && (
            <div className="mt-2">
              <ColorInput value={style.cornerColor} onChange={(v) => setStyle({ cornerColor: v })} />
            </div>
          )}
        </div>
      </section>

      {/* Logo */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Icon name="Image" size={15} className="text-brand-400" />
          Logo
        </h3>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onLogo(e.target.files?.[0])}
        />
        {style.logo ? (
          <div className="flex items-center gap-3">
            <img
              src={style.logo}
              alt="logo"
              className="h-12 w-12 rounded-lg bg-white object-contain ring-1 ring-white/15"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-white/12 px-3 py-1.5 text-xs text-white/70 hover:border-white/25 hover:text-white"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => setStyle({ logo: null })}
              className="flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-1.5 text-xs text-white/70 hover:border-red-400/40 hover:text-red-300"
            >
              <Icon name="Trash2" size={13} /> Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-4 text-sm text-white/50 transition hover:border-brand-400/50 hover:text-white/80"
          >
            <Icon name="Upload" size={16} />
            Upload a logo (PNG / SVG)
          </button>
        )}
        {style.logo && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Size</span>
            <input
              type="range"
              min={0.2}
              max={0.6}
              step={0.05}
              value={style.logoSize}
              onChange={(e) => setStyle({ logoSize: Number(e.target.value) })}
              className="accent-brand-500 flex-1"
            />
            <label className="flex items-center gap-1.5 text-xs text-white/50">
              <input
                type="checkbox"
                checked={style.hideBackgroundDots}
                onChange={(e) => setStyle({ hideBackgroundDots: e.target.checked })}
                className="accent-brand-500"
              />
              Clear behind
            </label>
          </div>
        )}
      </section>

      {/* Advanced */}
      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Icon name="ShieldCheck" size={15} className="text-brand-400" />
          Quality
        </h3>
        <div>
          <span className="label">
            Error correction{' '}
            <span className="font-normal normal-case text-white/30">(higher survives damage / logos)</span>
          </span>
          <Segmented options={ERROR_OPTS} value={style.errorLevel} onChange={(v) => setStyle({ errorLevel: v })} />
        </div>
        <div className="flex items-center gap-3">
          <span className="label mb-0 shrink-0">Quiet zone</span>
          <input
            type="range"
            min={0}
            max={40}
            value={style.margin}
            onChange={(e) => setStyle({ margin: Number(e.target.value) })}
            className="accent-brand-500 flex-1"
          />
          <span className="w-9 text-right text-xs text-white/55">{style.margin}px</span>
        </div>
      </section>
    </div>
  )
}
