const chalk = require('chalk')
const inquirer = require('inquirer')
const autocomplete = require('inquirer-autocomplete-prompt')
const logo = require('./lib/logo')
const auth = require('./lib/auth')
const mods = require('./lib/mods')
const util = require('./lib/util')
const path = require('./lib/path')
const multiplayer = require('./lib/multiplayer')

inquirer.registerPrompt('autocomplete', autocomplete)

console.log(chalk.yellow(logo))

!(async () => {
  const creds = await auth.getCredentials()

  const games = await multiplayer.getGames(creds)
  const sorted = util.sortWithfavourite(games)

  const choices = sorted.map(e => ({
    name: e.name, value: e.game_id,
  }))

  const { id } = await inquirer.prompt({
    type: 'autocomplete',
    name: 'id',
    message: 'Select a server to sync mods with',
    source: async (answersSoFar, input) => {
      if (!input) return choices
      const regex = new RegExp(input, 'i')
      return choices.filter(e => regex.exec(e.name))
    },
  })

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
