const Path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: 'css/main.css',
    allChunks: true
    // disable: process.env.NODE_ENV === 'development'
});

module.exports = {
    context: Path.resolve(__dirname, './src/'),
    entry: ['./js/main.js'],
    output: {
        filename: 'js/main.bundle.js',
        //filename: '[path]/main.bundle.[name]',
        path: Path.resolve(__dirname, 'public/assets/')
    },
    module: {
        rules:[
            {
                test: /\.vue$/, exclude: /(node_modules)/, loader: 'vue-loader'
            },
            {
                test: /\.(js)$/, exclude: /(node_modules)/, loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                    plugins: [require('babel-plugin-transform-class-properties')]
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new Webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new Webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new CopyWebpackPlugin([
          { from: 'images', to: './images' },
          { from: 'scss', to: '../../build/scss' },
          { from: 'views', to: '../../build/views' }     // partials and icons
        ], {
            copyUnmodified: true,
            debug: 'warning'
        })
    ]
};
