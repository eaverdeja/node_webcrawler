const rp = require('request-promise')
const cheerio = require('cheerio')
const striptags = require('striptags')

module.exports = class Webcrawler {
  constructor(url, maxLinkDepth) {
    this.uri = url
    this.maxLinkDepth = maxLinkDepth
    const options = {
      uri: url,
      transform: body => cheerio.load(body)
    }

    this.dumpContentFromURLtoTextFile(options)
  }

  dumpContentFromURLtoTextFile(options) {
    rp(options)
      .then($ => {
        var t = $('body *')
          .contents()
          .map(
            (_, element) =>
              element.type === 'text'
                ? $(element)
                    .text()
                    .trim() + ' '
                : ''
          )
          .get()
          .join('')
        const text = striptags($('body').text())

        console.log(text)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
