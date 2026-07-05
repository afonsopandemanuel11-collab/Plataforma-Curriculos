import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/profile']
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
  const isAuthRoute = pathname.startsWith('/auth')

  // Lê o token da sessão
  const token = request.cookies.get('session')?.value
  const user = token ? await verifyToken(token) : null

  // Redireciona utilizadores não autenticados para fora de rotas protegidas
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redireciona utilizadores autenticados para fora do login/signup
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
