const fetch = require('node-fetch')
const request = require('request')
const querystring = require('querystring')
const fs = require('fs')
const { Spinner } = require('clui')
const ProgressBar = require('progress')
const msg = name => `[:bar] downloading ${name} :rate/bps :percent :etas`

module.exports = {
  fetch: async ({ url, qs, method = 'GET', name }) => {
    const status = new Spinner(`Requesting ${name}, please wait...`)
    status.start()
    if (qs) url += '?' + querystring.stringify(qs)
    const res = await fetch(url, { method })
    const json = await res.json()
    status.stop()
    return json
  },
  download: ({ url, path, name, qs }) => {
    return new Promise((resolve, reject) => {
      if (qs) url += '?' + querystring.stringify(qs)
      const req = request({
        url,
        encoding: null,
      })
      req.on('error', err => reject(err))
      req.on('response', res => {
        req.pipe(fs.createWriteStream(path))
        const len = parseInt(res.headers['content-length'], 10)
        const bar = new ProgressBar(msg(name), {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: len,
        })
        res.on('data', data => bar.tick(data.length))
        req.on('end', () => resolve(name))
      })
    })
  },
}
