import axios from 'axios'

// In dev, use same-origin + Vite proxy (see vite.config.js) to avoid CORS when the
// frontend runs on a different port (e.g. 5174). Set VITE_API_BASE_URL for production.
const envUrl = import.meta.env.VITE_API_BASE_URL
const BASE_URL = import.meta.env.DEV
  ? envUrl || ''
  : envUrl ?? 'http://localhost:3000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function healthCheck() {
  const { data } = await api.get('/api/health')
  return data
}

export async function getFields() {
  const { data } = await api.get('/api/fields')
  return data
}

export async function createPrediction(payload) {
  const { data } = await api.post('/api/predict', payload)
  return data
}

export async function getPredictions() {
  const { data } = await api.get('/api/predictions')
  return data
}

export async function getPredictionById(id) {
  const { data } = await api.get(`/api/predictions/${id}`)
  return data
}

export async function deletePrediction(id) {
  const { data } = await api.delete(`/api/predictions/${id}`)
  return data
}
