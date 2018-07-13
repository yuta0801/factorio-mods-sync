const { fetch, download } = require('./request')
const path = require('./path')
const { getCredentials } = require('./auth')
const endpoint = 'https://mods.factorio.com'

module.exports = {
  getMod(name) {
    return fetch({
      url: endpoint + '/api/mods/' + name,
      name: name + ' mod',
    })
  },
  async getMods(mods) {
    mods = mods.filter(e => e.name !== 'base')
    const res = []
    for (const mod of mods) res.push(await this.getMod(mod.name))
    return res.map((mod, i) => {
      return mod.releases.filter(release => {
        return release.version === mods[i].version
      })[0]
    })
  },
  async downloadMods(mods) {
    const done = []
    for (const mod of mods) {
      done.push(await download({
        url: endpoint + mod.download_url,
        qs: await getCredentials(),
        path: path.getModPath(mod.file_name),
        name: mod.file_name,
      }).catch(err => console.log(err)))
    }
    return done
  },
}
