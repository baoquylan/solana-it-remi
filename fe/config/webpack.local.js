const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
const { merge } = require('webpack-merge');
const  {DefinePlugin}  = require("webpack");

const devConfig = {
  entry: path.join(__dirname, '../src/index.tsx'),
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    port: 3011,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
    }),
    new DefinePlugin({
      'process.env.MintPublicKey': JSON.stringify('FCn9B1uTEsVevM89NCsJPvvcKwSpRrFCXSkYedSkje4U'),
      'process.env.OwnerAccount': JSON.stringify('EJ8gucJAZxA1LspjGMNYBWsXUSYpimSg6UW99QHPBMAL'),
      'process.env.EnvType': JSON.stringify('localhost')
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
