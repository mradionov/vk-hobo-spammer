module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 8,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack/renderer.config.js',
      },
    },
  },
};
