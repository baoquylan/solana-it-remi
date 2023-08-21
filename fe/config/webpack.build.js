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
      'process.env.MintPublicKey': JSON.stringify('2Rb6EWDG4peN1GwZqB24Ky6SebRCQjZWiNcHuStHzWVu'),
      'process.env.OwnerAccount': JSON.stringify('EJ8gucJAZxA1LspjGMNYBWsXUSYpimSg6UW99QHPBMAL'),
      'process.env.EnvType': JSON.stringify('testnet')
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
