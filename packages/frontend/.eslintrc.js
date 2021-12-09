module.exports = {
    extends: 'react-app',
    rules: {
        'jsx-a11y/no-access-key': 'off',
        'no-useless-escape': 'off',
        'semi': ['error', 'always'],
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                },
                'newlines-between': 'always',
                groups: [
                    'builtin',
                    ['external', 'internal'],
                    ['sibling', 'parent', 'index'],
                    'object'
                ]
            }
        ],
        'no-process-env': ['error']
    },
    overrides: [
        {
            files: ["src/config/**/*.js", "ci/config.js"],
            rules: {
                'no-process-env': ['off']
            },
        },
    ],
}