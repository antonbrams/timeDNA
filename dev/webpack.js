
const webpack = require('webpack')
const ip	  = require('ip')
const fs	  = require('fs')

let config = {
	output    : {filename : '[name]'},
	devtool : 'source-map',
	module  : {
		loaders	: [
			// coffee
			{
				test     : /\.(coffee)$/,
				loader   : 'coffee-loader',
				exclude	 : /node_modules/
			},
			// es6
			{
				test	: /\.(js)$/,
				loader	: 'babel-loader',
				query	: {presets: ["es2015"]},
				exclude	: /node_modules/
			},
			// sass
			{
				test    : /\.(sass)$/,
				loaders : ['style-loader', 'css-loader', 'sass-loader?sourceMap'],
				exclude	: /node_modules/
			},
			{
				test: /\.(ttf|svg)$/,
				loader: 'file-loader?name=./graphic/[name].[ext]'
			},
			{
				test: /\.(jpg|png|svg)$/, 
				loader: 'url-loader'
			}
		]
	},
	/*resolve : {
		alias : {
			fw : '/Users/antonkluev/Desktop/Dev/web/libs/fw/src/'
		}
	}*/
	plugins : []
}

module.exports = env => {
	if (env.target == 'client') {
		config.entry = {'./client/build/index.js' : './client/src/index.js'}
		if (env.mode == 'watch') Object.assign(config, {
			devServer : {
				contentBase : './',
				stats       : 'errors-only',
				inline      : true,
				hot         : true,
				port        : 8000
			},
			plugins : [
				new webpack.HotModuleReplacementPlugin(),
				new webpack.ExternalsPlugin('commonjs', ['electron'])
			]
		})
		if (0) config.devServer.host = ip.address()
		if (env.mode == 'build') config.plugins.push(
			new webpack.ExternalsPlugin('commonjs', ['electron']))
	}

	else if (env.target == 'server') {
		config.entry = {'./server/build/index.js' : './server/src/index.js'}
		if (env.mode == 'watch') Object.assign(config, {
			watch : true
		})
		var modules = {}
		fs.readdirSync('node_modules')
			.filter(x => ['.bin'].indexOf(x) === -1)
		  	.forEach(mod => modules[mod] = `commonjs ${mod}`)
		Object.assign(config, {
			target    : 'node',
			externals : modules
		})
	}

	if (env.mode == 'build') config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			output    : {comments : false},
			sourceMap : true
		}))

	if (env.target == 'lib') config.output = {
		filename      : '[name]',
		libraryTarget : 'umd',
		library       : 'fw'
	}
	return config
}
