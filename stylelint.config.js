module.exports = {
    extends: [
        // Use the Standard config as the base
        // https://github.com/stylelint/stylelint-config-standard
        // ===
        'stylelint-config-standard',

        // Enforce a standard order for CSS properties
        // https://github.com/stormwarning/stylelint-config-recess-order
        // ===
        'stylelint-config-recess-order',

        // Override rules that would interfere with Prettier
        // https://github.com/shannonmoeller/stylelint-config-prettier
        // ===
        'stylelint-config-prettier',

        // Override rules to allow linting of CSS modules
        // https://github.com/pascalduez/stylelint-config-css-modules
        // ===
        'stylelint-config-css-modules',
    ],
    plugins: [
        'stylelint-scss',
        // 'stylelint-no-unsupported-browser-features',
        'stylelint-selector-bem-pattern',
        'stylelint-selector-no-empty',
    ],

    defaultSeverity: 'error',

    // Rule lists:
    // - https://stylelint.io/user-guide/rules/
    // - https://github.com/kristerkari/stylelint-scss#list-of-rules
    rules: {
        // ===
        // Off rules
        // ===
        'no-descending-specificity': null,
        'string-no-newline': null,

        // Allow newlines inside class attribute values
        'color-hex-case': 'lower',
        'color-hex-length': 'long',
        'comment-whitespace-inside': 'always',
        'declaration-block-semicolon-space-before': 'never',
        'declaration-block-trailing-semicolon': 'always',
        'function-url-quotes': 'always',
        'indentation': 4,
        'max-empty-lines': 2,
        'media-feature-name-no-unknown': true,
        'string-quotes': 'single',

        // ===
        // PROPERTY
        // ===
        'property-no-vendor-prefix': true,
        'property-no-unknown': [
            true,
            {
                ignoreProperties: [
                    ':root',
                    'border-top-radius',
                    'border-bottom-radius',
                ],
            },
        ],

        // ===
        // SELECTORS
        // Enforce camelCase for classes and ids, to work better
        // with CSS modules
        // ===
        // 'selector-class-pattern': /^(?:u|is|has)-[a-z][a-zA-Z0-9]*$|^(?!u|is|has)[a-zA-Z][a-zA-Z0-9]*(?:-[a-z][a-zA-Z0-9]*)?(?:--[a-z][a-zA-Z0-9]*)?$/,
        // 'selector-id-pattern': /^[a-z][a-zA-Z]*$/,

        // ===
        // TODO fix that & uncomment
        // Limit the number of universal selectors in a selector,
        // to avoid very slow selectors
        // ===
        // 'selector-max-universal': 1,

        // ===
        // TODO fix that & uncomment
        // Disallow allow global element/type selectors in scoped modules
        // ===
        'selector-max-type': [
            1,
            { ignore: [ 'child', 'descendant', 'compounded' ] },
        ],
        'selector-attribute-brackets-space-inside': 'never',
        'selector-attribute-operator-space-after': 'never',
        'selector-attribute-operator-space-before': 'never',
        'selector-attribute-quotes': 'always',
        'selector-combinator-space-after': 'always',
        'selector-list-comma-newline-before': 'never-multi-line',
        'selector-list-comma-newline-after': 'always',
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: [ 'v-deep' ],
            },
        ],

        // ===
        // PLUGINS
        // ===
        // 'plugin/no-unsupported-browser-features': [
        //   true,
        //   {
        //     severity: 'warning',
        //     ignore: [
        //       'background-img-opts',
        //       'calc',
        //       'css3-cursors',
        //       'css-appearance',
        //       'css-clip-path',
        //       'css-featurequeries',
        //       'css-filters',
        //       'css-masks',
        //       'css-media-resolution',
        //       'css-resize',
        //       'css-sticky',
        //       'flexbox',
        //       'multicolumn',
        //       'outline',
        //       'text-size-adjust',
        //       'viewport-units',
        //     ],
        //   },
        // ],
        'plugin/selector-bem-pattern': {
            preset: 'bem',
            componentName: '[A-Z]+',
            componentSelectors: {
                initial: '^\\.{componentName}(?:-[a-z]+)?$',
                combined: '^\\.combined-{componentName}-[a-z]+$',
            },
            utilitySelectors: '^\\.util-[a-z]+$',
        },
        'plugin/stylelint-selector-no-empty': true,
        'rule-empty-line-before': [
            'always',
            {
                except: [
                    'first-nested',
                ],
                ignore: [
                    'after-comment',
                ],
            },
        ],

        // ===
        // SCSS
        // ===
        'scss/dollar-variable-colon-space-after': 'always',
        'scss/dollar-variable-colon-space-before': 'never',
        'scss/dollar-variable-no-missing-interpolation': true,
        'scss/dollar-variable-pattern': /^[a-z0-9-]+$/,
        'scss/double-slash-comment-whitespace-inside': 'always',
        'scss/operator-no-newline-before': true,
        'scss/operator-no-unspaced': true,
        // worth enabling after decide to tidy up scss
        'scss/selector-no-redundant-nesting-selector': null,

        // Allow SCSS and CSS module keywords beginning with `@`
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,

        // ===
        // PRETTIER
        // ===
        // HACK: to compensate for https://github.com/shannonmoeller/stylelint-config-prettier/issues/4
        // Modifying setting from Standard: https://github.com/stylelint/stylelint-config-standard/blob/7b76d7d0060f2e13a331806a09c2096c7536b0a6/index.js#L6
        'at-rule-empty-line-before': [
            'always',
            {
                except: [ 'blockless-after-same-name-blockless', 'first-nested' ],
                ignore: [ 'after-comment' ],
                ignoreAtRules: [ 'else' ],
            },
        ],
    },
};
