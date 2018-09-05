const path = require('path');

module.exports = {
    mode: 'development',
    // entry: ['./ts/App.ts', './sass/main.scss'],
    entry: ['./webpack.dev.js', './ts/App.ts'],
    resolve: {
        extensions: ['.webpack.js', '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: './js/celestials.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        //typescript
        rules: [
        {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        //sass/scss
        // {
        //     test: /\.scss$/,
        //     loaders: [ 'style', 'css?sourceMap', 'sass?sourceMap' ]
        // },
        //files -- requires a locator in the webpack.*.js file.
        { 
            test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.json$|\.css$|background.js$/, 
            use: [{
                loader: "file-loader",
                options: {
                    name: '[path][name].[ext]'
                }
            }]
        }
        ]
    }

    
};