var path = require('path');

module.exports = function(grunt) {

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var configPath = {
        public: 'public',
        dev: 'dev'
    };


    // Project configuration.
    grunt.initConfig({

        configPath: configPath,

        clean: {
            public: '<%= configPath.public %>'
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: ['<%= configPath.dev %>/css/*'],
                        dest: '<%= configPath.public %>',
                        flatten: true
                    }
                ]
            }
        },

        // Configuration to be run (and then tested).
        stylus: {
            compile: {
                options: {
                    compress: false
                },
                files: {
                    '<%= configPath.dev %>/css/style.css': '<%= configPath.dev %>/stylus/style.styl'
                }
            }
        },
        watch: {
            stylus: {
                tasks: ['build'],
                files: ['dev/stylus/*.styl', 'dev/import/*.styl']
            }
        }

    });

    // By default, lint and run all tests.
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', [
        'clean:public',
        'stylus',
        'copy'
    ]);

};
