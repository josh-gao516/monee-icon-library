import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'node:fs'

const MODEL = 'claude-haiku-4-5-20251001'

// ── 读取 icons.json ──────────────────────────────────────
const iconsPath = new URL("../icons.json", import.meta.url).pathname
const raw = JSON.parse(fs.readFileSync(iconsPath, 'utf-8'))

// ── 缺 key 友好报错(不要裸 401)──────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ 缺少 API key:请在 .env 里设置 ANTHROPIC_API_KEY')
  process.exit(1)
}

// ── Anthropic 客户端 ──────────────────────────────────────
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ── 命令行参数解析 ───────────────────────────────────────
// 默认 dry-run(只打印,不写盘);--write 才真正写回 icons.json。
// --key <name> 只处理该 key,且忽略"有 description 就 skip"(便于对存量强制测试)。
const argv = process.argv.slice(2)
const write = argv.includes('--write')
const keyIdx = argv.indexOf('--key')
const onlyKey = keyIdx !== -1 ? argv[keyIdx + 1] : undefined
if (keyIdx !== -1 && !onlyKey) {
  console.error('❌ --key 需要跟一个 icon 名,例如:--key bank.fill')
  process.exit(1)
}

// ── 解析模型返回的 JSON(容错:剥 ``` 围栏 / 截取大括号)──
function parseMetadata(text: string): { description: string; tags: string[] } {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fence) t = fence[1].trim()

  let obj: any
  try {
    obj = JSON.parse(t)
  } catch {
    const s = t.indexOf('{')
    const e = t.lastIndexOf('}')
    if (s === -1 || e === -1) throw new Error(`无法从模型输出解析 JSON:\n${text}`)
    obj = JSON.parse(t.slice(s, e + 1))
  }

  if (typeof obj.description !== 'string' || !Array.isArray(obj.tags)) {
    throw new Error(`模型 JSON 结构不符(需 description:string + tags:array):\n${text}`)
  }
  return { description: obj.description.trim(), tags: obj.tags }
}

// ── 生成单个 icon 的双语 metadata ────────────────────────
async function generateMetadata(name: string, pathType: string): Promise<{ description: string; tags: string[] }> {
  const isFill = pathType === 'fill'
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `You are writing search metadata for a UI icon in a fintech mobile app icon library.

Icon name: "${name}"
Render style: ${isFill ? 'solid filled shape' : 'outline stroke'}

Return ONLY a JSON object (no markdown, no code fences) with exactly these keys:
{"description": "...", "tags": ["...", "..."]}

Rules for "description":
- Exactly 2 sentences: first an English sentence (the visual — shapes/elements present), then a Chinese sentence (语义 / 用途场景).
- Style reference: "Two-person silhouette, solid style. 两个人,用于推荐好友、邀请场景。"
- Do NOT start with "This icon"; vary your openings.

Rules for "tags":
- Return AT MOST 12 tags, no more. Pick the most relevant.
- Bilingual — include BOTH English terms and 中文 terms.
- Cover concepts, actions, shapes, and UI contexts (helps semantic search).

Output strictly valid JSON only, nothing else.`,
    }],
  })
  const text = (msg.content[0] as { type: string; text: string }).text
  return parseMetadata(text)
}

// ── 主函数 ───────────────────────────────────────────────
async function main() {
  const icons = raw.icons as Record<string, any>
  const allNames = Object.keys(icons)

  if (onlyKey && !(onlyKey in icons)) {
    console.error(`❌ --key "${onlyKey}" 不在 icons.json 中`)
    process.exit(1)
  }

  const targets = onlyKey ? [onlyKey] : allNames
  const modeTag = write ? '[WRITE]' : '[dry-run]'
  const targetDesc = onlyKey ?? 'all missing'
  const writeNote = write ? '(写盘)' : '(不写盘)'
  console.log(`${modeTag} target: ${targetDesc} ${writeNote} · model: ${MODEL}\n`)

  let generated = 0
  let skipped = 0

  for (const name of targets) {
    const icon = icons[name]

    // --key 强制处理(忽略 skip);否则维持原逻辑:有 description 就跳过(增量友好)
    if (!onlyKey && icon.description) {
      console.log(`⏭  skip  ${name}`)
      skipped++
      continue
    }

    // 取第一个 path 的 type 判断风格
    const pathType = icon.paths?.[0]?.type ?? 'stroke'

    try {
      const { description, tags } = await generateMetadata(name, pathType)

      console.log(`✅ gen   ${name}`)
      console.log(`   desc → ${description}`)
      console.log(`   tags → ${JSON.stringify(tags)}  ⚠️ AI 草稿,待人工审核`)
      if (tags.length > 12) {
        console.warn(`   ⚠️ 模型返回 ${tags.length} 个 tags,超出上限 12,dry-run 仅提示;写盘前请人工裁剪`)
      }
      generated++

      if (write) {
        // ⚠️ tags 是 AI 生成的草稿,合并前应人工审核。
        // 只写 icons.json 既有 schema 内字段(description / tags / paths …),不引入新字段。
        const { description: _oldDesc, tags: _oldTags, ...rest } = icon
        icons[name] = { description, tags, ...rest }
        // 每生成一个就写回,防止中途中断丢失进度(与 build 输出一致:末尾带换行)
        fs.writeFileSync(iconsPath, JSON.stringify(raw, null, 2) + '\n')
        console.log(`   💾 written → icons.json`)
      }

      // 避免触发速率限制,加一点间隔
      await new Promise(r => setTimeout(r, 300))

    } catch (err) {
      console.error(`❌ fail  ${name}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log(`\n🎉 Done: ${generated} generated, ${skipped} skipped${write ? '' : '  (dry-run,未写盘)'}`)
}

main().catch(console.error)
