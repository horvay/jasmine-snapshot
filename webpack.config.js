/*global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'jasmine-snapshot';

let plugins = [], outputFile;

if (env === 'build')
{
	plugins.push(new UglifyJsPlugin({ minimize: true }));
	outputFile = libraryName + '.min.js';
} else
{
	outputFile = libraryName + '.js';
}

const config = {
	entry: __dirname + '/src/index.ts',
	devtool: 'source-map',
	output: {
		path: __dirname + '/lib',
		filename: outputFile,
		library: libraryName,
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		modules: [path.resolve('./src'), path.resolve('./node_modules')],
		extensions: ['.json', '.js', '.ts']
	},
	plugins: plugins,
	externals: {
		vkbeautify: 'vkbeautify',
		difflib: 'difflib'
	}
};

module.exports = config;
