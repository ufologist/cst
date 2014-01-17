/**
 * Gruntfile模版文件
 *
 * 测试了很多grunt task
 */

 // "devDependencies": {
 //     "grunt": "~0.4.2",
 //     "grunt-contrib-concat": "~0.3.0",
 //     "grunt-contrib-uglify": "~0.2.7",
 //     "grunt-contrib-jshint": "~0.7.2",
 //     "grunt-contrib-watch": "~0.5.3",
 //     "grunt-contrib-htmlmin": "~0.1.3",
 //     "grunt-contrib-imagemin": "~0.5.0",
 //     "grunt-contrib-connect": "~0.6.0",
 //     "grunt-contrib-cssmin": "~0.7.0",
 //     "connect-livereload": "~0.3.2",
 //     "load-grunt-tasks": "~0.2.1"
 // }

module.exports = function(grunt) {
    // load all grunt tasks matching the `grunt-*` pattern
    // 不用一个个grunt.loadNpmTasks了
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // Task configuration.
        watch: { // Task
            options: { // Task level options
                livereload: true // enabled a live reload server
                                 // You'll be able to access the live reload script.
                                 // <script src="//localhost:35729/livereload.js"></script>
                                 // 注意: 访问的文件必须是HTML, 才能插入livereload.js
                                 // 验证livereload是否生效: 看下livereload.js是否被插入到DOM中
                                 // 有了这个后, 你可以和F5(包括node下单独的F5组件) say goodbye了
            },
            livereload: { // Target(watch:livereload)
                files: ['assets/**/*.{html,css,js}']
            }
        },
        connect: { // http://localhost:8000
            server: {
                options: {
                    base: 'assets/www',
                    // keepalive: true, // 集成watch livereload后本身就会一直挂起, 不需要这个了
                    middleware: function(connect, options) {
                        // Connect middleware to inject the livereload script tag into your page
                        // http://blog.csdn.net/xiongzhengxiang/article/details/12843615
                        // http://bluesdream.com/blog/grunt-plugin-livereload-wysiwyg-editor.html
                        return [
                            require('connect-livereload')({
                                port: 35729 // watch livereload default port
                            }),
                            // Serve static files.
                            connect.static(options.base),
                            // Make empty directories browsable.
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        },


        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['assets/www/lib/**/*.js', 'assets/www/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                noarg: true,
                sub: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['assets/www/*.js']
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/cst.html': 'assets/www/cst.html' // 'destination': 'source'
                }
            },
            dev: {
                files: {
                    'dist/index.html': 'src/index.html',
                    'dist/contact.html': 'src/contact.html'
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'assets', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'dist/' // Destination path prefix
                }]
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    'dist/min.css': ['assets/www/*.css']
                }
            }
        },
        requirejs: {
          compile: {
            options: {
              preserveLicenseComments: false,
              mainConfigFile: 'js/main.js',
              name: 'main',
              out: 'main-all.js'
            }
          }
        }
    });

    // Default task.
    // grunt.registerTask('default', ['connect', 'watch']);
    grunt.registerTask('server', ['connect', 'watch']);
};