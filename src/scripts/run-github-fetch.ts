import { getAllPostsFromGithubIssues } from '@/api/github';
import { getIssueMetaAndBody, hasValue } from '@/utils';

async function main() {
  console.log('Fetching GitHub issues...');
  try {
    const posts = await getAllPostsFromGithubIssues();

    if (hasValue(posts)) {
      posts.forEach(post => {
        const issue = getIssueMetaAndBody(post.body);
        console.log(issue);
      });
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

main();
