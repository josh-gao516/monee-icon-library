import iconsData from '../icons.json';

export type IconName = keyof typeof iconsData;
export type Variant = 'line' | 'solid';

export interface IconProps {
  /** icon 名,kebab-case,类型受 icons.json 约束 */
  name: IconName;
  /** 变体,默认 'line' */
  variant?: Variant;
  /** 渲染尺寸,不传则用该 icon 的 defaultSize */
  size?: number;
  /** 颜色。RN 必传;Web 不传则继承 currentColor */
  color?: string;
  /** 仅 line 变体生效,默认 2 */
  strokeWidth?: number;
}

export interface PathEntry {
  d: string;
  type: 'stroke' | 'fill';
  fillRule?: string;
}

export { iconsData };
