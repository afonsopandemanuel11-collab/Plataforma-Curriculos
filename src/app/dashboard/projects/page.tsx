import { getUser } from '@/lib/actions/auth'
import { getProjects } from '@/lib/actions/cv'
import ProjectsClient from './projects-client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Projectos de Investigação | Dashboard',
}

export default async function ProjectsPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const projects = await getProjects()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Projectos de Investigação
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Registe a sua participação em projectos de ID&I (Investigação, Desenvolvimento e Inovação), consórcios científicos e financiamentos obtidos.
        </p>
      </div>

      <ProjectsClient initialProjects={projects} />
    </div>
  )
}
