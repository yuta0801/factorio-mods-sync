const { fetch } = require('./request')
const { serviceCredentials } = require('./player')
const endpoint = 'https://auth.factorio.com'
const prompts = require('./prompts')
const { _ } = require('./util')

module.exports = {
  askCredentials() {
    console.log(_('WILL_ASK_CREDENTIALS'))
    return prompts.askCredentials()
  },
  async getCredentials() {
    if (serviceCredentials.token && serviceCredentials.username)
      return serviceCredentials

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
