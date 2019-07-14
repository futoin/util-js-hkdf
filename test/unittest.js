'use strict';

const crypto = require( 'crypto' );
const hkdf = require( '../hkdf' );
const expect = require( 'chai' ).expect;

describe( 'HKDF', function() {
    it ( 'use proper hash lengths', function() {
        const algos = [
            'sha256',
            'sha512',
            'sha224',
            'sha384',
            // 'blake2s256',
            // 'blake2b512',
            'sha1',
            'md5',
            // 'gost',
        ];

        for ( let a of algos ) {
            expect( hkdf.hash_length( a ) ).to.equal( crypto.createHash( a ).digest().length );
        }

        const future_algos = {
            'sha3-256' : 32,
            'sha3-512' : 64,
            'sha3-224' : 28,
            'sha3-384' : 48,
            blake2s256 : 32,
            blake2b512 : 64,
        };

        for ( let a in future_algos ) {
            expect( hkdf.hash_length( a ) ).to.equal( future_algos[a] );
        }
    } );

    it ( 'use hash length caching', function() {
        const algos = [
            'SHA256',
            'RIPEMD160',
            'SHA256',
            'RIPEMD160',
        ];

        for ( let a of algos ) {
            expect( hkdf.hash_length( a ) ).to.equal( crypto.createHash( a ).digest().length );
        }
    } );

    it ( 'should correctly handle optional parameters', function() {
        // note, values are derived from this functionality - can be invalid in theory
        expect( hkdf( 'abc', 12 ).toString( 'hex' ) ).to.equal( '4af82925ee74ef036c1ff38e' );
        expect( hkdf( 'abc', 12, { salt:'' } ).toString( 'hex' ) ).to.equal( '4af82925ee74ef036c1ff38e' );
        expect( hkdf( 'abc', 12, { salt:'123' } ).toString( 'hex' ) ).to.equal( '2385d8d57460fb520e05cb53' );
        expect( hkdf( 'abc', 12, { info:'' } ).toString( 'hex' ) ).to.equal( '4af82925ee74ef036c1ff38e' );
        expect( hkdf( 'abc', 12, { info:'123' } ).toString( 'hex' ) ).to.equal( '9fd198216181de061d18c424' );
        expect( hkdf( 'abc', 12, { hash:'MD5' } ).toString( 'hex' ) ).to.equal( '108ab4ed0e6336264c1f7182' );
    } );

    // as per https://tools.ietf.org/html/rfc6234
    //    *      okm_len: [in]
    //    *          The length of the buffer to hold okm.
    //    *          okm_len must be <= 255 * USHABlockSize(whichSha)
    // --------------------
    // 255 * 32 = 8160    so 8160 is a valid case for sha256 (and 8161 should be rejected)

    it ( 'should detect too long OKM issue', function() {
        expect( () => {
            hkdf( 'abc', 8161 );
        } ).to.throw( 'OKM length 8161 is too long for sha256 hash' );
    } );

    it ( 'should fallback hash length for unknown algorithms', function() {
        expect( () => {
            hkdf.hash_length( 'invalid' );
        } ).to.throw( 'Digest method not supported' );
    } );

    // NOTE: source for test vectors - https://tools.ietf.org/html/rfc5869
    const test_vectors = {
        1: {
            Hash: 'SHA-256',
            IKM: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
            salt: '000102030405060708090a0b0c',
            info: 'f0f1f2f3f4f5f6f7f8f9',
            L: 42,
            PRK: [
                '077709362c2e32df0ddc3f0dc47bba63',
                '90b6c73bb50f9c3122ec844ad7c2b3e5',
            ].join( '' ),
            OKM: [
                '3cb25f25faacd57a90434f64d0362f2a',
                '2d2d0a90cf1a5a4c5db02d56ecc4c5bf',
                '34007208d5b887185865',
            ].join( '' ),
        },

        2: {
            Hash: 'SHA-256',
            IKM: [
                '000102030405060708090a0b0c0d0e0f',
                '101112131415161718191a1b1c1d1e1f',
                '202122232425262728292a2b2c2d2e2f',
                '303132333435363738393a3b3c3d3e3f',
                '404142434445464748494a4b4c4d4e4f',
            ].join( '' ),
            salt: [
                '606162636465666768696a6b6c6d6e6f',
                '707172737475767778797a7b7c7d7e7f',
                '808182838485868788898a8b8c8d8e8f',
                '909192939495969798999a9b9c9d9e9f',
                'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf',
            ].join( '' ),
            info: [
                'b0b1b2b3b4b5b6b7b8b9babbbcbdbebf',
                'c0c1c2c3c4c5c6c7c8c9cacbcccdcecf',
                'd0d1d2d3d4d5d6d7d8d9dadbdcdddedf',
                'e0e1e2e3e4e5e6e7e8e9eaebecedeeef',
                'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
            ].join( '' ),
            L: 82,
            PRK: [
                '06a6b88c5853361a06104c9ceb35b45c',
                'ef760014904671014a193f40c15fc244',
            ].join( '' ),
            OKM: [
                'b11e398dc80327a1c8e7f78c596a4934',
                '4f012eda2d4efad8a050cc4c19afa97c',
                '59045a99cac7827271cb41c65e590e09',
                'da3275600c2f09b8367793a9aca3db71',
                'cc30c58179ec3e87c14c01d5c1f3434f',
                '1d87',
            ].join( '' ),
        },

        3: {
            Hash: 'SHA-256',
            IKM: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
            salt: '',
            info: '',
            L: 42,
            PRK: [
                '19ef24a32c717b167f33a91d6f648bdf',
                '96596776afdb6377ac434c1c293ccb04',
            ].join( '' ),
            OKM: [
                '8da4e775a563c18f715f802a063c5a31',
                'b8a11f5c5ee1879ec3454e5f3c738d2d',
                '9d201395faa4b61a96c8',
            ].join( '' ),
        },

        4: {
            Hash: 'SHA-1',
            IKM: '0b0b0b0b0b0b0b0b0b0b0b',
            salt: '000102030405060708090a0b0c',
            info: 'f0f1f2f3f4f5f6f7f8f9',
            L: 42,
            PRK: '9b6c18c432a7bf8f0e71c8eb88f4b30baa2ba243',
            OKM: [
                '085a01ea1b10f36933068b56efa5ad81',
                'a4f14b822f5b091568a9cdd4f155fda2',
                'c22e422478d305f3f896',
            ].join( '' ),
        },

        5: {
            Hash: 'SHA-1',
            IKM: [
                '000102030405060708090a0b0c0d0e0f',
                '101112131415161718191a1b1c1d1e1f',
                '202122232425262728292a2b2c2d2e2f',
                '303132333435363738393a3b3c3d3e3f',
                '404142434445464748494a4b4c4d4e4f',
            ].join( '' ),
            salt: [
                '606162636465666768696a6b6c6d6e6f',
                '707172737475767778797a7b7c7d7e7f',
                '808182838485868788898a8b8c8d8e8f',
                '909192939495969798999a9b9c9d9e9f',
                'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf',
            ].join( '' ),
            info: [
                'b0b1b2b3b4b5b6b7b8b9babbbcbdbebf',
                'c0c1c2c3c4c5c6c7c8c9cacbcccdcecf',
                'd0d1d2d3d4d5d6d7d8d9dadbdcdddedf',
                'e0e1e2e3e4e5e6e7e8e9eaebecedeeef',
                'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
            ].join( '' ),
            L: 82,
            PRK: '8adae09a2a307059478d309b26c4115a224cfaf6',
            OKM: [
                '0bd770a74d1160f7c9f12cd5912a06eb',
                'ff6adcae899d92191fe4305673ba2ffe',
                '8fa3f1a4e5ad79f3f334b3b202b2173c',
                '486ea37ce3d397ed034c7f9dfeb15c5e',
                '927336d0441f4c4300e2cff0d0900b52',
                'd3b4',
            ].join( '' ),
        },

        6: {
            Hash: 'SHA-1',
            IKM: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
            salt: '',
            info: '',
            L: 42,
            PRK: 'da8c8a73c7fa77288ec6f5e7c297786aa0d32d01',
            OKM: [
                '0ac1af7002b3d761d1e55298da9d0506',
                'b9ae52057220a306e07b6b87e8df21d0',
                'ea00033de03984d34918',
            ].join( '' ),
        },

        7: {
            Hash: 'SHA-1',
            IKM: '0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c',
            salt: null,
            info: '',
            L: 42,
            PRK: '2adccada18779e7c2077ad2eb19d3f3e731385dd',
            OKM: [
                '2c91117204d745f3500d636a62f64f0a',
                'b3bae548aa53d423b0d1f27ebba6f5e5',
                '673a081d70cce7acfc48',
            ].join( '' ),
        },
    };

    for ( let k in test_vectors ) {
        const v = test_vectors[k];

        it ( `should pass RFC Test Vector #${k}`, function() {
            const ihash = v.Hash.toLowerCase().replace( '-', '' );

            expect( hkdf.extract(
                ihash,
                hkdf.hash_length( ihash ),
                Buffer.from( v.IKM, 'hex' ),
                v.salt && Buffer.from( v.salt, 'hex' )
            ).toString( 'hex' ) ).to.equal( v.PRK );

            expect( hkdf(
                Buffer.from( v.IKM, 'hex' ),
                v.L,
                {
                    salt: v.salt && Buffer.from( v.salt, 'hex' ),
                    info: Buffer.from( v.info, 'hex' ),
                    hash: v.Hash,
                }
            ).toString( 'hex' ) ).to.equal( v.OKM );
        } );
    }
} );
