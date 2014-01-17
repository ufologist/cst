// 需要安装nodejs环境(加入path)
// 1. npm install  -- 安装依赖即可
// 2. grunt server -- 启动HTTP服务器(带了watch功能可自动F5)
// 3. http://localhost:8000/cst.html
// 由于没有使用index.html, 因此需要指定页面打开,
// 而且由于这个app比较特殊, 打开后会发现图片全部由于外链被屏蔽了, 这是正常现象, 不必惊慌
module.exports = function(grunt) {
    // load all grunt tasks matching the `grunt-*` pattern
    // 不用一个个grunt.loadNpmTasks了
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
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
                files: ['assets/**/*.{html,css,js}', 'assets/**/*.{gif,jpeg,jpg,png,svg,webp}']
            }
        },
        connect: { // http://localhost:8000
            server: {
                options: {
                    base: 'assets/www',
                    // keepalive: true, // 集成watch livereload后本身就会一直挂起, 不需要这个了
                    livereload: true
                }
            }
        }
    });

    // Default task.
    // grunt.registerTask('default', ['connect', 'watch']);
    grunt.registerTask('server', ['connect', 'watch']);
};