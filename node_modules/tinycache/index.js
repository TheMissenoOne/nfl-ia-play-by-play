'use strict';

const sizeof = require( 'js-sizeof' );

const TinyCache = function() {
    this._cache = {};
    this._timeouts = {};
    this._hits = 0;
    this._misses = 0;
    this._size = 0;

    return this;
};

TinyCache.prototype = {
    get size() {
        return this._size;
    },
    get memsize() {
        return sizeof( this._cache ); /* Returns the approximate memory usage of all objects stored in the cache and cache overhead */
    },
    get hits() {
        return this._hits;
    },
    get misses() {
        return this._misses;
    },

    put: function( key, value, time ) {
        if ( this._timeouts[ key ] ) {
            clearTimeout( this._timeouts[ key ] );
            delete this._timeouts[ key ];
        }
    
        this._cache[ key ] = value;
        
        if ( !isNaN( time ) ) {
            this._timeouts[ key ] = setTimeout( this.del.bind( this, key ), time );
        }
    
        ++this._size;
    },

    get: function( key ) {
        if ( typeof key === 'undefined' ) {
            return this._cache;
        }
        
        if ( !( key in this._cache ) ) {
            ++this._misses;
            return null;
        }
    
        ++this._hits;
        return this._cache[ key ];
    },

    del: function( key ) {
        clearTimeout( this._timeouts[ key ] );
        delete this._timeouts[ key ];
        
        if ( !( key in this._cache )  ) {
            return false;
        }
        
        delete this._cache[ key ];
        --this._size;
        return true;
    },

    clear: function() {
        for ( let key in this._timeouts ) {
            clearTimeout( this._timeouts[ key ] );
        }
    
        this._cache = {};
        this._timeouts = {};
        this._size = 0;
    }
};

TinyCache.shared = new TinyCache();

if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = TinyCache;
}
else if ( typeof define === 'function' && define.amd ) {
    /* global define */
    define( [], function() {
        return TinyCache;
    } );
}
else {
    /* global window */
    window.TinyCache = TinyCache;
}