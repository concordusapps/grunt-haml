# grunt-contrib-haml

> Compile Haml files to JavaScript.


## Getting Started
If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-contrib-haml --save-dev
```

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md


## Haml task
_Run this task with the `grunt haml` command._

_This task is a [multi task][] so any targets, files and options should be specified according to the [multi task][] documentation._
[multi task]: https://github.com/gruntjs/grunt/wiki/Configuring-tasks


### Options

#### bare
Type: ```boolean```

Compile the JavaScript without the top-level function safety wrapper.

*Defined only for target == 'coffee'.*

### Usage examples

``` javascript
haml: {
  one: {
    files: {
      // 1:1 compile
      'path/to/result.js': 'path/to/source.haml',

      // compile and concat into single file
      'path/to/another.js': ['path/to/sources/*.haml', 'path/to/more/*.haml']
    }
  },

  // compile individually into dest, maintaining folder structure
  two: {
    files: grunt.file.expandMapping(['path/to/*.haml'], 'path/to/dest/', {
      rename: function(base, path) {
        return base + path.replace(/\.haml$/, '.js');
      }
    })
  }
}
```


## Release History

 * 2012-12-18   v0.1.0   Rewrite from scratch (referencing several repositories in grunt-contrib). Support for full gamut of options including target for html and js, and language for js.
 * 2012-12-16   v0.0.2   Fixed a syntax error in the package.json (missing comma).
 * 2012-11-06   v0.0.1   Initial release; only slightly modified from what `grunt-contrib-coffee` was at the time.

---

Task submitted by [Ryan Leckey](https://github.com/mehcode)

*This file was generated on Wed Dec 19 2012 03:17:02.*
