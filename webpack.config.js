const Path = require('path');
const Webpack = require('webpack');

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
            },
            {    // we're just copying images into the right place
                test: /\.(png|jpg|gif)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {     // copying template partials into the right place.
                test: /\.*partials\/.*\.html$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '../../dist/views/partials/'
                        }
                    }
                ]
            },
          // TODO: icons copy
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                exclude: /(node_modules)/,
              /*  loader: ExtractTextPlugin.extract({ use: [{
                    loader: 'css-loader',
                    options: {
                        options: { minimize: false }
                    } }, {
                        loader: 'sass-loader',
                        options: {
                            minimize: false
                        }
                    }]
                })*/     // can't get this to work so just copy the scss files for hapi-sass to deal with
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '../../dist/scss/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    externals: 'fc3Images',
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
        extractSass
    ]
};
