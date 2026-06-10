import raw from '../icons.json';

const iconsData = raw.icons;
export const defaultSize = raw.defaultSize;
export const defaultViewBox = raw.defaultViewBox;

export type IconName = keyof typeof iconsData;

export interface IconProps {
  /** icon 名,kebab-case,类型受 icons.json 约束 */
  name: IconName;
  /** 渲染尺寸,不传则用顶层 defaultSize(24) */
  size?: number;
  /** 颜色。RN 默认 '#000';Web 不传则继承 currentColor */
  color?: string;
  /** 仅 stroke 类型路径生效,默认 2 */
  strokeWidth?: number;
}

export interface PathEntry {
  d: string;
  type: 'stroke' | 'fill';
  fillRule?: string;
}

export { iconsData };
