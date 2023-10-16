const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const terser = require('terser')
const rollup = require('rollup')
const configs = require('./configs')
const { mkdir } = require('fs/promises')

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

build(configs)

function build(builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built])
      .then(() => {
        built++
        if (built < total) {
          next()
        }
      })
      .catch(logError)
  }

  next()
}

function buildEntry({ input, output }) {
  const { file, banner } = output
  const fileDir = path.dirname(file)
  const isProd = /min\.js$/.test(file)
  return rollup
    .rollup(input)
    .then((bundle) => bundle.generate(output))
    .then(async (bundle) => {
      for (const result of bundle.output) {
        if (result.type === 'chunk') {
          const code = result.code
          if (!code) {
            continue
          }
          if (isProd && result.fileName.endsWith('.js')) {
            const minified =
              (banner ? banner + '\n' : '') +
              terser.minify(code, {
                toplevel: true,
                output: {
                  ascii_only: true,
                },
                compress: {
                  pure_funcs: ['makeMap'],
                },
              }).code
            await write(path.join(fileDir, result.fileName), minified, true)
          } else {
            await write(path.join(fileDir, result.fileName), code)
          }
        } else {
          if (isProd) continue
          if (result.fileName.includes('/')) {
            const dir = path.dirname(result.fileName)
            await mkdir(dir, { recursive: true })
            await write(result.fileName, result.source)
          } else {
            await write(path.join(fileDir, result.fileName), result.source)
          }
        }
      }
    })
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(
        blue(path.relative(process.cwd(), dest)) +
          ' ' +
          getSize(code) +
          (extra || ''),
      )
      resolve()
    }

    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
