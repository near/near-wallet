import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import babel from './build-utils/babel-custom';
import { dirname } from 'path';

import corepkg from './package.json';

const EXTERNAL = Object.keys(corepkg.devDependencies);

const GLOBALS = {
  'react/jsx-runtime': 'jsxRuntime',
  react: 'React',
  '@stitches/react': 'stitches',
  'react-dom': 'reactDom'
};

export default () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    input: corepkg.source,
    output: [
      {
        file: corepkg.main,
        format: 'cjs',
        sourcemap: true,
        strict: true,
        globals: GLOBALS
      },
      {
        file: corepkg.module,
        format: 'es',
        sourcemap: true,
        strict: true,
        globals: GLOBALS
      },
      {
        file: corepkg.modern,
        format: 'es',
        sourcemap: true,
        strict: true,
        globals: GLOBALS
      },
      {
        file: corepkg['umd:main'],
        name: 'index.umd.js',
        format: 'umd',
        sourcemap: true,
        strict: true,
        globals: GLOBALS
      }
    ],
    plugins: [
      peerDepsExternal(),
      typescript({
        tsconfigDefaults: {
          compilerOptions: {
            declaration: true,
            declarationDir: dirname(corepkg.types)
          }
        }
      }),
      resolve({
        mainFields: ['module', 'jsnext', 'main'],
        browser: true,
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        preferBuiltins: true
      }),
      commonjs({
        include: /\/node_modules\//,
        esmExternals: false,
        requireReturnsDefault: 'namespace'
      }),
      babel({ babelHelpers: 'bundled', include: 'node_modules/**', compact: false }),
      url(),
      svgr(),
      isProduction && terser()
    ],
    external: EXTERNAL,
    treeshake: {
      propertyReadSideEffects: false
    }
  };
};
