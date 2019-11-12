const inquirer = require('inquirer')
const autocomplete = require('inquirer-autocomplete-prompt')
const { _ } = require('./util')

inquirer.registerPrompt('autocomplete', autocomplete)

module.exports = {
  askCredentials() {
    return inquirer.prompt([{
      type: 'input',
      name: 'username',
      message: _('ASK_USER_NAME'),
      validate: val => val ? true : _('ASK_USER_NAME'),
    }, {
      type: 'password',
      name: 'password',
      message: _('ASK_PASS_WORD'),
      validate: val => val ? true : _('ASK_PASS_WORD_VALIDATE'),
    }])
  },
  selectServer(choices) {
    return inquirer.prompt({
      type: 'autocomplete',
      name: 'id',
      message: _('SELECT_SERVER'),
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
      message: _('FAILED_VERIFY_MOD', name),
      choices: [
        { name: _('VERIFY_IGNORE'), value: 'ignore' },
        { name: _('VERIFY_REINSTALL'), value: 'reinstall' },
      ],
    }).then(res => res.choice)
  },
}
