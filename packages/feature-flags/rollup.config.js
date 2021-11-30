const commonjs = require('@rollup/plugin-commonjs');
const { preserveShebangs } = require('rollup-plugin-preserve-shebangs');

export default {
    input: 'bin/flag-editor.js',
    output: {
        compact: true,
        dir: 'out',
        exports: 'auto',
        format: 'cjs',
    },
    plugins: [
        preserveShebangs(),
        commonjs(),
    ],
};
