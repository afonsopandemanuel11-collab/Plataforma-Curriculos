import { getUser } from '@/lib/actions/auth'
import { getCertifications } from '@/lib/actions/cv'
import CertificationsClient from './certifications-client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Certificações | Dashboard',
}

export default async function CertificationsPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const certifications = await getCertifications()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Certificações e Habilitações
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Registe certificações profissionais, cursos extracurriculares ou credenciais técnicas.
        </p>
      </div>

      <CertificationsClient initialCertifications={certifications} />
    </div>
  )
}
