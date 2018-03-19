/* eslint array-element-newline: "off" */
module.exports = {
	'env': {
		'es6': true
	,	'node': true
	}
,	'globals': {
		'_': true
	,	'ConstructionSite': true
	,	'Game': true
	,	'Memory': true
	,	'PathFinder': true
	,	'Room': true
	,	'RoomPosition': true
	,	'COLOR_GREY': true
	,	'COLOR_RED': true
	,	'COLOR_WHITE': true
	,	'COLOR_YELLOW': true
	,	'ERR_NOT_ENOUGH_RESOURCES': true
	,	'ERR_NOT_IN_RANGE': true
	,	'FIND_CREEPS': true
	,	'FIND_DROPPED_RESOURCES': true
	,	'FIND_FLAGS': true
	,	'FIND_HOSTILE_CREEPS': true
	,	'FIND_MY_CREEPS': true
	,	'FIND_MY_CONSTRUCTION_SITES': true
	,	'FIND_MY_SPAWNS': true
	,	'FIND_MY_STRUCTURES': true
	,	'FIND_STRUCTURES': true
	,	'FIND_SOURCES': true
	,	'FIND_SOURCES_ACTIVE': true
	,	'FIND_TOMBSTONES': true
	,	'OBSTACLE_OBJECT_TYPES': true
	,	'OK': true
	,	'RESOURCE_ENERGY': true
	,	'STRUCTURE_CONTAINER': true
	,	'STRUCTURE_CONTROLLER': true
	,	'STRUCTURE_EXTENSION': true
	,	'STRUCTURE_RAMPART': true
	,	'STRUCTURE_ROAD': true
	,	'STRUCTURE_SPAWN': true
	,	'STRUCTURE_STORAGE': true
	,	'STRUCTURE_TOWER': true
	,	'STRUCTURE_WALL': true
	,	'MOVE': true
	,	'WORK': true
	,	'CARRY': true
	}
,	'extends': 'eslint:recommended'
,	'parserOptions': { 'sourceType': 'module' }
,	'rules': {
		'accessor-pairs': 'error'
	,	'array-bracket-newline': 'off'
	,	'array-bracket-spacing': [ 'error', 'always', { 'singleValue': false } ]
	,	'array-callback-return': 'error'
	,	'array-element-newline': 'off'
	,	'arrow-body-style': 'error'
	,	'arrow-parens': [ 'error', 'as-needed', { 'requireForBlockBody': true } ]
	,	'arrow-spacing': [ 'error', { 'after': true, 'before': true } ]
	,	'block-scoped-var': 'error'
	,	'block-spacing': 'error'
	,	'brace-style': [ 'error', '1tbs' ]
	,	'callback-return': 'off'
	,	'camelcase': 'off'
	,	'capitalized-comments': 'off'
	,	'class-methods-use-this': 'error'
	,	'comma-dangle': 'error'
	,	'comma-spacing': [ 'error', { 'after': true, 'before': false } ]
	,	'comma-style': [ 'error', 'first' ]
	,	'complexity': 'off'
	,	'computed-property-spacing': [ 'error', 'never' ]
	,	'consistent-return': [ 'error', { 'treatUndefinedAsUnspecified': false } ]
	,	'consistent-this': 'error'
	,	'curly': 'error'
	,	'default-case': 'error'
	,	'dot-location': [ 'error', 'property' ]
	,	'dot-notation': 'error'
	,	'eol-last': 'off'
	,	'eqeqeq': 'error'
	,	'for-direction': 'error'
	,	'func-call-spacing': 'error'
	,	'func-name-matching': 'error'
	,	'func-names': 'error'
	,	'func-style': [ 'error', 'expression' ]
	,	'function-paren-newline': 'off'
	,	'generator-star-spacing': 'error'
	,	'getter-return': 'error'
	,	'global-require': 'error'
	,	'guard-for-in': 'error'
	,	'handle-callback-err': 'error'
	,	'id-blacklist': 'error'
	,	'id-length': 'off'
	,	'id-match': 'error'
	,	'implicit-arrow-linebreak': [ 'error', 'beside' ]
	,	'indent': 'off'
	,	'indent-legacy': 'off'
	,	'init-declarations': 'off'
	,	'jsx-quotes': 'error'
	,	'key-spacing': 'error'
	,	'keyword-spacing': [ 'error', { 'after': true, 'before': true } ]
	,	'line-comment-position': 'off'
	,	'linebreak-style': [ 'error', 'windows' ]
	,	'lines-around-comment': 'error'
	,	'lines-around-directive': 'off'
	,	'lines-between-class-members': 'error'
	,	'max-depth': 'error'
	,	'max-len': 'off'
	,	'max-lines': 'off'
	,	'max-nested-callbacks': 'error'
	,	'max-params': 'error'
	,	'max-statements': 'off'
	,	'max-statements-per-line': 'error'
	,	'multiline-comment-style': 'off'
	,	'multiline-ternary': [ 'error', 'never' ]
	,	'new-cap': 'error'
	,	'new-parens': 'error'
	,	'newline-after-var': 'off'
	,	'newline-before-return': 'off'
	,	'newline-per-chained-call': 'error'
	,	'no-alert': 'error'
	,	'no-array-constructor': 'error'
	,	'no-await-in-loop': 'error'
	,	'no-bitwise': 'error'
	,	'no-buffer-constructor': 'error'
	,	'no-caller': 'error'
	,	'no-catch-shadow': 'error'
	,	'no-confusing-arrow': 'off'
	,	'no-console': 'off'
	,	'no-continue': 'off'
	,	'no-div-regex': 'error'
	,	'no-duplicate-imports': 'error'
	,	'no-else-return': 'error'
	,	'no-empty-function': 'error'
	,	'no-eq-null': 'error'
	,	'no-eval': 'error'
	,	'no-extend-native': 'error'
	,	'no-extra-bind': 'error'
	,	'no-extra-label': 'error'
	,	'no-extra-parens': 'off'
	,	'no-floating-decimal': 'error'
	,	'no-implicit-coercion': 'error'
	,	'no-implicit-globals': 'error'
	,	'no-implied-eval': 'error'
	,	'no-inline-comments': 'off'
	,	'no-invalid-this': 'error'
	,	'no-iterator': 'error'
	,	'no-label-var': 'error'
	,	'no-labels': 'error'
	,	'no-lone-blocks': 'error'
	,	'no-lonely-if': 'off'
	,	'no-loop-func': 'error'
	,	'no-magic-numbers': 'off'
	,	'no-mixed-operators': 'error'
	,	'no-mixed-requires': 'error'
	,	'no-mixed-spaces-and-tabs': 'off'
	,	'no-multi-assign': 'error'
	,	'no-multi-spaces': 'off'
	,	'no-multi-str': 'error'
	,	'no-multiple-empty-lines': 'error'
	,	'no-native-reassign': 'off'
	,	'no-negated-condition': 'error'
	,	'no-negated-in-lhs': 'off'
	,	'no-nested-ternary': 'error'
	,	'no-new': 'error'
	,	'no-new-func': 'error'
	,	'no-new-object': 'error'
	,	'no-new-require': 'error'
	,	'no-new-wrappers': 'error'
	,	'no-octal-escape': 'error'
	,	'no-param-reassign': 'error'
	,	'no-path-concat': 'error'
	,	'no-plusplus': 'error'
	,	'no-process-env': 'error'
	,	'no-process-exit': 'error'
	,	'no-proto': 'error'
	,	'no-prototype-builtins': 'off'
	,	'no-restricted-globals': 'error'
	,	'no-restricted-imports': 'error'
	,	'no-restricted-modules': 'error'
	,	'no-restricted-properties': 'error'
	,	'no-restricted-syntax': 'error'
	,	'no-return-assign': 'error'
	,	'no-return-await': 'error'
	,	'no-script-url': 'error'
	,	'no-self-compare': 'error'
	,	'no-sequences': 'error'
	,	'no-shadow': 'error'
	,	'no-shadow-restricted-names': 'error'
	,	'no-spaced-func': 'off'
	,	'no-sync': 'error'
	,	'no-tabs': 'off'
	,	'no-template-curly-in-string': 'error'
	,	'no-ternary': 'off'
	,	'no-throw-literal': 'error'
	,	'no-trailing-spaces': 'error'
	,	'no-undef-init': 'error'
	,	'no-undefined': 'off'
	,	'no-underscore-dangle': 'error'
	,	'no-unmodified-loop-condition': 'error'
	,	'no-unneeded-ternary': 'error'
	,	'no-unused-expressions': 'error'
	,	'no-use-before-define': 'error'
	,	'no-useless-call': 'error'
	,	'no-useless-computed-key': 'error'
	,	'no-useless-concat': 'error'
	,	'no-useless-constructor': 'error'
	,	'no-useless-rename': 'error'
	,	'no-useless-return': 'off'
	,	'no-var': 'error'
	,	'no-void': 'error'
	,	'no-warning-comments': 'off'
	,	'no-whitespace-before-property': 'error'
	,	'no-with': 'error'
	,	'nonblock-statement-body-position': 'error'
	,	'object-curly-newline': 'error'
	,	'object-curly-spacing': [ 'error', 'always' ]
	,	'object-property-newline': 'off'
	,	'object-shorthand': [ 'error', 'never' ]
	,	'one-var': 'off'
	,	'one-var-declaration-per-line': 'error'
	,	'operator-assignment': [ 'error', 'always' ]
	,	'operator-linebreak': [ 'error', 'before' ]
	,	'padded-blocks': [ 'error', 'never' ]
	,	'padding-line-between-statements': 'error'
	,	'prefer-arrow-callback': 'error'
	,	'prefer-const': 'error'
	,	'prefer-destructuring': 'off'
	,	'prefer-numeric-literals': 'error'
	,	'prefer-promise-reject-errors': 'error'
	,	'prefer-reflect': 'off'
	,	'prefer-rest-params': 'error'
	,	'prefer-spread': 'error'
	,	'prefer-template': 'error'
	,	'quote-props': 'error'
	,	'quotes': [ 'error', 'single' ]
	,	'radix': 'error'
	,	'require-await': 'error'
	,	'require-jsdoc': 'error'
	,	'rest-spread-spacing': 'error'
	,	'semi': 'error'
	,	'semi-spacing': [ 'error', { 'after': true, 'before': false } ]
	,	'semi-style': [ 'error', 'last' ]
	,	'sort-imports': 'error'
	,	'sort-keys': 'off'
	,	'sort-vars': 'off'
	,	'space-before-blocks': 'error'
	,	'space-before-function-paren': 'error'
	,	'space-in-parens': [ 'error', 'always' ]
	,	'space-infix-ops': 'error'
	,	'space-unary-ops': 'error'
	,	'spaced-comment': [ 'error', 'always' ]
	,	'strict': 'off'
	,	'switch-colon-spacing': 'error'
	,	'symbol-description': 'error'
	,	'template-curly-spacing': [ 'error', 'never' ]
	,	'template-tag-spacing': 'error'
	,	'unicode-bom': [ 'error', 'never' ]
	,	'valid-jsdoc': 'error'
	,	'vars-on-top': 'error'
	,	'wrap-iife': 'error'
	,	'wrap-regex': 'error'
	,	'yield-star-spacing': 'error'
	,	'yoda': [ 'error', 'never' ]
	}
};
