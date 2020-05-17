/* global describe, it */
'use strict';

const assert = require( 'chai' ).assert;
const TinyCache = require( '../' );

let i = 0;

function new_key() {
    return 'key_' + ( ++i );
}

const suite = function( cache ) {
    describe( 'size', function() {
        it( 'should be 0 when empty', function() {
            cache.clear();
            assert.equal( cache.size, 0 );
        } );
        it( 'should be accurate', function() {
            cache.clear();
            cache.put( new_key(), 1 );
            assert.equal( cache.size, 1 );
        } );
        it( 'should be accurate after object falls out of cache', function( done ) {
            this.slow( 200 ); // not slow at 50ms
            const start = cache.size;
            cache.put( new_key(), 1, 5 );
            assert.equal( cache.size, start + 1 );
            setTimeout( function() {
                assert.equal( cache.size, start );
                done();
            }, 50 );
        } );
    } );

    describe( 'memsize', function() {

        it( 'should be 0 when empty', function() {
            cache.clear();
            assert.equal( cache.memsize, 0 );
        } );

        it( 'should be accurate', function() {
            cache.clear();

            const firstKey = new_key();
            cache.put( firstKey, 1 );
            const firstSize = cache.memsize;
            assert.isAbove( firstSize, 0 );

            const secondKey = new_key();
            cache.put( secondKey, 10 );
            const secondSize = cache.memsize;
            assert.isAbove( secondSize, firstSize );

            cache.del( secondKey );
            assert.equal( cache.memsize, firstSize );

            cache.del( firstKey );
            assert.equal( cache.memsize, 0 );
        } );

        it( 'should be accurate after object falls out of cache', function( done ) {
            this.slow( 200 ); // not slow at 50ms
            const start = cache.memsize;
            cache.put( new_key(), 1, 5 );
            assert.isAbove( cache.memsize, start );
            setTimeout( function() {
                assert.equal( cache.memsize, start );
                done();
            }, 50 );
        } );
    } );

    describe( 'clear()', function() {
        it( 'should clear all objects', function() {
            const size_start = cache.size;
            const keys = [ new_key(), new_key(), new_key() ];
            cache.put( keys[ 0 ], 1, 10 );
            cache.put( keys[ 1 ], 2, 10 );
            cache.put( keys[ 2 ], 3, 10 );
            assert.equal( cache.size, size_start + 3 );

            cache.clear();
            assert.equal( cache.size, 0 );
            assert.isNull( cache.get( keys[ 0 ] ) );
            assert.isNull( cache.get( keys[ 1 ] ) );
            assert.isNull( cache.get( keys[ 2 ] ) );
        } );
    } );

    describe( 'get()', function() {
        it( 'should return the internal cache object when called with no key', function() {
            assert.equal( cache._cache, cache.get() );
        } );

        it( 'should return null if key doesn\'t exist', function() {
            assert.isNull( cache.get( 'awf1n1a' ) );
            assert.isNull( cache.get( null ) );
            assert.isNull( cache.get( 1 ) );
            assert.isNull( cache.get( true ) );
            assert.isNull( cache.get( false ) );
        } );

        it( 'should return value', function() {
            const complicated = [ 'a', {
                'b': 'c',
                'd': [ 'e', 3 ]
            }, '@' ];
            const key = new_key();
            cache.put( key, complicated, 100 );
            assert.deepEqual( cache.get( key ), complicated );
        } );
    } );

    describe( 'put()', function() {
        it( 'should overwrite existing object if exists', function( done ) {
            const ttl1 = 20;
            const ttl2 = 20;
            const value1 = {
                a: 1
            };
            const value2 = {
                a: 2
            };
            const key = new_key();

            cache.put( key, value1, ttl1 );
            assert.deepEqual( cache.get( key ), value1 );
            setTimeout( function() {
                cache.put( key, value2, ttl2 );
                assert.deepEqual( cache.get( key ), value2 );
            }, 10 );

            // test that the value isn't wiped out by the first
            // put()'s timeout
            setTimeout( function() {
                assert.deepEqual( cache.get( key ), value2 );
                done();
            }, 25 );
        } );
        describe( 'stored object', function() {
            it( 'should exist during ttl (ms)', function( done ) {
                const ttl = 20;
                const value = {
                    a: 1
                };
                const key = new_key();
                cache.put( key, value, ttl );
                setTimeout( function() {
                    assert.deepEqual( cache.get( key ), value );
                    done();
                }, 10 );
            } );
            it( 'should expire after ttl (ms)', function( done ) {
                const ttl = 20;
                const value = {
                    a: 1
                };
                const key = new_key();
                cache.put( key, value, ttl );
                setTimeout( function() {
                    assert.isNull( cache.get( key ) );
                    done();
                }, 30 );
            } );
        } );
    } );

    describe( 'del()', function() {
        it( 'should remove object', function() {
            const key = new_key();
            const val = 1;
            const size = cache.size;
            cache.put( key, val, 100 );
            assert.equal( cache.get( key ), val );
            cache.del( key );
            assert.isNull( cache.get( key ) );
            assert.equal( cache.size, size );
        } );
        it( 'should return false when trying to remove a nonexistent object', function() {
            assert.notOk( cache.del( 'nonexistent' ) );
        } );
    } );

    describe( 'hits', function() {
        it( 'should be number of cache hits', function() {
            const key = new_key();
            cache.put( key, 1, 1 );
            const start = cache.hits;
            cache.get( 'missing' );
            cache.get( key );
            cache.get( key );
            cache.get( key );
            assert.equal( cache.hits, start + 3 );
        } );
    } );

    describe( 'misses', function() {
        it( 'should be number of cache misses', function() {
            const key = new_key();
            cache.put( key, 1, 1 );
            const start = cache.misses;
            cache.get( 'missing' );
            cache.get( 'missing' );
            cache.get( key );
            assert.equal( cache.misses, start + 2 );
        } );
    } );
};

describe( 'tinycache (instance)', function() {
    suite( new TinyCache() );
} );
describe( 'tinycache (shared)', function() {
    suite( TinyCache.shared );
} );