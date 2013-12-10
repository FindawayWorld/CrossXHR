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
                    "src/javascript/crossxhr.js"
                ]
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*.js',
                        'dist/*.swf',
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
            before: ['src/javascript/crossxhr.js'],
            after: ['dist/<%= pkg.name %>-<%= pkg.version %>.js']
        },
        watch : {
            files: 'src/javascript/crossxhr.js',
            tasks: ['build']
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
        },
        mxmlc: {
            options: {
                rawConfig: '-compress=true -static-link-runtime-shared-libraries=true -optimize=true -strict=true -link-report=true'
            },
            flash: {
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.swf': ['flash_crossxhr/HttpRequesterManager.as']
                }
            }
        },
        ant: {
            flash: {
                output: 'dist/<%= pkg.name %>-<%= pkg.version %>.swf',
                input: 'src/actionscript/HttpRequesterManager.as'
            }
        }
    });

    grunt.registerMultiTask('ant', function () {
        var done = this.async();
        grunt.util.spawn({
            cmd: 'ant',
            args: ['-Doutput=' + this.data.output, '-Dinput=' + this.data.input],
            grunt: false
        }, function (error, result, code) {
            grunt.log.write(result + '\n');
            grunt.log.write('Code: ' + code + '\n');
            done();
        });
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['clean:dist', 'ant', 'jshint:before', 'concat']);
    grunt.registerTask('min',   ['build', 'uglify:sdk']);
    grunt.registerTask('pkg',   ['buildExample', 'min', 'compress:pkg']);
};
