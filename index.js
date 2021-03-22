const
  webpack = require('webpack'),
  through = require('through2'),
  ReactDOMServer = require('react-dom/server'),
  replaceExt = require('replace-ext'),
  path = require('path'),
  gutil = require('gulp-util'),
  notifier = require('node-notifier'),
  MemoryFs = require('memory-fs')

let
  webpackConfig = require('./webpack.config.js'),
  statsLog = {
    colors: true,
    reasons: true
  }

const changeExtension = (filePath) => {
  if ( path.extname(filePath) ) {
    return replaceExt(filePath, '.html')
  } else {
    return filePath;
  }
}

module.exports = ( config ) => {
  const parameters = {
    ...{
      doctype: '<!doctype html>\n',
      linting: false,
      pageProps: {}
    },
    ...config
  }

  webpackConfig = {
    ...webpackConfig,
    mode: 'development'
  }

  if(parameters.linting){
    let
      rules = webpackConfig.module.rules,
      jsxRule = rules.filter(item => item.test.toString() === '/\\.(j|t)sx?$/')

    if(jsxRule.length){
      jsxRule = jsxRule[0]
      jsxRule.use = [...jsxRule.use, 'eslint-loader']
    }
  }

  return through.obj(function(file, encoding, callback) {
    webpackConfig = {
      ...webpackConfig,
      entry: file.path
    }

    const compiler = webpack(webpackConfig)

    const onComplete = (error, stats) => {
      if ( error ) {
        onError(error);
      } else if ( stats.hasErrors() ) {
        onError(stats.toString(statsLog));
      } else {
        onSuccess(stats.compilation.warnings.map(warn => warn.warning))
      }
    }

    const onError = (error) => {
      let formatedError = new gutil.PluginError('webpack', error);
      notifier.notify({
        title: `Error: ${formatedError.plugin}`,
        message: formatedError.message
      });
      callback(formatedError);
    }
    const onSuccess = (info) => {
      if(info.length)
        gutil.log('[webpack]', info);

      try {
        const template = compiler.outputFileSystem.readFileSync(path.join(compiler.options.output.path, 'bundle.js')).toString()
        const ev = eval(template)
        const result = parameters.doctype + ReactDOMServer.renderToStaticMarkup(ev.default(parameters.pageProps))

        file.contents = new Buffer.from(result)
        file.path = changeExtension(file.path)
        this.push(file)
        callback()
      }
      catch ( e ) {
        gutil.log('[webpack]', e)
        callback()
      }
    }

    compiler.outputFileSystem = new MemoryFs()
    compiler.run(onComplete)
  });
}