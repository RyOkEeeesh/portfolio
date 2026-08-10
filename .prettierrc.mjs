/** @type {import('prettier').Config} */
export default {
  // 1. クォートの設定
  singleQuote: true,
  printWidth: 120,
  arrowParens: 'avoid',

  // 2. プラグインの指定
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],

  // 3. import の順序定義
  importOrder: [
    // ① ライブラリ
    '<THIRD_PARTY_MODULES>',
    '',
    // ② type
    '<TYPES>',
    '',
    // ③ layout
    '^@/layouts(.*)$',
    '',
    // ④ component
    '^@/components(.*)$',
    '',
    // ⑤ module (lib や constants)
    '^@/lib(.*)$',
    '^@/constants(.*)$',
    '',
    // ⑥ assets / 相対パス
    '^@/assets(.*)$',
    '^[./]',
  ],

  // 4. オプション設定
  importOrderParserPlugins: ['typescript', 'jsx'],
  importOrderTypeScriptVersion: '5.0.0',
};
