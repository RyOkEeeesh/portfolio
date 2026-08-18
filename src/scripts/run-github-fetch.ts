import { getAllPostsFromGithubIssues } from '@/api/github';

async function main() {
  console.log('Fetching GitHub issues...');
  try {
    const posts = await getAllPostsFromGithubIssues();
    console.log('Result count:', posts.length);
    console.dir(posts, { depth: null }); // オブジェクトの中身を折りたたまず詳細表示
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

main();
