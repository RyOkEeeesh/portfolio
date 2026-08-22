import { graphql } from '@octokit/graphql';

const token = process.env.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;

export const githubGraphQL = graphql.defaults({
  headers: {
    authorization: `Bearer ${token}`,
  },
});
