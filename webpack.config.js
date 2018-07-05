const
	devMode = process.env.NODE_ENV != 'production',
	path = require('path'),
	dist = path.join(__dirname, 'lib', 'uk-development', 'public', 'dist'),
	FileManagerPlugin = require('filemanager-webpack-plugin'),
	MiniCSSExtractPlugin = require('mini-css-extract-plugin'),
	UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
	webpack = require('webpack')
;

// Define dirs

const
	nodeDir = './node_modules',
	publicDir = './lib/uk-development/public',
	scriptDir = './assets/js',
	styleDir = './assets/scss'
;

// Define paths

const paths = {
	scripts: [
		nodeDir + '/leaflet/dist/leaflet.js',
		scriptDir + '/event-bus.js',
		scriptDir + '/leaflet-maps.module.js',
		scriptDir + '/app.js'
	],

	vendorCSS: [
		nodeDir + '/leaflet/dist/leaflet.css'
	],

	styles: [
		styleDir + '/styles.scss'
	]
};

module.exports = {
	target: 'web',

	entry: {
		'scripts.min.js': paths.scripts,
		'vendor': paths.vendorCSS,
		'styles': paths.styles
	},

	output: {
		filename: '[name]',
		path: path.resolve(__dirname, dist)
	},

	module: {
		rules: [
			{
				test: /\.s(c|a)ss$/,
				use: [
					MiniCSSExtractPlugin.loader,
					'css-loader',
					'sass-loader'	
				],
			},
			{
				test: /\.css$/,
				use: [
					MiniCSSExtractPlugin.loader,
					'css-loader',
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/,
				use: 'file-loader'
			}
		]
	},

	optimization: {
		minimize: true,
		minimizer: [new UglifyJSPlugin({
			include: /\.min\.js$/
		})],
	},

	plugins: [
		new MiniCSSExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].css'
		}),

		new FileManagerPlugin({
			onStart: {
				delete: [
					publicDir + '/dist/*'
				]
			},

			onEnd: {
				delete: [
					publicDir + '/dist/styles',
					publicDir + '/dist/vendor'
				]
			}
		}),
	]
};
