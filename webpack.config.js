module.exports = {
  context: __dirname + '/src',
  entry: '',
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {

    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-optional-chaining'
              ]
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              'parser': 'babel-eslint',
              'extends': 'plugin:react/recommended',
              'settings': {
                'react': {
                  'version': '16.13'
                }
              },
              'rules': {
                'no-unused-vars': 'warn',
                'react/no-deprecated': 'warn',
                'react/prop-types': 'warn',
                'react/no-find-dom-node': 'warn'
              }
            }
          }
        ]
      }
    ]

  }
};
