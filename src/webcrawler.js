const rp = require('request-promise')
const cheerio = require('cheerio')
const striptags = require('striptags')
const Writer = require('./writer')

module.exports = class Webcrawler {
  constructor(url) {
    this.init(url)
  }

  /**
   * @param {string} url The URL to be crawled
   */
  init(url) {
    //URL to visit
    this.uri = url
    //Options for the request-promise HTTP client
    this.options = {
      uri: this.uri,
      //request-promise loads the response body into cheerio,
      //giving us access to cheerio as an argument to our callback
      transform: body => cheerio.load(body)
    }

    //Log file configurations
    this.Writer = new Writer(this.uri)

    //We bind our methods to `this` so proper scope is preserved
    this.dumpContentFromURLtoTextFile = this.dumpContentFromURLtoTextFile.bind(
      this
    )
    this.dumpLinksFromURLtoTextFile = this.dumpLinksFromURLtoTextFile.bind(this)
  }

  /**
   * Run the crawler!
   */
  async run() {
    //Dump the URL's content to a text f1ile, stripping HTML tags and JS
    await this.request(this.dumpContentFromURLtoTextFile)
    //Filter out the links and dump them to a different text file
    const links = await this.request(this.dumpLinksFromURLtoTextFile)

    console.log(`${this.uri} crawler finished running!\n`)

    return links
  }

  /**
   *
   * @param {function} callback
   * A callback to be called with the
   * response body loaded into cheerio.
   * Will catch any errors and log them
   * to the console
   */
  request(callback) {
    return rp(this.options)
      .then(callback)
      .catch(e => {
        console.log('Something went wrong when scraping: ', this.uri)
        this.Writer.writeToErrorLog(e)
      })
  }

  /**
   *
   * @param {*} $ Cheerio object, loaded with the response body
   */
  dumpContentFromURLtoTextFile($) {
    //Striptags cleans the HTML and JS for us
    const content = striptags($('body').text())
    return this.Writer.writeToFile('content.txt', content)
  }

  /**
   *
   * @param {*} $ Cheerio object, loaded with the response body
   *
   */
  async dumpLinksFromURLtoTextFile($) {
    //Grab all anchor tags with cheerio
    const anchors = $('a')
    const links = []

    $(anchors).each((_, link) => {
      //Grab the href from the tag with cheerio
      const url = $(link).attr('href')
      //We are not interested in these cases
      if (
        url === undefined ||
        url === '/' ||
        url.includes('localhost') ||
        url.includes('#')
      ) {
        return
      }

      //Valid absolute links should be either http or https
      const regex = /^http(s)?:/ //
      if (url.match(regex) !== null) {
        links.push(url)
      }
      //Anchors can have relative URLs
      else {
        const parts = this.uri.split('/')
        const protocol = parts[0]
        const root = parts[2]
        let link = null
        if (url.includes('//')) {
          link = `${protocol}${url}`
        } else {
          link = `${protocol}//${root}${url}`
        }
        links.push(link.replace(' ', ''))
      }
    })

    //Filter out the duplicated links
    const uniqueLinks = [...new Set(links)]

    //Wait for the links be to logged
    if (uniqueLinks.length) {
      await this.Writer.writeToFile('links.txt', uniqueLinks.join('\n'))
      return uniqueLinks
    }

    return []
  }
}
