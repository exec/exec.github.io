import type { Options as QRStylingOptions } from 'qr-code-styling'

export type DotType =
  | 'square'
  | 'rounded'
  | 'extra-rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'

export type CornerSquareType = 'square' | 'rounded' | 'extra-rounded' | 'dot'
export type CornerDotType = 'square' | 'rounded' | 'dot'
export type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

/** A single color stop in the foreground gradient. */
export interface GradientStop {
  id: string
  /** 0..1 position along the gradient. */
  offset: number
  color: string
}

export interface StyleState {
  /** Foreground (dots) */
  fgType: 'solid' | 'gradient'
  fgColor: string
  /** Multi-stop gradient (used when fgType === 'gradient'). */
  fgStops: GradientStop[]
  gradientType: 'linear' | 'radial'
  gradientRotation: number

  bgColor: string
  bgTransparent: boolean

  dotStyle: DotType
  cornerSquareStyle: CornerSquareType
  cornerDotStyle: CornerDotType
  /** When false, corner colors follow the foreground. */
  cornerColorOverride: boolean
  cornerColor: string

  margin: number
  errorLevel: ErrorLevel

  logo: string | null // data URL
  logoSize: number // 0–1 fraction
  logoMargin: number
  hideBackgroundDots: boolean
}

let _stopId = 0
/** Stable-ish unique id for a new gradient stop. */
export const newStopId = () => `stop-${_stopId++}`

export const stop = (offset: number, color: string): GradientStop => ({
  id: newStopId(),
  offset,
  color,
})

export const DEFAULT_STYLE: StyleState = {
  fgType: 'gradient',
  fgColor: '#8b5cf6',
  fgStops: [stop(0, '#8b5cf6'), stop(1, '#22d3ee')],
  gradientType: 'linear',
  gradientRotation: 45,
  bgColor: '#ffffff',
  bgTransparent: false,
  dotStyle: 'extra-rounded',
  cornerSquareStyle: 'extra-rounded',
  cornerDotStyle: 'dot',
  cornerColorOverride: false,
  cornerColor: '#8b5cf6',
  margin: 12,
  errorLevel: 'Q',
  logo: null,
  logoSize: 0.4,
  logoMargin: 6,
  hideBackgroundDots: true,
}

export interface Theme {
  id: string
  name: string
  /** Quick category so we can group "traditional" vs "creative". */
  kind: 'classic' | 'gradient'
  patch: Partial<StyleState>
}

