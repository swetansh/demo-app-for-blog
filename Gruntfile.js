module.exports = function (grunt) {
	'use strict';

	var port = grunt.option('port') || 9001,
		lrPort = grunt.option('lr-port') || 35729,
		hostname = 'localhost',
		baseFolder = '.';

	// Display the elapsed execution time of grunt tasks
	require('time-grunt')(grunt);
	// Lazy load all Grunt tasks
	require('jit-grunt')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Find available port in range
		portPick: {
			options: {
				limit: 20
			},
			localServer: {
				options: {
					port: port
				},
				targets: ['connect.server.options.port']
			},
			LiveReload: {
				options: {
					port: lrPort,
					// Needed since Watch is being reset every time
					name: 'port-pick-livereload'
				},
				targets: [
					'watch.options.livereload',
					'connect.server.options.livereload'
				]
			}
		},
		// Trigger relevant tasks when the files they watch has been changed
		// This includes adding/deleting files/folders as well
		watch: {
			// Will try to connect to a LiveReload script
			options: {
				livereload: '<%= grunt.config.get("port-pick-livereload") %>'
			},
			configs: {
				options: {
					reload: true
				},
				files: ['Gruntfile.js', 'package.json']
			},
			app: {
				files: [
					'app/**/*',
					'css/**/*.css',
					'lib/**/*',
					'index.html'
				]
			}
		},
		// Setup a local server (using Node) with LiveReload enabled
		connect: {
			server: {
				options: {
					port: port,
					base: {
						path: baseFolder,
						options: {
							index: ['index.html']
						}
					},
					hostname: hostname,
					livereload: lrPort,
					open: true
				}
			}
		}
	});

	// Open local server and watch for file changes
	grunt.registerTask('serve', ['portPick', 'connect', 'watch']);

	// Default task(s).
	grunt.registerTask('default', ['serve']);
};
