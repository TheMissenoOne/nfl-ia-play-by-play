# tinycache
[![NPM version](https://badge.fury.io/js/tinycache.png)](http://badge.fury.io/js/tinycache)
[![Build Status](https://travis-ci.org/andyburke/tinycache.png?branch=master)](https://travis-ci.org/andyburke/tinycache)
[![Coverage Status](https://coveralls.io/repos/andyburke/tinycache/badge.png)](https://coveralls.io/r/andyburke/tinycache)

A simple, small (~100 lines) in-memory cache for node.js or the browser (~1.5KB minified).

## Installation

    npm install tinycache

## Usage

```javascript
var TinyCache = require( 'tinycache' );
var cache = new TinyCache();

// now just use the cache

cache.put( 'foo', 'bar' );
console.log( cache.get( 'foo' ) );

// that wasn't too interesting, here's the good part

cache.put( 'houdini', 'disappear', 100 ); // Time in ms
console.log( 'Houdini will now ' + cache.get( 'houdini' ) );

setTimeout( function() {
  console.log( 'Houdini is ' + cache.get( 'houdini' ) );
}, 200 );
    
// don't want to allocate separate caches?
// there's also a default shared cache:
var sharedCache = TinyCache.shared;

sharedCache.put( 'foo', 'bar' );

// or you could grab it in a one-liner
var theSharedCache = require( 'tinycache' ).shared;

theSharedCache.get( 'bloop' );

```

## API

### cache.put( key, value[, time] )

Stores a value to the cache.
If time (in ms) is specified, the value will be automatically removed (via setTimeout)

### cache.get( [key] )

Retreives a value for a given key, or if no key is passed, will return the internal cache object.

### cache.del( key )

Deletes a key, returns a boolean indicating if the key existed and was deleted

### cache.clear()

Deletes all keys

### cache.size

The current number of entries in the cache

### cache.memsize

The approximate size in bytes of the cache (including all objects stored and cache overhead)

This is a rough estimate, using the js-sizeof library.

### cache.hits

The number of cache hits

### cache.misses

The number of cache misses.

## Contributing
 
* Fork the project.
* Make your feature addition or bug fix.
* Ensure it passes jshint using .jshintrc settings.
* Ensure it matches .jsbeautifyrc settings.
* Ensure all tests are passing.
* Add any relevant tests.
* Send me a pull request.

## Thanks

Many thanks to Paul Tarjan for the first iteration of this library (https://github.com/ptarjan/node-cache).

## CHANGELOG
1.1.0
-----
* Return internal cache if get is called with no arguments

1.0.1
-----
* Improved code coverage in tests
* Refactored timeout storage/handling
* Removed expired checks (let timeouts handle it)
* Doc updates

1.0.0
-----
* Change size, memsize, hits and misses to getters (breaking change)
* Update docs
* Update tests
* Minor code cleanups

0.1.11
------
* JSHint: use single quotes

0.1.10
------
* Fix an accidental dependency screwup
* Update docs on memsize()

0.1.9
-----
* Add/update some tests

0.1.8
-----
* Fix tests

0.1.7
-----
* Add dependency on js-sizeof and attempt to actually calculate rough in-memory cache size
* Fix an issue with size()

0.1.6
-----
* Integrate some upstream changes like:
  - hold size variable in memory instead of recalculating each time
  - minor cleanups/fixes
  
0.1.5
-----
* Remove an unnecessary anonymous function call

0.1.4
-----
* Fix tests

0.1.3
-----
* Fix component.json

0.1.2
-----
* Integrate testing from @brianreavis
* Add BSD License file via @brianreavis
* 'use strict';
* Pass jshint
* jsbeautify

