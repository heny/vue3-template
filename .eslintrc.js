module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/vue3-recommended',
    './auto-imports/.eslintrc-auto-import.json',
    'shts',
  ],
  rules: {
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/html-indent': ['error', 2],
    'vue/multi-word-component-names': 0,
  },
  globals: {
    Recordable: 'readonly',
    HttpResponse: 'readonly',
  }
}
