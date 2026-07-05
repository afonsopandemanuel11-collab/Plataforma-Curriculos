'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { generateToken, hashPassword, verifyPassword } from '@/lib/auth-utils'

// ── Helpers ──────────────────────────────────────────────────────────────────

async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })
}

async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

// ── Auth Actions ──────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const user = await prisma.authUser.findUnique({ where: { email } })
    if (!user) {
      return { error: 'Credenciais inválidas.' }
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return { error: 'Credenciais inválidas.' }
    }

    const token = await generateToken({ id: user.id, email: user.email })
    await setSessionCookie(token)
  } catch (error) {
    console.error('[login error]', error)
    return { error: 'Erro interno ao tentar entrar. Tenta novamente.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  try {
    const existing = await prisma.authUser.findUnique({ where: { email } })
    if (existing) {
      return { error: 'Este email já está registado.' }
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.authUser.create({
      data: {
        email,
        passwordHash,
        rawUserMetaData: { full_name: fullName },
        // O trigger handle_new_user cria o profile automaticamente no PostgreSQL
      },
    })

    // Cria ou atualiza o perfil manualmente (prevenindo conflito se o trigger da BD já tiver corrido)
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {
        fullName: fullName || email.split('@')[0],
      },
      create: {
        id: user.id,
        email: user.email,
        fullName: fullName || email.split('@')[0],
      },
    })

    const token = await generateToken({ id: user.id, email: user.email })
    await setSessionCookie(token)
  } catch (error) {
    console.error('[signup error]', error)
    return { error: 'Erro ao criar conta. Tenta novamente.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  await clearSessionCookie()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    if (!token) return null

    const { verifyToken } = await import('@/lib/auth-utils')
    const payload = await verifyToken(token)
    if (!payload) return null

    const user = await prisma.authUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true },
    })

    return user ?? null
  } catch {
    return null
  }
}
