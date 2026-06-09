import iconsData from '../icons.json' with { type: 'json' };

let ok = true;
console.log('=== icon 库自测(双变体)===\n');

for (const [name, icon] of Object.entries(iconsData as any)) {
  const line = icon.variants?.line;
  const solid = icon.variants?.solid;
  const issues: string[] = [];

  if (!icon.viewBox) issues.push('无 viewBox');
  if (!icon.defaultSize) issues.push('无 defaultSize');
  if (!line) issues.push('缺 line');
  if (!solid) issues.push('缺 solid');

  // line 的 path 不应带 fillRule;type 应为 stroke
  if (line?.paths?.some((p: any) => p.type !== 'stroke')) issues.push('line type 异常');
  // solid 的 path type 应为 fill
  if (solid?.paths?.some((p: any) => p.type !== 'fill')) issues.push('solid type 异常');

  // transform 残留检查
  if (JSON.stringify(icon).includes('transform')) issues.push('残留 transform');

  const status = issues.length === 0 ? '✅' : '❌';
  if (issues.length) ok = false;
  const lc = line?.paths?.length ?? 0;
  const sc = solid?.paths?.length ?? 0;
  console.log(`${status} ${name.padEnd(14)} line=${lc}p solid=${sc}p  ${issues.join(', ')}`);
}

console.log(ok ? '\n🎉 全部通过' : '\n⚠️  有问题,见上');
process.exit(ok ? 0 : 1);
