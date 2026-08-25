import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { RawIssueNodeType } from '@/api/github/schemas/postSchema';
import { validateIssue } from '../issueValidation';

const createIssueWithBody = (body: string): RawIssueNodeType => ({
  number: 1,
  title: 'Test Title',
  body,
  url: 'https://example.com',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  labels: {
    nodes: [
      { name: 'status:published', color: '' },
      { name: 'type:note', color: '' },
    ],
  },
});

const createMockIssue = (labels: string[]): RawIssueNodeType => ({
  number: 123,
  title: 'Test Title',
  body: 'Test Body',
  url: 'https://example.com',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  labels: {
    nodes: labels.map(name => ({ name, color: '' })),
  },
});

describe('description のバリデーションテスト', () => {
  it('正常系: description が10文字以上かつラベルが正しく設定されている場合は通る', () => {
    const validIssue: RawIssueNodeType = {
      number: 100,
      title: '正常な記事タイトル',
      // 10文字以上の description コメントを含める
      body: `<!--
  description: これは10文字以上ある正常な記事の概要テキストです。
  thumbnail: https://example.com/thumb.png
  -->
  ここから本文が入ります。`,
      url: 'https://github.com/example/repo/issues/100',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      labels: {
        nodes: [
          { name: 'status:published', color: 'ff0000' },
          { name: 'type:note', color: '00ff00' },
          { name: 'tag:TypeScript', color: '0000ff' },
        ],
      },
    };

    const result = validateIssue(validIssue);

    assert.equal(result.success, true);
  });

  it('異常系: body に description コメントが無い場合はエラーになる', () => {
    const issue = createIssueWithBody('コメントなしの本文');
    const result = validateIssue(issue);

    assert.equal(result.success, false);
    if (!result.success) {
      // transformIssueNode 内の ZodError をキャッチしてエラー配列に入る
      assert.ok(result.errors.some(err => err.includes('メタデータ解析エラー')));
    }
  });

  it('異常系: description が 10 文字未満の場合はスキーマエラーになる', () => {
    // 1文字〜9文字の description
    const issue = createIssueWithBody('<!-- description: 短い説明 -->\n本文');
    const result = validateIssue(issue);

    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.errors.some(err => err.includes('スキーマエラー')));
    }
  });

  it('異常系: status: ラベルが複数ある場合は検証失敗する', () => {
      const issue = createMockIssue(['status:published', 'status:draft', 'type:article']);
      const result = validateIssue(issue);
  
      assert.equal(result.success, false);
      if (!result.success) {
        assert.ok(
          result.errors.some(err => err.includes('ステータス(status:)が複数設定されています'))
        );
      }
    });
  
    it('異常系: status:published なのに type: が無い場合に検証失敗する', () => {
      const issue = createMockIssue(['status:published']);
      const result = validateIssue(issue);
  
      assert.equal(result.success, false);
      if (!result.success) {
        assert.ok(
          result.errors.some(err => err.includes('コンテンツタイプ(type:)が設定されていません'))
        );
      }
    });
  
    it('異常系: type: ラベルが複数ある場合は検証失敗する', () => {
      const issue = createMockIssue(['type:article', 'type:scrap']);
      const result = validateIssue(issue);
  
      assert.equal(result.success, false);
      if (!result.success) {
        assert.ok(
          result.errors.some(err => err.includes('コンテンツタイプ(type:)が複数設定されています'))
        );
      }
    });
});
