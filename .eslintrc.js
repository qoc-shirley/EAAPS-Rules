module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    "indent": [
      "error",
      2,
      {
        "VariableDeclarator": {
          "var": 2,
          "let": 2,
          "const": 3
        }
      }
    ],
    "space-before-function-paren": [
      "error",
      "never"
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxEOF": 1
      }
    ],
    "brace-style": [
      "error",
      "stroustrup"
    ],
    "newline-per-chained-call": [
      "error",
      {
        "ignoreChainWithDepth": 2
      }
    ],
    "key-spacing": [
      "error",
      {
        "singleLine": {
          "beforeColon": false,
          "afterColon": true
        },
        "multiLine": {
          "beforeColon": false,
          "afterColon": true
        }
      }
    ],
    "multiline-ternary": [
      "error",
      "always"
    ],
    "comma-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    "space-in-parens": [
      "error",
      "always"
    ],
    "max-len": [
      "error",
      {
        "code": 120,
        "comments": 120,
        "ignoreUrls": true,
        "ignoreTemplateLiterals": true
      }
    ],
    "curly": "error",
    "no-caller": "error",
    "no-debugger": "warn",
    "no-else-return": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-fallthrough": "error",
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-redeclare": "error",
    "prefer-promise-reject-errors": "error",
    "no-delete-var": "error",
    "no-undef": "error",
    "no-use-before-define": "error",
    "lines-around-comment": [
      "error",
      {
        "beforeBlockComment": true
      }
    ],
    "max-statements-per-line": [
      "error",
      {
        "max": 1
      }
    ],
    "max-params": [
      "error",
      5
    ],
    "newline-before-return": "error",
    "no-inline-comments": "error",
    "no-trailing-spaces": "error",
    "react/jsx-boolean-value": "off"
  }
};