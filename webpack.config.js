const Path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: Path.resolve(__dirname, './src/'),
    entry: './js/main.js',
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
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
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
            { from: 'images', to: './images' }
        ], {
            copyUnmodified: true,
            debug: 'warning'
        }),
        new ExtractTextPlugin({
            filename: 'css/main.css',
            disable: false
        })
    ]
};
