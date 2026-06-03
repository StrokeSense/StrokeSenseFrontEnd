import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, Info, Lightbulb } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import RiskBadge from '../components/ui/RiskBadge'
import CircularGauge from '../components/ui/CircularGauge'
import { useLanguage } from '../i18n/LanguageContext'

const content = {
  en: {
    pageLabel: 'StrokeSense Result',
    title: 'Your Risk Assessment',
    subtitle: 'Based on the 8 health fields you submitted.',
    riskFactors: 'Risk Factors',
    recommendations: 'Recommendations',
    submittedSummary: 'Submitted Summary',
    modelSource: 'Model source',
    version: 'Version',
    unknown: 'unknown',
    yes: 'Yes',
    no: 'No',
    checkAgain: 'Check Again',
    viewHistory: 'View History',
    fieldLabels: {
      age: 'Age',
      hypertension: 'Hypertension',
      heart_disease: 'Heart Disease',
      ever_married: 'Ever Married',
      work_type: 'Work Type',
      avg_glucose_level: 'Avg. Glucose',
      bmi: 'BMI',
      smoking_status: 'Smoking Status',
    },
    workTypes: {
      children: 'Children',
      Govt_job: 'Government Job',
      Never_worked: 'Never Worked',
      Private: 'Private',
      'Self-employed': 'Self-employed',
    },
    smokingStatuses: {
      'formerly smoked': 'Formerly Smoked',
      'never smoked': 'Never Smoked',
      smokes: 'Currently Smokes',
      Unknown: 'Unknown',
    },
    riskHeadlines: {
      Low: "You're in good shape 👍",
      Medium: 'Worth keeping an eye on',
      High: 'Please consult a doctor soon',
    },
  },
  id: {
    pageLabel: 'Hasil StrokeSense',
    title: 'Hasil Penilaian Risiko',
    subtitle: 'Berdasarkan 8 data kesehatan yang kamu masukkan.',
    riskFactors: 'Faktor Risiko',
    recommendations: 'Rekomendasi',
    submittedSummary: 'Ringkasan Data',
    modelSource: 'Sumber model',
    version: 'Versi',
    unknown: 'tidak diketahui',
    yes: 'Ya',
    no: 'Tidak',
    checkAgain: 'Cek Lagi',
    viewHistory: 'Lihat Riwayat',
    fieldLabels: {
      age: 'Usia',
      hypertension: 'Hipertensi',
      heart_disease: 'Penyakit Jantung',
      ever_married: 'Pernah Menikah',
      work_type: 'Jenis Pekerjaan',
      avg_glucose_level: 'Rata-rata Glukosa',
      bmi: 'BMI',
      smoking_status: 'Status Merokok',
    },
    workTypes: {
      children: 'Anak-anak',
      Govt_job: 'Pekerjaan Pemerintah',
      Never_worked: 'Belum Pernah Bekerja',
      Private: 'Swasta',
      'Self-employed': 'Wiraswasta',
    },
    smokingStatuses: {
      'formerly smoked': 'Pernah Merokok',
      'never smoked': 'Tidak Pernah Merokok',
      smokes: 'Masih Merokok',
      Unknown: 'Tidak Diketahui',
    },
    riskHeadlines: {
      Low: 'Kondisimu terlihat cukup baik 👍',
      Medium: 'Perlu tetap diperhatikan',
      High: 'Sebaiknya segera konsultasi ke dokter',
    },
  },
}

function formatValue(key, value, t) {
  if (key === 'hypertension' || key === 'heart_disease') {
    return Number(value) === 1 ? t.yes : t.no
  }

  if (key === 'work_type') {
    return t.workTypes[value] ?? value
  }

  if (key === 'smoking_status') {
    return t.smokingStatuses?.[value] ?? value
  }

  if (key === 'avg_glucose_level') return `${value} mg/dL`
  if (key === 'bmi') return `${value}`

  if (value === 'Yes') return t.yes
  if (value === 'No') return t.no

  return String(value ?? '—')
}

export default function Result() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = content[language] ?? content.en

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

  const summaryEntries = Object.entries(t.fieldLabels).filter(
    ([key]) => input?.[key] !== undefined && input?.[key] !== '',
  )

  return (
    <PageWrapper className="py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {t.pageLabel}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-text md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 text-muted">{t.subtitle}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="flex flex-col items-center justify-center p-6 text-center">
            {t.riskHeadlines[riskLevel] && (
              <p className="mb-3 text-center text-lg font-semibold text-text">
                {t.riskHeadlines[riskLevel]}
              </p>
            )}

            <CircularGauge percent={probabilityPercent} riskLevel={riskLevel} />

            <div className="mt-5">
              <RiskBadge riskLevel={riskLevel} size="lg" />
              <p className="mt-3 text-sm text-muted">
                {t.modelSource}: {modelSource || t.unknown}
              </p>
              {modelVersion && (
                <p className="mt-1 text-xs text-muted">
                  {t.version}: {modelVersion}
                </p>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            {prediction?.factors?.length > 0 && (
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-text">
                    {t.riskFactors}
                  </h2>
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
                  <h2 className="text-xl font-bold text-text">
                    {t.recommendations}
                  </h2>
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
          <h2 className="mb-4 text-xl font-bold text-text">
            {t.submittedSummary}
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summaryEntries.map(([key, label]) => (
              <div key={key} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {label}
                </p>
                <p className="mt-1 font-semibold text-text">
                  {formatValue(key, input[key], t)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/check"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {t.checkAgain}
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-primary bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-teal-50"
          >
            {t.viewHistory}
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}
