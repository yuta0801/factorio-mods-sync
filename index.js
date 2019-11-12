const chalk = require('chalk')
const auth = require('./lib/auth')
const mods = require('./lib/mods')
const util = require('./lib/util')
const multiplayer = require('./lib/multiplayer')
const prompts = require('./lib/prompts')
const player = require('./lib/player')
const modlist = require('./lib/modlist')

!(async () => {
  console.log(chalk.yellow('FactorioModsSync'))

  const creds = await auth.getCredentials()

  const games = await multiplayer.getGames(creds)

  const hasModsGames = games.filter(game => game.has_mods)

  const favs = player.favouriteServers
  const sorted = util.sortWithfavourite(hasModsGames, favs)

  const allChoices = sorted.map(e => ({
    name: e.name, value: e.game_id,
    ver: e.application_version.game_version,
  }))

  let choices = allChoices
  const version = player.lastPlayedVersion

  if (version) {
    const sameVersion = allChoices.filter(e => e.ver === version)
    sameVersion.push({
      name: chalk.bold('View all versions of the server'), value: 'all',
    })
    choices = sameVersion
    console.log(`Currently viewing only version ${version} of the server`)
    console.log('To view all servers, select `View all versions of the server`')
  }

  let id = await prompts.selectServer(choices)
  if (id === 'all') id = await prompts.selectServer(allChoices)

  const game = await multiplayer.getGameDetails(id)

  const exists = modlist.listMods()
  const require = await mods.getMods(game.mods)

  const [needed, installed] = util.neededMods(require, exists)

  const failed = modlist.verifyMods(installed)
  if (failed.length) {
    for (const mod of failed) {
      const choice = await prompts.resolveFailedVerify(mod.file_name)
      if (choice === 'reinstall') needed.push(mod)
    }
  }

  console.log([
    `Info: ${installed.length} mods has installed`,
    `of total ${game.mods.length} mods`,
    `and the remaining ${needed.length} mods will be downloaded`,
  ].join(' '))

  const done = await mods.downloadMods(needed)
  console.log(`Downloaded ${done.join(', ')}!`)

  modlist.enable(game.mods.map(mod => mod.name))

  if (version && game.application_version.game_version !== version) {
    console.log('Info: You have selected the different version of the last version you played')
    console.log('To play on that server, Don\'t forget to change the version of Factorio')
  }

  console.log('After downloading mods, you need restart Factorio for apply them')

  util.paktc('Press any key to exit...')
})().catch(error => {
  console.log('Unexpected error has occurred!\n')
  if (error instanceof Error)
    console.log('Please let me know following message for improve this tool:\n')
  console.log(error)
  util.paktc('Press any key to exit...')
})
