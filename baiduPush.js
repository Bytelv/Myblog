'use strict'

/**
 * Generate baidu url push file
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const readFileList = require('./modules/readFileList');
const urlsRoot = path.join(__dirname, '..', 'urls.txt');
const DOMAIN = process.argv.splice(2)[0];

if (!DOMAIN) {
  console.log('https://blog.lvbyte.tk')
  return
}

main();
function main() {
  fs.writeFileSync(urlsRoot, DOMAIN)
  const files = readFileList();

  files.forEach(function(file) {
    const data = matter(fs.readFileSync(file.filePath, 'utf8'));
    if (data.permalink) {
      const link = '\r\n' + DOMAIN + data.permalink + '/';
      console.log(link)
      fs.appendFileSync(urlsRoot, link);
    }
  })
}
