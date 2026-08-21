import { githubGraphQL } from '@/api/github/client';
import { IssueSearchResultSchema, type PostType } from '@/api/github/schemas/postSchema';
import { StatusSchema } from '@/schema';

const repo = import.meta.env.GITHUB_REPO || process.env.GITHUB_REPO;

export async function getAllPostsFromGithubIssues(): Promise<PostType[]> {
  const posts: PostType[] = [];
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

    // parse 時に内側の transform が自動実行され、nodes は完全に整った PostType[] になる
    const result = IssueSearchResultSchema.parse(raw);
    const { nodes, pageInfo } = result.search;

    posts.push(...nodes);
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return posts;
}
