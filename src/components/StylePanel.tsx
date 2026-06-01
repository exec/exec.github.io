import { useRef } from 'react'
import { Icon } from './Icon'
import { GradientEditor } from './GradientEditor'
import { ShapeGlyph } from './ShapeGlyph'
import {
  THEMES,
  SHAPE_PRESETS,
  DOT_TYPES,
  CORNER_TYPES,
  SHAPE_LABEL,
  stop,
  type StyleState,
  type Theme,
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

/** A grid of shape choices with little visual glyphs. */
function ShapeChoice({
  options,
  value,
  onChange,
  variant,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  variant: 'dot' | 'frame' | 'inner'
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
      {options.map((o) => {
        const active = o === value
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            title={SHAPE_LABEL[o] ?? o}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-2.5 transition ${
              active
                ? 'border-brand-400/60 bg-brand-500/15 text-brand-200'
                : 'border-white/8 bg-white/[0.02] text-white/45 hover:border-white/20 hover:text-white/80'
            }`}
          >
            <span className="flex h-6 items-center justify-center">
              <ShapeGlyph type={o} variant={variant} />
            </span>
            <span className="text-[9px] font-medium leading-none">{SHAPE_LABEL[o] ?? o}</span>
          </button>
        )
      })}
    </div>
  )
}

const ERROR_OPTS: { value: ErrorLevel; label: string }[] = [
  { value: 'L', label: 'L · 7%' },
  { value: 'M', label: 'M · 15%' },
  { value: 'Q', label: 'Q · 25%' },
  { value: 'H', label: 'H · 30%' },
]

function themeSwatch(t: Theme) {
  const s = t.patch
  const fg =
    s.fgType === 'gradient' && s.fgStops?.length
      ? `linear-gradient(135deg, ${s.fgStops.map((g) => g.color).join(', ')})`
      : (s.fgColor ?? '#000')
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-white/15"
      style={{ background: s.bgColor ?? '#fff' }}
    >
      <div className="h-5 w-5 rounded-[5px]" style={{ background: fg }} />
    </div>
  )
}

function ThemeButton({ t, onClick }: { t: Theme; onClick: () => void }) {
  return (
    <button type="button" title={t.name} onClick={onClick} className="group flex flex-col items-center gap-1.5">
      <span className="rounded-xl p-0.5 ring-1 ring-transparent transition group-hover:ring-brand-400/50">
        {themeSwatch(t)}
      </span>
      <span className="max-w-[4.5rem] truncate text-[10px] text-white/40 group-hover:text-white/70">
        {t.name}
      </span>
    </button>
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
      {/* Themes */}
      <section>
        <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-white/85">
          <Icon name="Sparkles" size={15} className="text-brand-400" />
          Themes
        </h3>

        <p className="label mt-3">Classic · scanner-safe</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6">
          {THEMES.filter((t) => t.kind === 'classic').map((t) => (
            <ThemeButton key={t.id} t={t} onClick={() => applyPreset(t.patch)} />
          ))}
        </div>

        <p className="label mt-4">Creative · gradient</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6">
          {THEMES.filter((t) => t.kind === 'gradient').map((t) => (
            <ThemeButton key={t.id} t={t} onClick={() => applyPreset(t.patch)} />
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
              onChange={(v) =>
                setStyle(
                  v === 'gradient' && style.fgStops.length < 2
                    ? { fgType: v, fgStops: [stop(0, style.fgColor), stop(1, '#22d3ee')] }
                    : { fgType: v },
                )
              }
            />
          </div>
          {style.fgType === 'gradient' ? (
            <GradientEditor
              stops={style.fgStops}
              gradientType={style.gradientType}
              rotation={style.gradientRotation}
              onChange={setStyle}
            />
          ) : (
            <ColorInput value={style.fgColor} onChange={(v) => setStyle({ fgColor: v })} />
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

      {/* Shape — fully independent from the color theme */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Icon name="Settings2" size={15} className="text-brand-400" />
            Shape
          </h3>
          <span className="text-[11px] text-white/35">independent of theme</span>
        </div>

        {/* Quick shape presets */}
        <div className="flex flex-wrap gap-1.5">
          {SHAPE_PRESETS.map((p) => {
            const active =
              style.dotStyle === p.patch.dotStyle &&
              style.cornerSquareStyle === p.patch.cornerSquareStyle &&
              style.cornerDotStyle === p.patch.cornerDotStyle
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setStyle(p.patch)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'border-brand-400/60 bg-brand-500/20 text-white'
                    : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/80'
                }`}
              >
                {p.name}
              </button>
            )
          })}
        </div>

        <div>
          <span className="label">Body dots</span>
          <ShapeChoice
            options={DOT_TYPES}
            value={style.dotStyle}
            variant="dot"
            onChange={(v) => setStyle({ dotStyle: v as StyleState['dotStyle'] })}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="label mb-0">Corner frame</span>
            <button
              type="button"
              onClick={() =>
                setStyle({
                  cornerSquareStyle: style.dotStyle,
                  cornerDotStyle: style.dotStyle,
                })
              }
              className="text-[11px] text-brand-300/80 hover:text-brand-200"
            >
              Match dots
            </button>
          </div>
          <ShapeChoice
            options={CORNER_TYPES}
            value={style.cornerSquareStyle}
            variant="frame"
            onChange={(v) => setStyle({ cornerSquareStyle: v as StyleState['cornerSquareStyle'] })}
          />
        </div>

        <div>
          <span className="label">Corner center</span>
          <ShapeChoice
            options={CORNER_TYPES}
            value={style.cornerDotStyle}
            variant="inner"
            onChange={(v) => setStyle({ cornerDotStyle: v as StyleState['cornerDotStyle'] })}
          />
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
