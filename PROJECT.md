# GitHub Native Portfolio CMS - 仕様書（MVP）

## コンセプト

**GitHubをCMSとして利用するポートフォリオサイト。**

記事や制作物はすべてGitHub Issuesで管理し、GitHub ActionsでAstroをビルドしてGitHub Pagesへデプロイする。

管理画面は存在せず、**GitHubだけで運用できる**ことを目標とする。

---

# 技術スタック

- Astro
- TypeScript
- Vanilla CSS
- GitHub Pages
- GitHub Actions
- GitHub REST API（必要なら将来的にGraphQLへ移行）
- react-markdown + remark-gfm（Markdown表示）

※ Three.jsやReactは後から追加可能（トップページ演出用）

---

# システム構成

```text
GitHub Issues
      │
      ▼
GitHub Actions
      │
GitHub API取得
      │
Astro Build
      │
GitHub Pages
```

Issueの更新をトリガーに自動ビルド・自動デプロイを行う。

---

# データソース

GitHub IssuesをそのままCMSとして利用する。

| GitHub      | サイト        |
| ----------- | ---------- |
| Issue Title | タイトル       |
| Issue Body  | Markdown本文 |
| Labels      | カテゴリ・タグ・状態 |
| Created At  | 投稿日        |
| Updated At  | 更新日        |
| Number      | URL ID     |
| User        | 投稿者        |

---

# ラベル設計

## コンテンツタイプ

```
type:project
type:blog
type:note
```

---

## タグ

```
tag:astro
tag:rust
tag:react
tag:web
tag:threejs
tag:esp32
tag:linux
tag:competitive-programming
```

自由に追加可能。

---

## ステータス

```
status:draft
status:published
status:archived
```

- draft

- 一覧に表示しない
- published

- 公開
- archived

- アーカイブ表示

---

## その他

```
featured
```

トップページのおすすめ表示。

---

# ページ構成

```
/
```

トップページ

- Hero
- Featured Projects
- Latest Blogs
- Latest Notes

---

```
/projects
```

制作物一覧

---

```
/projects/[id]
```

制作物詳細

Markdown表示

---

```
/blog
```

ブログ一覧

---

```
/blog/[id]
```

ブログ詳細

---

```
/notes
```

メモ一覧

---

```
/notes/[id]
```

メモ詳細

---

```
/tags/[tag]
```

タグ一覧

---

```
/about
```

プロフィール

---

# Markdown

Issue本文をそのまま表示する。

対応

- GitHub Flavored Markdown
- Table
- Task List
- Code Block
- Quote
- Image

画像はGitHub Attachmentsを利用。

---

# ディレクトリ

```text
src/
├── pages/
├── layouts/
├── components/
├── styles/
├── lib/
│   ├── github.ts
│   ├── parser.ts
│   └── types.ts
└── content/
```

---

# GitHub Actions

トリガー

```yaml
on:
  issues:
    types:
      - opened
      - edited
      - deleted
      - labeled
      - unlabeled
```

処理

```
Issue更新
↓

Astro Build

↓

GitHub Pages Deploy
```

---

# SEO

実装予定

- title
- meta description
- Open Graph
- Twitter Card
- sitemap.xml
- robots.txt
- RSS
- canonical

---

# 将来的な追加機能

## Three.js

トップページのみ背景演出。

---

## 検索

タグ検索

全文検索

---

## OGP画像生成

記事ごとに自動生成。

---

## シンタックスハイライト

コード表示強化。

---

## ダークモード

CSSのみで実装予定。

---

## View Transition API

ページ遷移アニメーション。

---

## GitHub GraphQL

REST APIから移行予定。

---

## コメント

GitHub Discussionsとの連携（検討）。

---

# 開発方針

- **GitHubだけで運用できること**
- **サーバーレス**
- **静的サイト（Astro）**
- **高速表示**
- **シンプルな構成**
- **バニラCSSでデザイン**
- **Three.jsは必要になった時点で導入**

---

## MVP（最初の完成目標）

- Astroでサイト構築
- GitHub Issuesから記事取得
- Markdown表示
- ラベルによる分類
- Projects / Blog / Notes の一覧
- GitHub Actionsによる自動ビルド・デプロイ
- GitHub Pages公開

このMVPが完成すれば、「GitHubをそのままCMSとして利用するポートフォリオサイト」として十分に実用的な形になります。その後は検索やOGP自動生成、Three.jsなどを追加しながら育てていく方針です。