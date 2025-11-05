// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', '.vite/**', '.idea/**', '.vscode/**', '*.log']
  },
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser, // ✅ 改成直接使用 vueParser
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        window: 'readonly',
        document: 'readonly'
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint,
      prettier
    },
    rules: {
      // 推荐规则集合
      ...js.configs.recommended.rules,
      ...vue.configs['vue3-recommended'].rules,
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs.stylistic.rules,

      // 自定义规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // 超过 3 个属性才换行；换行后每行 1 个属性
      'vue/max-attributes-per-line': ['error', { singleline: 3, multiline: 1 }],
      // 不换行时首属性与标签同一行；需要换行时首属性放到下一行
      'vue/first-attribute-linebreak': ['error', { singleline: 'beside', multiline: 'below' }],
      // 如果你启用了 eslint-plugin-prettier，显式告诉它也用这个 Prettier 选项
      'prettier/prettier': ['error']
    }
  }
]
