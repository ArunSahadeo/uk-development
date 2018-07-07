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
	scriptDir = './assets/js',
	styleDir = './assets/scss'
;

// Define paths

const paths = {
	scripts: [
		nodeDir + '/leaflet/dist/leaflet.js',
		scriptDir + '/event-bus.js',
		scriptDir + '/leaflet-maps.module.js',
		scriptDir + '/geocoding.module.js',
		scriptDir + '/geolocation.module.js',
		scriptDir + '/click-events.module.js',
		scriptDir + '/service-worker.module.js',
		scriptDir + '/app.js'
	],

	serviceWorker: [
		scriptDir + '/service-worker.js'
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
		'service-worker.js': paths.serviceWorker,
		'scripts.min.js': paths.scripts,
		'vendor': paths.vendorCSS,
		'styles': paths.styles
	},

	output: {
		filename: '[name]',
		path: dist
	},

	module: {
		rules: [
			{
				test: /\.js(x)?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
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
				test: /\.(gif|png|jpe?g|svg|ttf)$/,
				//use: 'file-loader'
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]'
					}
				}]
			},
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
					dist + '/*'
				]
			},

			onEnd: {
				copy: [
					{ source: './assets/fonts/*', destination: dist + '/fonts' },
					{ source: './offline.html', destination: dist }
				],
				delete: [
					dist + '/styles',
					dist + '/vendor'
				]
			}
		}),
	]
};
