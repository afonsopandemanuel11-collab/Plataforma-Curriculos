import Link from 'next/link'
import { getUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import {
  Sparkles, ArrowRight, Brain, FileText, Share2, Zap,
  CheckCircle, ChevronRight, Star, Users, Award, BookOpen
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'IA Generativa',
    desc: 'Resumos, descrições e sugestões geradas automaticamente com base no teu perfil académico.',
    color: 'from-brand-500 to-brand-600',
    bg: 'bg-brand-50',
    iconColor: 'text-brand-600',
  },
  {
    icon: FileText,
    title: 'Múltiplos Templates',
    desc: 'Academic Classic, Modern Research, Institutional Pro e Scientific Elite.',
    color: 'from-accent-500 to-accent-600',
    bg: 'bg-accent-50',
    iconColor: 'text-accent-600',
  },
  {
    icon: Zap,
    title: 'Exportação PDF',
    desc: 'Descarrega o teu CV em PDF profissional pronto a enviar a qualquer instituição.',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Share2,
    title: 'Perfil Público',
    desc: 'Partilha o teu currículo com um link permanente e personalizável.',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
]

const steps = [
  { num: '01', title: 'Cria o teu perfil', desc: 'Preenche os teus dados académicos, experiência e publicações.' },
  { num: '02', title: 'Usa a IA', desc: 'A inteligência artificial gera e melhora automaticamente o teu currículo.' },
  { num: '03', title: 'Exporta e partilha', desc: 'Descarrega em PDF ou partilha com um link público personalizado.' },
]

const stats = [
  { value: '10k+', label: 'Académicos', icon: Users },
  { value: '50k+', label: 'Currículos criados', icon: FileText },
  { value: '4.9★', label: 'Avaliação média', icon: Star },
  { value: '95%', label: 'Taxa de aprovação', icon: Award },
]

export default async function HomePage() {
  const user = await getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-white">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-60 pointer-events-none" />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">CurriculumAI</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {['Funcionalidades', 'Templates', 'Como funciona'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm">Entrar</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Criar conta grátis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Powered by Claude AI · Feito para académicos lusófonos
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 animate-slide-up">
            Construa o seu currículo{' '}
            <span className="gradient-text">académico</span>{' '}
            com inteligência artificial
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-100">
            Plataforma inteligente para criação, organização e geração automática de
            currículos científicos. Inspirada no Ciência Vitae, optimizada para investigadores.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
            <Link href="/auth/signup" className="btn-primary px-8 py-4 text-base rounded-2xl">
              Criar currículo grátis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#como-funciona" className="btn-secondary px-8 py-4 text-base rounded-2xl">
              Ver como funciona
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-400 animate-fade-in delay-300">
            {['Grátis para começar', 'Sem cartão de crédito', 'Deploy na Vercel', 'Open Source'].map(t => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="max-w-4xl mx-auto mt-16 animate-slide-up delay-300">
          <div className="relative glass-card rounded-3xl p-1 shadow-glass-hover">
            <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
                <div className="flex-1 h-6 bg-white/20 rounded-lg" />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['Currículos', 'Publicações', 'Projetos'].map((label, i) => (
                  <div key={label} className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold">{[3, 12, 5][i]}</div>
                    <div className="text-sm text-white/70 mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {['CV Académico 2025', 'Candidatura Bolsa FCT', 'Perfil Internacional'].map((cv, i) => (
                  <div key={cv} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${['bg-green-400', 'bg-yellow-400', 'bg-blue-400'][i]}`} />
                      <span className="text-sm font-medium">{cv}</span>
                    </div>
                    <span className="text-xs text-white/50">
                      {['Gerado por IA', 'Em edição', 'Público'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="funcionalidades" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-brand mb-4">Funcionalidades</div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Tudo o que precisas num só lugar
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Uma plataforma completa para académicos que querem um currículo profissional, moderno e gerado com IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc, bg, iconColor }) => (
              <div key={title} className="glass-card-hover rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-accent mb-4">Como funciona</div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Em 3 passos simples
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="flex items-start gap-6 glass-card rounded-2xl p-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-brand">
                  {num}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500">{desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-300 mt-1 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-brand-600 to-accent-600 rounded-3xl p-12 text-center text-white shadow-brand">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Junta-te a milhares de académicos que já usam a IA para criar currículos profissionais.
            </p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Criar o meu currículo grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">CurriculumAI</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} CurriculumAI · Feito com 🤍 em Angola
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/auth/login" className="hover:text-gray-600 transition-colors">Entrar</Link>
            <Link href="/auth/signup" className="hover:text-gray-600 transition-colors">Criar conta</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
