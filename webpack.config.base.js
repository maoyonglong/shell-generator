/* eslint-disable */
const webpack = require('webpack');
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pageConfig = require('./page.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const templateParameters = require('./src/config')

let env = process.env.NODE_env;
let isDev = env === 'development';

let webpackConfig = {
	mode: env,
	// 配置入口  
	entry: {},
	// 配置出口  
	output: {
		path: path.join(__dirname, './dist/'),
		filename: 'static/js/[name].[hash:7].js',
		publicPath: '/',
	},
	// 路径配置
	resolve: {
		extensions: ['.js', '.ejs', '.json'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	// loader配置
	module: {
		rules: [
			{
				test: /\.(js)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [path.join(__dirname, './src')],
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.ejs$/,
				include: [path.join(__dirname, './src')],
				loader: 'ejs-loader',
				query: {
					variable: 'data',
					// mustache模板：
					// 具体参考lodash/underscore的template方法
					// interpolate : '\\{\\{(.+?)\\}\\}',
					// evaluate : '\\[\\[(.+?)\\]\\]'
				}
			},	
			// },
			// html中的img标签
			{
				test: /\.html$/,
				include: [path.join(__dirname, './src')],
				use: [
					'html-loader',
					{
						loader: 'html-withimg-loader',
						options: {
							limit: 10000,
							name: 'static/img/[name].[hash:7].[ext]'
						}
					}
				]
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [path.join(__dirname, './src')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'static/img/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'static/media/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'static/fonts/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev
						}
					},
					'css-loader',
					'postcss-loader'
				],
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev
						}
					},
					'css-loader',
					'less-loader'
				],
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev
						}
					},
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		// 全局引入lodash
		new webpack.ProvidePlugin({
			_: 'lodash',
			$: 'jquery',
			jQuery: 'jquery'
		}),
		//设置每一次build之前先删除dist  
		new CleanWebpackPlugin(
			['dist/*',],　     //匹配删除的文件  
			{
				root: __dirname,   //根目录  
				verbose: true,    //开启在控制台输出信息  
				dry: false     //启用删除文件  
			}
		),
		new CopyWebpackPlugin([
			// to是相对于output的，所以不是'dist/public'
			// 注： 如果使用from: 'src/public/**/'会生成src/public/**/在dist下
			{ from: 'public/**/*', to: './', context: 'src' }
		]),
		// 替代ExtractTextPlugin
		new MiniCssExtractPlugin({
			filename: 'static/css/[name].[hash:7].css'
		}),
		new MonacoWebpackPlugin()
	]
};


if (pageConfig && Array.isArray(pageConfig)) {
	pageConfig.map(page => {
		webpackConfig.entry[page.name] = `./src/${page.jsEntry}`;
		let template = path.join(__dirname, `/src/${page.html}`);
		webpackConfig.plugins.push(new HtmlWebpackPlugin({
			filename: path.join(__dirname, `/dist/${page.name}.html`),
			template,
			templateParameters,
			inject: true,
			chunks: [page.name],
			inlineSource: '.(js|css)$',
			chunksSortMode: 'dependency',
			minify: isDev ? undefined : {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			}
		}));
	});
}

module.exports = webpackConfig;
