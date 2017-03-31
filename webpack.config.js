// path
var path = require('path')
// webpack
var webpack = require('webpack')
// export
module.exports = {
  // components index still the key
  entry: [
    './components/index'
  ],
  // /bundle.js
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  // care only js
  resolve: {
    extensions: ['', '.js']
  },
  // babel loader
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'components')
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.COSMIC_BUCKET': JSON.stringify(process.env.COSMIC_BUCKET),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.COSMIC_READ_KEY': JSON.stringify(process.env.COSMIC_READ_KEY),
      'process.env.COSMIC_WRITE_KEY': JSON.stringify(process.env.COSMIC_WRITE_KEY)
    })
  ]
}
