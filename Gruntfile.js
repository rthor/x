module.exports = function (grunt) {
	var banner = '/** \n' +
				' * X.js - <%= pkg.version %>\n' +
				' * <%= pkg.description %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Licensed under the MIT license.\n' +
				' * Copyright (c) 2013 <%= pkg.author.name %>\n' +
				' * <%= pkg.author.url %>\n' +
				' */\n';

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
			options: {
				separator: '\n\n'
			},
			dist: {
				files: {
					'build/x.js': [
						'src/intro.js',
						'src/helper.js',
						'src/events.js',
						'src/model.js',
						'src/collection.js'
					]
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
			options: {
				banner: banner
			},
			dist: {
				files: {
					'build/x.min.js': 'build/x.js'
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
	grunt.registerTask('default', ['concat', 'wrap', 'trimtrailingspaces', 'uglify', 'jshint']);
};