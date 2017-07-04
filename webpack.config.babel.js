/**
 *  @fileOverview Webpack configuration file.
 *  @author       Vasiliy Shilov (shcoder.ru@ya.ru)
 */

/**
 * Module dependencies.
 * @private
 */
import path from 'path';
import webpack from 'webpack';

/**
 * Module constants.
 * @private
 */
const isProd = process.argv.indexOf('-p') > -1;
const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');

let plugins = isProd ? [
    new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: true,
        include: ['fluxtor.min']
    })
] : [];

/**
 * Webpack configuration
 * @module WebpackConfigBabel
 */
export default {
    devtool: isProd ? false : 'source-map',
    context: srcDir,
    entry: {
        'fluxtor-client': './fluxtor.js',
    },
    output: {
        filename: '[name].' + (isProd ? 'min.' : '') + 'js',
        path: distDir,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            }
        ]
    },
    plugins: plugins,
    resolve: {
        extensions: ['.js']
    }
};
