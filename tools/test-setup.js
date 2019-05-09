const { noop } = require('lodash')
require('reflect-metadata')
const { configure } = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

configure({ adapter: new Adapter() })

require.context = noop

process.on('unhandledRejection', (reason) => {
  console.error(reason)
})
