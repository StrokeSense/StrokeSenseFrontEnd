import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from './Button'
import Input from './Input'

export default function BMICalculator({ onResult }) {
  const [open, setOpen] = useState(false)
  const [unit, setUnit] = useState('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    let bmi = null

    if (unit === 'metric') {
      const w = parseFloat(weight)
      const h = parseFloat(height) / 100
      if (w > 0 && h > 0) {
        bmi = w / (h * h)
      }
    } else {
      const wLbs = parseFloat(weight)
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      const totalInches = ft * 12 + inches
      if (wLbs > 0 && totalInches > 0) {
        const wKg = wLbs * 0.453592
        const hM = totalInches * 0.0254
        bmi = wKg / (hM * hM)
      }
    }

    if (bmi != null && Number.isFinite(bmi)) {
      setResult(Math.round(bmi * 10) / 10)
    }
  }

  const handleUse = () => {
    if (result != null) {
      onResult(result)
      setOpen(false)
      setResult(null)
    }
  }

  return (
    <div className="max-w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-primary hover:text-primary-dark"
      >
        Don&apos;t know your BMI? Calculate it →
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 max-w-full rounded-xl border border-teal-100 bg-teal-50/50 p-4">
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUnit('metric')
                    setResult(null)
                  }}
                  className={`min-h-11 flex-1 rounded-full border-2 px-3 py-2 text-sm font-medium transition-colors ${
                    unit === 'metric'
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-200 bg-white text-muted'
                  }`}
                >
                  Metric
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnit('imperial')
                    setResult(null)
                  }}
                  className={`min-h-11 flex-1 rounded-full border-2 px-3 py-2 text-sm font-medium transition-colors ${
                    unit === 'imperial'
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-200 bg-white text-muted'
                  }`}
                >
                  Imperial
                </button>
              </div>

              {unit === 'metric' ? (
                <div className="space-y-3">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    min="1"
                    placeholder="e.g. 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <Input
                    label="Height (cm)"
                    type="number"
                    min="1"
                    placeholder="e.g. 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    label="Weight (lbs)"
                    type="number"
                    min="1"
                    placeholder="e.g. 154"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Height (ft)"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                    />
                    <Input
                      label="Height (in)"
                      type="number"
                      min="0"
                      max="11"
                      placeholder="7"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button type="button" onClick={calculate} className="min-h-11">
                  Calculate
                </Button>
                {result != null && (
                  <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
                    Your BMI is {result}
                  </span>
                )}
              </div>

              {result != null && (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3 min-h-11 w-full sm:w-auto"
                  onClick={handleUse}
                >
                  Use this value
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
