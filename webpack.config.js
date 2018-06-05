const Path = require('path');
const Webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

//const devMode = true;

module.exports = {
    mode: 'development',
    entry: './src/assets/js/main.js',
    optimization: {
        minimize: false
    },
    devtool: 'eval-source-map',
    output: {
        filename: 'js/main.bundle.js',
        path: Path.resolve(__dirname, 'public/assets')
    },
    module: {
        rules:[
            {
                test: /\.vue$/,
                // exclude: /(node_modules)/,
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
                test: /\.scss$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    //{ loader: 'style-loader' },
                    { loader: 'vue-style-loader' },
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 }
                    },
                    'postcss-loader',     // we supposedly need this because of scoped css
                    'sass-loader'
                ]
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
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new VueLoaderPlugin()
            // no options, i guess.
    ]
};
