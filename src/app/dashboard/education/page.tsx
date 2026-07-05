import { getUser } from '@/lib/actions/auth'
import { getEducation } from '@/lib/actions/cv'
import EducationClient from './education-client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Formação Académica | Dashboard',
}

export default async function EducationPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const education = await getEducation()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Formação Académica
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Registe os seus diplomas, graus académicos e certificados de habilitações literárias.
        </p>
      </div>

      <EducationClient initialEducation={education} />
    </div>
  )
}
