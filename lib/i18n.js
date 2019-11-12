const path = require('path')
const osLocale = require('os-locale')
const y18n = require('y18n')

module.exports = y18n({
  directory: path.join(process.cwd(), '_locales'),
  locale: osLocale.sync(),
})
