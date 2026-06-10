import raw from '../icons.json';
import { iconsData } from '../src/types';
import { validateIconName } from './suffix-registry';

type PathEntry = { d: string; type: string; fillRule?: string };
type IconEntry = { paths: PathEntry[]; size?: number; viewBox?: string };

const icons = raw.icons as Record<string, IconEntry>;
const keys = Object.keys(icons);

let ok = true;
function log(mark: '✅' | '❌' | '⚠️', msg: string) {
  if (mark === '❌') ok = false;
  console.log(`${mark} ${msg}`);
}

console.log('=== icon 库自测 (schema v2 扁平) ===\n');

// ── 1. 顶层字段 ──────────────────────────────────────────
log(raw.schemaVersion === 2 ? '✅' : '❌', `schemaVersion = ${raw.schemaVersion}`);
log(raw.defaultSize === 24 ? '✅' : '❌', `defaultSize = ${raw.defaultSize}`);
log(raw.defaultViewBox === '0 0 24 24' ? '✅' : '❌', `defaultViewBox = "${raw.defaultViewBox}"`);
console.log('');

// ── 2. keyof typeof iconsData === Object.keys(j.icons) ──
const typeKeys = Object.keys(iconsData as object).sort().join(',');
const jsonKeys = [...keys].sort().join(',');
if (typeKeys === jsonKeys) {
  log('✅', `TypeScript iconsData 键集与 icons.json 一致 (${keys.length} 个)`);
} else {
  log('❌', `TypeScript iconsData 键集与 icons.json 不一致\n  TS  : ${typeKeys}\n  JSON: ${jsonKeys}`);
}
console.log('');

// ── 3. 命名校验 (suffix-registry) + 孤儿检测 ─────────────
let nameOk = true;
for (const key of [...keys].sort()) {
  const errs = validateIconName(key);
  if (errs.length > 0) {
    nameOk = false;
    for (const e of errs) log('❌', `"${key}": ${e}`);
  }
}
if (nameOk) log('✅', `全部 ${keys.length} 个 key 命名合法`);

const keysSet = new Set(keys);
for (const key of keys.filter(k => k.endsWith('.fill'))) {
  const withoutFill = key.slice(0, -'.fill'.length);
  if (!keysSet.has(withoutFill)) {
    log('⚠️', `"${key}" 是孤儿 — 缺少对应基名 "${withoutFill}"`);
  }
}
console.log('');

// ── 4. 各 icon 的 path 逐条检查 ──────────────────────────
for (const key of [...keys].sort()) {
  const icon = icons[key];
  const issues: string[] = [];

  if (!icon.paths || icon.paths.length === 0) {
    issues.push('无 paths');
  } else {
    for (const p of icon.paths) {
      if (p.type !== 'stroke' && p.type !== 'fill') {
        issues.push(`type 非法: "${p.type}"`);
      }
      if (p.fillRule !== undefined && p.fillRule !== 'evenodd') {
        issues.push(`fillRule 值异常: "${p.fillRule}"`);
      }
    }
    if (JSON.stringify(icon).includes('"transform"')) {
      issues.push('残留 transform 属性');
    }
  }

  const mark: '✅' | '❌' = issues.length === 0 ? '✅' : '❌';
  const summary = icon.paths?.map(p => p.type + (p.fillRule ? `[${p.fillRule}]` : '')).join(', ') ?? '-';
  log(mark, `${key.padEnd(22)} [${summary}]${issues.length ? '  ← ' + issues.join('; ') : ''}`);
}

console.log('');
console.log(ok ? '🎉 全部通过' : '⚠️  有问题,见上');
process.exit(ok ? 0 : 1);
