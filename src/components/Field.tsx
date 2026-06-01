import type { FieldDef } from '../qr/types'

interface Props {
  field: FieldDef
  value: string
  onChange: (key: string, value: string) => void
}

export function Field({ field, value, onChange }: Props) {
  const set = (v: string) => onChange(field.key, v)

  if (field.type === 'checkbox') {
    const checked = value === 'true'
    return (
      <label className="flex cursor-pointer items-center gap-3 py-1 select-none">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => set(checked ? 'false' : 'true')}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            checked ? 'bg-brand-500' : 'bg-white/12'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-sm text-white/80">{field.label}</span>
      </label>
    )
  }

  return (
    <div>
      <label className="label" htmlFor={`f-${field.key}`}>
        {field.label}
        {field.required && <span className="text-brand-400"> *</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          id={`f-${field.key}`}
          className="field min-h-[90px] resize-y"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      ) : field.type === 'select' ? (
        <select
          id={`f-${field.key}`}
          className="field cursor-pointer"
          value={value}
          onChange={(e) => set(e.target.value)}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={`f-${field.key}`}
          type={field.type}
          className="field"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      )}

      {field.hint && <p className="mt-1 text-xs text-white/35">{field.hint}</p>}
    </div>
  )
}
