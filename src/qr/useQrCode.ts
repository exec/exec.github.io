import { useEffect, useRef } from 'react'
import QRCodeStyling, { type FileExtension } from 'qr-code-styling'
import { buildQROptions, type StyleState } from './style'

/**
 * Owns a single QRCodeStyling instance, mounts it into a container ref, and
 * keeps it in sync with the current data + style. Returns the container ref to
 * attach and a `download` helper.
 */
export function useQrCode(data: string, style: StyleState, previewSize = 320) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  // Create once.
  if (qrRef.current === null) {
    qrRef.current = new QRCodeStyling(buildQROptions(data, style, previewSize))
  }

  // Mount into the DOM container.
  useEffect(() => {
    const node = containerRef.current
    const qr = qrRef.current
    if (node && qr) {
      node.replaceChildren()
      qr.append(node)
    }
  }, [])

  // Re-render whenever data or style changes.
  useEffect(() => {
    qrRef.current?.update(buildQROptions(data, style, previewSize))
  }, [data, style, previewSize])

  const download = async (extension: FileExtension, name = 'qrcode', exportSize = 1024) => {
    // Render at full export resolution, trigger download, then restore preview size.
    const qr = qrRef.current
    if (!qr) return
    qr.update(buildQROptions(data, style, exportSize))
    await qr.download({ name, extension })
    qr.update(buildQROptions(data, style, previewSize))
  }

  return { containerRef, download }
}
