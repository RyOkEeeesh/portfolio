import { ZodError } from 'zod';
import {
  type IssueLabelType,
  type RawIssueNodeType,
  TransformCollectionSchema,
  type TransformCollectionType,
  transformIssueNode,
} from '@/api/github/schemas/postSchema';
import { getEnv } from '@/utils';

export type ValidationResult = { success: true } | { success: false; errors: string[] };

export function getIssue(): RawIssueNodeType {
  let labelNodes: IssueLabelType[] = [];

  const rawLabels = getEnv('ISSUE_LABELS');
  if (rawLabels) {
    try {
      const parsed = JSON.parse(rawLabels);
      if (Array.isArray(parsed)) {
        labelNodes = parsed
          .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
          .map(item => ({
            name: String(item.name ?? ''),
            color: String(item.color ?? ''),
          }));
      }
    } catch (error) {
      console.error('ISSUE_LABELS の JSON パースに失敗しました:', error);
    }
  }

  return {
    number: Number(getEnv('ISSUE_NUMBER')) || 0,
    title: getEnv('ISSUE_TITLE') || '',
    body: getEnv('ISSUE_BODY') || '',
    url: getEnv('ISSUE_URL') || '',
    createdAt: getEnv('ISSUE_CREATED_AT') || '',
    updatedAt: getEnv('ISSUE_UPDATED_AT') || '',
    labels: {
      nodes: labelNodes,
    },
  };
}

export function validateIssue(issue: RawIssueNodeType): ValidationResult {
  const errors: string[] = [];

  const statusLabels = issue.labels.nodes.filter(l => l.name.startsWith('status:'));
  const typeLabels = issue.labels.nodes.filter(l => l.name.startsWith('type:'));

  if (statusLabels.length === 0) {
    errors.push('ステータスラベル(status:)が設定されていません。');
  } else if (statusLabels.length > 1) {
    errors.push(`ステータス(status:)が複数設定されています: ${statusLabels.map(l => l.name).join(', ')}`);
  } else {
    const isPublished = statusLabels.some(l => l.name === 'status:published');
    if (isPublished && typeLabels.length === 0) {
      errors.push('ステータスが公開(status:published)ですが、コンテンツタイプ(type:)が設定されていません。');
    }
  }

  if (typeLabels.length > 1) {
    errors.push(`コンテンツタイプ(type:)が複数設定されています: ${typeLabels.map(l => l.name).join(', ')}`);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  let transformed: TransformCollectionType;

  try {
    transformed = transformIssueNode(issue);
  } catch (error) {
    if (error instanceof ZodError) {
      error.issues.forEach(err => {
        errors.push(`メタデータ解析エラー [${err.path.join('.')}]: ${err.message}`);
      });
    } else if (error instanceof Error) {
      errors.push(`データ変換エラー: ${error.message}`);
    } else {
      errors.push('不明なデータ変換エラーが発生しました。');
    }

    return { success: false, errors };
  }

  const parsed = TransformCollectionSchema.safeParse(transformed);

  if (!parsed.success) {
    parsed.error.issues.forEach(err => {
      const path = err.path.join('.') || 'root';
      errors.push(`スキーマエラー [${path}]: ${err.message}`);
    });
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true };
}

function main() {
  const rawIssue = getIssue();
  const result = validateIssue(rawIssue);

  if (!result.success) {
    console.error(`Issue #${rawIssue.number} の検証に失敗しました。`);
    result.errors.forEach(err => {
      console.error(`- ${err}`);
    });
    process.exit(1);
  }

  console.log('検証成功');
}

main();
