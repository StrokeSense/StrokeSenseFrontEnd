import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import {
  Trash2,
  ClipboardPlus,
  ClipboardList,
  Activity,
  TrendingUp,
} from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import RiskBadge from '../components/ui/RiskBadge'
import { getPredictions, deletePrediction } from '../api/strokesense'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatChartDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getPredictionTitle(prediction) {
  const input = prediction?.input ?? {}
  const age = input.age ?? '—'
  const workType = input.work_type ?? 'Unknown work type'
  return `Age ${age} • ${workType}`
}

export default function Dashboard() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchPredictions = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPredictions()
      const list = response?.data ?? response ?? []
      const sorted = [...list].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      )

      setPredictions(sorted)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not reach the backend. Start it on http://localhost:3000, restart the frontend dev server, then refresh.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPredictions()
  }, [fetchPredictions])

  const requestDelete = (id) => {
    const confirmed = window.confirm(
      'Delete this prediction from your history? This cannot be undone.',
    )
    if (confirmed) {
      handleDelete(id)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)

    try {
      await deletePrediction(id)
      await fetchPredictions()
    } catch {
      setError('Failed to delete prediction.')
    } finally {
      setDeletingId(null)
    }
  }

  const latest = predictions[predictions.length - 1]

  const chartData = predictions.map((p) => ({
    date: formatChartDate(p.createdAt),
    score: p.prediction?.probabilityPercent ?? 0,
    fullDate: p.createdAt,
  }))

  if (loading) {
    return (
      <PageWrapper className="py-20">
        <div className="flex justify-center">
          <Spinner />
        </div>
      </PageWrapper>
    )
  }

  if (error && predictions.length === 0) {
    return (
      <PageWrapper className="py-20">
        <div className="mx-auto max-w-xl px-4">
          <Card className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button className="mt-4" onClick={fetchPredictions}>
              Retry
            </Button>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  if (predictions.length === 0) {
    return (
      <PageWrapper className="py-20">
        <div className="mx-auto max-w-xl px-4">
          <Card className="p-8 text-center">
            <ClipboardPlus className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-bold text-text">No Checks Yet</h2>
            <p className="mt-2 text-muted">
              Run your first stroke risk assessment to see your history and trends here.
            </p>
            <Link
              to="/check"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Start Risk Check
            </Link>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            StrokeSense Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-text md:text-4xl">
            Prediction History
          </h1>
          <p className="mt-3 text-muted">
            Review submitted checks and risk trends from the backend history.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <ClipboardList className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm text-muted">Total Checks</p>
            <p className="mt-2 text-3xl font-bold text-text">
              {predictions.length}
            </p>
          </Card>

          <Card className="p-5">
            <Activity className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm text-muted">Latest Risk</p>
            <div className="mt-3">
              {latest?.prediction?.riskLevel && (
                <RiskBadge riskLevel={latest.prediction.riskLevel} />
              )}
            </div>
          </Card>

          <Card className="p-5">
            <TrendingUp className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm text-muted">Latest Score</p>
            <p className="mt-2 text-3xl font-bold text-text">
              {Number(latest?.prediction?.probabilityPercent ?? 0).toFixed(1)}%
            </p>
          </Card>
        </div>

        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-xl font-bold text-text">Risk Trend</h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(1)}%`,
                    'Risk Score',
                  ]}
                />
                <ReferenceLine
                  y={35}
                  stroke="#d97706"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Medium',
                    position: 'right',
                    fontSize: 11,
                    fill: '#d97706',
                  }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#dc2626"
                  strokeDasharray="4 4"
                  label={{
                    value: 'High',
                    position: 'right',
                    fontSize: 11,
                    fill: '#dc2626',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, fill: '#0d9488' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-text">All Predictions</h2>

          <div className="space-y-4 md:hidden">
            {predictions
              .slice()
              .reverse()
              .map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">
                        {getPredictionTitle(p)}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {formatDate(p.createdAt)}
                      </p>
                    </div>

                    <RiskBadge riskLevel={p.prediction?.riskLevel} />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-bold text-text">
                      {Number(p.prediction?.probabilityPercent ?? 0).toFixed(1)}%
                    </p>

                    <button
                      type="button"
                      onClick={() => requestDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-50"
                      aria-label="Delete prediction"
                    >
                      {deletingId === p.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-muted">
                  <th className="py-3 pr-4 font-semibold">Date</th>
                  <th className="py-3 pr-4 font-semibold">Input</th>
                  <th className="py-3 pr-4 font-semibold">Risk</th>
                  <th className="py-3 pr-4 font-semibold">Score</th>
                  <th className="py-3 pr-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {predictions
                  .slice()
                  .reverse()
                  .map((p) => (
                    <tr key={p.id} className="border-b border-slate-100">
                      <td className="py-4 pr-4 text-muted">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="py-4 pr-4 font-medium text-text">
                        {getPredictionTitle(p)}
                      </td>
                      <td className="py-4 pr-4">
                        <RiskBadge riskLevel={p.prediction?.riskLevel} />
                      </td>
                      <td className="py-4 pr-4 font-semibold text-text">
                        {Number(p.prediction?.probabilityPercent ?? 0).toFixed(1)}%
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => requestDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-red-500 hover:bg-red-50 disabled:opacity-50"
                          aria-label="Delete prediction"
                        >
                          {deletingId === p.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
