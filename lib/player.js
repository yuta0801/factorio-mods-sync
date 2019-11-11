const { userDataPath } = require('./path')
const { readJSONSync } = require('./util')
const playerData = readJSONSync(userDataPath)

module.exports = {
  serviceCredentials: {
    username: playerData['service-username'],
    token: playerData['service-token'],
  },
  favouriteServers: playerData['favourite-servers'] || [],
  lastPlayedVersion: playerData['last-played-version'] ?
    playerData['last-played-version']['game_version'] || '' :
    '',
}
