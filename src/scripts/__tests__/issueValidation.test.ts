import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { getIssue, validateIssue } from '../issueValidation';

// 環境変数のモック用ヘルパー
const setupEnv = (overrides: Record<string, string> = {}) => {
  process.env.ISSUE_NUMBER = '123';
  process.env.ISSUE_TITLE = 'Test Title';
  process.env.ISSUE_BODY = '<!-- description: これは10文字以上の説明テキストです -->\n本文';
  process.env.ISSUE_URL = 'https://example.com';
  process.env.ISSUE_CREATED_AT = '2026-01-01T00:00:00Z';
  process.env.ISSUE_UPDATED_AT = '2026-01-01T00:00:00Z';
  process.env.ISSUE_LABELS = '[]';

  Object.entries(overrides).forEach(([key, val]) => {
    process.env[key] = val;
  });
};

describe('getIssue & validateIssue (環境変数経由) の統合テスト', () => {
  beforeEach(() => {
    delete process.env.ISSUE_NUMBER;
    delete process.env.ISSUE_TITLE;
    delete process.env.ISSUE_BODY;
    delete process.env.ISSUE_URL;
    delete process.env.ISSUE_CREATED_AT;
    delete process.env.ISSUE_UPDATED_AT;
    delete process.env.ISSUE_LABELS;
  });

  it('GitHub Actions の toJSON 形式 (改行付きJSON) を正しくパースして検証できること', () => {
    const actionsFormattedLabels = JSON.stringify(
      [
        { name: 'status:published', color: 'd93f0b' },
        { name: 'status:draft', color: 'b60205' },
        { name: 'type:note', color: '00ff00' },
      ],
      null,
      2,
    );

    setupEnv({ ISSUE_LABELS: actionsFormattedLabels });

    const rawIssue = getIssue();
    const result = validateIssue(rawIssue);

    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.errors.some(err => err.includes('ステータス(status:)が複数設定されています')));
    }
  });

  it('ISSUE_LABELS が不正な JSON や空文字の場合に適切にエラーになること', () => {
    setupEnv({ ISSUE_LABELS: 'invalid json string' });

    const rawIssue = getIssue();
    const result = validateIssue(rawIssue);

    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.errors.some(err => err.includes('ステータスラベル(status:)が設定されていません')));
    }
  });
});
