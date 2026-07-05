import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/actions/auth'
import { prisma } from '@/lib/db'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { action, context } = await req.json()

    // Validação de entrada simples para evitar abusos
    if (!action || typeof action !== 'string') {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }

    const systemPrompt = `És um assistente especializado em criar currículos académicos profissionais em português europeu.
Tens conhecimento profundo das normas académicas angolanas e internacionais.
Respondes sempre em português europeu, de forma clara, concisa e profissional.
Nunca inventas informação — trabalhas apenas com os dados fornecidos.`

    const userPrompt = buildPrompt(action, context)

    const startTime = Date.now()
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${errText}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const durationMs = Date.now() - startTime

    // Regista o log (sem bloquear a resposta)
    ;(async () => {
      try {
        await prisma.aiLog.create({
          data: {
            userId: user.id,
            action,
            prompt: userPrompt,
            response: text,
            model: 'gemini-1.5-flash',
            tokensUsed: data.usageMetadata?.totalTokenCount ?? 0,
            durationMs: durationMs,
          },
        })
      } catch (err) {
        console.error('Erro ao registar log de IA:', err)
      }
    })()

    return NextResponse.json({ text })
  } catch (error) {
    console.error('[AI Route Error]', error)
    return NextResponse.json(
      { error: 'Erro ao gerar conteúdo com Gemini. Tenta novamente.' },
      { status: 500 }
    )
  }
}

function buildPrompt(action: string, context: Record<string, unknown>): string {
  switch (action) {
    case 'generate_summary':
      return `Com base neste perfil académico, escreve um resumo profissional de 3-4 frases para um currículo:
      
Nome: ${context.full_name}
Instituição: ${context.institution ?? 'não especificada'}
Departamento: ${context.department ?? 'não especificado'}
Nível Académico: ${context.academic_level ?? 'não especificado'}
Bio: ${context.bio ?? 'não fornecida'}

Escreve apenas o texto do resumo, sem introdução nem comentários.`

    case 'improve_text':
      return `Melhora este texto para um currículo académico profissional. Mantém o conteúdo factual, mas torna-o mais impactante e formal:

"${context.text}"

Escreve apenas o texto melhorado, sem explicações.`

    case 'suggest_skills':
      return `Com base neste perfil, sugere 8-10 competências relevantes para incluir no currículo:

Área: ${context.field ?? 'académica'}
Função: ${context.role ?? 'não especificada'}
Experiência: ${context.experience ?? 'não especificada'}

Responde com uma lista JSON de objetos com os campos "skill_name" e "category". Apenas JSON, sem mais texto.`

    case 'generate_cv_content':
      return `Gera um texto profissional para cada secção do currículo com base nos dados fornecidos:

${JSON.stringify(context, null, 2)}

Responde em JSON com o formato: { "summary": "...", "highlights": ["..."] }`

    default:
      return `${context.prompt}`
  }
}
