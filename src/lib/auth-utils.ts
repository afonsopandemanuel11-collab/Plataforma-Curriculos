import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_jwt_key_at_least_32_characters_long_curriculumai'
const secret = new TextEncoder().encode(SECRET_KEY)

// ── JWT Utilities ────────────────────────────────────────────────────────────

export async function generateToken(payload: { id: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Sessão de 7 dias
    .sign(secret)
}

export async function verifyToken(token: string): Promise<{ id: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { id: string; email: string }
  } catch (error) {
    return null
  }
}

// ── Password Hashing Utilities ────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
