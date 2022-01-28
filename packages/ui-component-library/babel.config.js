module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        loose: true,
        modules: false,
        targets: { node: 12 },
        useBuiltIns: 'entry'
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: ['@babel/plugin-syntax-jsx']
};
