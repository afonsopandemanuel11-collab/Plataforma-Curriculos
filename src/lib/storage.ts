import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import { randomUUID } from 'crypto'

// Diretório base de uploads (configurável por variável de ambiente)
const STORAGE_BASE = path.resolve(
  process.env.STORAGE_PATH ?? './storage/uploads'
)

// Tipos MIME permitidos por categoria
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  avatars: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  cvs: ['application/pdf'],
}

// Limite máximo de tamanho: 10MB
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

// ── Utilitários ──────────────────────────────────────────────────────────────

/**
 * Gera um nome de ficheiro único com UUID + extensão original.
 */
export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase()
  return `${randomUUID()}${ext}`
}

/**
 * Retorna o caminho absoluto a partir de um caminho relativo guardado na DB.
 * Garante que o caminho está dentro do diretório de uploads (path traversal protection).
 */
export function getFilePath(relativeFilePath: string): string {
  // Normaliza e resolve o caminho
  const normalized = path.normalize(relativeFilePath).replace(/^(\.\.[/\\])+/, '')
  const absolute = path.resolve(STORAGE_BASE, normalized)

  // Proteção contra path traversal
  if (!absolute.startsWith(STORAGE_BASE + path.sep) && absolute !== STORAGE_BASE) {
    throw new Error('Acesso negado: caminho inválido.')
  }

  return absolute
}

/**
 * Guarda um ficheiro no disco.
 * @param folder - Subpasta dentro de /storage/uploads (ex: 'avatars', 'cvs')
 * @param filename - Nome do ficheiro gerado por generateFileName()
 * @param buffer - Conteúdo binário do ficheiro
 * @param mimeType - Tipo MIME para validação
 * @returns Caminho relativo guardado na base de dados (ex: 'avatars/uuid.jpg')
 */
export async function saveFile(
  folder: string,
  filename: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  // Validação de tamanho
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Ficheiro demasiado grande. Máximo permitido: 10MB.`)
  }

  // Validação de tipo MIME
  const allowed = ALLOWED_MIME_TYPES[folder]
  if (allowed && !allowed.includes(mimeType)) {
    throw new Error(
      `Tipo de ficheiro não permitido para "${folder}". Permitidos: ${allowed.join(', ')}`
    )
  }

  // Garante que a pasta existe
  const folderPath = path.join(STORAGE_BASE, folder)
  await fs.mkdir(folderPath, { recursive: true })

  // Verifica que o caminho final está dentro do STORAGE_BASE
  const filePath = path.join(folderPath, filename)
  if (!filePath.startsWith(STORAGE_BASE + path.sep)) {
    throw new Error('Acesso negado: caminho inválido.')
  }

  // Escreve o ficheiro
  try {
    await fs.writeFile(filePath, buffer)
  } catch (err: any) {
    if (err.code === 'ENOSPC') {
      throw new Error('Sem espaço em disco para guardar o ficheiro.')
    }
    if (err.code === 'EACCES') {
      throw new Error('Permissão negada para escrever o ficheiro.')
    }
    throw new Error(`Erro ao guardar o ficheiro: ${err.message}`)
  }

  // Retorna o caminho relativo (o que é guardado na DB)
  return `${folder}/${filename}`
}

/**
 * Elimina um ficheiro do disco.
 * @param relativeFilePath - Caminho relativo guardado na DB (ex: 'avatars/uuid.jpg')
 */
export async function deleteFile(relativeFilePath: string): Promise<void> {
  try {
    const absolute = getFilePath(relativeFilePath)
    if (existsSync(absolute)) {
      await fs.unlink(absolute)
    }
  } catch (err: any) {
    // Erros de path traversal relançam; outros são silenciosos (ficheiro já eliminado)
    if (err.message.includes('Acesso negado')) throw err
    console.warn('[storage] Aviso ao eliminar ficheiro:', err.message)
  }
}
