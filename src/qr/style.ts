import type { Options as QRStylingOptions } from 'qr-code-styling'

export type DotType =
  | 'square'
  | 'rounded'
  | 'extra-rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'

// In qr-code-styling 1.9, corners accept the full DotType set plus `dot`.
export type CornerSquareType = DotType | 'dot'
export type CornerDotType = DotType | 'dot'
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

/**
 * Color themes — these only change COLOR (foreground / gradient / background),
 * never the shapes. Shapes are controlled independently in the Shape panel so
 * you can mix any look with any color.
 */
export interface Theme {
  id: string
  name: string
  kind: 'classic' | 'gradient'
  patch: Partial<StyleState>
}

export const THEMES: Theme[] = [
  // --- Traditional, scanner-safe solid colors ---
  {
    id: 'bw',
    name: 'Black & White',
    kind: 'classic',
    patch: {
      fgType: 'solid',
      fgColor: '#000000',
      bgColor: '#ffffff',
      bgTransparent: false,
      cornerColorOverride: false,
    },
  },
  {
    id: 'ink',
    name: 'Ink',
    kind: 'classic',
    patch: {
      fgType: 'solid',
      fgColor: '#0b0b14',
      bgColor: '#ffffff',
      bgTransparent: false,
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
      cornerColorOverride: false,
    },
  },
  {
    id: 'crimson',
    name: 'Crimson',
    kind: 'classic',
    patch: {
      fgType: 'solid',
      fgColor: '#b91c1c',
      bgColor: '#ffffff',
      bgTransparent: false,
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
      cornerColorOverride: false,
    },
  },
]

/** Shape presets — set dot + corner shapes together for a quick starting point. */
export interface ShapePreset {
  id: string
  name: string
  patch: Pick<StyleState, 'dotStyle' | 'cornerSquareStyle' | 'cornerDotStyle'>
}

export const SHAPE_PRESETS: ShapePreset[] = [
  { id: 'square', name: 'Square', patch: { dotStyle: 'square', cornerSquareStyle: 'square', cornerDotStyle: 'square' } },
  { id: 'rounded', name: 'Rounded', patch: { dotStyle: 'rounded', cornerSquareStyle: 'rounded', cornerDotStyle: 'dot' } },
  { id: 'smooth', name: 'Smooth', patch: { dotStyle: 'extra-rounded', cornerSquareStyle: 'extra-rounded', cornerDotStyle: 'dot' } },
  { id: 'dots', name: 'Dots', patch: { dotStyle: 'dots', cornerSquareStyle: 'extra-rounded', cornerDotStyle: 'dot' } },
  { id: 'classy', name: 'Classy', patch: { dotStyle: 'classy', cornerSquareStyle: 'square', cornerDotStyle: 'square' } },
  { id: 'fancy', name: 'Fancy', patch: { dotStyle: 'classy-rounded', cornerSquareStyle: 'dot', cornerDotStyle: 'dot' } },
]

export const DOT_TYPES: DotType[] = ['square', 'rounded', 'extra-rounded', 'dots', 'classy', 'classy-rounded']
export const CORNER_TYPES: CornerSquareType[] = ['square', 'rounded', 'extra-rounded', 'dots', 'classy', 'classy-rounded', 'dot']

export const SHAPE_LABEL: Record<string, string> = {
  square: 'Square',
  rounded: 'Round',
  'extra-rounded': 'X-Round',
  dots: 'Dots',
  classy: 'Classy',
  'classy-rounded': 'Classy+',
  dot: 'Dot',
}

/** Sort stops by offset and guarantee at least two for a valid gradient. */
function normalizedStops(stops: GradientStop[], fallback: string): GradientStop[] {
  const sorted = [...stops].sort((a, b) => a.offset - b.offset)
  if (sorted.length === 0) return [stop(0, fallback), stop(1, fallback)]
  if (sorted.length === 1) return [{ ...sorted[0], offset: 0 }, stop(1, sorted[0].color)]
  return sorted
}

/**
 * Build the full qr-code-styling options object.
 *
 * IMPORTANT: qr-code-styling's `update()` deep-merges into the previous options,
 * so we must pass BOTH `color` and `gradient` keys explicitly every time —
 * otherwise switching from a gradient look to a solid one leaves the old
 * gradient in place (e.g. the Black & White theme not turning black).
 */
export function buildQROptions(
  data: string,
  style: StyleState,
  size: number,
): QRStylingOptions {
  const stops = normalizedStops(style.fgStops, style.fgColor)
  const fg =
    style.fgType === 'gradient'
      ? {
          color: stops[0].color,
          gradient: {
            type: style.gradientType,
            rotation: (style.gradientRotation * Math.PI) / 180,
            colorStops: stops.map((s) => ({ offset: s.offset, color: s.color })),
          },
        }
      : { color: style.fgColor, gradient: undefined }

  const cornerColor = style.cornerColorOverride
    ? { color: style.cornerColor, gradient: undefined }
    : fg

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
