import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  ClipboardList,
  HeartPulse,
  LineChart,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useLanguage } from '../i18n/LanguageContext'

function useCountUp(target, duration = 1500, enabled = true) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, enabled])

  return value
}

function StatCard({ value, suffix, label, delay, Icon }) {
  const [visible, setVisible] = useState(false)
  const count = useCountUp(value, 1200, visible)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <Card className="text-center">
      <Icon className="mx-auto mb-2 h-5 w-5 text-primary" aria-hidden="true" />
      <p className="text-4xl font-extrabold text-primary sm:text-5xl">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-muted sm:text-base">{label}</p>
    </Card>
  )
}

const content = {
  en: {
    badge: 'Early Stroke Detection',
    titleMain: 'Know Your Risk.',
    titleHighlight: "Before It's Too Late.",
    subtitle:
      'StrokeSense helps you understand your stroke risk early — so you can take action while prevention is still possible.',
    checkButton: 'Check Your Risk',
    howItWorksLink: 'See how it works ↓',
    stats: [
      {
        value: 1,
        suffix: ' in 4',
        label: 'Adults Will Have a Stroke',
        icon: Users,
      },
      {
        value: 80,
        suffix: '%',
        label: 'Are Preventable',
        icon: ShieldCheck,
      },
      {
        value: 100,
        suffix: '%',
        label: 'Early Detection Saves Lives',
        icon: HeartPulse,
      },
    ],
    howItWorksTitle: 'How It Works',
    steps: [
      {
        step: '01',
        icon: ClipboardList,
        title: 'Enter Health Data',
        desc: 'Complete a short 3-step form with your health profile.',
      },
      {
        step: '02',
        icon: Activity,
        title: 'System Analyzes',
        desc: 'Our model evaluates stroke risk from your clinical inputs.',
      },
      {
        step: '03',
        icon: LineChart,
        title: 'Get Risk Score',
        desc: 'Receive a clear probability score and personalized guidance.',
      },
    ],
  },
  id: {
    badge: 'Deteksi Dini Risiko Stroke',
    titleMain: 'Kenali Risikomu.',
    titleHighlight: 'Sebelum Terlambat.',
    subtitle:
      'StrokeSense membantu kamu memahami risiko stroke lebih awal, agar kamu bisa mengambil langkah pencegahan sebelum kondisi menjadi lebih serius.',
    checkButton: 'Cek Risiko Sekarang',
    howItWorksLink: 'Lihat cara kerjanya ↓',
    stats: [
      {
        value: 1,
        suffix: ' dari 4',
        label: 'Orang Dewasa Berisiko Mengalami Stroke',
        icon: Users,
      },
      {
        value: 80,
        suffix: '%',
        label: 'Kasus Dapat Dicegah',
        icon: ShieldCheck,
      },
      {
        value: 100,
        suffix: '%',
        label: 'Deteksi Dini Membantu Menyelamatkan Nyawa',
        icon: HeartPulse,
      },
    ],
    howItWorksTitle: 'Cara Kerja',
    steps: [
      {
        step: '01',
        icon: ClipboardList,
        title: 'Masukkan Data Kesehatan',
        desc: 'Isi form singkat berisi profil kesehatan dasar kamu.',
      },
      {
        step: '02',
        icon: Activity,
        title: 'Sistem Menganalisis',
        desc: 'Model AI mengevaluasi risiko stroke dari input kesehatan yang kamu berikan.',
      },
      {
        step: '03',
        icon: LineChart,
        title: 'Lihat Skor Risiko',
        desc: 'Dapatkan skor probabilitas risiko dan arahan awal yang mudah dipahami.',
      },
    ],
  },
}

export default function Home() {
  const { language } = useLanguage()
  const t = content[language] ?? content.en

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 to-transparent" />
        <PageWrapper className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              {t.badge}
            </span>
            <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl">
              {t.titleMain}{' '}
              <span className="text-primary">{t.titleHighlight}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
              {t.subtitle}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link to="/check">
                <Button className="gap-2 px-8 text-base">
                  {t.checkButton}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a
                href="#how-it-works"
                className="text-sm text-muted underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {t.howItWorksLink}
              </a>
            </div>
          </motion.div>
        </PageWrapper>
      </section>

      <PageWrapper>
        <div className="grid gap-4 sm:grid-cols-3">
          {t.stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 150}
              Icon={stat.icon}
            />
          ))}
        </div>

        <section id="how-it-works" className="mt-16 scroll-mt-24">
          <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight text-text">
            {t.howItWorksTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {t.steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                {i < t.steps.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-10 hidden h-0.5 w-[calc(100%-80px)] bg-primary/30 md:block" />
                )}
                <p className="mb-2 text-xs font-bold text-primary/50">
                  {step.step}
                </p>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-primary">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </PageWrapper>
    </>
  )
}
