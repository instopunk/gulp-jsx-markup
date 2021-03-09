const
  gutil = require('gulp-util'),
  ReactDOMServer = require('react-dom/server')

module.exports = class WebpackHtmlPlugin {
  constructor (options) {
    this.options = {
      ...{
        doctype: ''
      },
      ...options
    }
  }

  apply (compiler) {
    compiler.hooks.emit.tap('WebpackHtmlPlugin', (compilation) => {
      const assets = compilation.getAssets()
      assets.forEach(asset => {
        try {
          const
            source = asset.source.source(),
            ev = eval(source),
            result = this.options.doctype + ReactDOMServer.renderToStaticMarkup(ev.default())

          compilation.assets[asset.name] = {
            source: () => result,
            size: () => result.length
          }

          gutil.log('[webpack]', `${asset.name} done`)
        } catch ( err ) {
          console.log(err)
        }
      })
    })
  }
}