/*
 * grunt-contrib-haml
 *
 * Copyright (c) 2012 Concordus Applications
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var _    = grunt.util._;

  grunt.registerMultiTask('haml', 'Compile Haml files', function() {
    // Set the target options with some defaults.
    var options = this.options({
      // Default target is javascript.
      target: 'html',

      // Default language choice to coffee-script and haml-coffee.
      language: 'js',

      // Default placement; either `amd` or `global`.
      placement: 'global',

      // Default global placement namespace to `window`.
      namespace: 'window.HAML',

      // Default hash of dependencies for AMD.
      dependencies: {},

      // External haml command to execute, must accept STDIN
      rubyHamlCommand: 'haml -t ugly'
    });

    // Write options iff verbose.
    grunt.verbose.writeflags(options, 'Options');

    // Transpile each src/dest group of files.
    this.files.forEach(function(file) {

      // Get only files that are actually there.
      var validFiles = file.src.filter(function(filepath) {
        if (grunt.file.exists(filepath)) {
          return true;
        } else {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
      });

      // Ensure we have files to transpile.
      if (validFiles.length > 0) {
        // Transpile each file.
        var output = validFiles.map(function (filename) {
          return transpile(filename, options);
        });
        // Write the new file.
        grunt.file.write(file.dest, output.join('\n'));
        grunt.log.writeln('File ' + file.dest.cyan + ' created.');
      } else {
        grunt.log.writeln('Unable to compile; no valid files were found.');
      }
    });
  });

  var transpile = function(name, opts) {
    // Construct appropriate options to pass to the compiler
    // Create a new object so we do not mutate the target options.
    var options = _.extend({filename: name}, opts);
    // Read in the file
    options.input = grunt.file.read(name);

    // Ensure we have a template name.
    if (options.name === undefined) {
      // Default template name is the basename w/o the extension.
      options.name = path.basename(name, path.extname(name));
    }

    try {
      switch (options.language) {
      case 'js': return transpileJs(options);
      case 'coffee': return transpileCoffee(options);
      case 'ruby': return transpileRuby(options);
      default:
        grunt.fail.warn(
          'Language ' + options.language + ' is not a valid ' +
          'source language for HAML; choices are: coffee and js\n');
      }
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('Haml failed to compile.');
    }
  };

  var transpileJs = function(options) {
    var haml = require('haml');

    // First pass; generate the javascript method.
    var output = haml(options.input);

    if (options.target === 'html') {
      // Evaluate method with the context and return it.
      return output(options.context);
    } else if (options.target !== 'js') {
      grunt.fail.warn(
        'Target ' + options.target + ' is not a valid ' +
        'destination target for `haml-js`; choices ' +
        'are: html and js\n');
    }

    // Reduce to a true annoymous, unnamed method.
    // TODO: Push this upstream.
    output = output.toString().substring(27);
    output = 'function(locals)' + output;

    switch (options.placement) {
    case 'global':
      // Set in the desired namespace.
      output = options.namespace + "['" + options.name + "'] = " + output;
      output = '\n' + output + '\n';
      break;

    case 'amd':
      // Search for additional dependencies
      var lookup = /require.*?\(.*?["'](.*)["'].*?\)/g;
      var extra = lookup.exec(options.input);
      while (extra !== null) {
        var base = path.basename(extra[1]);
        options.dependencies[base] = extra[1];
        extra = lookup.exec(options.input);
      }

      // Build define statement.
      var defineStatement = 'define([';
      var modules = _.values(options.dependencies);
      modules = modules.length ? "'" + modules.join("','") + "'" : "";
      defineStatement += modules;
      defineStatement += '], function(';
      defineStatement += _.keys(options.dependencies).join(',');
      defineStatement += ') { \n';

      // Wrap output in it.
      output = defineStatement + 'return ' + output + ';\n});\n';
      break;

    default:
      grunt.fail.warn(
        'Placement ' + options.placement + ' is not a valid ' +
        'destination placement for `haml-js`; choices ' +
        'are: amd and global\n');
    }
    // Return the final template.
    return output;
  };

  var transpileCoffee = function(options) {
    var hamlc = require('haml-coffee');

    switch (options.target) {
    case 'js':
      // Pass it off to haml-coffee to render a template in javascript.
      return hamlc.template(options.input, options.name, options.namespace,
        options);

    case 'html':
      // Pass it off to haml-coffee to render a template in javascript.
      var output = hamlc.compile(options.input, options);
      // Now we render it as HTML with the given context.
      return output(options.context);

    default:
      grunt.fail.warn(
        'Target ' + options.target + ' is not a valid ' +
        'destination target for `haml-coffee`; choices ' +
        'are: html and js\n');
    }
  };

  var transpileRuby = function(options) {
    var execSync = require('execSync');

    if (options.context) {
      grunt.fail.warn("Context is not a valid option for `haml-ruby`");
    }

    if (options.target !== 'html') {
      grunt.fail.warn(
        'Target ' + options.target + ' is not a valid ' +
        'destination target for `haml-ruby`; choices ' +
        'are: html\n');
    }

    var p = path.resolve(options.filename);
    var result = execSync.exec(options.rubyHamlCommand + ' ' + p);
    if (result.code !== 0) {
      grunt.fail.warn(
        "Error executing haml on " + p + ": \n" +
        result.stderr + "\n" +
        result.stdout
      );
    }
    return result.stdout;
  };
};
