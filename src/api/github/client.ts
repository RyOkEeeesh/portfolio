import { graphql } from '@octokit/graphql';

const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

export const githubGraphQL = graphql.defaults({
  headers: {
    authorization: `Bearer ${token}`,
  },
});
