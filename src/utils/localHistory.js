const HISTORY_KEY = 'strokesensePredictionHistory'
const LAST_PREDICTION_KEY = 'lastPrediction'

export function getLocalPredictionHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.error('Failed to read local prediction history:', error)
    return []
  }
}

export function saveLocalPrediction(prediction) {
  try {
    const currentHistory = getLocalPredictionHistory()

    const safePrediction = {
      ...prediction,
      savedAt: new Date().toISOString()
    }

    const updatedHistory = [safePrediction, ...currentHistory].slice(0, 25)

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
    sessionStorage.setItem(LAST_PREDICTION_KEY, JSON.stringify(safePrediction))

    return updatedHistory
  } catch (error) {
    console.error('Failed to save local prediction history:', error)
    return []
  }
}

export function clearLocalPredictionHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
