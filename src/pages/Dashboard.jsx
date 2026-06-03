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
import RiskBadge from '../components/ui/RiskBadge'
import {
  getLocalPredictionHistory,
  clearLocalPredictionHistory,
} from '../utils/localHistory'
import { useLanguage } from '../i18n/LanguageContext'

const content = {
  en: {
    pageLabel: 'StrokeSense Dashboard',
    title: 'Prediction History',
    privacyNote:
      'For privacy, this history is stored only on this device/browser. Other users cannot see it.',
    totalChecks: 'Total Checks',
    latestRisk: 'Latest Risk',
    latestScore: 'Latest Score',
    riskTrend: 'Risk Trend',
    allPredictions: 'All Predictions',
    clearHistory: 'Clear Browser History',
    date: 'Date',
    input: 'Input',
    risk: 'Risk',
    score: 'Score',
    actions: 'Actions',
    age: 'Age',
    unknownWorkType: 'Unknown work type',
    deleteConfirm:
      'Delete this prediction from your browser history? This cannot be undone.',
    clearConfirm: 'Clear all prediction history from this browser?',
    noChecks: 'No Checks Yet',
    noChecksDesc:
      'Run your first stroke risk assessment to see your private browser history here.',
    noChecksPrivacy:
      'Your history is stored only on this device/browser for privacy.',
    startRiskCheck: 'Start Risk Check',
    medium: 'Medium',
    high: 'High',
  },
  id: {
    pageLabel: 'Dashboard StrokeSense',
    title: 'Riwayat Prediksi',
    privacyNote:
      'Untuk privasi, riwayat ini hanya tersimpan di perangkat/browser ini. Pengguna lain tidak dapat melihatnya.',
    totalChecks: 'Total Cek',
    latestRisk: 'Risiko Terbaru',
    latestScore: 'Skor Terbaru',
    riskTrend: 'Tren Risiko',
    allPredictions: 'Semua Prediksi',
    clearHistory: 'Hapus Riwayat Browser',
    date: 'Tanggal',
    input: 'Input',
    risk: 'Risiko',
    score: 'Skor',
    actions: 'Aksi',
    age: 'Usia',
    unknownWorkType: 'Jenis pekerjaan tidak diketahui',
    deleteConfirm:
      'Hapus prediksi ini dari riwayat browser kamu? Tindakan ini tidak dapat dibatalkan.',
    clearConfirm: 'Hapus semua riwayat prediksi dari browser ini?',
    noChecks: 'Belum Ada Cek',
    noChecksDesc:
      'Lakukan cek risiko stroke pertama kamu untuk melihat riwayat pribadi di sini.',
    noChecksPrivacy:
      'Riwayat kamu hanya tersimpan di perangkat/browser ini untuk menjaga privasi.',
    startRiskCheck: 'Mulai Cek Risiko',
    medium: 'Sedang',
    high: 'Tinggi',
  },
}

function formatDate(iso) {
  if (!iso) return 'Unknown date'

  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatChartDate(iso) {
  if (!iso) return 'Unknown'

  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getPredictionTitle(prediction, t) {
  const input = prediction?.input ?? {}
  const age = input.age ?? '—'
  const workType = input.work_type ?? t.unknownWorkType
  return `${t.age} ${age} • ${workType}`
}

export default function Dashboard() {
  const { language } = useLanguage()
  const t = content[language] ?? content.en
  const [predictions, setPredictions] = useState([])

  const loadLocalHistory = useCallback(() => {
    const localHistory = getLocalPredictionHistory()

    const sorted = [...localHistory].sort(
      (a, b) =>
        new Date(a.createdAt || a.savedAt || 0) -
        new Date(b.createdAt || b.savedAt || 0),
    )

    setPredictions(sorted)
  }, [])

  useEffect(() => {
    loadLocalHistory()
  }, [loadLocalHistory])

  const requestDelete = (id) => {
    const confirmed = window.confirm(t.deleteConfirm)
    if (!confirmed) return

    const updated = predictions.filter((prediction) => prediction.id !== id)

    localStorage.setItem(
      'strokesensePredictionHistory',
      JSON.stringify(updated),
    )

    setPredictions(updated)
  }

  const requestClearAll = () => {
    const confirmed = window.confirm(t.clearConfirm)
    if (!confirmed) return

    clearLocalPredictionHistory()
    setPredictions([])
  }

  const latest = predictions[predictions.length - 1]

  const chartData = predictions.map((p) => ({
    date: formatChartDate(p.createdAt || p.savedAt),
    score: p.prediction?.probabilityPercent ?? 0,
    fullDate: p.createdAt || p.savedAt,
  }))

  if (predictions.length === 0) {
    return (
      <PageWrapper className="py-20">
        <div className="mx-auto max-w-xl px-4">
          <Card className="p-8 text-center">
            <ClipboardPlus className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-bold text-text">{t.noChecks}</h2>
            <p className="mt-2 text-muted">{t.noChecksDesc}</p>
            <p className="mt-2 text-sm text-muted">{t.noChecksPrivacy}</p>
            <Link
              to="/check"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              {t.startRiskCheck}
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
            {t.pageLabel}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-text md:text-4xl">
            {t.title}
          </h1>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {t.privacyNote}
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <ClipboardList className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm text-muted">{t.totalChecks}</p>
            <p className="mt-2 text-3xl font-bold text-text">
              {predictions.length}
            </p>
          </Card>

          <Card className="p-5">
            <Activity className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm text-muted">{t.latestRisk}</p>
            <div className="mt-3">
              {latest?.prediction?.riskLevel && (
                <RiskBadge riskLevel={latest.prediction.riskLevel} />
              )}
            </div>
          </Card>

          <Card className="p-5">
            <TrendingUp className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm text-muted">{t.latestScore}</p>
            <p className="mt-2 text-3xl font-bold text-text">
              {Number(latest?.prediction?.probabilityPercent ?? 0).toFixed(1)}%
            </p>
          </Card>
        </div>

        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-xl font-bold text-text">{t.riskTrend}</h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(1)}%`,
                    t.score,
                  ]}
                />
                <ReferenceLine
                  y={35}
                  stroke="#d97706"
                  strokeDasharray="4 4"
                  label={{
                    value: t.medium,
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
                    value: t.high,
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

        <Card className="p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-text">{t.allPredictions}</h2>

            <Button
              type="button"
              variant="outline"
              onClick={requestClearAll}
              className="text-red-600 hover:bg-red-50"
            >
              {t.clearHistory}
            </Button>
          </div>

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
                        {getPredictionTitle(p, t)}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {formatDate(p.createdAt || p.savedAt)}
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
                      className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                      aria-label="Delete prediction"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-muted">
                  <th className="py-3 pr-4 font-semibold">{t.date}</th>
                  <th className="py-3 pr-4 font-semibold">{t.input}</th>
                  <th className="py-3 pr-4 font-semibold">{t.risk}</th>
                  <th className="py-3 pr-4 font-semibold">{t.score}</th>
                  <th className="py-3 pr-4 text-right font-semibold">
                    {t.actions}
                  </th>
                </tr>
              </thead>

              <tbody>
                {predictions
                  .slice()
                  .reverse()
                  .map((p) => (
                    <tr key={p.id} className="border-b border-slate-100">
                      <td className="py-4 pr-4 text-muted">
                        {formatDate(p.createdAt || p.savedAt)}
                      </td>
                      <td className="py-4 pr-4 font-medium text-text">
                        {getPredictionTitle(p, t)}
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
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                          aria-label="Delete prediction"
                        >
                          <Trash2 className="h-5 w-5" />
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
