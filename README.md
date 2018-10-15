# node_webcrawler

Repo for the RSS reader assignment for the Competitive Inteligence Systems class at PUC-Rio

This project enables users to add and remove RSS feeds from a local file. Users can then list articles from the feeds and, when available, read the content from the articles.

# usage

`npm run crawl` - Prompts the user for a root URL to crawl. Also asks for a maximum number of links so as to stop the crawling eventually. Creates a `logs/` directory with found content and links.

`npm run clear` - Clears the `logs/` directory.

`npm run help` - Shows the description for the different commands

`npm run build:all` - Builds the executables for the different platforms. Needs `zeit/pkg` installed globally to work.

# executables

This project uses `zeit/pkg` to create windows (x64 and x86) and linux executables. All of them can be found in the `dist/` directory.
