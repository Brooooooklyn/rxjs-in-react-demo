const ts = require('typescript')
const path = require('path')

const tsConfig = require(path.join(__dirname, '..', 'tsconfig.json'))

module.exports = {
  process(src, path) {
    if (/\.(t|j)sx?$/.test(path)) {
      return ts.transpileModule(src, {
        compilerOptions: Object.assign(tsConfig.compilerOptions, {
          module: 'commonjs',
          esModuleInterop: true,
          inlineSourceMap: true,
        }),
        fileName: path,
      }).outputText
    }
    return src
  },
}
