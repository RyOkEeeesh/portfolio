---
title: "初めてのテスト投稿"
description: "これはローカルでテストするための記事です。"
# thumbnail: "/images/default-thumbnail.png"
createdAt: "2026-07-15"
contentType: "blog"
tags: ["astro"]
status: "published"
featured: false
issueNumber: 1
---

# テスト本文
## テスト本文
### テスト本文
#### テスト本文
##### テスト本文
###### テスト本文

ここに書いた文字が画面に表示されるか実験します！

```ts title="example.ts"
console.log("banana")
```

```js title="example.js" {7} del={3} ins={4} "str"
const main = (str) => {
  console.log(str)
  console.log("apple")
  console.log("banana")
}

main("Hello! I like...")
```

```css title="global.css"
.example {
  color: goldenrod;
}
```