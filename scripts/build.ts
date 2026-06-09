import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { optimize } from 'svgo';
import * as cheerio from 'cheerio';

const ROOT = join(import.meta.dirname, '..');
const RAW = join(ROOT, 'raw');
const OUT = join(ROOT, 'icons.json');
const VARIANTS = ['line', 'solid'] as const;
type Variant = (typeof VARIANTS)[number];

// 11 个 icon 的元数据。defaultSize 统一 24(后续可按需调单个)。
const META: Record<string, { defaultSize: number; description: string; tags: string[] }> = {
  'bank':         { defaultSize: 24, description: 'Bank / institution',          tags: ['bank', 'finance', 'building'] },
  'bell':         { defaultSize: 24, description: 'Notification bell',           tags: ['notification', 'alert'] },
  'chevron-left': { defaultSize: 24, description: 'Chevron left / back',         tags: ['back', 'navigation', 'chevron'] },
  'chevron-right':{ defaultSize: 24, description: 'Chevron right / forward',     tags: ['forward', 'navigation', 'chevron'] },
  'copy':         { defaultSize: 24, description: 'Copy to clipboard',           tags: ['copy', 'duplicate', 'clipboard'] },
  'credit-card':  { defaultSize: 24, description: 'Credit / debit card',         tags: ['card', 'payment', 'finance'] },
  'gift':         { defaultSize: 24, description: 'Gift / reward',               tags: ['gift', 'reward', 'present'] },
  'home':         { defaultSize: 24, description: 'Home / dashboard',            tags: ['home', 'house', 'dashboard'] },
  'lock':         { defaultSize: 24, description: 'Lock / security',             tags: ['lock', 'security', 'otp'] },
  'shield':       { defaultSize: 24, description: 'Shield / protection',         tags: ['shield', 'security', 'protect'] },
  'user':         { defaultSize: 24, description: 'User / profile',              tags: ['user', 'profile', 'account'] },
};

// line 保 stroke;solid 保 fill-rule。两者都保 viewBox、消解 transform。
const svgoConfig = {
  multipass: true,
  plugins: [
    'preset-default',
    { name: 'convertTransform' as const, params: {} },
  ],
};

type PathEntry = { d: string; type: 'stroke' | 'fill'; fillRule?: string };
type IconRecord = {
  description: string; tags: string[]; defaultSize: number; viewBox: string;
  variants: Partial<Record<Variant, { paths: PathEntry[] }>>;
};

const result: Record<string, IconRecord> = {};

for (const variant of VARIANTS) {
  const dir = join(RAW, variant);
  if (!existsSync(dir)) { console.warn(`⚠️  缺目录 ${dir}`); continue; }

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
    const key = basename(file, '.svg');
    const meta = META[key];
    if (!meta) { console.warn(`⚠️  ${key} 不在 META 表,跳过`); continue; }

    const { data: clean } = optimize(readFileSync(join(dir, file), 'utf-8'), svgoConfig);
    const $ = cheerio.load(clean, { xmlMode: true });
    const viewBox = $('svg').attr('viewBox') ?? '0 0 24 24';

    const paths: PathEntry[] = [];
    $('path').each((_, el) => {
      const d = $(el).attr('d');
      if (!d) return;
      if (variant === 'line') {
        paths.push({ d, type: 'stroke' });
      } else {
        const fillRule = $(el).attr('fill-rule');
        paths.push({ d, type: 'fill', ...(fillRule ? { fillRule } : {}) });
      }
    });

    if (paths.length === 0) { console.warn(`⚠️  ${key}/${variant} 没抽到 path`); continue; }

    result[key] ??= { ...meta, viewBox, variants: {} };
    result[key].variants[variant] = { paths };
    console.log(`✅ ${variant.padEnd(5)} ${key.padEnd(14)} ${paths.length} path(s)`);
  }
}

// 稳定排序,key 字母序,方便 diff
const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n');
console.log(`\n📦 写入 ${Object.keys(sorted).length} 个 icon → icons.json`);