export const THEMES: Theme[] = [
  // --- Traditional, scanner-safe black & white first ---
  {
    id: 'bw',
    name: 'Black & White',
    kind: 'classic',
    patch: {
      fgType: 'solid',
      fgColor: '#000000',
      bgColor: '#ffffff',
      bgTransparent: false,
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      cornerColorOverride: false,
    },
  },
  {
    id: 'bw-rounded',
    name: 'Soft Mono',
    kind: 'classic',
    patch: {
      fgType: 'solid',
      fgColor: '#0b0b14',
      bgColor: '#ffffff',
      bgTransparent: false,
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      cornerColorOverride: false,
    },
  },
  {
    id: 'inverted',
    name: 'Inverted',
    kind: 'classic',
    patch: {
      fgType: 'solid',
      fgColor: '#ffffff',
      bgColor: '#0b0b14',
      bgTransparent: false,
      dotStyle: 'rounded',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'dot',
      cornerColorOverride: false,
    },
  },
  {
    id: 'navy',
    name: 'Navy',
    kind: 'classic',
    patch: {
      fgType: 'solid',
      fgColor: '#1e293b',
      bgColor: '#ffffff',
      bgTransparent: false,
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      cornerColorOverride: false,
    },
  },
  // --- Creative gradients ---
  {
    id: 'violet',
    name: 'Violet Mist',
    kind: 'gradient',
    patch: {
      fgType: 'gradient',
      fgStops: [stop(0, '#8b5cf6'), stop(1, '#22d3ee')],
      gradientType: 'linear',
      gradientRotation: 45,
      bgColor: '#ffffff',
      bgTransparent: false,
      dotStyle: 'extra-rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      cornerColorOverride: false,
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    kind: 'gradient',
    patch: {
      fgType: 'gradient',
      fgStops: [stop(0, '#f97316'), stop(0.5, '#ef4444'), stop(1, '#db2777')],
      gradientType: 'linear',
      gradientRotation: 30,
      bgColor: '#ffffff',
      bgTransparent: false,
      dotStyle: 'dots',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      cornerColorOverride: false,
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    kind: 'gradient',
    patch: {
      fgType: 'gradient',
      fgStops: [stop(0, '#059669'), stop(1, '#84cc16')],
      gradientType: 'linear',
      gradientRotation: 90,
      bgColor: '#ffffff',
      bgTransparent: false,
      dotStyle: 'classy-rounded',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'dot',
      cornerColorOverride: false,
    },
  },
  {
    id: 'neon',
    name: 'Neon Dark',
    kind: 'gradient',
    patch: {
      fgType: 'gradient',
      fgStops: [stop(0, '#22d3ee'), stop(1, '#a78bfa')],
      gradientType: 'radial',
      gradientRotation: 0,
      bgColor: '#0b0b14',
      bgTransparent: false,
      dotStyle: 'dots',
      cornerSquareStyle: 'dot',
      cornerDotStyle: 'dot',
      cornerColorOverride: true,
      cornerColor: '#22d3ee',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    kind: 'gradient',
    patch: {
      fgType: 'gradient',
      fgStops: [stop(0, '#2563eb'), stop(1, '#06b6d4')],
      gradientType: 'linear',
      gradientRotation: 135,
      bgColor: '#ffffff',
      bgTransparent: false,
      dotStyle: 'classy',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'square',
      cornerColorOverride: false,
    },
  },
  {
    id: 'rose',
    name: 'Rosé',
    kind: 'gradient',
    patch: {
      fgType: 'gradient',
      fgStops: [stop(0, '#e11d48'), stop(1, '#fb7185')],
      gradientType: 'linear',
      gradientRotation: 60,
      bgColor: '#fff1f2',
      bgTransparent: false,
      dotStyle: 'extra-rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      cornerColorOverride: false,
    },
  },
]

/** Sort stops by offset and guarantee at least two for a valid gradient. */
function normalizedStops(stops: GradientStop[], fallback: string): GradientStop[] {
  const sorted = [...stops].sort((a, b) => a.offset - b.offset)
  if (sorted.length === 0) return [stop(0, fallback), stop(1, fallback)]
  if (sorted.length === 1) return [{ ...sorted[0], offset: 0 }, stop(1, sorted[0].color)]
  return sorted
}

/** Build the full qr-code-styling options object from our style + data + size. */
export function buildQROptions(
  data: string,
  style: StyleState,
  size: number,
): QRStylingOptions {
  const fg =
    style.fgType === 'gradient'
      ? {
          gradient: {
            type: style.gradientType,
            rotation: (style.gradientRotation * Math.PI) / 180,
            colorStops: normalizedStops(style.fgStops, style.fgColor).map((s) => ({
              offset: s.offset,
              color: s.color,
            })),
          },
        }
      : { color: style.fgColor }

  const cornerColor = style.cornerColorOverride ? { color: style.cornerColor } : fg

  return {
    width: size,
    height: size,
    type: 'svg',
    data: data || ' ',
    margin: style.margin,
    qrOptions: {
      errorCorrectionLevel: style.errorLevel,
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: style.logoMargin,
      imageSize: style.logoSize,
      hideBackgroundDots: style.hideBackgroundDots,
    },
    dotsOptions: {
      type: style.dotStyle,
      ...fg,
    },
    cornersSquareOptions: {
      type: style.cornerSquareStyle,
      ...cornerColor,
    },
    cornersDotOptions: {
      type: style.cornerDotStyle,
      ...cornerColor,
    },
    backgroundOptions: {
      color: style.bgTransparent ? 'transparent' : style.bgColor,
    },
    image: style.logo ?? undefined,
  }
}

/** CSS gradient string for previewing a set of stops in the editor UI. */
export function stopsToCss(stops: GradientStop[], angleDeg = 90): string {
  const sorted = [...stops].sort((a, b) => a.offset - b.offset)
  const parts = sorted.map((s) => `${s.color} ${Math.round(s.offset * 100)}%`)
  return `linear-gradient(${angleDeg}deg, ${parts.join(', ')})`
}

/** Linearly interpolate between two #rrggbb colors. */
export function lerpHex(a: string, b: string, t: number): string {
  const pa = hexToRgb(a)
  const pb = hexToRgb(b)
  if (!pa || !pb) return a
  const mix = (x: number, y: number) => Math.round(x + (y - x) * t)
  return rgbToHex(mix(pa[0], pb[0]), mix(pa[1], pb[1]), mix(pa[2], pb[2]))
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}
