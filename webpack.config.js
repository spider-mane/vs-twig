//@ts-check

"use strict";

const webpack = require("webpack");
const path = require("path");
// @ts-ignore
const extensionPackage = require("./package.json");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  target: "node",
  entry: "./src/extension.js",
  output: {
    path: path.resolve(__dirname, "extension"),
    filename: "index.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      EXTENSION_NAME: JSON.stringify(extensionPackage.name),
      EXTENSION_VERSION: JSON.stringify(extensionPackage.version),
    }),
  ],
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode",
    // prettier: "prettier",
    // "prettier-plugin-twig-melody": "prettier-plugin-twig-melody",
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
};
