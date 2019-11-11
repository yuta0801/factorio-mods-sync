const { modListPath } = require('./path')
const { readJSONSync } = require('./util')
const fs = require('fs')

module.exports = {
  load() {
    const list = readJSONSync(modListPath).mods || []
    return list.reduce((map, { name, enabled }) => {
      const partial = { [name]: enabled }
      if (name !== 'base') Object.assign(map, partial)
      return map
    }, {})
  },
  save(mods) {
    const list = Object.entries(mods)
      .map(([name, enabled]) => ({ name, enabled }))
    list.unshift({ name: 'base', enabled: true })
    const json = JSON.stringify({ mods: list }, null, 2)
    fs.writeFileSync(modListPath, json)
  },
  append(mods) {
    const list = this.load()
    for (const mod of Object.keys(list)) list[mod] = false
    for (const mod of mods) list[mod] = true
    this.save(list)
  },
}
