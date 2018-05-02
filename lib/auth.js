const inquirer = require('inquirer')
const Preferences = require('preferences')
const { fetch } = require('./request')
const { serviceCredentials } = require('./player')
const endpoint = 'https://auth.factorio.com'
const prefs = new Preferences('factorio-mods-sync')

function askCredentials() {
  console.log('This app encrypts and saves only your name and token.')
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
}

async function getCredentials() {
  if (prefs.factorio) return prefs.factorio

  if (serviceCredentials.token) {
    prefs.factorio = serviceCredentials
    return serviceCredentials
  }

  const credentials = await askCredentials()
  const res = await fetch({
    url: endpoint + '/api-login',
    qs: credentials,
    method: 'POST',
    name: 'token',
  })
  if (res.message) throw res.message
  const creds = {
    username: credentials.username,
    token: res[0],
  }
  prefs.factorio = creds
  return creds
}

module.exports = {
  askCredentials,
  getCredentials,
}
