module.exports = {
    extends: ['react-app', 'eslint:recommended'],
    rules: {
        'jsx-a11y/no-access-key': 'off',
        'no-useless-escape': 'off',
        'semi': ['error', 'always'],
        'no-console': 'off',
        'no-extra-boolean-cast':'off',
        'no-extra-semi':'off',
        'no-irregular-whitespace':'off',
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
    }
}