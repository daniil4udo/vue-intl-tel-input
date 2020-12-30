// rollup.config.js
import fs from 'fs';
import path from 'path';
import vue from 'rollup-plugin-vue';
import node from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import minimist from 'minimist';
import typescript from "rollup-plugin-typescript2";
import postcss from 'rollup-plugin-postcss';

// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs.readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, '..');

const pkg = require(path.join(projectRoot, 'package.json'))

const baseConfig = {
  input: 'src/index.ts',
  sourcemap: true,   // have source map even for production
  // banner: require('./banner'),
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: {
    node: {
      extensions: ['.vue', '.js', '.ts', '.css']
    },
    json: {
      compact: true
    },
    preVue: [
      alias({
        resolve: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        entries: {
          '@': path.resolve(projectRoot, 'src'),
          '~bulma': path.resolve(projectRoot, './node_modules/bulma'),
          '~buefy': path.resolve(projectRoot, './node_modules/buefy'),
        },
      }),
    ],
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.ES_BUILD': JSON.stringify('false'),
    },
    typescript: {
      check: false,
      tsconfig: path.join(projectRoot, 'tsconfig.json'),
      cacheRoot: path.join(projectRoot, 'node_modules/.rts2_cache'),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
        exclude: ['__tests__', 'test-dts'],
      },
    },
    vue: {
      css: true,
      template: {
        isProduction: true,
        compilerOptions: { preserveWhitespace: false }
      },
    },
    babel: {
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      runtimeHelpers: false,
    },
    postcss: {
      extract: 'sprites.css',
      plugins: [
        require('autoprefixer'),
        require('cssnano'),
      ],
      // modules: ['src', 'node_modules'],
      sourceMap: true,
      extensions: [ '.scss', '.sass', '.css' ]
    }
  },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  'vue',
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: 'Vue',
};

// Customize configs for individual targets
const buildFormats = [];
if (!argv.format || argv.format === 'es') {
  const esConfig = {
    ...baseConfig,
    external,
    output: {
      // file: 'dist/vue-intl-tel-input.esm.js',
      entryFileNames: 'vue-intl-tel-input.esm.js',   // .."chunks created from entry points"; default is: '[name].js'
      dir: 'dist',
      format: 'esm',
      exports: 'named',
    },
    plugins: [
      postcss(baseConfig.plugins.postcss),
      replace({
        ...baseConfig.plugins.replace,
        'process.env.ES_BUILD': JSON.stringify('true'),
      }),
      node(baseConfig.plugins.node),
      json(baseConfig.plugins.json),
      typescript(baseConfig.plugins.typescript),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      // babel({
      //   ...baseConfig.plugins.babel,
      //   presets: [
      //     [
      //       '@babel/preset-env',
      //       {
      //         targets: esbrowserslist,
      //       },
      //     ],
      //   ],
      // }),
      commonjs(),
    ],
  };
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
  const umdConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      // file: 'dist/vue-intl-tel-input.ssr.js',
      entryFileNames: 'vue-intl-tel-input.ssr.js',   // .."chunks created from entry points"; default is: '[name].js'
      dir: 'dist',
      format: 'cjs',
      name: 'VueIntlTelInput',
      exports: 'named',
      globals,
    },
    plugins: [
      postcss(baseConfig.plugins.postcss),
      replace(baseConfig.plugins.replace),
      node(baseConfig.plugins.node),
      json(baseConfig.plugins.json),
      typescript(baseConfig.plugins.typescript),
      ...baseConfig.plugins.preVue,
      vue({
        ...baseConfig.plugins.vue,
        template: {
          ...baseConfig.plugins.vue.template,
          optimizeSSR: true,
        },
      }),
      // babel(baseConfig.plugins.babel),
      commonjs(),
    ],
  };
  buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === 'umd') {
  const unpkgConfig = {
    ...baseConfig,
    external,
    inlineDynamicImports: true,
    output: {
      compact: true,
      // file: 'dist/vue-intl-tel-input.min.js',
      entryFileNames: 'vue-intl-tel-input.min.js',   // .."chunks created from entry points"; default is: '[name].js'
      dir: 'dist',
      format: 'umd',
      name: 'VueIntlTelInput',
      exports: 'named',
      globals,
    },
    plugins: [
      postcss(baseConfig.plugins.postcss),
      replace(baseConfig.plugins.replace),
      node(baseConfig.plugins.node),
      json(baseConfig.plugins.json),
      typescript(baseConfig.plugins.typescript),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      // babel(baseConfig.plugins.babel),
      commonjs(),
      terser({
        output: {
          ecma: 5,
        },
      }),
    ],
  };
  buildFormats.push(unpkgConfig);
}

// Export config
export default buildFormats;
