const Path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/assets/js/main.js',
    output: {
        filename: 'js/main.bundle.js',
        path: Path.resolve(__dirname, 'public/assets')
    },
    module: {
        rules:[
            {
                test: /\.vue$/,
                // exclude: /(node_modules)/,
                loader: 'vue-loader'
            },
            {
                test: /\.(js)$/,
                // exclude: /(node_modules)/,
                loader: 'babel-loader',
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
            { from: './node_modules/@freecycle/fc3_common_assets/src/images', to: './images' },
            { from: './node_modules/@freecycle/fc3_common_assets/src/scss', to: '../../build/scss' }
            // { from: './node_modules/@freecycle/fc3_common_assets/src/views', to: '../../build/views' }

        ], {
            copyUnmodified: true,
            debug: 'warning'
        }),
        new ExtractTextPlugin({
            filename: '../../public/assets/css/main.css',
            disable: false
        })
    ]
};
