import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename, relative } from 'node:path';
import { optimize } from 'svgo';
import * as cheerio from 'cheerio';

const ROOT = join(import.meta.dirname, '..');
const RAW = join(ROOT, 'raw');
const OUT = join(ROOT, 'icons.json');

const DEFAULT_SIZE = 24;
const DEFAULT_VIEWBOX = '0 0 24 24';

const svgoConfig = {
  multipass: true,
  plugins: [
    'preset-default',
    { name: 'convertTransform' as const, params: {} },
  ],
};

type PathEntry = { d: string; type: 'stroke' | 'fill'; fillRule?: string };
type IconEntry = {
  description?: string;
  tags?: string[];
  paths: PathEntry[];
  size?: number;
  viewBox?: string;
};

function walkSvgs(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkSvgs(full));
    } else if (entry.name.endsWith('.svg')) {
      results.push(full);
    }
  }
  return results;
}

// ── 读取现有 icons.json，保留 description 和 tags ──────────
const existingIcons: Record<string, any> = {};
if (existsSync(OUT)) {
  try {
    const prev = JSON.parse(readFileSync(OUT, 'utf-8'));
    for (const [name, data] of Object.entries(prev.icons ?? {})) {
      existingIcons[name] = data;
    }
  } catch {
    // 第一次运行或文件损坏，忽略
  }
}

const allFiles = walkSvgs(RAW);

// Detect key collisions before processing anything
const keyToFile = new Map<string, string>();
const collisions: string[] = [];

for (const absPath of allFiles) {
  const key = basename(absPath, '.svg');
  const rel = relative(ROOT, absPath);
  if (keyToFile.has(key)) {
    collisions.push(`  "${key}": ${keyToFile.get(key)}  AND  ${rel}`);
  } else {
    keyToFile.set(key, rel);
  }
}

if (collisions.length > 0) {
  console.error('Key collisions detected — aborting:');
  for (const c of collisions) console.error(c);
  process.exit(1);
}

// Process each file
const icons: Record<string, IconEntry> = {};

for (const [key, relPath] of keyToFile) {
  const { data: clean } = optimize(readFileSync(join(ROOT, relPath), 'utf-8'), svgoConfig);
  const $ = cheerio.load(clean, { xmlMode: true });
  const viewBox = $('svg').attr('viewBox') ?? DEFAULT_VIEWBOX;
  const widthStr = $('svg').attr('width');
  const size = widthStr ? parseInt(widthStr, 10) : DEFAULT_SIZE;

  const paths: PathEntry[] = [];
  $('path').each((_, el) => {
    const d = $(el).attr('d');
    if (!d) return;
    const stroke = $(el).attr('stroke');
    if (stroke && stroke !== 'none') {
      paths.push({ d, type: 'stroke' });
    } else {
      const fillRule = $(el).attr('fill-rule');
      paths.push({ d, type: 'fill', ...(fillRule === 'evenodd' ? { fillRule: 'evenodd' } : {}) });
    }
  });

  if (paths.length === 0) {
    console.warn(`⚠️  ${key} (${relPath}) — no paths extracted`);
    continue;
  }

  // ── 构建条目：description / tags 优先从现有数据继承 ──────
  const entry: IconEntry = {
    ...(existingIcons[key]?.description != null && { description: existingIcons[key].description }),
    ...(existingIcons[key]?.tags != null      && { tags: existingIcons[key].tags }),
    paths,
  };
  if (viewBox !== DEFAULT_VIEWBOX) entry.viewBox = viewBox;
  if (size !== DEFAULT_SIZE) entry.size = size;

  icons[key] = entry;
  console.log(`✅ ${key.padEnd(22)} ${paths.length} path(s)  [${relPath}]`);
}

const sortedIcons = Object.fromEntries(
  Object.entries(icons).sort(([a], [b]) => a.localeCompare(b)),
);

const output = {
  schemaVersion: 2,
  defaultSize: DEFAULT_SIZE,
  defaultViewBox: DEFAULT_VIEWBOX,
  icons: sortedIcons,
};

writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n');
console.log(`\n📦 wrote ${Object.keys(sortedIcons).length} icons → icons.json`);
