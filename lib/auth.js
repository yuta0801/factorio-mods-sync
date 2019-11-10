const { fetch } = require('./request')
const { serviceCredentials } = require('./player')
const endpoint = 'https://auth.factorio.com'
const prompts = require('./prompts')

module.exports = {
  askCredentials() {
    console.log('This tool does not save any credentials.')
    return prompts.askCredentials()
  },
  async getCredentials() {
    if (serviceCredentials.token) return serviceCredentials

    const credentials = await this.askCredentials()
    const res = await fetch({
      url: endpoint + '/api-login',
      qs: credentials,
      method: 'POST',
      name: 'token',
    })

    if (res.message) throw res.message

    return {
      username: credentials.username,
      token: res[0],
    }
  },
}
