import { getUser } from '@/lib/actions/auth'
import { getExperiences } from '@/lib/actions/cv'
import ExperienceClient from './experience-client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Experiência Profissional | Dashboard',
}

export default async function ExperiencePage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const experiences = await getExperiences()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Experiência Profissional
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gira o seu histórico de carreiras docentes, investigadores, cargos administrativos ou outras posições de relevância científica.
        </p>
      </div>

      <ExperienceClient initialExperiences={experiences} />
    </div>
  )
}
