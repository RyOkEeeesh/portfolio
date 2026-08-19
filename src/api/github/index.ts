import { graphql } from '@octokit/graphql';
import { IssueSearchResultSchema, StatusSchema } from '@/schema';
import type { IssueType } from '@/types';

export const githubGraphQL = graphql.defaults({
  headers: {
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

export async function getAllPostsFromGithubIssues(): Promise<IssueType[]> {
  const issues: IssueType[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  const q = `repo:${process.env.GITHUB_REPO} is:issue author:@me label:status:${StatusSchema.enum.published}`;

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

    const result = IssueSearchResultSchema.parse(raw);
    const { nodes, pageInfo } = result.search;

    issues.push(...nodes);
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return issues;
}
