import { getUser } from '@/lib/actions/auth'
import { getProfile } from '@/lib/actions/cv'
import ProfileForm from './profile-form'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Meu Perfil | Dashboard',
}

export default async function ProfilePage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const profile = await getProfile()
  if (!profile) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-card">
        <h2 className="text-lg font-bold text-red-600 mb-2">Erro</h2>
        <p className="text-gray-500">Não foi possível carregar os dados do seu perfil.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          O Meu Perfil Académico
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Atualize os seus dados pessoais, académicos e identificadores de investigação (ORCID).
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  )
}
