/// <reference types="vitest" />
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnpluginSvgComponent from 'unplugin-svg-component/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteMockServe } from 'vite-plugin-mock'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import pkg from './package.json'

const version = pkg.version

const resolve = (filePath) => path.resolve(__dirname, filePath)

// 由于auto-imports目录不上传，这里需要判断一下是否
if (!fs.existsSync(resolve('auto-imports'))) {
  fs.mkdirSync(resolve('auto-imports'))
}

export default defineConfig({
  base: '/',
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    visualizer({ open: true }),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ],
      dts: './auto-imports/auto-imports.d.ts',
      imports: ['vue', 'vue-router', 'pinia'],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/, /\.[tj]s?$/],
      eslintrc: {
        enabled: true,
        filepath: './auto-imports/.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ],
      // 只引入components下面的，views下面components太多，会很乱
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: resolve('./auto-imports/components.d.ts'),
      directoryAsNamespace: false,
      globalNamespaces: [],
      include: [/\.vue$/, /\.vue\?vue/],
      exclude: [/[\/]node_modules[\/]/, /[\/].git[\/]/]
    }),
    UnpluginSvgComponent({
      iconDir: path.resolve(__dirname, 'src/assets/icons'),
      projectType: 'vue',
      componentName: 'SvgIcon',
      dts: true,
      prefix: 'icon',
      vueVersion: 3,
      scanStrategy: 'component',
      // 不能使用treeShaking，生产环境会导致icon无法显示
      treeShaking: false,
      domInsertionStrategy: 'dynamic',
      dtsDir: './auto-imports/',
      preserveColor: resolve('src/assets/icons')
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/assets/style/element-plus.scss" as *;'
      }
    },
    postcss: {
      plugins: [
        autoprefixer(),
        tailwindcss()
      ]
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // open: true,
    cors: true,
    hmr: true,
    proxy: {
      '/api': {
        // 联调修改target
        target: 'http://8.137.91.192/treatment-sandbox',
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,
    target: 'ESNext',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        // eslint-disable-next-line camelcase
        drop_console: false,
        // eslint-disable-next-line camelcase
        drop_debugger: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus'],
          axios: ['axios']
        },
        chunkFileNames: `js/[name].${version}.js`,
        entryFileNames: `js/[name].${version}.js`,
        assetFileNames: `[ext]/[name].${version}.[ext]`
      }
    }
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
