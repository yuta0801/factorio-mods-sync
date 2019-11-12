const fs = require('fs')
const crypto = require('crypto')

module.exports = {
  sortWithfavourite(games, favs) {
    return games.sort((a, b) => favs.indexOf(a) - favs.indexOf(b))
  },
  paktc(message) {
    process.stdout.write('\n' + message)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', () => process.exit(0))
  },
  readJSONSync(filepath) {
    try {
      const data = fs.readFileSync(filepath, 'utf8')
      return JSON.parse(data)
    } catch (e) {
      return {}
    }
  },
  neededMods(mods, all) {
    const isSame = a => b => a.name === b.name && a.version === b.version
    const installed = mods.filter(mod => all.find(isSame(mod)))
    const needed = mods.filter(mod => installed.find(isSame(mod)))
    return [needed, installed]
  },
  getFileSHA1(path) {
    const shasum = crypto.createHash('sha1')
    const file = fs.readFileSync(path)
    return shasum.update(file).digest('hex')
  },
}
