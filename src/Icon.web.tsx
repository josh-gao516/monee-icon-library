import React from 'react';
import { iconsData, type IconProps, type PathEntry } from './types';

export function Icon({ name, variant = 'line', size, color, strokeWidth = 2 }: IconProps) {
  const icon = (iconsData as any)[name];
  if (!icon) {
    if (process.env.NODE_ENV !== 'production') console.warn(`[Icon] 未知 icon: "${name}"`);
    return null;
  }
  const variantData = icon.variants[variant];
  if (!variantData) {
    if (process.env.NODE_ENV !== 'production') console.warn(`[Icon] "${name}" 无变体 "${variant}"`);
    return null;
  }
  const resolved = size ?? icon.defaultSize ?? 24;
  const c = color ?? 'currentColor';

  return (
    <svg width={resolved} height={resolved} viewBox={icon.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      {variantData.paths.map((p: PathEntry, i: number) =>
        p.type === 'stroke' ? (
          <path
            key={i} d={p.d}
            stroke={c} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeLinejoin="round"
          />
        ) : (
          <path
            key={i} d={p.d}
            fill={c}
            fillRule={(p.fillRule as any) ?? 'nonzero'}
            clipRule={(p.fillRule as any) ?? 'nonzero'}
          />
        )
      )}
    </svg>
  );
}

export type { IconProps, IconName, Variant } from './types';
