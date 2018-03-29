const path = require('path');

const rootDir = path.join(__dirname, '..');

const config = {
  mode: 'development',
  target: 'electron-renderer',
  entry: path.join(rootDir, 'src/renderer/renderer.js'),
  output: {
    path: path.join(rootDir, 'src/renderer/dist'),
    filename: 'renderer.dist.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          cssModules: {
            camelCase: true,
            localIdentName: '[name]__[local]__[hash:base64:5]',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
  },
};

module.exports = config;
