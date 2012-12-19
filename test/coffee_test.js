/*
 * grunt-contrib-haml
 *
 * Copyright (c) 2012 Concordus Applications
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt');
var fs = require('fs');

exports.coffee = {
  compile: function(test) {

    var targets          = ['js', 'html'];
    var inputVariations  = {'js': ['', '_amd'], 'html': ['']};
    var languages        = ['coffee', 'js'];
    var outputVariations = ['haml', 'concat'];

    test.expect(
      languages.length *
      outputVariations.length *
      grunt.util._(inputVariations).values().reduce(function(sum, value) {
        return sum + value.length;
      }, 0)
    );

    var actual   = null, expected  = null,
        target   = null, language  = null,
        name     = null, inputVariation = null,
        outputVariation = null;

    for (var i = 0; i < targets.length; i++) {
      target = targets[i];
      for (var j = 0; j < languages.length; j++) {
        language = languages[j];
        for (var m = 0; m < outputVariations.length; m++) {
          outputVariation = outputVariations[m];
          for (var n = 0; n < inputVariations[target].length; n++) {
            inputVariation = inputVariations[target][n];
            name = language + '_' + target + inputVariation;
            name += '/' + outputVariation + '.' + target;
            actual = grunt.file.read('tmp/' + name);
            expected = grunt.file.read('test/expected/' + name);
            test.equal(actual, expected,
              'should compile haml on ' + language + ' to ' + target);
          }
        }
      }
    }

    test.done();
  }
};
