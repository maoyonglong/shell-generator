
// set env in top
process.env.NODE_ENV = 'development'

const webpackBaseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');

module.exports = merge(webpackBaseConfig, {
	// 起本地服务
	devServer: {
		contentBase: './dist/',
		historyApiFallback: true,
		inline: true,
		hot: true,
		host: '127.0.0.1',
		before(_, server) {
			server._watch(__dirname + '/src')
		}
	}
})
