import { Check } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

const labels = {
  en: ['Personal', 'Lifestyle', 'Clinical'],
  id: ['Pribadi', 'Gaya Hidup', 'Klinis'],
}

export default function StepIndicator({ currentStep }) {
  const { language } = useLanguage()
  const steps = labels[language] ?? labels.en

  return (
    <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((label, index) => {
        const stepNum = index + 1
        const isComplete = currentStep > stepNum
        const isActive = currentStep === stepNum

        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-10 sm:w-10 ${
                  isComplete
                    ? 'bg-primary text-white'
                    : isActive
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-slate-100 text-muted'
                }`}
              >
                {isComplete ? <Check className="h-5 w-5" /> : stepNum}
              </span>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  isActive ? 'text-primary' : 'text-muted'
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-16 ${
                  currentStep > stepNum ? 'bg-primary' : 'bg-slate-200'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
