import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, Info, Lightbulb } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import RiskBadge from '../components/ui/RiskBadge'
import CircularGauge from '../components/ui/CircularGauge'

const FIELD_LABELS = {
  age: 'Age',
  hypertension: 'Hypertension',
  heart_disease: 'Heart Disease',
  ever_married: 'Ever Married',
  work_type: 'Work Type',
  avg_glucose_level: 'Avg. Glucose',
  bmi: 'BMI',
  smoking_status: 'Smoking Status',
}

function formatValue(key, value) {
  if (key === 'hypertension' || key === 'heart_disease') {
    return Number(value) === 1 ? 'Yes' : 'No'
  }

  if (key === 'work_type') {
    const map = {
      children: 'Children',
      Govt_job: 'Government Job',
      Never_worked: 'Never Worked',
      Private: 'Private',
      'Self-employed': 'Self-employed',
    }

    return map[value] ?? value
  }

  if (key === 'avg_glucose_level') return `${value} mg/dL`
  if (key === 'bmi') return `${value}`

  return String(value ?? '—')
}

const RISK_HEADLINES = {
  Low: "You're in good shape 👍",
  Medium: 'Worth keeping an eye on',
  High: 'Please consult a doctor soon',
}

export default function Result() {
  const navigate = useNavigate()

  const data = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('lastPrediction')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!data) navigate('/check', { replace: true })
  }, [data, navigate])

  if (!data) return null

  const { input, prediction, modelSource, modelVersion } = data

  const probabilityPercent = Number(prediction?.probabilityPercent ?? 0)
  const riskLevel = prediction?.riskLevel ?? 'Unknown'

  const summaryEntries = Object.entries(FIELD_LABELS).filter(
    ([key]) => input?.[key] !== undefined && input?.[key] !== '',
  )

  return (
    <PageWrapper className="py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            StrokeSense Result
          </p>
          <h1 className="mt-2 text-3xl font-bold text-text md:text-4xl">
            Your Risk Assessment
          </h1>
          <p className="mt-3 text-muted">
            Based on the 8 health fields you submitted.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            {RISK_HEADLINES[riskLevel] && (
              <p className="mb-3 text-center text-lg font-semibold text-text">
                {RISK_HEADLINES[riskLevel]}
              </p>
            )}
            <CircularGauge percent={probabilityPercent} riskLevel={riskLevel} />

            <div className="mt-5">
              <RiskBadge riskLevel={riskLevel} size="lg" />
              <p className="mt-3 text-sm text-muted">
                Model source: {modelSource || 'unknown'}
              </p>
              {modelVersion && (
                <p className="mt-1 text-xs text-muted">
                  Version: {modelVersion}
                </p>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            {prediction?.factors?.length > 0 && (
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-text">Risk Factors</h2>
                </div>

                <ul className="space-y-2 text-sm text-muted">
                  {prediction.factors.map((factor) => (
                    <li key={factor} className="flex gap-2">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {prediction?.recommendations?.length > 0 && (
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold text-text">Recommendations</h2>
                </div>

                <ul className="space-y-2 text-sm text-muted">
                  {prediction.recommendations.map((rec) => (
                    <li key={rec} className="flex gap-2">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {prediction?.disclaimer && (
              <div className="flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-base text-blue-800">
                <Info className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{prediction.disclaimer}</p>
              </div>
            )}
          </div>
        </div>

        <Card className="mt-6 p-6">
          <h2 className="mb-4 text-xl font-bold text-text">Submitted Summary</h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summaryEntries.map(([key, label]) => (
              <div key={key} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {label}
                </p>
                <p className="mt-1 font-semibold text-text">
                  {formatValue(key, input[key])}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/check">
            Check Again
          </Button>
          <Link
            to="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-primary bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-teal-50"
          >
            View History
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}
