import Anthropic from '@anthropic-ai/sdk'
import fs from 'node:fs'
import path from 'node:path'

// ── 读取 icons.json ──────────────────────────────────────
const iconsPath = new URL("../icons.json", import.meta.url).pathname
const raw = JSON.parse(fs.readFileSync(iconsPath, 'utf-8'))

// ── Anthropic 客户端 ──────────────────────────────────────
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ── 生成单个 icon 的 description ─────────────────────────
async function generateDescription(name: string, pathType: string): Promise<string> {
  const isFill = pathType === 'fill'
  const msg = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 150,
    messages: [{
      role: 'user',
      content: `You are writing metadata for a UI icon library used in a fintech mobile app.

Icon name: "${name}"
Render style: ${isFill ? 'solid filled shape' : 'outline stroke'}

Write exactly 2 sentences:
1. Visual: describe what the icon looks like (shapes, elements present).
2. Semantic: list the concepts, actions, and UI contexts it represents.

Rules:
- Be specific and varied in vocabulary (helps semantic search)
- Include both English terms and common design/dev terminology  
- Do NOT start with "This icon" — vary your openings
- Output only the 2 sentences, nothing else`,
    }],
  })
  return (msg.content[0] as { type: string; text: string }).text.trim()
}

// ── 主函数 ───────────────────────────────────────────────
async function main() {
  const icons = raw.icons as Record<string, any>
  const names = Object.keys(icons)

  let generated = 0
  let skipped = 0

  for (const name of names) {
    const icon = icons[name]

    // 已有 description 则跳过（增量友好）
    if (icon.description) {
      console.log(`⏭  skip  ${name}`)
      skipped++
      continue
    }

    // 取第一个 path 的 type 判断风格
    const pathType = icon.paths?.[0]?.type ?? 'stroke'

    try {
      const description = await generateDescription(name, pathType)
      
      // 写入：description + 空 tags（等你手填）
      icons[name] = {
        description,
        tags: [],
        ...icon,  // paths 等原有字段保留在后面
      }

      console.log(`✅ done  ${name}`)
      console.log(`   → ${description.slice(0, 80)}...`)
      generated++

      // 每生成一个就写回文件，防止中途中断丢失进度
      fs.writeFileSync(iconsPath, JSON.stringify(raw, null, 2))

      // 避免触发速率限制，加一点间隔
      await new Promise(r => setTimeout(r, 300))

    } catch (err) {
      console.error(`❌ fail  ${name}:`, err)
    }
  }

  console.log(`\n🎉 Done: ${generated} generated, ${skipped} skipped`)
}

main().catch(console.error)
