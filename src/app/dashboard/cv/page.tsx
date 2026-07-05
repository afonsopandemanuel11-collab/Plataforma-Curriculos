import { getUser } from '@/lib/actions/auth'
import { getCurriculums } from '@/lib/actions/cv'
import CVListClient from './cv-list-client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Currículos | Dashboard',
}

export default async function CVListPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const curriculums = await getCurriculums()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Os Meus Currículos Académicos
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Crie, configure, organize e partilhe os seus diferentes currículos académicos ou científicos.
        </p>
      </div>

      <CVListClient initialCVs={curriculums as any[]} />
    </div>
  )
}
