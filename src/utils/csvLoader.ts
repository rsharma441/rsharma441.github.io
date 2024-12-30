import csvtojson from 'csvtojson'

export const loadCsv = async <T>(filePath: string): Promise<T[]> => {
  try {
    const response = await fetch(filePath)
    const csvText = await response.text()

    // Replace escaped characters in the raw CSV text
    const processedCsv = csvText.replace(/\\n/g, '\n')

    const jsonArray = await csvtojson().fromString(processedCsv)
    return jsonArray
  } catch (error) {
    console.error('Error loading CSV:', error)
    return []
  }
}
