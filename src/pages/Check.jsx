import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import StepIndicator from '../components/forms/StepIndicator'
import FormField from '../components/forms/FormField'
import ToggleButton from '../components/forms/ToggleButton'
import SelectField from '../components/forms/SelectField'
import InfoTooltip from '../components/ui/InfoTooltip'
import BMICalculator from '../components/ui/BMICalculator'
import { usePrediction } from '../hooks/usePrediction'

const predictionSchema = z.object({
  age: z.coerce
    .number({ invalid_type_error: 'Age is required' })
    .min(0, 'Age must be at least 0')
    .max(120, 'Age must be at most 120'),

  hypertension: z.union([z.literal(0), z.literal(1)]),

  heart_disease: z.union([z.literal(0), z.literal(1)]),

  ever_married: z.enum(['Yes', 'No'], {
    required_error: 'This field is required',
  }),

  work_type: z.enum(
    ['children', 'Govt_job', 'Never_worked', 'Private', 'Self-employed'],
    { required_error: 'Work type is required' },
  ),

  avg_glucose_level: z.coerce
    .number({ invalid_type_error: 'Glucose level is required' })
    .min(0, 'Must be at least 0')
    .max(400, 'Must be at most 400'),

  bmi: z.coerce
    .number({ invalid_type_error: 'BMI is required' })
    .min(5, 'BMI must be at least 5')
    .max(100, 'BMI must be at most 100'),

  smoking_status: z.enum(
    ['formerly smoked', 'never smoked', 'smokes', 'Unknown'],
    { required_error: 'Smoking status is required' },
  ),
})

const WORK_OPTIONS = [
  { value: 'children', label: 'Children' },
  { value: 'Govt_job', label: 'Government Job' },
  { value: 'Never_worked', label: 'Never Worked' },
  { value: 'Private', label: 'Private' },
  { value: 'Self-employed', label: 'Self-employed' },
]

const SMOKING_OPTIONS = [
  { value: 'formerly smoked', label: 'Formerly Smoked' },
  { value: 'never smoked', label: 'Never Smoked' },
  { value: 'smokes', label: 'Currently Smokes' },
  { value: 'Unknown', label: 'Unknown' },
]

const YES_NO_OPTIONS = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' },
]

const MARRIED_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
]

const STEP_FIELDS = {
  1: ['age', 'ever_married', 'work_type'],
  2: ['hypertension', 'heart_disease', 'smoking_status'],
  3: ['avg_glucose_level', 'bmi'],
}

const STEP_DESCRIPTIONS = {
  1: 'Basic information about you',
  2: 'Your medical and health background',
  3: 'Two key clinical measurements',
}

const defaultValues = {
  age: '',
  hypertension: 0,
  heart_disease: 0,
  ever_married: 'Yes',
  work_type: 'Private',
  avg_glucose_level: '',
  bmi: '',
  smoking_status: 'never smoked',
}

export default function Check() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { predict, loading, error, clearError } = usePrediction()

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(predictionSchema),
    defaultValues,
    mode: 'all',
  })

  const goNext = async () => {
    clearError()
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep((s) => Math.min(s + 1, 3))
  }

  const goBack = () => {
    clearError()
    setStep((s) => Math.max(s - 1, 1))
  }

  const onSubmit = async (data) => {
    clearError()

    const payload = {
      age: Number(data.age),
      hypertension: Number(data.hypertension),
      heart_disease: Number(data.heart_disease),
      ever_married: data.ever_married,
      work_type: data.work_type,
      avg_glucose_level: Number(data.avg_glucose_level),
      bmi: Number(data.bmi),
      smoking_status: data.smoking_status,
    }

    try {
      const response = await predict(payload)

      if (response?.success && response?.data) {
        sessionStorage.setItem('lastPrediction', JSON.stringify(response.data))
        navigate('/result')
      }
    } catch {
      // Error is handled inside usePrediction hook
    }
  }

  return (
    <PageWrapper className="py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            StrokeSense
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text md:text-4xl">
            Stroke Risk Check
          </h1>
          <p className="mt-3 text-muted">
            Complete all steps using the 8 health fields required by the AI model.
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <StepIndicator currentStep={step} />

          <p className="mb-6 text-sm text-muted">{STEP_DESCRIPTIONS[step]}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-6">
            {step === 1 && (
              <div className="space-y-7">
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <label
                      htmlFor="age"
                      className="text-base font-medium text-text"
                    >
                      Age
                    </label>
                    <InfoTooltip content="Enter your current age in years. The model uses ages from 0 to 120." />
                  </div>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    required
                    placeholder="Example: 55"
                    error={errors.age?.message}
                    {...register('age')}
                  />
                </div>

                <Controller
                  name="ever_married"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Ever Married"
                      error={errors.ever_married?.message}
                    >
                      <ToggleButton
                        name="ever_married"
                        options={MARRIED_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="work_type"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Work Type"
                      options={WORK_OPTIONS}
                      error={errors.work_type?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-7">
                <Controller
                  name="hypertension"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Do you have hypertension?"
                      error={errors.hypertension?.message}
                    >
                      <ToggleButton
                        name="hypertension"
                        options={YES_NO_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="heart_disease"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Do you have heart disease?"
                      error={errors.heart_disease?.message}
                    >
                      <ToggleButton
                        name="heart_disease"
                        options={YES_NO_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="smoking_status"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Smoking Status"
                      options={SMOKING_OPTIONS}
                      error={errors.smoking_status?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-7">
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <label
                      htmlFor="avg_glucose_level"
                      className="text-base font-medium text-text"
                    >
                      Average Glucose Level
                    </label>
                    <InfoTooltip content="Average glucose level in your blood, measured in mg/dL. You can get this value from a glucometer at home or from a recent blood test. Normal fasting range is 70–100 mg/dL." />
                  </div>
                  <Input
                    id="avg_glucose_level"
                    type="number"
                    min="0"
                    max="400"
                    step="0.01"
                    required
                    placeholder="Example: 180"
                    unit="mg/dL"
                    error={errors.avg_glucose_level?.message}
                    {...register('avg_glucose_level')}
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <label
                      htmlFor="bmi"
                      className="text-base font-medium text-text"
                    >
                      BMI
                    </label>
                    <InfoTooltip content="Body Mass Index is calculated from your height and weight. Normal range is 18.5–24.9. Use the calculator below if you don't know yours." />
                  </div>
                  <Input
                    id="bmi"
                    type="number"
                    min="5"
                    max="100"
                    step="0.1"
                    required
                    placeholder="Example: 29.5"
                    error={errors.bmi?.message}
                    {...register('bmi')}
                  />
                  <BMICalculator
                  onResult={(value) => {
                    setValue('bmi', value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true
                    })
                    trigger('bmi')
                  }}
                />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {Object.keys(errors).some((key) => STEP_FIELDS[step].includes(key)) && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Please fill in all required fields before continuing.
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-4">
              {step > 1 ? (
                <Button type="button" variant="secondary" onClick={goBack}>
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button type="button" onClick={goNext}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      Analyzing…
                    </>
                  ) : (
                    'Get My Risk Score'
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </PageWrapper>
  )
}
