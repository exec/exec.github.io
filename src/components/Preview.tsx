import { useState } from 'react'
import type { FileExtension } from 'qr-code-styling'
import { Icon } from './Icon'
import { useQrCode } from '../qr/useQrCode'
import type { StyleState } from '../qr/style'

interface Props {
  data: string
  style: StyleState
  typeName: string
  fileName: string
}

const FORMATS: { ext: FileExtension; label: string }[] = [
  { ext: 'png', label: 'PNG' },
  { ext: 'svg', label: 'SVG' },
  { ext: 'jpeg', label: 'JPG' },
  { ext: 'webp', label: 'WEBP' },
]

export function Preview({ data, style, typeName, fileName }: Props) {
  const { containerRef, download } = useQrCode(data, style, 320)
  const [busy, setBusy] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const has = data.trim().length > 0

  const handleDownload = async (ext: FileExtension) => {
    if (!has) return
    setBusy(ext)
    try {
      await download(ext, fileName)
    } finally {
      setBusy(null)
    }
  }

  const copyData = async () => {
    try {
      await navigator.clipboard.writeText(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="glass rounded-3xl p-6 shadow-2xl shadow-black/40">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-white/45 uppercase">
          Live preview
        </span>
        <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-[11px] font-medium text-brand-300">
          {typeName}
        </span>
      </div>

      {/* QR canvas */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[conic-gradient(at_50%_50%,#1a1a2a,#101019)] p-4">
        <div
          ref={containerRef}
          className={`transition-opacity duration-300 [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-[300px] [&>svg]:rounded-xl ${
            has ? 'opacity-100' : 'opacity-30 blur-[1px]'
          }`}
        />
        {!has && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <Icon name="Sparkles" size={26} className="text-white/30" />
            <p className="max-w-[14rem] text-sm text-white/40">
              Fill in the details and your QR code appears here instantly.
            </p>
          </div>
        )}
      </div>

      {/* Downloads */}
      <div className="mt-5">
        <div className="grid grid-cols-4 gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.ext}
              type="button"
              disabled={!has || busy !== null}
              onClick={() => handleDownload(f.ext)}
              className="group relative flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-semibold text-white/75 transition enabled:hover:border-brand-400/50 enabled:hover:bg-brand-500/10 enabled:hover:text-white disabled:opacity-40"
            >
              <Icon
                name={busy === f.ext ? 'Sparkles' : 'Download'}
                size={15}
                className={busy === f.ext ? 'animate-pulse text-brand-400' : 'text-white/50 group-hover:text-brand-300'}
              />
              {f.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!has}
          onClick={copyData}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-2.5 text-xs font-medium text-white/55 transition enabled:hover:text-white/85 disabled:opacity-40"
        >
          <Icon name={copied ? 'Check' : 'Type'} size={14} className={copied ? 'text-emerald-400' : ''} />
          {copied ? 'Copied encoded data' : 'Copy raw encoded data'}
        </button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-white/35">
        <Icon name="Infinity" size={13} className="text-brand-400/70" />
        Data is encoded directly — this code works forever, offline, no account.
      </p>
    </div>
  )
}
