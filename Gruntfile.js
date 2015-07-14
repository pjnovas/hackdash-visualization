'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! \n* <%= pkg.title || pkg.name %> - v<%= pkg.version %>' +
            '\n* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> ' +
            '\n* <%= pkg.homepage ? pkg.homepage : "" %> ' +
            '\n*/ \n\n',

    browserify: {
      all: {
        options:{
          banner: '<%= banner %>',
          extension: [ '.js' ],
          transform: [
            [ 'babelify'/*, { 'stage': 2 }*/ ],
            [ "hbsfy", { "extensions": [ "hbs" ] } ],
          ],
          watch: true,
          keepAlive: true
        },
        src: ['src/index.js'],
        dest: 'js/<%= pkg.name %>.js'
      }
    },

  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.registerTask("default", "browserify");

};
