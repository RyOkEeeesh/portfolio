import { defineCollection } from 'astro:content';
import { getAllPostsFromGithubIssues } from '@/api';
import { CollectionSchema, transformIssueNode } from '@/api/github/schemas/postSchema';
import { downloadAsset } from '@/lib';

const posts = defineCollection({
  loader: {
    name: 'github-posts-loader',
    load: async ({ store, parseData, renderMarkdown }) => {
      const rawPosts = await getAllPostsFromGithubIssues();
      const posts = rawPosts.map(transformIssueNode);

      store.clear();

      for (const post of posts) {
        const parsedPost = await downloadAsset(post);
        const data = await parseData({
          id: parsedPost.id,
          data: parsedPost.data,
        });

        store.set({
          id: parsedPost.id,
          data,
          body: parsedPost.body,
          rendered: parsedPost.body ? await renderMarkdown(parsedPost.body) : undefined,
        });
      }
    },
  },
  schema: CollectionSchema,
});

export const collections = { posts };
