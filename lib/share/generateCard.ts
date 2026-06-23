export interface ShareCardData {
  billionaireName: string
  unitName: string
  quantity: string
  netWorth: number
}

export async function generateShareCard(
  elementId: string
): Promise<Blob | null> {
  const html2canvas = (await import('html2canvas')).default
  const el = document.getElementById(elementId)
  if (!el) return null

  const canvas = await html2canvas(el, {
    backgroundColor: '#18181b',
    scale: 2,
    useCORS: true,
    logging: false,
  })

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png', 0.95)
  })
}

export async function downloadShareCard(elementId: string, filename: string) {
  const blob = await generateShareCard(elementId)
  if (!blob) return

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function nativeShareCard(elementId: string, data: ShareCardData) {
  if (!navigator.share || !navigator.canShare) {
    await downloadShareCard(elementId, `how-rich-${data.billionaireName.toLowerCase().replace(/\s+/g, '-')}.png`)
    return
  }

  const blob = await generateShareCard(elementId)
  if (!blob) return

  const file = new File([blob], 'how-rich.png', { type: 'image/png' })
  await navigator.share({
    title: `How Rich is ${data.billionaireName}?`,
    text: `${data.billionaireName} could buy ${data.quantity} ${data.unitName}s`,
    files: [file],
  })
}
