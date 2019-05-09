const { join } = require('path')

module.exports = {
  browser: false,
  verbose: true,
  rootDir: join(__dirname, '..'),
  setupFilesAfterEnv: ['<rootDir>/tools/test-setup.js'],
  moduleDirectories: [
    '<rootDir>/node_modules',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '@demo/raw(.*)$': '<rootDir>/packages/raw/src/$1',
    '@demo/decorator(.*)$': '<rootDir>/packages/decorator/src/$1',
    '@demo/hooks(.*)$': '<rootDir>/packages/hooks/src/$1',
    '@demo/app(.*)$': '<rootDir>/packages/app/src/$1',
    '\\.(svg|css|png|jpg|gif)': '<rootDir>/__mocks__/statics.js',
  },
  transform: {
    '^.+\\.(t|j)sx?$': '<rootDir>/tools/preprocessor.js',
  },
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/tools/',
  ],
  testRegex: '.*\\.spec\\.(j|t)sx?$',
  coverageReporters: ['lcov', 'html', 'text'],
}
