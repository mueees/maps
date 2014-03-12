module.exports = function(grunt) {


  // Project configuration.
  grunt.initConfig({

    // Configuration to be run (and then tested).
    stylus: {
	  compile: {
		options: {
		  compress: false
		},
		files: {
		  'css/style.css': 'stylus/style.styl'
		}
	  }
	},
	watch: {
		stylus: {
			files: 'stylus/*.styl',
			tasks: ['stylus']
		}
	}
	
  });

	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['watch']);

};
