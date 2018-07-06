const Path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

//TODO: figure out minification, etc for Production

//const devMode = true;

module.exports = {
    mode: 'development',
    entry: './src/assets/js/main.js',
    optimization: {
        minimize: false
    },
    watchOptions: {
        poll: 2000,
        aggregateTimeout: 10000
    },
    stats: 'normal',
    devServer: {
        hot: true
    },
    devtool: 'cheap-module-eval-source-map',
    output: {
        filename: 'js/main.bundle.js',
        path: Path.resolve(__dirname, 'public/assets')
    },
    module: {
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    hotReload: false // disables Hot Reload
                }
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
                test: /\.scss?$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css?$/, loaders: ['style-loader', 'css-loader', 'sass-loader']
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
            minimize: false
        }),
        // for production remember to change these appropriately
        /*new Webpack.optimize.UglifyJsPlugin({
            optimization: {
                minimize: false
            },
            output: {
                beautify: true
            },
            sourceMap: true,
            extractComments: {
                removeAll: false
            },
            compress: {
                warnings: false,
                drop_console: false
            }
        }),*/
        new CopyWebpackPlugin([
            { from: './node_modules/@freecycle/fc3_common_assets/src/images', to: './images' }
            // { from: './node_modules/@freecycle/fc3_common_assets/src/scss', to: '../../build/scss' }
            // { from: './node_modules/@freecycle/fc3_common_assets/src/views', to: '../../build/views' }

        ], {
            copyUnmodified: true,
            debug: 'warning'
        }),
        /*new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),*/
        new VueLoaderPlugin()
            // no options, i guess.
    ]
};
