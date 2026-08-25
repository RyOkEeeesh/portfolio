import { graphql } from '@octokit/graphql';
import { getEnv } from '@/utils';

const token = getEnv('GITHUB_TOKEN');

export const githubGraphQL = graphql.defaults({
  headers: {
    authorization: `Bearer ${token}`,
  },
});
