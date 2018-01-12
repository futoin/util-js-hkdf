'use strict';

var fs = require( 'fs' );

module.exports = function( grunt ) {
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),

        eslint: {
            options: {
                fix: true,
                ignore: false,
            },
            target: [
                '*.js',
                'lib/**/*.js',
                'test/**/*.js',
            ],
        },
        mocha_istanbul: { coverage: { src: [ 'test' ] } },
        istanbul_check_coverage: {},
        jsdoc2md: {
            README: {
                src: [ '*.js', 'lib/**/*.js' ],
                dest: "README.md",
                options: { template: fs.readFileSync( 'misc/README.hbs', 'utf8' ) },
            },
        },
        replace: {
            README: {
                src: "README.md",
                overwrite: true,
                replacements: [
                    {
                        from: "$$pkg.version$$",
                        to: "<%= pkg.version %>",
                    },
                ],
            },
        },
    } );

    grunt.loadNpmTasks( 'grunt-eslint' );
    grunt.loadNpmTasks( 'grunt-mocha-istanbul' );

    grunt.registerTask( 'check', [ 'eslint' ] );

    grunt.registerTask( 'node', [ 'mocha_istanbul' ] );
    grunt.registerTask( 'test', [
        'check',
        'node',
        'doc',
    ] );

    grunt.loadNpmTasks( 'grunt-jsdoc-to-markdown' );
    grunt.loadNpmTasks( 'grunt-text-replace' );
    grunt.registerTask( 'doc', [ 'jsdoc2md:README', 'replace:README' ] );

    grunt.registerTask( 'default', [ 'check' ] );
};
