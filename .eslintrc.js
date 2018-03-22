module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  env: {
    browser: true
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
  rules: {
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never',
    }],
  },
};
