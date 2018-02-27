const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const output = fs.createWriteStream(path.join(__dirname, '..', 'translate-man.zip'))
const archive = archiver('zip', {
  zlib: { level: 9 }
})

output.on('close', () => {
  console.log(`Translate man ziped ${archive.pointer()} total bytes.`)
  console.log('Now you can upload to browser store.')
})

archive.on('warning', err => {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    throw err
  }
})

archive.on('error', err => {
  throw err
})

// pipe archive data to the file
archive.pipe(output)

// append files from a sub-directory, putting its contents at the root of archive
archive.directory('../dist/', false)

archive.finalize()
