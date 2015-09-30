module.exports = (grunt) ->

    STATIC_DIR = 'static/'
    BUILD_DIR = 'build/'
    PUBLIC_DIR = 'public/'
    BOWER_DIR = "#{PUBLIC_DIR}splash/bower_components/"

    LESS_MAP = {}
    LESS_MAP["#{STATIC_DIR}splash/css/style.css"] = "#{PUBLIC_DIR}/splash/less/style.less"
    LESS_MAP["#{STATIC_DIR}css/style.css"] = "#{PUBLIC_DIR}/less/style.less"

    # Load the plugins
    (require 'load-grunt-tasks')(grunt)
    grunt.loadNpmTasks('grunt-browser-sync')

    # Project configuration.
    grunt.initConfig

        pkg: grunt.file.readJSON 'package.json'

        browserSync:
            bsFiles:
                  src: ["public/**/*.html", "public/splash/less/**/*.css", "public/splash/js/**/*.js"]
            options:
                open: true
                reloadOnRestart: true
                watchTask: true
                server:
                    baseDir: './static/'

        compress:
            main:
                options:
                    mode: 'gzip'
                expand: true
                src: ["#{STATIC_DIR}**/*.css", "#{STATIC_DIR}**/*.html", "#{STATIC_DIR}**/*.js"]

        copy:
            build:
                expand: true
                cwd: 'public/'
                src: ['js/**']
                dest: BUILD_DIR
            production:
                expand: true
                cwd: 'public/'
                src: [
                    'css/**'
                    'fonts/**'
                    'img/**'
                    'index.html'
                    'maintenance.html'
                    'robots.txt'
                    'js/libs/almond.js'
                    'favicon.png'
                    'splash/img/**'
                    "#{BOWER_DIR}bootstrap/fonts"
                ]
                dest: STATIC_DIR

        imagemin:
            production:
                files: [{
                    expand: true
                    cwd: "#{PUBLIC_DIR}splash/img"
                    src: ['**/*.{png,jpg,gif}']
                    dest: "#{STATIC_DIR}splash/img"
                }]

        less:
            production:
                files: LESS_MAP
            development:
                files: LESS_MAP
                options:
                    sourceMap: true
                    sourceMapURL: 'style.css.map'
            options:
                paths: ["#{BOWER_DIR}bootstrap/less"]

        uglify:
            splash_head:
                mangle: true
                src: [
                    "#{BOWER_DIR}/Detect.js/detect.js"
                    "#{PUBLIC_DIR}splash/js/ua.js"
                ]
                dest: "#{STATIC_DIR}splash/js/head.js"
            splash_main:
                mangle: true
                src: [
                    "#{BOWER_DIR}jquery/dist/jquery.js"
                    "#{BOWER_DIR}ScrollMagic/scrollmagic/uncompressed/ScrollMagic.js"
                    "#{BOWER_DIR}typed.js/js/typed.js"
                    "#{PUBLIC_DIR}splash/js/fx.js"
                ]
                dest: "#{STATIC_DIR}splash/js/main.js"

        watch:
            splash:
                files: ['public/*.html', 'public/splash/js/*.js']
                tasks: ['uglify:splash_head', 'uglify:splash_main', 'copy']
            scripts:
                files: ['public/**/*.less']
                tasks: ['less:development']
                options:
                    interrupt: true

    # Production tasks
    grunt.registerTask 'production-build', ['copy:build']
    grunt.registerTask 'production', ['less:production', 'copy:production', 'imagemin', 'uglify:splash_head', 'uglify:splash_main', 'production-build', 'compress']

    # Default task
    grunt.registerTask 'development', ['less:development', 'uglify:splash_head', 'uglify:splash_main', 'copy']
    grunt.registerTask 'default', ['development', 'browserSync', 'watch' ]
