import { useMemo, useState } from 'react'
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
import { saveLocalPrediction } from '../utils/localHistory'
import { useLanguage } from '../i18n/LanguageContext'
function createPredictionSchema(language) {
  const isId = language === 'id'
  const messages = {
    ageRequired: isId ? 'Usia wajib diisi' : 'Age is required',
    ageMin: isId ? 'Usia minimal 0 tahun' : 'Age must be at least 0',
    ageMax: isId ? 'Usia maksimal 120 tahun' : 'Age must be at most 120',
    glucoseRequired: isId
      ? 'Kadar glukosa wajib diisi'
      : 'Glucose level is required',
    glucoseMin: isId ? 'Kadar glukosa minimal 0' : 'Must be at least 0',
    glucoseMax: isId ? 'Kadar glukosa maksimal 400' : 'Must be at most 400',
    bmiRequired: isId ? 'BMI wajib diisi' : 'BMI is required',
    bmiMin: isId ? 'BMI minimal 5' : 'BMI must be at least 5',
    bmiMax: isId ? 'BMI maksimal 100' : 'BMI must be at most 100',
  }
  const requiredNumber = (requiredMsg, minValue, minMsg, maxValue, maxMsg) =>
    z
      .union([z.string(), z.number()])
      .refine((value) => value !== '' && value !== null && value !== undefined, {
        message: requiredMsg,
      })
      .transform((value) => Number(value))
      .refine((value) => Number.isFinite(value), {
        message: requiredMsg,
      })
      .refine((value) => value >= minValue, {
        message: minMsg,
      })
      .refine((value) => value <= maxValue, {
        message: maxMsg,
      })
  return z.object({
    age: requiredNumber(
      messages.ageRequired,
      0,
      messages.ageMin,
      120,
      messages.ageMax,
    ),
    hypertension: z.union([z.literal(0), z.literal(1)]),
    heart_disease: z.union([z.literal(0), z.literal(1)]),
    ever_married: z.enum(['Yes', 'No']),
    work_type: z.enum([
      'children',
      'Govt_job',
      'Never_worked',
      'Private',
      'Self-employed',
    ]),
    avg_glucose_level: requiredNumber(
      messages.glucoseRequired,
      0,
      messages.glucoseMin,
      400,
      messages.glucoseMax,
    ),
    bmi: requiredNumber(
      messages.bmiRequired,
      5,
      messages.bmiMin,
      100,
      messages.bmiMax,
    ),
    smoking_status: z.enum([
      'formerly smoked',
      'never smoked',
      'smokes',
      'Unknown',
    ]),
  })
}
const STEP_FIELDS = {
  1: ['age', 'ever_married', 'work_type'],
  2: ['hypertension', 'heart_disease', 'smoking_status'],
  3: ['avg_glucose_level', 'bmi'],
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
const content = {
  en: {
    pageLabel: 'StrokeSense',
    title: 'Stroke Risk Check',
    subtitle:
      'Complete all steps using the 8 health fields required by the AI model.',
    stepDescriptions: {
      1: 'Basic information about you',
      2: 'Your medical and health background',
      3: 'Two key clinical measurements',
    },
    labels: {
      age: 'Age',
      everMarried: 'Ever Married',
      workType: 'Work Type',
      hypertension: 'Do you have hypertension?',
      heartDisease: 'Do you have heart disease?',
      smokingStatus: 'Smoking Status',
      glucose: 'Average Glucose Level',
      bmi: 'BMI',
    },
    placeholders: {
      age: 'Example: 55',
      glucose: 'Example: 180',
      bmi: 'Example: 29.5',
    },
    tooltips: {
      age: 'Enter your current age in years. The model uses ages from 0 to 120.',
      glucose:
        'Average glucose level in your blood, measured in mg/dL. You can get this value from a glucometer at home or from a recent blood test. Normal fasting range is 70–100 mg/dL.',
      bmi: "Body Mass Index is calculated from your height and weight. Normal range is 18.5–24.9. Use the calculator below if you don't know yours.",
    },
    alerts: { required: 'Please fill in all required fields before continuing.' },
    buttons: {
      back: 'Back',
      next: 'Next',
      analyzing: 'Analyzing…',
      submit: 'Get My Risk Score',
    },
    options: {
      yes: 'Yes',
      no: 'No',
      children: 'Children',
      govt: 'Government Job',
      neverWorked: 'Never Worked',
      private: 'Private',
      selfEmployed: 'Self-employed',
      formerlySmoked: 'Formerly Smoked',
      neverSmoked: 'Never Smoked',
      smokes: 'Currently Smokes',
      unknown: 'Unknown',
    },
  },
  id: {
    pageLabel: 'StrokeSense',
    title: 'Cek Risiko Stroke',
    subtitle:
      'Lengkapi semua langkah dengan 8 data kesehatan yang dibutuhkan oleh model AI.',
    stepDescriptions: {
      1: 'Informasi dasar tentang kamu',
      2: 'Riwayat medis dan kondisi kesehatan',
      3: 'Dua pengukuran klinis utama',
    },
    labels: {
      age: 'Usia',
      everMarried: 'Pernah Menikah',
      workType: 'Jenis Pekerjaan',
      hypertension: 'Apakah kamu memiliki hipertensi?',
      heartDisease: 'Apakah kamu memiliki penyakit jantung?',
      smokingStatus: 'Status Merokok',
      glucose: 'Rata-rata Kadar Glukosa',
      bmi: 'BMI',
    },
    placeholders: {
      age: 'Contoh: 55',
      glucose: 'Contoh: 180',
      bmi: 'Contoh: 29.5',
    },
    tooltips: {
      age: 'Masukkan usia kamu saat ini dalam satuan tahun. Model menerima rentang usia 0 sampai 120.',
      glucose:
        'Rata-rata kadar glukosa dalam darah, diukur dalam mg/dL. Nilai ini bisa didapat dari alat cek gula darah atau hasil tes darah terbaru. Rentang puasa normal sekitar 70–100 mg/dL.',
      bmi: 'Body Mass Index dihitung dari tinggi dan berat badan. Rentang normal sekitar 18.5–24.9. Gunakan kalkulator di bawah jika kamu belum tahu BMI kamu.',
    },
    alerts: { required: 'Harap isi semua data yang wajib sebelum melanjutkan.' },
    buttons: {
      back: 'Kembali',
      next: 'Lanjut',
      analyzing: 'Menganalisis…',
      submit: 'Lihat Skor Risiko',
    },
    options: {
      yes: 'Ya',
      no: 'Tidak',
      children: 'Anak-anak',
      govt: 'Pekerjaan Pemerintah',
      neverWorked: 'Belum Pernah Bekerja',
      private: 'Swasta',
      selfEmployed: 'Wiraswasta',
      formerlySmoked: 'Pernah Merokok',
      neverSmoked: 'Tidak Pernah Merokok',
      smokes: 'Masih Merokok',
      unknown: 'Tidak Diketahui',
    },
  },
}
export default function Check() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { predict, loading, error, clearError } = usePrediction()
  const { language } = useLanguage()
  const t = content[language] ?? content.en
  const predictionSchema = useMemo(() => createPredictionSchema(language), [language])
  const workOptions = useMemo(
    () => [
      { value: 'children', label: t.options.children },
      { value: 'Govt_job', label: t.options.govt },
      { value: 'Never_worked', label: t.options.neverWorked },
      { value: 'Private', label: t.options.private },
      { value: 'Self-employed', label: t.options.selfEmployed },
    ],
    [t],
  )
  const smokingOptions = useMemo(
    () => [
      { value: 'formerly smoked', label: t.options.formerlySmoked },
      { value: 'never smoked', label: t.options.neverSmoked },
      { value: 'smokes', label: t.options.smokes },
      { value: 'Unknown', label: t.options.unknown },
    ],
    [t],
  )
  const yesNoOptions = useMemo(
    () => [
      { value: 1, label: t.options.yes },
      { value: 0, label: t.options.no },
    ],
    [t],
  )
  const marriedOptions = useMemo(
    () => [
      { value: 'Yes', label: t.options.yes },
      { value: 'No', label: t.options.no },
    ],
    [t],
  )
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
        saveLocalPrediction(response.data)
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
            {t.pageLabel}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 text-muted">{t.subtitle}</p>
        </div>
        <Card className="p-6 md:p-8">
          <StepIndicator currentStep={step} />
          <p className="mb-6 text-sm text-muted">
            {t.stepDescriptions[step]}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-6">
            {step === 1 && (
              <div className="space-y-7">
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <label
                      htmlFor="age"
                      className="text-base font-medium text-text"
                    >
                      {t.labels.age}
                    </label>
                    <InfoTooltip content={t.tooltips.age} />
                  </div>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    placeholder={t.placeholders.age}
                    error={errors.age?.message}
                    {...register('age')}
                  />
                </div>
                <Controller
                  name="ever_married"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label={t.labels.everMarried}
                      error={errors.ever_married?.message}
                    >
                      <ToggleButton
                        name="ever_married"
                        options={marriedOptions}
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
                      label={t.labels.workType}
                      options={workOptions}
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
                      label={t.labels.hypertension}
                      error={errors.hypertension?.message}
                    >
                      <ToggleButton
                        name="hypertension"
                        options={yesNoOptions}
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
                      label={t.labels.heartDisease}
                      error={errors.heart_disease?.message}
                    >
                      <ToggleButton
                        name="heart_disease"
                        options={yesNoOptions}
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
                      label={t.labels.smokingStatus}
                      options={smokingOptions}
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
                      {t.labels.glucose}
                    </label>
                    <InfoTooltip content={t.tooltips.glucose} />
                  </div>
                  <Input
                    id="avg_glucose_level"
                    type="number"
                    min="0"
                    max="400"
                    step="0.01"
                    placeholder={t.placeholders.glucose}
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
                      {t.labels.bmi}
                    </label>
                    <InfoTooltip content={t.tooltips.bmi} />
                  </div>
                  <Input
                    id="bmi"
                    type="number"
                    min="5"
                    max="100"
                    step="0.1"
                    placeholder={t.placeholders.bmi}
                    error={errors.bmi?.message}
                    {...register('bmi')}
                  />
                  <BMICalculator
                    onResult={(value) => {
                      setValue('bmi', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
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
                {t.alerts.required}
              </div>
            )}
            <div className="flex items-center justify-between gap-3 pt-4">
              {step > 1 ? (
                <Button type="button" variant="secondary" onClick={goBack}>
                  <ChevronLeft className="h-4 w-4" />
                  {t.buttons.back}
                </Button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <Button type="button" onClick={goNext}>
                  {t.buttons.next}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      {t.buttons.analyzing}
                    </>
                  ) : (
                    t.buttons.submit
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
