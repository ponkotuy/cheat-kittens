
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  experiments: {
    outputModule: true
  },
  entry: {
    contents: './src/contents.ts',
    background: './src/background.ts'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader'
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    environment: {dynamicImport: true},
    module: true
  }
}
