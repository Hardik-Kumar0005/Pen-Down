module: {
    rules: [
      { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // custom loader added by me and installed using npm i file-loader
      {
        test: /\.(gif|svg|jpg|png)$/,  // add whatever files you wanna use within this regEx
        use: ["file-loader"]
      }

    ],

// other boilerplate config goes down here
"scripts": {
  "build": "webpack --config prod.config.js"
}
