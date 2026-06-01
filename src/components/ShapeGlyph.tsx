/** Small visual preview of a dot / corner shape, drawn with border-radius. */
const RADIUS: Record<string, string> = {
  square: '15%',
  rounded: '32%',
  'extra-rounded': '46%',
  dots: '50%',
  classy: '0 50% 0 50%',
  'classy-rounded': '32% 50% 32% 50%',
  dot: '50%',
}

export function ShapeGlyph({
  type,
  variant = 'dot',
}: {
  type: string
  variant?: 'dot' | 'frame' | 'inner'
}) {
  const r = RADIUS[type] ?? '15%'

  if (variant === 'frame') {
    return <span className="block h-5 w-5 border-[3px] border-current" style={{ borderRadius: r }} />
  }
  if (variant === 'inner') {
    return <span className="block h-3.5 w-3.5 bg-current" style={{ borderRadius: r }} />
  }
  // A 2×2 mini grid conveys the dot pattern.
  return (
    <span className="grid grid-cols-2 gap-[2px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="block h-2 w-2 bg-current" style={{ borderRadius: r }} />
      ))}
    </span>
  )
}
