module.exports = {
    extends: ['react-app', 'eslint:recommended'],
    rules: {
        'jsx-a11y/no-access-key': 'off',
        'no-useless-escape': 'off',
        'no-extra-boolean-cast': 'off',
        semi: ['error', 'always'],
        'no-console': 'off',
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                'newlines-between': 'always',
                groups: ['builtin', ['external', 'internal'], ['sibling', 'parent', 'index'], 'object'],
            },
        ],
    },
};
