module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    var isWin = !!process.platform.match(/^win/),

        mxmlcPath = function () {
            var mxmlc = isWin ? 'mxmlc.exe' : 'mxmlc';
            return process.env['FLEX_HOME'] + '/bin/' + mxmlc;
        };

    var fullBanner = [
        '/*!\n',
        ' * CrossXHR v<%= pkg.version %>\n',
        ' *\n',
        ' * Date: <%= grunt.template.today("yyyy-mm-dd") %>\n',
        ' */\n\n'].join('');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        build: {
            js: ['clean:js', 'jshint:before', 'concat', 'uglify:sdk'],
            swf: ['clean:swf', 'mxmlc']
        },
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
            js: {
                files: [{
                    dot: true,
                    src: [
                        'dist/*.js',
                        '!dist/.git*'
                    ]
                }]
            },
            swf: {
                files: [{
                    dot: true,
                    src: [
                        'dist/*.swf',
                        '!dist/.git*'
                    ]
                }]
            }
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
            flash: {
                output: 'dist/<%= pkg.name %>-<%= pkg.version %>.swf',
                input: 'src/actionscript/HttpRequesterManager.as'
            }
        }
    });

    grunt.registerMultiTask('mxmlc', function () {
        var done = this.async();
        grunt.util.spawn({
            cmd: mxmlcPath(),
            args: [
                this.data.input,
                '--include-libraries=src/actionscript/vendor/as3corelib.swc',
                '-compress=true',
                '-static-link-runtime-shared-libraries=true',
                '-optimize=true',
                '-strict=true',
                '-output=' + this.data.output
            ],
            grunt: false
        }, function (error, result, code) {
            grunt.log.write(result + '\n');
            grunt.log.write('Code: ' + code + '\n');
            done();
        });
    });

    grunt.task.registerMultiTask('build', function () {
        grunt.task.run(this.data);
    });

    grunt.registerTask('min',   ['build', 'uglify:sdk']);
    grunt.registerTask('pkg',   ['buildExample', 'min', 'compress:pkg']);
};
