/*
 * grunt-contrib-haml
 *
 * Copyright (c) 2012 Concordus Applications
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('haml', 'Compile Haml files into JavaScript', function() {
    var path = require('path');

    var helpers = require('grunt-contrib-lib').init(grunt);

    var options = helpers.options(this, {
      basePath: false
    });

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var basePath;
    var newFileDest;

    var srcFiles;
    var srcCompiled;
    var taskOutput;

    this.files.forEach(function(file) {
      file.dest = path.normalize(file.dest);
      srcFiles = grunt.file.expandFiles(file.src);

      if (srcFiles.length === 0) {
        grunt.log.writeln('Unable to compile; no valid source files were found.');
        return;
      }

      taskOutput = [];

      srcFiles.forEach(function(srcFile) {
        srcCompiled = compileHaml(srcFile, options);

        if (helpers.isIndividualDest(file.dest)) {
          basePath = helpers.findBasePath(srcFiles, options.basePath);
          newFileDest = helpers.buildIndividualDest(file.dest, srcFile, basePath, options.flatten);

          grunt.file.write(newFileDest, srcCompiled || '');
          grunt.log.writeln('File ' + newFileDest.cyan + ' created.');
        } else {
          taskOutput.push(srcCompiled);
        }
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join('\n') || '');
        grunt.log.writeln('File ' + file.dest.cyan + ' created.');
      }
    });
  });

  var compileHaml = function(srcFile, options) {
    options = grunt.util._.extend({filename: srcFile}, options);
    delete options.basePath;
    delete options.flatten;

    var srcCode = grunt.file.read(srcFile);

    try {
      var hamlc = require('haml-coffee');
      return hamlc.template(srcCode, 'haml', 'this._template', options);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('Haml failed to compile.');
    }
  };
};
