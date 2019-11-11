const fetch = require('node-fetch')
const querystring = require('querystring')
const fs = require('fs')
const { once } = require('events')
const { Spinner } = require('clui')
const ProgressBar = require('progress')
const msg = name => `[:bar] downloading ${name} :rate/bps :percent :etas`

module.exports = {
  async fetch({ url, qs, method = 'GET', name }) {
    const status = new Spinner(`Requesting ${name}, please wait...`)
    status.start()
    if (qs) url += '?' + querystring.stringify(qs)
    const json = await fetch(url, { method }).then(res => res.json())
    status.stop()
    return json
  },
  async download({ url, path, name, qs }) {
    if (qs) url += '?' + querystring.stringify(qs)
    const res = await fetch(url)
    const len = Number(res.headers.get('content-length'))
    const file = fs.createWriteStream(path)
    res.body.pipe(file)
    const bar = new ProgressBar(msg(name), {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: len,
    })
    res.body.on('data', data => bar.tick(data.length))
    await once(file, 'finish')
    return name
  },
}
