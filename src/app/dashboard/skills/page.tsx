import { getUser } from '@/lib/actions/auth'
import { getSkills } from '@/lib/actions/cv'
import SkillsClient from './skills-client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Competências | Dashboard',
}

export default async function SkillsPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const skills = await getSkills()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Competências Técnicas e Científicas
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Registe e organize as suas competências por categorias e proficiência. Obtenha sugestões inteligentes com o Gemini AI.
        </p>
      </div>

      <SkillsClient initialSkills={skills} />
    </div>
  )
}
