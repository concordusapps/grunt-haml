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
    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = helpers.options(this);

    // Write options iff verbose.
    grunt.verbose.writeflags(options, 'Options');

    // Iterate through files.
    this.files.forEach(function(file) {
      // Ensure we have files to compile.
      if (file.src.length === 0) {
        grunt.log.writeln('Unable to compile; no valid files were found.');
        return;
      }

      // Compile each file; concatenating them into the source if desired.
      var output = [];
      file.src.forEach(function(file) {
        output.push(transpile(file, options));
      });

      // If we managed to get anything; let the world know.
      if (output.length > 0) {
        grunt.file.write(file.dest, output.join('\n') || '');
        grunt.log.writeln('File ' + file.dest.cyan + ' created.');
      }
    });
  });

  var transpile = function(name, options) {
    // Construct appropriate options to pass to the compiler
    options = _({filename: name}).extend(options);
    options = _(options).defaults({
      // Default target is javascript.
      target: 'html',

      // Default language choice to coffee-script and haml-coffee.
      language: 'js',

      // Default placement; either `amd` or `global`.
      placement: 'global',

      // Default global placement namespace to `window`.
      namespace: 'window.HAML',

      // Default hash of dependencies for AMD.
      dependencies: {}
    });

    // Read in the file
    var input = grunt.file.read(name);

    try {
      // Store the desired language.
      var language = options.language;
      var target = options.target;
      var context = options.context;
      var output = null;

      var template = options.name;
      if (template === undefined) {
        // Default template name is the basename w/o the extension.
        template = path.basename(name, path.extname(name));
      }

      // Remove options not understood by any compiler.
      delete options.language;
      delete options.target;
      delete options.name;
      delete options.context;

      switch (language) {
      case 'js':
        var haml = require('haml');

        // First pass; generate the javascript method.
        output = haml(input);

        if (target === 'html') {
          // Evaluate method with the context and return it.
          return output(context);
        } else if (target !== 'js') {
          grunt.fail.warn(
            'Target ' + target + ' is not a valid ' +
            'destination target for `haml-coffee`; choices ' +
            'are: html and js\n');
        }

        // Reduce to a true annoymous, unnamed method.
        // TODO: Push this upstream.
        output = output.toString().substring(27);
        output = 'function(locals)' + output;

        switch (options.placement) {
        case 'global':
          // Set in the desired namespace.
          output = options.namespace + "['" + template + "'] = " + output;
          output = '\n' + output + '\n';
          break;

        case 'amd':
          // Search for additional dependencies
          var lookup = /require.*?\(.*?["'](.*)["'].*?\)/g;
          var extra = lookup.exec(input);
          while (extra !== null) {
            var base = path.basename(extra[1]);
            options.dependencies[base] = extra[1];
            extra = lookup.exec(input);
          }

          // Build define statement.
          var defineStatement = 'define([';
          var modules = _(options.dependencies).values();
          modules = modules.length ? "'" + modules.join("','") + "'" : "";
          defineStatement += modules;
          defineStatement += '], function(';
          defineStatement += _(options.dependencies).keys().join(',');
          defineStatement += ') { \n';

          // Wrap ouptut in it.
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

      case 'coffee':
        var hamlc = require('haml-coffee');
        var namespace = options.namespace;

        // Remove options not understood by the compiler.
        delete options.namespace;

        switch (target) {
        case 'js':
          // Pass it off to haml-coffee to render a template in javascript.
          return hamlc.template(input, template, namespace, options);

        case 'html':
          // Pass it off to haml-coffee to render a template in javascript.
          output = hamlc.compile(input, options);

          // Now we render it as HTML with the given context.
          return output(context);

        default:
          grunt.fail.warn(
            'Target ' + target + ' is not a valid ' +
            'destination target for `haml-coffee`; choices ' +
            'are: html and js\n');
        }

        // Shouldn't be able to get here -- but just in case.
        break;

      default:
        grunt.fail.warn(
          'Language ' + language + ' is not a valid ' +
          'source language for HAML; choices are: coffee and js\n');
      }

    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('Haml failed to compile.');
    }
  };
};
