module.exports = function (grunt) {
    'use strict';

    var fullBanner = [
        '/*!\n',
        ' * CrossXHR v<%= pkg.version %>\n',
        ' *\n',
        ' * Date: <%= grunt.template.today("yyyy-mm-dd") %>\n',
        ' */\n\n'].join('');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: fullBanner
            },
            dist: {
                dest: "dist/<%= pkg.name %>-<%= pkg.version %>.js",
                src: [
                    "vendor/swfobject/swfobject/src/swfobject.js",
                    "crossxhr.js"
                ]
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        uglify: {
            options: {
                mangle: false,
                banner: fullBanner
            },
            sdk: {
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.name %>-<%= pkg.version %>.js']
                }
            }
        },
        jshint: {
            before: ['crossxhr.js'],
            after: ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
        },
        watch : {
            files: 'crossxhr.js',
            tasks: ['min']
        },
        compress: {
            pkg: {
                options: {
                    archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [
                    {
                        expand:true,
                        dot:false,
                        flatten:true,
                        src: ['dist/**'],
                        dest: 'src/'
                    },
                    {
                        expand:true,
                        dot:false,
                        flatten:false,
                        cwd: 'examples/dist/',
                        src: ['**'],
                        dest:'example/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('deps',  ['uglify:deps'])
    grunt.registerTask('build', ['clean:dist', 'jshint:before','concat']);
    grunt.registerTask('min',   ['build', 'uglify:sdk']);
    grunt.registerTask('pkg',   ['buildExample', 'min', 'compress:pkg']);
};
