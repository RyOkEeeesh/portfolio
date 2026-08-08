/** @type {import('prettier').Config} */
export default {
  // 1. クォートの設定
  singleQuote: true, // 文字列にシングルクォートを使用

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
    '^@/layouts/(.*)$',
    '',
    // ④ component
    '^@/components/(.*)$',
    '',
    // ⑤ module
    '^@/lib/(.*)$',
    '^@/assets/(.*)$',
    '^[./]',
  ],

  // 4. オプション設定
  importOrderParserPlugins: ['typescript', 'jsx'],
  importOrderTypeScriptVersion: '5.0.0',
};
