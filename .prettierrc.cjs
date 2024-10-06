const config = require('@kitql/eslint-config/.prettierrc.cjs')

module.exports = {
  ...config,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
}
