const
  fs = require('fs'),
  path = require('path'),
  webpack = require('webpack')

let
  webpackConfig = require('./webpack.config.js')

module.exports = (config) => {
  const
    options = {
      ...{
        doctype: '<!doctype html>',
        linting: false,
        watch: false
      },
      ...config
    },
    rootDir = process.env.INIT_CWD,
    contextPath = path.resolve(rootDir, config.context || 'src'),
    srcPath = path.resolve(rootDir, config.srcPath),
    buildPath = path.resolve(rootDir, config.buildPath)

  webpackConfig = webpackConfig(options)

  if ( options.linting ) {
    enableLinting()
  }

  fs.readdir(srcPath, function(err, files) {
    if ( err ) {
      return console.log('Unable to scan directory: ' + err)
    }

    const pages = {}

    files.forEach(fileName => {
      pages[path.basename(fileName, '.jsx')] = path.resolve(srcPath, fileName)
    })

    renderFiles({ pages })

    options.callback()
  })


  const renderFiles = ({ pages }) => {

    webpackConfig = {
      ...webpackConfig,
      entry: pages,
      context: contextPath,
      output: {
        path: buildPath,
        filename: '[name].html'
      }
    }

    console.log(webpackConfig, options.watch)

    const compiler = webpack(webpackConfig)

    if ( !options.watch ) {
      compiler.run()
    } else {
      compiler.watch({
        aggregateTimeout: 300
      }, (err, stat) => {
        if ( err ) {
          console.log(err)
        }
        if ( stat ) {
          console.log(stat)
        }
      })
    }
  }

  function enableLinting() {
    let
      rules = webpackConfig.module.rules,
      jsxRules = rules.filter(item => item.test.toString() === '/\\.(j|t)sx?$/')

    jsxRules.forEach(jsxRule => {
      jsxRule.use = [...jsxRule.use, 'eslint-loader']
    })
  }
}