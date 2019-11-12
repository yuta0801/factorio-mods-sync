const inquirer = require('inquirer')
const autocomplete = require('inquirer-autocomplete-prompt')

inquirer.registerPrompt('autocomplete', autocomplete)

module.exports = {
  askCredentials() {
    return inquirer.prompt([{
      type: 'input',
      name: 'username',
      message: 'Enter your Factorio username',
      validate: val => val ? true : 'Please enter your username',
    }, {
      type: 'password',
      name: 'password',
      message: 'Enter your password',
      validate: val => val ? true : 'Please enter your password',
    }])
  },
  selectServer(choices) {
    return inquirer.prompt({
      type: 'autocomplete',
      name: 'id',
      message: 'Select a server to sync mods with',
      source: async (answersSoFar, input) => {
        if (!input) return choices
        const regex = new RegExp(input, 'i')
        return choices.filter(e => regex.test(e.name))
      },
    }).then(res => res.id)
  },
  resolveFailedVerify(name) {
    return inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: `Failed to verify installed mod ${name},` +
        'It may be broken or modified',
      choices: [
        { name: 'Ignore', value: 'ignore' },
        { name: 'Reinstall', value: 'reinstall' },
      ],
    }).then(res => res.choice)
  },
}
