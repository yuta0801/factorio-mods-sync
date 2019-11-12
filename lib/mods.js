const request = require('./request')
const path = require('./path')
const { getCredentials } = require('./auth')
const endpoint = 'https://mods.factorio.com'

module.exports = {
  async getMod({ name, version }) {
    const mod = await request.fetch({
      url: endpoint + '/api/mods/' + name,
      name: name + ' mod',
    })
    const release = mod.releases.find(r => r.version === version)
    if (!release) throw (`Cannot find mod ${name} installed on server!\n` +
      'Please confirm with the server owner')
    return release
  },
  async getMods(mods) {
    mods = mods.filter(e => e.name !== 'base')
    const res = []
    for (const mod of mods) res.push(await this.getMod(mod))
    return res
  },
  async downloadMods(mods) {
    const cred = await getCredentials()
    return request.downloadParallel(mods.map(mod => ({
      url: endpoint + mod.download_url,
      qs: cred,
      path: path.getModPath(mod.file_name),
      name: mod.file_name,
    })))
  },
}
