const commonjs = require('@rollup/plugin-commonjs');

export default {
    input: 'flag.js',
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
