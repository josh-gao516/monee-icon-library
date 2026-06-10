export type SuffixSlot = 'count' | 'direction' | 'enclosure' | 'negation' | 'fill' | 'badge';

export interface SuffixDef {
  slot: SuffixSlot;
  order: number;
}

export const SUFFIX_REGISTRY: Record<string, SuffixDef> = {
  up:     { slot: 'direction', order: 2 },
  down:   { slot: 'direction', order: 2 },
  left:   { slot: 'direction', order: 2 },
  right:  { slot: 'direction', order: 2 },
  circle: { slot: 'enclosure', order: 3 },
  square: { slot: 'enclosure', order: 3 },
  slash:  { slot: 'negation',  order: 4 },
  fill:   { slot: 'fill',      order: 5 },
};

export function parseIconName(key: string): { base: string; suffixes: string[] } {
  const parts = key.split('.');
  return { base: parts[0], suffixes: parts.slice(1) };
}

export function validateIconName(key: string): string[] {
  const errors: string[] = [];
  const { base, suffixes } = parseIconName(key);

  if (base.includes('-')) {
    errors.push(`base "${base}" 含 '-'（复合名词须拼接）`);
  }
  if (base !== base.toLowerCase()) {
    errors.push(`base "${base}" 含大写字母`);
  }

  let prevOrder = -Infinity;
  for (const suffix of suffixes) {
    const def = SUFFIX_REGISTRY[suffix];
    if (!def) {
      errors.push(`未知后缀 ".${suffix}"`);
      // prevOrder 不更新：未知后缀的 order 无法判断
    } else {
      if (def.order < prevOrder) {
        errors.push(`后缀 ".${suffix}" 顺序错误（order ${def.order} < ${prevOrder}）`);
      }
      prevOrder = def.order;
    }
  }

  return errors;
}
