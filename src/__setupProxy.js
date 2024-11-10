const proxy = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/api/*',
		proxy({
			target: 'https://kai9.com:9444',
			changeOrigin: true,
		})
	);
};