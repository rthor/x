module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        uglify: {
            build: {
                files: { 'build/x.min.js': ['build/x.js'] }
            }
        }
    });
    grunt.registerTask('default', ['uglify']);
};