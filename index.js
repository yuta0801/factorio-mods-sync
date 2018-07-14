const chalk = require('chalk')
const logo = require('./lib/logo')
const auth = require('./lib/auth')
const mods = require('./lib/mods')
const util = require('./lib/util')
const path = require('./lib/path')
const multiplayer = require('./lib/multiplayer')
const prompts = require('./lib/prompts')

console.log(chalk.yellow(logo))

!(async () => {
  const creds = await auth.getCredentials()

  const games = await multiplayer.getGames(creds)
  const { favouriteServers: favs } = require('./lib/player')
  const sorted = util.sortWithfavourite(games, favs)

  const choices = sorted.map(e => ({
    name: e.name, value: e.game_id,
  }))

  const { id } = await prompts.selectServer(choices)

  const game = await multiplayer.getGameDetails(id)

  const list = await mods.getMods(game.mods)

  util.deleteFiles(path.modsPath, file => {
    return file.endsWith('.zip') || file === 'mod-list.json'
  })

  const done = await mods.downloadMods(list)
  console.log('Downloaded ' + done.join(', ') + '!')

  util.paktc('Press any key to exit...')
})()

process.on('unhandledRejection', err => console.log(err))
