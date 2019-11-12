const { modListPath, modsPath, getModPath } = require('./path')
const { readJSONSync, getFileSHA1, _ } = require('./util')
const { Spinner } = require('clui')
const fs = require('fs')

module.exports = {
  listMods() {
    return fs.readdirSync(modsPath)
      .map(f => f.match(/^(.*?)_(\d+.\d+.\d+).zip$/))
      .filter(e => e)
      .map(([, name, version]) => ({ name, version}))
  },
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
  enable(mods) {
    const list = this.load()
    for (const mod of Object.keys(list)) list[mod] = false
    for (const mod of mods) list[mod] = true
    this.save(list)
  },
  verifyMods(mods) {
    const status = new Spinner(_('VERIFYING'))
    status.start()
    const failed = []
    for (const mod of mods) {
      const path = getModPath(mod.file_name)
      const sha1 = getFileSHA1(path)
      if (sha1 !== mod.sha1) failed.push(mod)
    }
    status.stop()
    return failed
  },
}
