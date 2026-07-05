import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/actions/auth'

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)
  const user = await getUser()

  if (user) {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  return NextResponse.redirect(`${origin}/`)
}
