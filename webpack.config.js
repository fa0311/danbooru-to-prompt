const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    main: path.join(__dirname, "src/ts/main.ts"),
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "html", to: "../html", context: "src" },
        { from: "css", to: "../css", context: "src" },
        { from: "js", to: "../js", context: "src" },
        { from: "manifest.json", to: "../", context: "src" },
        { from: "LICENCE", to: "../" },
      ],
    }),
  ],
};
