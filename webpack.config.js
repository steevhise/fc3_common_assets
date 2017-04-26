var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/assets/js/main.js',
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, 'public/assets/js')
    },
    module: {
        rules:[
            {
                test: /\.(js)$/, exclude: /(node_modules)/, loader: "babel-loader",
                options: {
                    presets: ['es2015'],
                    plugins: [require('babel-plugin-transform-class-properties')]
                }
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
    ]
};
