const fs = require('fs')

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
  neededMods(mods, installed) {
    return mods.filter(a => !installed.find(b => {
      return a.name === b.name && a.version === b.version
    }))
  },
}
