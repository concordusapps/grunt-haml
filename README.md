# grunt-contrib-haml

> Compile Haml files to JavaScript.

### Overview

Inside your `grunt.js` file add a section named `haml`. This section specifies
the files to compile and the options passed to the haml compiler.

> Currently only coffeescript is supported but javascript support is
> planned (see #1).

#### Parameters

##### files ```object```

This defines what files this task will process and should contain
key:value pairs.

The key (destination) should be an unique filepath (supports [grunt.template][])
and the value (source) should be a filepath or an array of filepaths
(supports [minimatch][].

As of v0.3.0, you can use *.{ext} as your destination filename to individually
compile each file to the destination directory. Otherwise, when the source
contains an array of multiple filepaths, the contents are concatenated in the
order passed.

[grunt.template]: https://github.com/gruntjs/grunt/blob/master/docs/api_template.md
[minimatch]: https://github.com/isaacs/minimatch

##### options ```object```

This controls how this task (and its helpers) operate and should
contain key:value pairs, see options below.

Values are passed directly into the `haml-cofee` compiler; a more complete
reference can be found on its [repository][].

[repository]: https://github.com/netzpirat/haml-coffee#compiler-options-1

#### Options

_To be written_

#### Config Example

``` javascript
haml: {
  compile: {
    files: {
      'path/to/result.js': 'path/to/source.haml', // 1:1 compile
      'path/to/*.js': ['path/to/sources/*.haml', 'path/to/more/*.haml'] // compile individually into dest, maintaining folder structure
    }
  },
}
```

--

*Task submitted by [Eric Woroshow](https://github.com/errcw).*
