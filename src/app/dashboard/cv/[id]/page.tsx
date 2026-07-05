import { getCurriculumById, getFullCVDataByUserId } from '@/lib/actions/cv'
import CVEditorClient from './cv-editor-client'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'

export const metadata = {
  title: 'Editar Currículo | Dashboard',
}

export default async function CVEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const cv = await getCurriculumById(id)
  if (!cv) {
    redirect('/dashboard/cv')
  }

  // Valida propriedade
  if (cv.userId !== user.id) {
    redirect('/dashboard/cv')
  }

  // Carrega todas as tabelas relacionadas
  const cvData = await getFullCVDataByUserId(user.id)

  return (
    <div className="max-w-6xl mx-auto">
      <CVEditorClient cv={cv as any} cvData={cvData} />
    </div>
  )
}
