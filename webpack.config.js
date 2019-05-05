const { join } = require('path')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',

  entry: {
    'redux-observable': './redux-observable/src/index.tsx',
  },

  context: join(__dirname, 'packages'),

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
}