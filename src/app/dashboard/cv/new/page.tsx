import { getProfile, getEducation, getExperiences } from '@/lib/actions/cv'
import NewCVClient from './new-cv-client'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'

export const metadata = {
  title: 'Novo Currículo | Dashboard',
}

export default async function NewCVPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const [profile, education, experiences] = await Promise.all([
    getProfile(),
    getEducation(),
    getExperiences(),
  ])

  const profileExists = !!profile
  const hasData = education.length > 0 || experiences.length > 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Criar Novo Currículo
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Inicie o assistente para formatar um novo documento académico e científico.
        </p>
      </div>

      <NewCVClient profileExists={profileExists} hasData={hasData} />
    </div>
  )
}
