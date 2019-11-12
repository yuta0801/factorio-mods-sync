const { fetch } = require('./request')
const { _ } = require('./util')
const endpoint = 'https://multiplayer.factorio.com'

module.exports = {
  getGames: creds => fetch({
    url: endpoint + '/get-games',
    qs: {
      username: creds.username,
      token: creds.token,
    },
    name: _('SERVERS'),
  }),
  getGameDetails: id => fetch({
    url: endpoint + '/get-game-details/' + id,
    name: _('SERVER'),
  }),
}
