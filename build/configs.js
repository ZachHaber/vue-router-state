const path = require('path')
const buble = require('@rollup/plugin-buble')
/** @type {import('@rollup/plugin-typescript')['default']} */
const typescript = require('@rollup/plugin-typescript')
const cjs = require('@rollup/plugin-commonjs')
const node = require('@rollup/plugin-node-resolve').nodeResolve
/** @type {import('@rollup/plugin-replace')['default']} */
const replace = require('@rollup/plugin-replace')
const version = process.env.VERSION || require('../package.json').version
const banner = `/*!
  * vue-router-2-state v${version}
  * Zachary Soare
  * @license MIT
  */`

const resolve = (_path) => path.resolve(__dirname, '../', _path)

module.exports = [
  // browser dev
  {
    input: resolve('src/index.ts'),
    file: resolve('dist/vue-router.js'),
    format: 'umd',
    env: 'development',
  },
  {
    input: resolve('src/index.ts'),
    file: resolve('dist/vue-router.min.js'),
    format: 'umd',
    env: 'production',
  },
  {
    input: resolve('src/entries/cjs.ts'),
    file: resolve('dist/vue-router.common.js'),
    format: 'cjs',
  },
  {
    input: resolve('src/entries/esm.ts'),
    file: resolve('dist/vue-router.esm.js'),
    format: 'es',
  },
  {
    input: resolve('src/entries/esm.ts'),
    file: resolve('dist/vue-router.mjs'),
    format: 'es',
    declarations: true,
  },
  {
    input: resolve('src/entries/esm.ts'),
    file: resolve('dist/vue-router.esm.browser.js'),
    format: 'es',
    env: 'development',
    transpile: false,
  },
  {
    input: resolve('src/entries/esm.ts'),
    file: resolve('dist/vue-router.esm.browser.min.js'),
    format: 'es',
    env: 'production',
    transpile: false,
  },
  {
    input: resolve('src/composables/index.ts'),
    file: resolve('./composables.mjs'),
    format: 'es',
  },
  {
    input: resolve('src/composables/index.ts'),
    file: resolve('./composables.js'),
    format: 'cjs',
  },
].map(genConfig)

function genConfig(opts) {
  const config = {
    input: {
      input: opts.input || resolve('src/index.js'),
      plugins: [
        ...(opts.plugins || []),
        typescript({
          include: ['src/**/*.ts', 'src/**/*.mts'],
          declaration: opts.declarations || false,
          compilerOptions: {
            module: 'esnext',
          },
        }),
        node(),
        cjs(),
        replace({
          __VERSION__: version,
          preventAssignment: true,
        }),
      ],
      external: ['vue'],
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'VueRouter',
    },
  }

  if (opts.env) {
    config.input.plugins.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env),
        preventAssignment: true,
      }),
    )
  }

  if (opts.transpile !== false) {
    config.input.plugins.push(buble())
  }

  return config
}
