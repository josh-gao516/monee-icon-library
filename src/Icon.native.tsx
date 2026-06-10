import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { iconsData, defaultSize, defaultViewBox, type IconProps, type PathEntry } from './types';

declare const __DEV__: boolean;

export function Icon({ name, size, color = '#000', strokeWidth = 2 }: IconProps) {
  const icon = (iconsData as any)[name];
  if (!icon) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[icon-library] unknown icon: ' + name);
    return null;
  }
  const resolved = size ?? (icon.size as number | undefined) ?? defaultSize;
  const viewBox = (icon.viewBox as string | undefined) ?? defaultViewBox;

  return (
    <Svg width={resolved} height={resolved} viewBox={viewBox} fill="none">
      {(icon.paths as PathEntry[]).map((p, i) =>
        p.type === 'stroke' ? (
          <Path
            key={i} d={p.d}
            stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        ) : (
          <Path
            key={i} d={p.d}
            fill={color}
            fillRule={(p.fillRule as any) ?? 'nonzero'}
            clipRule={(p.fillRule as any) ?? 'nonzero'}
          />
        )
      )}
    </Svg>
  );
}

export type { IconProps, IconName } from './types';
