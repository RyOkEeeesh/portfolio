import { getAllPostsFromGithubIssues } from '@/api/github';
import { hasValue, getIssueMeta } from '@/utils';

async function main() {
  console.log('Fetching GitHub issues...');
  try {
    const posts = await getAllPostsFromGithubIssues();

    if (hasValue(posts)) {
      posts.forEach(post => {
        const { meta, content } = getIssueMeta(post.body);
        console.log(meta);
        console.log(content);
      })
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

main();
