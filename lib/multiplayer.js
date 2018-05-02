const { fetch } = require('./request')
const endpoint = 'https://multiplayer.factorio.com'

module.exports = {
  getGames: creds => fetch({
    url: endpoint + '/get-games',
    qs: {
      username: creds.username,
      token: creds.token,
    },
    name: 'games',
  }),
  getGameDetails: id => fetch({
    url: endpoint + '/get-game-details/' + id,
    name: 'game details',
  }),
}
