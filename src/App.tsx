import { useMemo, useState } from 'react'
import { Icon } from './components/Icon'
import { Field } from './components/Field'
import { StylePanel } from './components/StylePanel'
import { Preview } from './components/Preview'
import { QR_TYPES, getType, type QRType } from './qr/types'
import { DEFAULT_STYLE, type StyleState } from './qr/style'

/** Build the initial value map for a type from its field defaults. */
function initialValues(type: QRType): Record<string, string> {
  const v: Record<string, string> = {}
  for (const f of type.fields) {
    if (f.default !== undefined) v[f.key] = String(f.default)
  }
  return v
}

export default function App() {
  const [typeId, setTypeId] = useState('url')
  // Values are kept per-type so switching tabs never loses what you typed.
  const [valuesByType, setValuesByType] = useState<Record<string, Record<string, string>>>(
    () =>
      Object.fromEntries(QR_TYPES.map((t) => [t.id, initialValues(t)])) as Record<
        string,
        Record<string, string>
      >,
  )
  const [style, setStyleState] = useState<StyleState>(DEFAULT_STYLE)
  const [tab, setTab] = useState<'content' | 'design'>('content')

  const type = getType(typeId)
  const values = valuesByType[typeId] ?? {}

  const setValue = (key: string, value: string) =>
    setValuesByType((prev) => ({
      ...prev,
      [typeId]: { ...(prev[typeId] ?? {}), [key]: value },
    }))

  const setStyle = (patch: Partial<StyleState>) =>
    setStyleState((prev) => ({ ...prev, ...patch }))

  const applyPreset = (patch: Partial<StyleState>) =>
    setStyleState((prev) => ({ ...prev, ...patch }))

  const useSample = () => {
    if (type.sample) {
      setValuesByType((prev) => ({
        ...prev,
        [typeId]: { ...initialValues(type), ...type.sample },
      }))
    }
  }

  const clear = () =>
    setValuesByType((prev) => ({ ...prev, [typeId]: initialValues(type) }))

  const data = useMemo(() => type.build(values), [type, values])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-6 sm:px-8">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="h-9 w-9 rounded-xl" />
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">
              Perma<span className="text-brand-400">qr</span>
            </div>
            <div className="text-[11px] text-white/40">QR codes that never expire</div>
          </div>
        </div>
        <a
          href="https://en.wikipedia.org/wiki/QR_code"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/55 transition hover:border-white/25 hover:text-white/85 sm:flex"
        >
          <Icon name="ShieldCheck" size={14} className="text-emerald-400" />
          100% client-side · open standard
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-8 text-center sm:px-8">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/60">
          <Icon name="Zap" size={13} className="text-brand-400" />
          Free forever · no sign-up · no redirects
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Beautiful QR codes that
          <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
            {' '}
            never die
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/55">
          Other generators hide your link behind a redirect that breaks the moment your “free
          trial” ends. Permaqr encodes your data <strong className="text-white/80">directly</strong> into
          the code — so it keeps working forever, even offline.
        </p>
      </section>

      {/* App */}
      <main className="mx-auto grid max-w-6xl gap-6 px-5 pb-20 sm:px-8 lg:grid-cols-[1fr_380px]">
        {/* Left: controls */}
        <div className="space-y-5">
          {/* Type picker */}
          <div className="glass rounded-3xl p-5">
            <h2 className="mb-4 text-sm font-semibold text-white/85">What should it do?</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {QR_TYPES.map((t) => {
                const active = t.id === typeId
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeId(t.id)}
                    className={`group flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${
                      active
                        ? 'border-brand-400/60 bg-brand-500/15 text-white shadow-lg shadow-brand-500/10'
                        : 'border-white/8 bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white/85'
                    }`}
                  >
                    <Icon
                      name={t.icon}
                      size={20}
                      className={active ? 'text-brand-300' : 'text-white/45 group-hover:text-white/75'}
                    />
                    <span className="text-[11px] leading-tight font-medium">{t.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tabs: content / design */}
          <div className="glass overflow-hidden rounded-3xl">
            <div className="flex border-b border-white/8 p-1.5">
              {(
                [
                  { id: 'content', label: 'Content', icon: 'Type' },
                  { id: 'design', label: 'Design', icon: 'Palette' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold transition ${
                    tab === t.id
                      ? 'bg-white/[0.06] text-white'
                      : 'text-white/45 hover:text-white/75'
                  }`}
                >
                  <Icon name={t.icon} size={15} />
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {tab === 'content' ? (
                <div key={typeId} className="animate-fade-up space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-white/50">{type.blurb}</p>
                    <div className="flex shrink-0 gap-2">
                      {type.sample && (
                        <button
                          type="button"
                          onClick={useSample}
                          className="rounded-lg border border-white/12 px-2.5 py-1 text-xs text-white/60 hover:border-brand-400/50 hover:text-white"
                        >
                          Sample
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={clear}
                        className="rounded-lg border border-white/12 px-2.5 py-1 text-xs text-white/60 hover:border-white/25 hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {type.fields.map((f) => (
                      <div key={f.key} className={f.half ? 'col-span-2 sm:col-span-1' : 'col-span-2'}>
                        <Field field={f} value={values[f.key] ?? ''} onChange={setValue} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-fade-up">
                  <StylePanel style={style} setStyle={setStyle} applyPreset={applyPreset} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: sticky preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Preview data={data} style={style} typeName={type.name} fileName={`permaqr-${type.id}`} />
        </div>
      </main>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: 'Infinity',
              title: 'Never expires',
              body: 'Your URL or data lives inside the code itself. No middle-man server that can ever switch it off.',
            },
            {
              icon: 'WifiOff',
              title: 'Works offline',
              body: 'Generation happens entirely in your browser. Nothing is uploaded — your data never leaves the device.',
            },
            {
              icon: 'Sparkles',
              title: 'Genuinely free',
              body: 'No trials, no watermarks, no scan limits, no account. Download print-ready PNG, SVG, JPG or WEBP.',
            },
          ].map((c) => (
            <div key={c.title} className="glass rounded-2xl p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15">
                <Icon name={c.icon} size={18} className="text-brand-300" />
              </div>
              <h3 className="font-semibold text-white/90">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-7 text-sm text-white/40 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="h-5 w-5" />
            <span>
              Perma<span className="text-brand-400">qr</span> — your codes, forever.
            </span>
          </div>
          <span className="text-xs">Built with React · QR data encoded directly, never via redirect.</span>
        </div>
      </footer>
    </div>
  )
}
