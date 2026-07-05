import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth-utils'
import { getFilePath } from '@/lib/storage'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // 1. Verifica autenticação
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  const user = token ? await verifyToken(token) : null

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // 2. Constrói o caminho relativo a partir dos segmentos da URL
  const { path: segments } = await params
  const relativeFilePath = segments.join('/')

  // 3. Resolve caminho absoluto (já inclui protecção contra path traversal)
  let absolutePath: string
  try {
    absolutePath = getFilePath(relativeFilePath)
  } catch {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  // 4. Verifica se o ficheiro existe
  if (!existsSync(absolutePath)) {
    return NextResponse.json({ error: 'Ficheiro não encontrado' }, { status: 404 })
  }

  // 5. Lê e serve o ficheiro
  try {
    const fileBuffer = await fs.readFile(absolutePath)
    const ext = path.extname(absolutePath).toLowerCase()

    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
    }

    const contentType = mimeMap[ext] ?? 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (err) {
    console.error('[files route] Erro ao ler ficheiro:', err)
    return NextResponse.json(
      { error: 'Erro ao servir o ficheiro.' },
      { status: 500 }
    )
  }
}
