import { githubGraphQL } from '@/api/github/client';
import { RawIssueSearchResultSchema, type RawIssueNodeType } from '@/api/github/schemas/postSchema';
import { StatusSchema } from '@/schema';

const repo = process.env.GITHUB_REPO || import.meta.env.GITHUB_REPO;

export async function getAllPostsFromGithubIssues(): Promise<RawIssueNodeType[]> {
  const posts: RawIssueNodeType[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  const q = `repo:${repo} is:issue author:@me label:status:${StatusSchema.enum.published}`;

  while (hasNextPage) {
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
                body
                createdAt
                updatedAt
                labels(first: 100) {
                  nodes { name }
                }
              }
            }
          }
        }
      `,
      { q, cursor },
    );

    // 生のレスポンス構造を parse
    const result = RawIssueSearchResultSchema.parse(raw);
    const { nodes, pageInfo } = result.search;

    posts.push(...nodes);
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return posts;
}