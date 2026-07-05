import { getUser } from '@/lib/actions/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Plus, BookOpen, Briefcase, Trophy, ArrowRight, ExternalLink, Calendar, GraduationCap } from 'lucide-react'

export const metadata = { title: 'Início | Dashboard' }

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  // Carrega dados em paralelo para estatísticas rápidas
  const [
    profile,
    curriculums,
    education,
    experiences,
    publications,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { id: user.id } }),
    prisma.curriculum.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.education.findMany({ where: { userId: user.id }, select: { id: true } }),
    prisma.experience.findMany({ where: { userId: user.id }, select: { id: true } }),
    prisma.publication.findMany({ where: { userId: user.id }, select: { id: true } }),
  ])

  const stats = [
    { label: 'Currículos', value: curriculums?.length ?? 0, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Formações', value: education?.length ?? 0, icon: GraduationCap, color: 'text-amber-600 bg-amber-50' },
    { label: 'Experiências', value: experiences?.length ?? 0, icon: Briefcase, color: 'text-purple-600 bg-purple-50' },
    { label: 'Publicações', value: publications?.length ?? 0, icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-6 md:p-8 shadow-glass">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Olá, {profile?.full_name?.split(' ')[0] ?? 'Académico'} 👋
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {profile?.institution ? `${profile.institution} · ` : ''}
            {profile?.department ?? 'Bem-vindo à sua área de trabalho. Complete o seu perfil para melhores currículos.'}
          </p>
        </div>
        <Link
          href="/dashboard/cv/new"
          className="btn-primary shrink-0 self-start md:self-center px-6 py-3 rounded-2xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Currículo
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="bg-white/80 backdrop-blur-sm border border-gray-100/80 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  {s.value}
                </span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Curriculums Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1a3a5c] tracking-tight">
          Os Meus Currículos
        </h2>

        {!curriculums?.length ? (
          <div className="bg-white/80 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-500">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Sem currículos ainda</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Ainda não tem nenhum documento criado. Comece por criar um currículo otimizado com IA.
            </p>
            <Link
              href="/dashboard/cv/new"
              className="btn-primary px-6 py-3 rounded-2xl inline-flex items-center gap-2"
            >
              Criar o primeiro CV <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {curriculums.map(cv => (
              <div
                key={cv.id}
                className="bg-white/80 border border-gray-100 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 leading-tight">
                      {cv.title}
                    </h3>
                    {cv.is_public && (
                      <span className="shrink-0 text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full uppercase border border-green-100">
                        Público
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-4">
                    <span>Template: {cv.template_name}</span>
                    <span>•</span>
                    <span className="uppercase">{cv.language}</span>
                    {cv.ai_generated && (
                      <>
                        <span>•</span>
                        <span className="text-brand-600 font-semibold">IA</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mt-2 pt-4 border-t border-gray-100/70">
                  <Link
                    href={`/dashboard/cv/${cv.id}`}
                    className="flex-1 btn-secondary text-center text-xs py-2 px-3 justify-center"
                  >
                    Editar Dados
                  </Link>
                  <Link
                    href={`/cv/${cv.id}`}
                    target="_blank"
                    className="btn-ghost flex items-center justify-center p-2 rounded-xl border border-gray-100 text-gray-500 hover:text-gray-900"
                    title="Ver CV Público"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
