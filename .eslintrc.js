module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    // 添加从shts配置中的环境
    es6: true
  },
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:vue/vue3-recommended',
    './auto-imports/.eslintrc-auto-import.json'
    // 移除 'shts'，因为我们直接合并了其规则
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'vue/no-unused-vars': 'warn',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/html-indent': ['error', 2],
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': ['warn', {
      singleline: {
        max: 4
      },
    }],
    // 合并shts的规则
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'max-lines-per-function': ['error', { 'max': 150 }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'interface',
        'format': ['PascalCase'],
      },
      {
        'selector': 'typeAlias',
        'format': ['PascalCase']
      },
      {
        'selector': 'enum',
        'format': ['UPPER_CASE', 'PascalCase']
      },
      {
        'selector': 'class',
        'format': ['PascalCase']
      }
    ],
    'generator-star-spacing': 'off',
    indent: [1, 2, {
      SwitchCase: 1,
    }],
    'no-multiple-empty-lines': [1, { max: 2 }],
    camelcase: 2,
    'no-spaced-func': 2,
    'no-func-assign': 2,
    'no-undef': 2,
    'key-spacing': [2, { beforeColon: false, afterColon: true }],
    'no-redeclare': 2,
    eqeqeq: [2, 'allow-null'],
    quotes: [1, 'single', 'avoid-escape'],
    semi: [2, 'never'],
    'comma-dangle': [0, 'never'],
    'no-unused-vars': 0,
    'no-dupe-keys': 2,
    'no-invalid-this': 2,
    'no-var': 2,
    'eol-last': ['error', 'always'],
    'new-cap': [
      2,
      {
        newIsCap: true, // 构造函数方法名必须大写
        capIsNew: false // 构造函数不需要一定使用new
      }
    ], // 构造函数大写限制
    'new-parens': 2, // 要求调用无参构造函数时带括号
    'prettier/prettier': 0,
    // 禁止出现console
    // 'no-console': 'warn',
    // 禁用debugger
    // 'no-debugger': 'warn',

    // 禁止出现空语句块
    'no-empty': 'warn',
    'no-extra-parens': 'off',
    'no-unreachable': 'warn',
    'curly': ['error', 'multi-line'],
    'object-curly-spacing': ['error', 'always'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
      { blankLine: 'always', prev: '*', next: 'multiline-expression' },
    ],
    'default-case': 'warn',
    'dot-notation': 'warn',
    'no-else-return': 'warn',
    'no-multi-spaces': 'warn',
    'no-useless-catch': 'warn',
    'no-useless-return': 'warn',
    'no-shadow': 'off',
    'no-delete-var': 'off',
    'no-mixed-spaces-and-tabs': 'warn',
    'space-infix-ops': 'warn',
    'no-useless-escape': 0
  },
  globals: {
    Recordable: 'readonly',
    HttpResponse: 'readonly'
  }
}
