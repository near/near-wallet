module.exports = {
    extends: 'react-app',
    rules: {
        'jsx-a11y/no-access-key': 'off',
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
    }
}