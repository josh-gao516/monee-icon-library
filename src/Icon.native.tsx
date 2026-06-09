import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { iconsData, type IconProps, type PathEntry } from './types';

declare const __DEV__: boolean;

export function Icon({ name, variant = 'line', size, color = '#000', strokeWidth = 2 }: IconProps) {
  const icon = (iconsData as any)[name];
  if (!icon) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn(`[Icon] 未知 icon: "${name}"`);
    return null;
  }
  const variantData = icon.variants[variant];
  if (!variantData) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn(`[Icon] "${name}" 无变体 "${variant}"`);
    return null;
  }
  const resolved = size ?? icon.defaultSize ?? 24;

  return (
    <Svg width={resolved} height={resolved} viewBox={icon.viewBox} fill="none">
      {variantData.paths.map((p: PathEntry, i: number) =>
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

export type { IconProps, IconName, Variant } from './types';
