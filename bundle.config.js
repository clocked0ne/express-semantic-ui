var fs = require('fs');

var config = {
	gulpBuildMaps: false
};

if(fs.existsSync('./config/config.js'))
	config = require('./config/config');

module.exports = {
	bundle: {
		jquery: {
			scripts: './src/js/jquery-3.0.0.min.js',
			options: {
				useMin: true,
				uglify: false,
				rev: false,
				maps: false
			}
		},
		base: {
			scripts: [
				'./src/js/jquery.toast.js',
				'./src/js/init.js',
				'./src/js/velocity.min.js',
				'./src/js/hammer.min.js',
				'./semantic/dist/semantic.min.js',
				'./src/js/semantic-ui.js'
			],
			styles: [
				'./semantic/dist/semantic.min.css',
				'./src/css/theme.css'
			],
			options: {
				useMin: true,
				uglify: true,
				minCSS: true,
				rev: true,
				maps: config.gulpBuildMaps,
				pluginOptions: {
					'gulp-clean-css': { processImport: false }
				}
			}
		}
	},
	copy: [
		{
			src: './semantic/dist/themes/**/*.*',
			base: './semantic/dist'
		}
	]
};
