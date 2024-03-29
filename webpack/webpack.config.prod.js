const Path = require('path')
const Webpack = require('webpack')
const common = require('./webpack.common.js')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  output: {
    filename: 'scripts/[name].[chunkhash:8].js',
    chunkFilename: 'scripts/[name].[chunkhash:8].chunk.js'
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/styles.[contenthash].css',
      chunkFilename: '[id].css'
    }),
    new StyleLintPlugin({
      configFile: Path.resolve(__dirname, '../.stylelintrc'),
      failOnError: false, // Set to true if using CI
      emitErrors: false, // Set to true if using CI
      files: '**/*.scss',
      syntax: 'scss'
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 1
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 10
              }
            }
          },
        ],
      },
     
      {
        test: /\.(js)$/i,
        exclude: /node_modules/,
        use: 'babel-loader',
        
      },
      {
        test: /\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?url=false',
          'sass-loader'
        ]
      }
    ]
  }
})
