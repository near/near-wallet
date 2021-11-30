const commonjs = require('@rollup/plugin-commonjs');

export default {
    input: 'bin/flag-editor.js',
    output: {
        compact: true,
        dir: 'out',
        exports: 'auto',
        format: 'cjs',
    },
    plugins: [
        commonjs(),
    ],
};
