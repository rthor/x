module.exports = function (grunt) {
	var banner = '/** \n' +
				' * X.js - <%= pkg.version %>\n' +
				' * <%= pkg.description %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Licensed under the MIT license.\n' +
				' * Copyright (c) 2014 <%= pkg.author.name %>\n' +
				' * <%= pkg.author.url %>\n' +
				' */\n';

	var files = [
		'src/intro.js',
		'src/helper.js',
		'src/events.js',
		'src/model.js',
		'src/collection.js'
	];

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		wrap: {
			advanced: {
				src: 'build/x.js',
				dest: 'build/x.js',
				options: {
					seperator: '\n',
					indent: '\t',
					wrapper: [banner + '(function() {', '})();']
				}
			}
		},
		concat: {
			basic: {
				options: {
					separator: '\n\n'
				},
				files: {
					'build/x.js': files
				}
			}
		},
		jshint: {
			all: ['Gruntfile.js', 'src/*.js', 'build/x.js']
		},
		trimtrailingspaces: {
			main: {
				src: ['build/x.js'],
				filter: 'isFile',
				encoding: 'utf8'
			}
		},
		uglify: {
			basic: {
				options: {
					banner: banner
				},
				files: {
					'build/x.min.js': 'build/x.js'
				}
			},
			npm: {
				options: {
					banner: 'var $=require(\'jquery/dist/jquery\')(window),_=require(\'underscore\');\n'
				},
				files: {
					'build/x.npm.js': ['build/x.js']
				}
			},
			test: {
				options: {
					banner: 'var $=require(\'jquery/dist/jquery\')(require("jsdom").jsdom().createWindow()),_=require(\'underscore\');\n'
				},
				files: {
					'build/x.test.js': ['build/x.js']
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-wrap');
	grunt.loadNpmTasks('grunt-trimtrailingspaces');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// Default task(s).
	grunt.registerTask('default', [
		'concat',
		'wrap',
		'trimtrailingspaces',
		'uglify:basic',
		'uglify:npm',
		'uglify:test',
		'jshint'
	]);
};