import { getUser } from '@/lib/actions/auth'
import { getAwards } from '@/lib/actions/cv'
import AwardsClient from './awards-client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Prémios e Bolsas | Dashboard',
}

export default async function AwardsPage() {
  const user = await getUser()
  if (!user) redirect('/auth/login')

  const awards = await getAwards()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a3a5c] tracking-tight">
          Prémios, Bolsas e Distinções
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Registe condecorações, prémios científicos de mérito ou bolsas de investigação nacionais e internacionais.
        </p>
      </div>

      <AwardsClient initialAwards={awards} />
    </div>
  )
}
