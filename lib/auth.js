const Preferences = require('preferences')
const { fetch } = require('./request')
const { serviceCredentials } = require('./player')
const endpoint = 'https://auth.factorio.com'
const prefs = new Preferences('factorio-mods-sync')
const prompts = require('./prompts')

module.exports = {
  askCredentials() {
    console.log('This app encrypts and saves only your name and token.')
    return prompts.askCredentials()
  },
  async getCredentials() {
    if (prefs.factorio) return prefs.factorio

    if (serviceCredentials.token) {
      prefs.factorio = serviceCredentials
      return serviceCredentials
    }

    const credentials = await this.askCredentials()
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
  },
}
