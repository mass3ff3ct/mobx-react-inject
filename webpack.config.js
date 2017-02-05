const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  entry: {
    main: './src/index'
  },
  output: {
    filename: './lib/index.js'
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: [
          'babel-loader',
          'ts-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin()
  ],
  externals: [nodeExternals()]
}