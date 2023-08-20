module.exports = {
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
          },
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.(css|s[ac]ss)$/i,
            use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
          },
        //   {
        //     test: /\.json$/,
        //     exclude: /(node_modules)/,
        //     loader: "json-loader"       
        // }
        ],
      },
      resolve: {
        fallback: { "assert": false },
        extensions: [
          '.jsx',
          '.js',
          '.json',
          '.css',
          '.scss',
          '.jpg',
          '.jpeg',
          '.png',
          '.ts',
          '.tsx',
        ],
      },
};
