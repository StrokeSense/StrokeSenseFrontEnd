import { useState, useCallback } from 'react'
import { createPrediction } from '../api/strokesense'

export function usePrediction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const predict = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const response = await createPrediction(payload)
      return response
    } catch (err) {
      const isNetworkError =
        !err.response &&
        (err.code === 'ERR_NETWORK' || err.message === 'Network Error')
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (isNetworkError
          ? 'Could not reach the backend. Start it on http://localhost:3000, restart the frontend dev server, then try again.'
          : err.message) ||
        'Could not reach the backend. Make sure the backend server is running on http://localhost:3000 and try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { predict, loading, error, clearError }
}
