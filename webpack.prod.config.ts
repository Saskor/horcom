import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const config: Configuration = {
  stats: "detailed",
  mode: "production",
  entry: { main: "./src/index.tsx" },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    publicPath: ""
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript"
              ],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-export-default-from",
                [ "@babel/plugin-proposal-decorators", { legacy: true } ],
                [
                  "@babel/plugin-transform-runtime",
                  {
                    regenerator: true
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[hash:base64:5]"
              }
            }
          },
          {
            // Compiles Sass to CSS
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [ "file-loader" ]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: [ "file-loader" ]
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js", ".css", ".scss" ],
    modules: [ path.resolve(__dirname, "src"), "node_modules" ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css"
    }),
    new HtmlWebpackPlugin({
      publicPath: "./",
      template: "src/index.html"
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false
    }),
    new ESLintPlugin({
      extensions: [ "js", "jsx", "ts", "tsx" ]
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: "all"
    }
  }
};

export default config;
