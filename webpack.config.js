const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: "public/popup.html",
          to: "popup.html",
          transform(content) {
            // Update script path for dev server
            return content.toString().replace(
              '<script src="popup.js"></script>',
              '<script src="/popup.js"></script>'
            );
          }
        },
        { from: "public/icons", to: "icons" },
        { 
          from: "manifest.json",
          to: "manifest.json",
          transform(content) {
            const manifest = JSON.parse(content);
            manifest.action.default_popup = "popup.html";
            manifest.action.default_icon = {
              "16": "icons/icon16.png",
              "48": "icons/icon48.png",
              "128": "icons/icon128.png"
            };
            manifest.icons = manifest.action.default_icon;
            return JSON.stringify(manifest, null, 2);
          }
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
    port: 3000,
    devMiddleware: {
      writeToDisk: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
};
