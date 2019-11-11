const fs = require('fs')

module.exports = {
  sortWithfavourite(games, favs) {
    if (!Array.isArray(favs)) return games
    const tmp = []
    for (const game of games) {
      if (favs.includes(game.server_id)) tmp.unshift(game)
      else tmp.push(game)
    }
    return tmp
  },
  paktc(message) {
    process.stdout.write(message)
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
