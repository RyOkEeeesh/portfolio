import { graphql } from '@octokit/graphql';
import { SearchResultSchema, StatusSchema } from '@/schema';
import type { IssueType } from '@/types';

export const githubGraphQL = graphql.defaults({
  headers: {
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

async function _getAllPostsFromGithubIssues(): Promise<IssueType[]> {
  const issues: IssueType[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  const searchQuery = `repo:${process.env.GITHUB_REPO} is:issue author:@me label:${StatusSchema.enum.published}`;

  while (hasNextPage) {
    // raw を unknown として受け取ることで完全な any 排除を明示
    const raw = await githubGraphQL<unknown>(
      `
        query search($q: String!, $cursor: String) {
          search(query: $q, type: ISSUE, first: 100, after: $cursor) {
            issueCount
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              ... on Issue {
                number
                title
                url
                state
                createdAt
                labels(first: 100) {
                  nodes { name }
                }
              }
            }
          }
        }
      `,
      { q: searchQuery, cursor },
    );

    // Zod スキーマでランタイムチェック 兼 型確定
    const result = SearchResultSchema.parse(raw);
    const { nodes, pageInfo } = result.search;

    issues.push(...nodes);
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return issues;
}
