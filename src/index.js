const program = require('commander')
const { prompt } = require('inquirer')

const Webcrawler = require('./webcrawler')

program.version('0.0.1').description('Webcrawler')

const questions = [
  {
    type: 'input',
    name: 'url',
    message: 'What URL do you want to crawl?'
  },
  {
    type: 'input',
    name: 'maxLinkDepth',
    message:
      'What is the maximum number of links we should visit while crawling the root page?'
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
      const { url, maxLinkDepth } = answers
      new Webcrawler(url, maxLinkDepth)
    })
  )

program.parse(process.argv)
