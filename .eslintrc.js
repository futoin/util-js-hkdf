module.exports = {
    "env": {
        "es6": true,
        "node": true,
        commonjs: true,
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": ["off"],
        "semi": ["error", "always"],
        "strict": ["error", "global"],
        "comma-dangle": ["error", "always-multiline"],
        "comma-spacing": ["error", { "before": false, "after": true }],
        "comma-style": ["error", "last"],
        "valid-jsdoc": ["error", { requireReturn: false } ],
        "require-jsdoc": "error",
        "no-template-curly-in-string": ["error"],
        "curly": ["error", "multi-line"],
        "no-multi-spaces": ["error"],
        //"array-bracket-newline": ["error", { "multiline": true, "minItems": 3 }],
        "array-bracket-spacing": ["error", "always"],
        //"array-element-newline": ["error", { "multiline": true, "minItems": 3 }],
        "block-spacing": ["error"],
        "brace-style": ["error", "1tbs"],
        "no-trailing-spaces": "error",
        "no-unused-vars": [
            "error",
            {
                "vars" : "all",
                "args" : "all",
                "argsIgnorePattern" : "^(as|err|_.*)$"
            }
        ],
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-useless-escape": "error",
        // "object-curly-newline": ["error", { "multiline": true }],
        "object-curly-spacing": ["error", "always"],
        //"object-property-newline": "error",
        "one-var": ["error", "never"],
        "padded-blocks": ["error", "never"],
        "padding-line-between-statements": [
            "error",
            { "blankLine": "always", "prev": "*", "next": ["for", "while", "do", "class", "if", "switch", "try", "with"] },
            { "blankLine": "always", "prev": ["for", "while", "do", "class", "if", "switch", "try", "with"], "next": "*" },
            
            { "blankLine": "always", "prev": "var", "next": "*" },
            { "blankLine": "any", "prev": "var", "next": "var" },
        ],
        "space-before-blocks": "error",
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        "space-in-parens": ["error", "always"],
        "quote-props": ["error", "as-needed"],
        "wrap-regex": "error",
    },
    overrides: [
        {
            env: {
                browser: true,
            },
            files: [ "lib/browser*.js" ],
            rules: {
                strict: [ "error", "function" ],
                "no-console" : ["off"],
                "brace-style": ["off"],
            }
        },
        {
            env : {
                mocha: true,
                browser: true,
            },
            files: [ "test/**/*.js" ],
            rules: {
                "no-console" : ["off"],
                "no-unused-vars": ["off"],
                "require-jsdoc" : ["off"],
            }
        },
    ]
};
