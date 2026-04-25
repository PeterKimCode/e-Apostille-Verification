import mockData from './mockData.json'

export function getDefaultPageUrl() {
  return mockData[0]?.pageUrl || ''
}

export function normalizePageUrl(value) {
  if (!value) return ''

  const decoded = decodeURIComponent(String(value)).trim()
  const withoutHash = decoded.replace(/^#\/?/, '')
  const verifyIndex = withoutHash.indexOf('verify/')
  const normalizedPath = verifyIndex >= 0
    ? withoutHash.slice(verifyIndex + 'verify/'.length)
    : withoutHash

  return normalizedPath.replace(/^\/+|\/+$/g, '')
}

export function findRecordByPageUrl(pageUrl) {
  const normalizedPageUrl = normalizePageUrl(pageUrl)
  const serialMatch = normalizedPageUrl.match(/26e-\d+/i)?.[0]?.toLowerCase() || ''

  return mockData.find((record) => {
    const recordPageUrl = normalizePageUrl(record.pageUrl)
    const recordSerial = String(record.serialNumber || '').trim().toLowerCase()

    return (
      recordPageUrl === normalizedPageUrl ||
      recordSerial === normalizedPageUrl.toLowerCase() ||
      (serialMatch && recordSerial === serialMatch) ||
      (serialMatch && recordPageUrl.toLowerCase().includes(serialMatch))
    )
  }) || null
}
