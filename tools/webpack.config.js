const { join } = require('path')
const os = require('os')
const HtmlPlugin = require('html-webpack-plugin')
const HappyPack = require('happypack')
const IgnoreNotFoundExportPlugin = require('./ignore-not-found-export-plugin')

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',

  entry: {
    'app': './app/src/index.tsx',
  },

  devServer: {
    port: 8080,
    historyApiFallback: true,
  },

  watch: true,

  context: join(__dirname, '../packages'),

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: 'happypack/loader?id=ts',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false
            }
          }
        ]
      },
    ]
  },

  plugins: [
    new HtmlPlugin({
      template: '../index.html',
    }),

    new HappyPack({
      id: 'ts',
      loaders: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
          }
        }
      ],
      threadPool: happyThreadPool
    }),

    new IgnoreNotFoundExportPlugin(),
  ]
}
