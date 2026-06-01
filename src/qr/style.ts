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

export interface StyleState {
  /** Foreground (dots) */
  fgType: 'solid' | 'gradient'
  fgColor: string
  fgColor2: string
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

export const DEFAULT_STYLE: StyleState = {
  fgType: 'gradient',
  fgColor: '#8b5cf6',
  fgColor2: '#22d3ee',
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

export interface Preset {
  id: string
  name: string
  patch: Partial<StyleState>
}

export const PRESETS: Preset[] = [
  {
    id: 'violet',
    name: 'Violet Mist',
    patch: {
      fgType: 'gradient',
      fgColor: '#8b5cf6',
      fgColor2: '#22d3ee',
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
    id: 'midnight',
    name: 'Midnight',
    patch: {
      fgType: 'solid',
      fgColor: '#0b0b14',
      bgColor: '#ffffff',
      bgTransparent: false,
      dotStyle: 'rounded',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      cornerColorOverride: false,
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    patch: {
      fgType: 'gradient',
      fgColor: '#f97316',
      fgColor2: '#db2777',
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
    patch: {
      fgType: 'gradient',
      fgColor: '#059669',
      fgColor2: '#84cc16',
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
    id: 'mono',
    name: 'Classic',
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
    id: 'neon',
    name: 'Neon Dark',
    patch: {
      fgType: 'gradient',
      fgColor: '#22d3ee',
      fgColor2: '#a78bfa',
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
    patch: {
      fgType: 'gradient',
      fgColor: '#2563eb',
      fgColor2: '#06b6d4',
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
    patch: {
      fgType: 'gradient',
      fgColor: '#e11d48',
      fgColor2: '#fb7185',
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

const gradient = (a: string, b: string, type: 'linear' | 'radial', rotation: number) => ({
  type,
  rotation: (rotation * Math.PI) / 180,
  colorStops: [
    { offset: 0, color: a },
    { offset: 1, color: b },
  ],
})

/** Build the full qr-code-styling options object from our style + data + size. */
export function buildQROptions(
  data: string,
  style: StyleState,
  size: number,
): QRStylingOptions {
  const fgSolid = { color: style.fgColor }
  const fgGradient = style.fgType === 'gradient'
    ? { gradient: gradient(style.fgColor, style.fgColor2, style.gradientType, style.gradientRotation) }
    : fgSolid

  const cornerColor = style.cornerColorOverride
    ? { color: style.cornerColor }
    : fgGradient

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
      ...fgGradient,
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
