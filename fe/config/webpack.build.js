const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require("./webpack.common");
const  {DefinePlugin}  = require("webpack");
const { merge } = require("webpack-merge");

const prodConfig = {
  entry: path.join(__dirname, '../src/index.tsx'),
  mode: 'production',
  target: 'web',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
    }),
    new DefinePlugin({
      'process.env.MintPublicKey': JSON.stringify('2SsAM7TxVQhKU1y1LxswHtYrUB2RVueB6KrkRN67uaRx'),
      'process.env.MintPublicKey': JSON.stringify('DtKoLP7vEyMBP8muouk939yLysg4Y6kgeotkJnREKjnW'),
      'process.env.EnvType': JSON.stringify('testnet')
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
