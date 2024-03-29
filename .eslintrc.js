module.exports = {
  globals: {
    JSX: true
  },
  extends: [
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  settings: {
    "import/extensions": [
      ".ts",
      ".tsx"
    ],
    "import/resolver": {
      node: {
        extensions: [ ".js", ".jsx", ".ts", ".tsx" ],
        moduleDirectory: [ "node_modules", "src/" ],
        paths: [ "src" ]
      }
    }
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: [
    "jsx-a11y",
    "react",
    "@typescript-eslint",
    "import",
    "react-hooks"
  ],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  ignorePatterns: [ "src/**/*d.ts", "copyScript.js" ],
  rules: {
    // Import rules
    "import/no-unresolved": "error",
    "import/named": 1,
    "import/default": "error",
    "import/no-self-import": "error",
    "import/no-cycle": [ "error", { maxDepth: 1 } ],
    "import/no-useless-path-segments": "error",
    "import/export": 1,
    "import/no-named-as-default": 1,
    "import/no-deprecated": 1,
    "import/no-mutable-exports": 1,
    "import/first": "error",
    "import/no-duplicates": "error",
    "import/no-namespace": "error",
    "import/extensions": [
      "error",
      {
        ts: "never",
        tsx: "never",
        js: "never",
        json: "always"
      }
    ],
    "import/order": "error",
    "import/newline-after-import": "error",
    "import/no-named-default": "error",
    "import/no-anonymous-default-export": "error",

    // React rules
    "react/button-has-type": "error",
    "react/forbid-component-props": "error",
    "react/no-access-state-in-setstate": "error",
    "react/no-adjacent-inline-elements": "error",
    "react/no-array-index-key": "error",
    "react/no-children-prop": "error",
    "react/no-danger": "error",
    "react/no-danger-with-children": "error",
    "react/no-deprecated": "error",
    "react/no-did-mount-set-state": "error",
    "react/no-did-update-set-state": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-redundant-should-component-update": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": 1,
    "react/no-this-in-sfc": "error",
    "react/no-typos": "error",
    "react/no-unescaped-entities": "error",
    "react/no-unknown-property": "error",
    "react/no-unsafe": "error",
    "react/no-unused-prop-types": "error",
    "react/no-unused-state": "error",
    "react/prefer-es6-class": "error",
    "react/prefer-read-only-props": "error",
    "react/prefer-stateless-function": 1,
    // "react/prop-types": "error",
    "react/react-in-jsx-scope": "error",
    "react/require-render-return": "error",
    "react/self-closing-comp": "error",
    "react/sort-comp": 1,
    "react/state-in-constructor": "error",
    "react/style-prop-object": "error",
    "react/void-dom-elements-no-children": "error",
    "react/jsx-boolean-value": "error",
    "react/jsx-closing-bracket-location": 0,
    "react/jsx-closing-tag-location": "error",
    "react/jsx-curly-newline": "error",
    "react/jsx-curly-spacing": "error",
    "react/jsx-equals-spacing": "error",
    "react/jsx-filename-extension": [ "error", { extensions: [ ".tsx" ] } ],
    "react/jsx-first-prop-new-line": "error",
    "react/jsx-fragments": [ "error", "element" ],
    // "react/jsx-handler-names": 1,
    "react/jsx-indent": [ "error", 2, { checkAttributes: true, indentLogicalExpressions: true } ],
    "react/jsx-key": "error",
    "react/jsx-max-props-per-line": [ "error", { maximum: 3, when: "always" } ],
    "react/jsx-no-bind": "error",
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-script-url": "error",
    "react/jsx-no-target-blank": "error",
    "react/jsx-no-undef": "error",

    /*
     * "react/jsx-no-useless-fragment": "error",
     * "react/jsx-one-expression-per-line": "error",
     */
    "react/jsx-pascal-case": "error",
    "react/jsx-props-no-multi-spaces": "error",
    "react/jsx-space-before-closing": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": 1,
    "react/jsx-wrap-multilines": "error",

    // React hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // ES lint rules
    "no-await-in-loop": "error",
    "no-console": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    // "no-extra-parens": [ "error", "all", { ignoreJSX: "all" } ],
    "array-callback-return": "error",
    "consistent-return": "error",
    curly: [ "error", "all" ],
    "dot-location": "error",
    "dot-notation": "error",
    eqeqeq: "error",
    "guard-for-in": 1,
    "no-alert": "error",
    "no-case-declarations": "error",
    "no-constructor-return": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-empty-pattern": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-floating-decimal": "error",
    "no-implicit-coercion": "error",
    // "no-invalid-this": "error",
    "no-implied-eval": "error",
    "no-iterator": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    // "no-magic-numbers": "error",
    "no-multi-spaces": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    "no-proto": "error",
    "no-return-await": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-unused-expressions": 1,
    "no-useless-call": "error",
    // no-useless-concat only for strings
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "no-void": "error",
    "prefer-promise-reject-errors": "error",
    "require-await": 1,
    "wrap-iife": "error",
    yoda: "error",

    // Variables
    "no-label-var": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": [ "error" ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [ "error" ],

    // Stylistic Issues
    "array-bracket-newline": [ "error", { multiline: true } ],
    "array-bracket-spacing": [ "error", "always" ],
    "block-spacing": [ "error", "never" ],
    "brace-style": "error",
    camelcase: "error",
    "comma-dangle": "error",
    "comma-spacing": [ "error", { before: false, after: true } ],
    "comma-style": [ "error", "last" ],
    "computed-property-spacing": "error",
    "eol-last": [ "error", "always" ],
    "func-call-spacing": [ "error", "never" ],
    "function-call-argument-newline": [ "error", "consistent" ],
    "function-paren-newline": [ "error", "consistent" ],
    "implicit-arrow-linebreak": [ "error", "beside" ],
    indent: [ "error", 2, { ignoredNodes: [ "JSXElement *", "JSXElement" ], SwitchCase: 1 } ],
    "jsx-quotes": [ "error", "prefer-double" ],
    "key-spacing": [ "error", { beforeColon: false } ],
    "keyword-spacing": [ "error", { before: true, after: true } ],
    "line-comment-position": [ "error", { position: "above" } ],
    "linebreak-style": [ "error", "unix" ],
    "lines-around-comment": [ "error", { beforeBlockComment: true } ],
    "lines-between-class-members": [ "error", "always" ],
    "max-len": [
      "error",
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    "max-params": [ "error", 3 ],
    "max-statements-per-line": [ "error", { max: 1 } ],
    "multiline-comment-style": [ "error", "starred-block" ],
    "new-cap": "error",
    "new-parens": [ "error", "always" ],
    "newline-per-chained-call": [ "error", { ignoreChainWithDepth: 2 } ],
    "no-array-constructor": "error",
    "no-bitwise": "error",
    "no-inline-comments": "error",
    "no-lonely-if": "error",
    "no-mixed-operators": "error",
    "no-multi-assign": "error",
    "no-multiple-empty-lines": [ "error", { max: 2 } ],
    "no-negated-condition": 1,
    "no-nested-ternary": "error",
    "no-new-object": "error",
    "no-tabs": "error",
    "no-trailing-spaces": [ "error", { skipBlankLines: true, ignoreComments: true } ],
    "no-underscore-dangle": "error",
    "no-unneeded-ternary": "error",
    "no-whitespace-before-property": "error",
    "object-curly-newline": [ "error", { consistent: true } ],
    "object-curly-spacing": [ "error", "always" ],
    "object-property-newline": [ "error", { allowAllPropertiesOnSameLine: true } ],
    "one-var": [ "error", "never" ],
    "one-var-declaration-per-line": [ "error", "initializations" ],
    "operator-linebreak": [ "error", "before" ],
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "return" }
    ],
    "quote-props": [ "error", "as-needed" ],
    semi: [ "error", "always" ],
    "semi-spacing": [ "error", { before: false, after: true } ],
    "semi-style": [ "error", "last" ],
    "space-before-function-paren": [
      "error", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "space-in-parens": [ "error", "never" ],
    "space-infix-ops": "error",
    "spaced-comment": [ "error", "always" ],
    "switch-colon-spacing": [ "error", { after: true, before: false } ],
    "wrap-regex": "error",

    // ES 6 rules
    "arrow-body-style": [ "error", "as-needed" ],
    "arrow-parens": [ "error", "as-needed" ],
    "arrow-spacing": [ "error", { before: true, after: true } ],
    "generator-star-spacing": [ "error", { before: false, after: true } ],
    "no-confusing-arrow": "error",
    "no-duplicate-imports": "error",
    "no-useless-computed-key": "error",
    "no-useless-constructor": "error",
    "no-useless-rename": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-destructuring": [ "error", { object: true, array: false } ],
    "prefer-rest-params": "error",
    // Suggest using spread syntax instead of .apply()
    "prefer-spread": "error",
    // Prefer template strings
    "prefer-template": "error",
    // Space before spread operator
    "rest-spread-spacing": [ "error", "never" ],
    // require symbol description (better for debugging)
    "symbol-description": "error",
    // Space before and after curly brackets in template strings
    "template-curly-spacing": [ "error", "never" ],

    // enable additional rules
    quotes: [ "error", "double" ]
  }
};
