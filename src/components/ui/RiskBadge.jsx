import { useLanguage } from '../../i18n/LanguageContext'

function normalizeRiskLevel(riskLevel, language = 'en') {
  const value = String(riskLevel || '').toLowerCase()

  const labels = {
    en: {
      high: 'High Risk',
      medium: 'Medium Risk',
      low: 'Low Risk',
      unknown: 'Unknown Risk',
    },
    id: {
      high: 'Risiko Tinggi',
      medium: 'Risiko Sedang',
      low: 'Risiko Rendah',
      unknown: 'Risiko Tidak Diketahui',
    },
  }

  const t = labels[language] ?? labels.en

  if (value.includes('high')) {
    return {
      label: t.high,
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: '⚠️',
    }
  }

  if (value.includes('medium') || value.includes('moderate')) {
    return {
      label: t.medium,
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: '⚠️',
    }
  }

  if (value.includes('low')) {
    return {
      label: t.low,
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: '✓',
    }
  }

  return {
    label: riskLevel || t.unknown,
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: 'ℹ️',
  }
}

export default function RiskBadge({ riskLevel, size = 'md' }) {
  const { language } = useLanguage()
  const config = normalizeRiskLevel(riskLevel, language)

  const sizeClass =
    size === 'lg'
      ? 'px-4 py-2 text-sm'
      : 'px-3 py-1.5 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${sizeClass} ${config.className}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}
