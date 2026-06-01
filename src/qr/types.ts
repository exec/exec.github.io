/**
 * Definitions for every supported QR code "type".
 *
 * The guiding principle of this app: every QR encodes its real data DIRECTLY.
 * There is no redirect server in the middle, so a generated code keeps working
 * forever — it cannot be deactivated, rate-limited, or put behind a paywall.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'email'
  | 'tel'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'datetime-local'

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
  default?: string | boolean
  /** Render at half width so two fields sit on one row. */
  half?: boolean
  hint?: string
}

export interface QRType {
  id: string
  name: string
  /** lucide-react icon name */
  icon: string
  blurb: string
  fields: FieldDef[]
  /** Turn the collected field values into the raw string the QR will encode. */
  build: (v: Record<string, string>) => string
  /** Optional sample so a fresh code is never empty. */
  sample?: Record<string, string>
}

const val = (v: Record<string, string>, k: string) => (v[k] ?? '').trim()

/** Escape a value for the WIFI: and MECARD/VCARD style payloads. */
const escWifi = (s: string) => s.replace(/([\\;,:"])/g, '\\$1')
const escVcard = (s: string) => s.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n')

/** YYYY-MM-DDTHH:mm (local) -> 20240101T090000Z style for iCal. */
const toICalDate = (local: string): string => {
  if (!local) return ''
  // Treat the entered wall-clock time as local, convert to UTC basic format.
  const d = new Date(local)
  if (isNaN(d.getTime())) return ''
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  )
}

export const QR_TYPES: QRType[] = [
  {
    id: 'url',
    name: 'Website / Link',
    icon: 'Link',
    blurb: 'Open any URL. The address is baked into the code — it never expires.',
    fields: [
      {
        key: 'url',
        label: 'URL',
        type: 'url',
        placeholder: 'https://example.com',
        required: true,
      },
    ],
    sample: { url: 'https://github.com' },
    build: (v) => {
      const u = val(v, 'url')
      if (!u) return ''
      return /^[a-z][a-z0-9+.-]*:\/\//i.test(u) || /^[a-z]+:/i.test(u)
        ? u
        : `https://${u}`
    },
  },
  {
    id: 'text',
    name: 'Plain Text',
    icon: 'Type',
    blurb: 'Encode any text — a note, a code, a message, anything.',
    fields: [
      {
        key: 'text',
        label: 'Text',
        type: 'textarea',
        placeholder: 'Type anything…',
        required: true,
      },
    ],
    sample: { text: 'Hello from Permaqr ✦' },
    build: (v) => val(v, 'text'),
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'Mail',
    blurb: 'Pre-fill a new email with recipient, subject, and body.',
    fields: [
      { key: 'to', label: 'To', type: 'email', placeholder: 'name@example.com', required: true },
      { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Hello!' },
      { key: 'body', label: 'Message', type: 'textarea', placeholder: 'Your message…' },
    ],
    sample: { to: 'hi@example.com', subject: 'Hi there', body: 'Just scanned your QR code!' },
    build: (v) => {
      const to = val(v, 'to')
      if (!to) return ''
      const params = new URLSearchParams()
      if (val(v, 'subject')) params.set('subject', val(v, 'subject'))
      if (val(v, 'body')) params.set('body', val(v, 'body'))
      const q = params.toString()
      return `mailto:${to}${q ? `?${q}` : ''}`
    },
  },
  {
    id: 'phone',
    name: 'Phone Call',
    icon: 'Phone',
    blurb: 'Tap to dial a phone number.',
    fields: [
      { key: 'phone', label: 'Phone number', type: 'tel', placeholder: '+1 555 123 4567', required: true },
    ],
    sample: { phone: '+15551234567' },
    build: (v) => {
      const p = val(v, 'phone').replace(/[^\d+]/g, '')
      return p ? `tel:${p}` : ''
    },
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: 'MessageSquare',
    blurb: 'Open a text message with the number and body pre-filled.',
    fields: [
      { key: 'phone', label: 'Phone number', type: 'tel', placeholder: '+1 555 123 4567', required: true, half: true },
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Your message…' },
    ],
    sample: { phone: '+15551234567', message: 'Hey!' },
    build: (v) => {
      const p = val(v, 'phone').replace(/[^\d+]/g, '')
      if (!p) return ''
      const msg = val(v, 'message')
      return `SMSTO:${p}:${msg}`
    },
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    icon: 'Wifi',
    blurb: 'Let guests join your network by scanning — no typing passwords.',
    fields: [
      { key: 'ssid', label: 'Network name (SSID)', type: 'text', placeholder: 'MyNetwork', required: true },
      {
        key: 'encryption',
        label: 'Security',
        type: 'select',
        default: 'WPA',
        half: true,
        options: [
          { label: 'WPA/WPA2/WPA3', value: 'WPA' },
          { label: 'WEP', value: 'WEP' },
          { label: 'None (open)', value: 'nopass' },
        ],
      },
      { key: 'password', label: 'Password', type: 'text', placeholder: '••••••••', half: true },
      { key: 'hidden', label: 'Hidden network', type: 'checkbox' },
    ],
    sample: { ssid: 'CoffeeShop', encryption: 'WPA', password: 'latte123' },
    build: (v) => {
      const ssid = val(v, 'ssid')
      if (!ssid) return ''
      const enc = val(v, 'encryption') || 'WPA'
      const pass = val(v, 'password')
      const hidden = v.hidden === 'true' || v.hidden === 'on'
      const t = enc === 'nopass' ? 'nopass' : enc
      const passPart = enc === 'nopass' ? '' : `P:${escWifi(pass)};`
      return `WIFI:T:${t};S:${escWifi(ssid)};${passPart}${hidden ? 'H:true;' : ''};`
    },
  },
  {
    id: 'vcard',
    name: 'Contact (vCard)',
    icon: 'Contact',
    blurb: 'Share a full contact card that saves straight into the address book.',
    fields: [
      { key: 'firstName', label: 'First name', type: 'text', placeholder: 'Ada', half: true },
      { key: 'lastName', label: 'Last name', type: 'text', placeholder: 'Lovelace', half: true },
      { key: 'org', label: 'Organization', type: 'text', placeholder: 'Analytical Engines', half: true },
      { key: 'title', label: 'Job title', type: 'text', placeholder: 'Mathematician', half: true },
      { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 123 4567', half: true },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'ada@example.com', half: true },
      { key: 'url', label: 'Website', type: 'url', placeholder: 'https://example.com' },
      { key: 'address', label: 'Address', type: 'text', placeholder: '12 Baker St, London' },
    ],
    sample: {
      firstName: 'Ada',
      lastName: 'Lovelace',
      org: 'Analytical Engines',
      title: 'Mathematician',
      phone: '+15551234567',
      email: 'ada@example.com',
    },
    build: (v) => {
      const fn = val(v, 'firstName')
      const ln = val(v, 'lastName')
      if (!fn && !ln && !val(v, 'org') && !val(v, 'phone') && !val(v, 'email')) return ''
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escVcard(ln)};${escVcard(fn)};;;`,
        `FN:${escVcard(`${fn} ${ln}`.trim())}`,
      ]
      if (val(v, 'org')) lines.push(`ORG:${escVcard(val(v, 'org'))}`)
      if (val(v, 'title')) lines.push(`TITLE:${escVcard(val(v, 'title'))}`)
      if (val(v, 'phone')) lines.push(`TEL;TYPE=CELL:${val(v, 'phone')}`)
      if (val(v, 'email')) lines.push(`EMAIL:${val(v, 'email')}`)
      if (val(v, 'url')) lines.push(`URL:${val(v, 'url')}`)
      if (val(v, 'address')) lines.push(`ADR:;;${escVcard(val(v, 'address'))};;;;`)
      lines.push('END:VCARD')
      return lines.join('\n')
    },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'MessageCircle',
    blurb: 'Start a WhatsApp chat with a pre-written message.',
    fields: [
      { key: 'phone', label: 'Phone (with country code)', type: 'tel', placeholder: '15551234567', required: true },
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'Hi! I’d like to…' },
    ],
    sample: { phone: '15551234567', message: 'Hi! I saw your QR code.' },
    build: (v) => {
      const p = val(v, 'phone').replace(/[^\d]/g, '')
      if (!p) return ''
      const msg = val(v, 'message')
      return `https://wa.me/${p}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`
    },
  },
  {
    id: 'geo',
    name: 'Location',
    icon: 'MapPin',
    blurb: 'Drop a pin at exact coordinates that opens in any maps app.',
    fields: [
      { key: 'lat', label: 'Latitude', type: 'text', placeholder: '51.5007', required: true, half: true },
      { key: 'lng', label: 'Longitude', type: 'text', placeholder: '-0.1246', required: true, half: true },
    ],
    sample: { lat: '51.5007', lng: '-0.1246' },
    build: (v) => {
      const lat = val(v, 'lat')
      const lng = val(v, 'lng')
      if (!lat || !lng) return ''
      return `geo:${lat},${lng}`
    },
  },
  {
    id: 'event',
    name: 'Calendar Event',
    icon: 'CalendarDays',
    blurb: 'Add an event to the calendar with one scan.',
    fields: [
      { key: 'title', label: 'Event title', type: 'text', placeholder: 'Team offsite', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Conference Room A' },
      { key: 'start', label: 'Starts', type: 'datetime-local', half: true },
      { key: 'end', label: 'Ends', type: 'datetime-local', half: true },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Notes…' },
    ],
    build: (v) => {
      const title = val(v, 'title')
      if (!title) return ''
      const lines = ['BEGIN:VEVENT', `SUMMARY:${escVcard(title)}`]
      if (val(v, 'location')) lines.push(`LOCATION:${escVcard(val(v, 'location'))}`)
      if (val(v, 'description')) lines.push(`DESCRIPTION:${escVcard(val(v, 'description'))}`)
      if (val(v, 'start')) lines.push(`DTSTART:${toICalDate(val(v, 'start'))}`)
      if (val(v, 'end')) lines.push(`DTEND:${toICalDate(val(v, 'end'))}`)
      lines.push('END:VEVENT')
      return lines.join('\n')
    },
  },
  {
    id: 'crypto',
    name: 'Crypto Payment',
    icon: 'Bitcoin',
    blurb: 'Request a crypto payment to your wallet address.',
    fields: [
      {
        key: 'coin',
        label: 'Coin',
        type: 'select',
        default: 'bitcoin',
        half: true,
        options: [
          { label: 'Bitcoin', value: 'bitcoin' },
          { label: 'Ethereum', value: 'ethereum' },
          { label: 'Litecoin', value: 'litecoin' },
        ],
      },
      { key: 'amount', label: 'Amount (optional)', type: 'text', placeholder: '0.01', half: true },
      { key: 'address', label: 'Wallet address', type: 'text', placeholder: 'bc1q…', required: true },
    ],
    sample: { coin: 'bitcoin', address: 'bc1qexampleaddressxxxxxxxxxxxxxxxxxxxxx' },
    build: (v) => {
      const coin = val(v, 'coin') || 'bitcoin'
      const addr = val(v, 'address')
      if (!addr) return ''
      const amount = val(v, 'amount')
      return `${coin}:${addr}${amount ? `?amount=${amount}` : ''}`
    },
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'DollarSign',
    blurb: 'Send people to your PayPal.Me link, optionally with an amount.',
    fields: [
      { key: 'username', label: 'PayPal.Me username', type: 'text', placeholder: 'janedoe', required: true, half: true },
      { key: 'amount', label: 'Amount (optional)', type: 'text', placeholder: '25', half: true },
      {
        key: 'currency',
        label: 'Currency',
        type: 'select',
        default: 'USD',
        half: true,
        options: [
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
          { label: 'GBP', value: 'GBP' },
          { label: 'CAD', value: 'CAD' },
          { label: 'AUD', value: 'AUD' },
        ],
      },
    ],
    sample: { username: 'janedoe', amount: '25', currency: 'USD' },
    build: (v) => {
      const u = val(v, 'username').replace(/^@/, '')
      if (!u) return ''
      const amount = val(v, 'amount')
      const cur = val(v, 'currency') || 'USD'
      return `https://www.paypal.me/${u}${amount ? `/${amount}${cur}` : ''}`
    },
  },
]

export const getType = (id: string): QRType =>
  QR_TYPES.find((t) => t.id === id) ?? QR_TYPES[0]
