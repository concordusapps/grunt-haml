# grunt-haml [![Build Status](https://travis-ci.org/concordusapps/grunt-haml.png?branch=master)](http://travis-ci.org/concordusapps/grunt-haml)

> Compile Haml files to JavaScript.


## Getting Started
If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-haml --save-dev
```

[grunt]: http://gruntjs.com/
[Getting Started]: http://gruntjs.com/getting-started


## Haml task
_Run this task with the `grunt haml` command._

_This task is a [multi task][] so any targets, files and options should be specified according to the [multi task][] documentation._
[multi task]: https://github.com/gruntjs/grunt/wiki/Configuring-tasks


### Options

#### language
Type: ```string```
Default: ```js```

Specifies the script language and compiler to use alongside HAML.

Accepts following values: ```coffee``` or ```js``` in which it will use
[haml-coffee][] or [haml-js][] respectively.

[haml-coffee]: https://github.com/netzpirat/haml-coffee
[haml-js]: https://github.com/creationix/haml-js

#### target
Type: ```string```
Default: ```html```

Specifies the target language to compile to.

Accepts the following values: ```js``` or ```html```. For ```js``` the template
is generated and for ```html``` the template is both generated and rendered
into its resultant HTML.

#### placement
Type: ```string```
Default: ```global```

Specifies where to place the resultant template

*Defined only for target == 'js'.*

#### namespace
Type: ```string```
Default: ```window.HAML```

Specifies the global object to store the compiled HAML templates in.

*Defined only for target == 'js' and placement == 'global'.*

#### name
Type: ```string```
Default: basename without extension of the input HAML file

Specifies the name to store the compiled HAML template as in the object
specified by `namespace`.

With a `name` of 'apple' and a namespace of `this._template`, you'd get
something like this:

```javascript
window.HAML['apple'] =  function(locals) {
    // template code
};
```

*Defined only for target == 'js' and placement == 'global'.*

#### dependencies
Type: ```object```
Default: ```{}```

Specifies any module dependencies of the HAML file that must be loaded via
the AMD define statement. These are automatically appended to if there are
any `require` statements in the HAML code.

With the following HAML file:

```haml
!= require('path/to/other')()
%p Hello World
```

And the following options (in the `Gruntfile.js`):

```javascript
haml: {
  compile: {
    files: // ...
    options: {
      dependencies: {
        $: 'jquery',
        _: 'underscore'
      }
    }
  }
}
```

The resultant template would be something like this:

```javascript
define(['jquery', 'underscore', 'path/to/other'], function($, _, other) {
    // template code
});
```

*Defined only for target == 'js'.*

#### bare
Type: ```boolean```
Default: ```true```

Compile the JavaScript without the top-level function safety wrapper.

*Defined only for language == 'coffee' and target == 'js'.*

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

 * 2013-03-21   v0.3.2   Corrected placement option to match readme.
 * 2013-01-27   v0.3.1   Update to current version of grunt.
 * 2012-12-19   v0.3.0   Name changed to `grunt-haml` Default target changed to `html`
 * 2012-12-18   v0.1.3   Updated README.
 * 2012-12-18   v0.1.2   Fixed package.json syntax error.
 * 2012-12-18   v0.1.1   Fixed package.json dependencies.
 * 2012-12-18   v0.1.0   Rewrite from scratch (referencing grunt-contrib). Support for full gamut of options.
 * 2012-12-16   v0.0.2   Fixed a syntax error in the package.json (missing comma).
 * 2012-11-06   v0.0.1   Initial release; only slightly modified from what `grunt-contrib-coffee` was at the time.

---

Task submitted by [Ryan Leckey](https://github.com/mehcode)

*This file was generated on Tue Apr 02 2013 15:25:59.*
