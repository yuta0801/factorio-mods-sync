const { userDataPath } = require('./path')
const fs = require('fs')

let playerData

try {
  playerData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'))
} catch (e) {
  playerData = {}
}

module.exports = {
  serviceCredentials: {
    username: playerData['service-username'],
    token: playerData['service-token'],
  },
  favouriteServers: playerData['favourite-servers'],
}
