const Webcrawler = require('./webcrawler')

module.exports = class CrawlerManager {
  constructor(rootUrl, maxLinks) {
    this.rootUrl = rootUrl
    this.maxLinks = maxLinks
    this.init()
  }

  async init() {
    console.log('Starting the crawl....')
    //We keep all known links in a separate array
    //so that we consume the URLs to crawl
    //in the order they were found
    let allLinks = []
    //The first URL to be crawled is a user input
    let scrapedLinks = [this.rootUrl]
    let urlToCrawl = this.rootUrl
    do {
      //Run the crawler!
      const crawler = new Webcrawler(urlToCrawl)
      const crawledLinks = await crawler.run()
      //Mark the URL as crawled
      scrapedLinks.push(urlToCrawl)
      allLinks = [
        //Keep the unique links
        ...new Set(
          //Merge all links
          allLinks.concat(crawledLinks)
        )
      ]

      //Get the new URL to crawl
      urlToCrawl = allLinks[scrapedLinks.length]
    } while (scrapedLinks.length <= this.maxLinks)
    console.log('Ending the crawl!')
  }
}
