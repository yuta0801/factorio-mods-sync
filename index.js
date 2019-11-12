const chalk = require('chalk')
const auth = require('./lib/auth')
const mods = require('./lib/mods')
const util = require('./lib/util')
const multiplayer = require('./lib/multiplayer')
const prompts = require('./lib/prompts')
const player = require('./lib/player')
const modlist = require('./lib/modlist')
const _ = require('./lib/i18n').__

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
      name: chalk.bold(_('VIEW_ALL_VERSION')), value: 'all',
    })
    choices = sameVersion
    console.log(_('ONLY_LIST_VERSION', version))
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

  const status = [installed, game.mods, needed]
  console.log(_('MODS_STATUS', ...status.map(s => s.length)))

  const done = await mods.downloadMods(needed)
  console.log(_('DOWNLOADED', done.join(', ')))

  modlist.enable(game.mods.map(mod => mod.name))

  if (version && game.application_version.game_version !== version)
    console.log(_('NEED_CHANGE_VERSION'))

  console.log(_('NEED_RESTART'))

  util.paktc(util._('PAKTC'))
})().catch(error => {
  console.log(_('ERROR_OCCURRED'))
  if (error instanceof Error)
    console.log(_('LET_ME_KNOW_ERROR'))
  console.log(error)
  util.paktc(util._('PAKTC'))
})
