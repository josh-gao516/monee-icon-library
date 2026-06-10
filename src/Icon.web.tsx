import React from 'react';
import { iconsData, defaultSize, defaultViewBox, type IconProps, type PathEntry } from './types';

export function Icon({ name, size, color, strokeWidth = 2 }: IconProps) {
  const icon = (iconsData as any)[name];
  if (!icon) {
    if (process.env.NODE_ENV !== 'production') console.warn('[icon-library] unknown icon: ' + name);
    return null;
  }
  const resolved = size ?? (icon.size as number | undefined) ?? defaultSize;
  const viewBox = (icon.viewBox as string | undefined) ?? defaultViewBox;
  const c = color ?? 'currentColor';

  return (
    <svg width={resolved} height={resolved} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      {(icon.paths as PathEntry[]).map((p, i) =>
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

export type { IconProps, IconName } from './types';
