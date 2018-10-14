const util = require('util')
const fs = require('fs')
const path = require('path')

module.exports = class Writer {
  constructor(name) {
    this.write = util.promisify(fs.writeFile)
    if (process.env.NODE_ENV === 'development') {
      this.appDir = path.dirname(require.main.filename)
      this.logPath = `${this.appDir}/../logs`
    } else {
      this.appDir = path.dirname(process.execPath)
      this.logPath = `${this.appDir}/logs`
    }

    try {
      if (!fs.existsSync(this.logPath)) {
        fs.mkdirSync(this.logPath)
      }
    } catch (e) {
      console.error(e)
      console.log('Unable to create the main logs folder')
    }

    try {
      this.dirPath = `${this.logPath}/${this.slugify(name)}`
      if (!fs.existsSync(this.dirPath)) {
        fs.mkdirSync(this.dirPath)
      }
    } catch (e) {
      console.error(e)
      console.log('Unable to create a folder for ', name)
    }

    try {
      //We create a write stream for the combined log in append mode
      this.combinedLogStream = fs.createWriteStream(
        `${this.logPath}/combined.txt`,
        {
          flags: 'a'
        }
      )
    } catch (e) {
      console.error(e)
      console.log('Unable to create the combined content file')
    }
  }

  /**
   * Useful for making the folder names for the text files
   * using the full URLs as the names
   *
   * @param {string} text
   */
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  /**
   * Writes a content to a filename inside the writer's directory
   * Also streams the content to a combined log
   * @param {string} name
   * @param {string} content
   */
  writeToFile(name, content) {
    const file = `${this.dirPath}/${name}`
    return this.write(file, content, err => {
      if (err) {
        console.log(err)
        return
      }
    }).then(() => {
      if (name.includes('content')) {
        //If the writer wrote a content file
        //we create a read stream for it and pipe it
        //to the combined log stream
        const rstream = fs.createReadStream(file)
        return rstream.pipe(this.combinedLogStream)
      }
    })
  }

  /**
   * Handles a separate file for error messages
   * @param {error} err
   */
  writeToErrorLog(err) {
    return this.write(`${this.dirPath}/errors.txt`, err)
  }
}
