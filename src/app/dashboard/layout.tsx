import { getProfile } from '@/lib/actions/cv'
import { getUser } from '@/lib/actions/auth'
import Sidebar from '@/components/layout/sidebar'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Obter perfil para o cabeçalho/sidebar
  let profile = null
  try {
    profile = await getProfile()
  } catch (error) {
    console.error('Erro ao ler perfil no layout do dashboard:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-40 pointer-events-none z-0" />

      {/* Shared Sidebar */}
      <Sidebar profile={profile} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 z-10 pt-16 lg:pt-0">
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
