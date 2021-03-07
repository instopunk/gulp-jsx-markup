module.exports = {
  context: __dirname + '/src',
  entry: '',
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.jsx', '.tsx', '.js']
  },

  module: {

    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining'
              ]
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-transform-typescript',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining'
              ]
            }
          }
        ]
      },
      {
        test: /\.icon\.svg$/,
        use: [
          {
            loader: "react-svg-loader",
            options: {
              jsx: false, // true outputs JSX tags
              svgo: {
                plugins: [
                  { removeTitle: true },
                  { removeViewBox: false },
                  { uniqueID: require('svgo-unique-id') }
                ]
              }
            }
          }
        ]
      }
    ]

  }
};
