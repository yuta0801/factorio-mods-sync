const fetch = require('node-fetch')
const querystring = require('querystring')
const fs = require('fs')
const { once } = require('events')
const { Spinner } = require('clui')
const pLimit = require('p-limit')
const MultiProgress = require('multi-progress')
const { _ } = require('./util')

module.exports = {
  async fetch({ url, qs, method = 'GET', name }) {
    const status = new Spinner(_('REQUESTING', name))
    status.start()
    if (qs) url += '?' + querystring.stringify(qs)
    const json = await fetch(url, { method }).then(res => res.json())
    status.stop()
    return json
  },
  downloadParallel(resources) {
    const limit = pLimit(3)
    const bars = new MultiProgress()
    const promises = resources.map(resource => {
      return limit(() => this.download({ ...resource, bars }))
    })
    return Promise.all(promises)
  },
  async download({ url, path, name, qs, bars }) {
    if (qs) url += '?' + querystring.stringify(qs)
    const res = await fetch(url)
    const len = Number(res.headers.get('content-length'))
    const file = fs.createWriteStream(path + '.tmp')
    res.body.pipe(file)
    const bar = bars.newBar(_('PROGRESS', name), {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: len,
    })
    res.body.on('data', data => bar.tick(data.length))
    await once(file, 'finish')
    fs.renameSync(file.path, path)
    return name
  },
}
