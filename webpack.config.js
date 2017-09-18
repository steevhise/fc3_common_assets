const Path = require('path');
const Webpack = require('webpack');

/*const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    disable: process.env.NODE_ENV === 'development'
});*/

module.exports = {
    context: Path.resolve(__dirname, './src/'),
    entry: {
        js: './js/main.js',
        images: 'images' //,
        // css: './scss'  //,
      //partials: 'views/partials',
      //icons: 'views/icons'
    },
    output: {
        filename: 'js/main.bundle.js',
        path: Path.resolve(__dirname, 'public/assets')
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
                test: /\.(png|jpg|gif)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // name: [path][name].[ext],
                            outputPath: 'images/'
                        }
                    }
                ]
            } //,
            /*{
                test: /\.scss$/,
                exclude: /(node_modules)/,
                use: extractSass.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }],
              // use style-loader in development
                    fallback: 'style-loader'
                })
            }*/


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
        })   //,
        // extractSass
    ]
};
