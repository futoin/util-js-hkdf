'use strict';

const assert = require( 'assert' );
const { Suite } = require( 'benchmark' );
const { Buffer } = require( 'buffer' );

const futoin_hkdf = require( '../hkdf' );

// NOTE: requires patching to work with latest Node.js
//const OtherHKDF = require( './foreign/hkdf' );

//const ctrlpanel = require( './foreign/ctrlpanel' );
//const stablelib = require( '@stablelib/hkdf' ).HKDF;
//const stablelib_sha256 = require( '@stablelib/sha256' ).SHA256;

{
    const hash = 'SHA-256';
    const l_hash = 'sha256';
    const ikm = Buffer.from( '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', 'hex' );
    const s_ikm = ikm.toString( 'ascii' );
    const salt = Buffer.from( '000102030405060708090a0b0c', 'hex' );
    const s_salt = ikm.toString( 'ascii' );
    const info = Buffer.from( 'f0f1f2f3f4f5f6f7f8f9', 'hex' );
    const s_info = ikm.toString( 'ascii' );
    const L = 42;
    const okm = Buffer.from( [
        '3cb25f25faacd57a90434f64d0362f2a',
        '2d2d0a90cf1a5a4c5db02d56ecc4c5bf',
        '34007208d5b887185865',
    ].join( '' ), 'hex' );
    const s_okm = okm.toString( 'ascii' );

    const bsha256 = new Suite( 'HKDF SHA-256' );
    bsha256
        .add( 'FutoIn', function() {
            const res = futoin_hkdf( ikm, L, { salt, info, hash } );
            //assert( res.equals( okm ) );
        } )
        /*.add('Other HKDF', {
            defer: true,
            fn: function(deferred){
                const hkdf = new OtherHKDF(l_hash, salt, ikm);
                hkdf.derive( info, L, (res) => {
                    // FAILS
                    //assert( res.equals( okm ) );
                    deferred.resolve();
                } );
            }
        })
        .add('CtrlPanel', {
            defer: true,
            fn: function(deferred){
                ctrlpanel( salt, ikm, info, L, hash )
                .then( (res) => {
                    //assert( Buffer.from(res).equals( okm ) );
                    deferred.resolve();
                } );
            }
        })
        .add('StableLib', function(){
            const hkdf = new stablelib(
                stablelib_sha256,
                ikm,
                salt,
                info,
            );
            const res = hkdf.expand( L );
            //assert( Buffer.from(res).equals( okm ) );
        })
        .on('complete', function() {
            console.log(this);
        })*/
        .run();
}
