const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/app.ts",
  mode: "development",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyPlugin({
        patterns: [
          { from: "./src/templates", to: "templates" },
          { from: "./src/static/images", to: "images" },
          { from: "./src/static/fonts", to: "fonts" },
          { from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "scripts" },
          { from: "./node_modules/chart.js/dist/chart.umd.js", to: "scripts" },
          { from: "./node_modules/chart.js/dist/chart.js", to: "scripts" },
          { from: "./node_modules/@kurkle/color/dist/color.esm.js", to: "scripts" },
          { from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css" },
          { from: "./src/styles", to: "css" },
        ],
      }),
  ],
};
