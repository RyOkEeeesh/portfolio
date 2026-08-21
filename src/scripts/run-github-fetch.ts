import { getAllPostsFromGithubIssues } from '@/api';
import { hasValue } from '@/utils';

async function main() {
  console.log('Fetching GitHub issues...');
  try {
    const posts = await getAllPostsFromGithubIssues();

    if (hasValue(posts)) {
      console.log(posts);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

main();
