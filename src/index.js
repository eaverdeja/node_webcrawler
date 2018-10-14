const program = require('commander')
const { prompt } = require('inquirer')
const rimraf = require('rimraf')

const CrawlerManager = require('./crawlerManager')

program.version('0.0.1').description('Webcrawler')

const questions = [
  {
    type: 'input',
    name: 'url',
    message: 'What URL do you want to crawl?'
  },
  {
    type: 'input',
    name: 'maxLinks',
    message:
      'What is the maximum number of links we should visit while crawling?'
  }
]

program
  .command('crawl')
  .alias('c')
  .description(
    'Crawl a given URL and dumps content from the root page and linked pages in a set of text files'
  )
  .action(() =>
    prompt(questions).then(answers => {
      const { url, maxLinks } = answers
      new CrawlerManager(url, maxLinks)
    })
  )

program
  .command('clear')
  .description('Clears the /logs directory')
  .action(() =>
    rimraf('logs', () => console.log('The /logs directory was deleted!'))
  )

program.parse(process.argv)
