import { getUser } from '@/lib/actions/auth'
import { getPublications } from '@/lib/actions/cv'
import PublicationsClient from './publications-client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Publicações Científicas | Dashboard',
}

export default async function PublicationsPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const publications = await getPublications()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Publicações Científicas
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Registe e organize os seus artigos científicos, livros, teses e patentes.
        </p>
      </div>

      <PublicationsClient initialPublications={publications} />
    </div>
  )
}
