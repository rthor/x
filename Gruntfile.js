module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        uglify: {
            build: {
                files: { 'x.min.js': ['x.js'] }
            }
        }
    });
    grunt.registerTask('default', ['uglify']);
};