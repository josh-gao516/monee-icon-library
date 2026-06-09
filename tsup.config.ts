import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'native/index': 'src/Icon.native.tsx',
    'web/index': 'src/Icon.web.tsx',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  // 不打进包,留给宿主工程提供,避免双实例
  external: ['react', 'react-native', 'react-native-svg'],
});
