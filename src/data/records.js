import mockData from './mockData.json'

export function getDefaultPageUrl() {
  return mockData[0]?.pageUrl || ''
}

export function findRecordByPageUrl(pageUrl) {
  return mockData.find((record) => record.pageUrl === pageUrl) || null
}
