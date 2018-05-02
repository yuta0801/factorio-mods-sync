const { favouriteServers: favs } = require('./player')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

module.exports = {
  sortWithfavourite: games => {
    if (!Array.isArray(favs)) return games
    const tmp = []
    for (const game of games) {
      if (favs.includes(game.server_id)) tmp.unshift(game)
      else tmp.push(game)
    }
    return tmp
  },
  deleteFiles: (dir, callback) => {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      if (callback(file)) {
        fs.unlinkSync(path.join(dir, file))
      }
    }
  },
  paktc: () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Press enter to continue...', () => rl.close())
  },
}
