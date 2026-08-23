import { getCollection } from 'astro:content';
import { Temporal } from 'temporal-polyfill';
import { POSTS } from '@/constants';
import { StatusSchema } from '@/schema';
import type { ContentsType, PostType, TagType } from '@/types';

const posts: PostType[] | null = null;

export async function getPosts(): Promise<PostType[]> {
  if (posts?.length) return posts;

  return await getCollection(POSTS);
}

let tags: TagType[] | null = null;

export async function getTags(): Promise<TagType[]> {
  if (tags?.length) return tags;
  const allPosts = await getPosts();
  const tagMap = new Map<string, number>();

  for (const post of allPosts) {
    const postTags = post.data.tags || [];
    for (const tag of postTags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  tags = Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
  return tags;
}

export async function getPublishedPosts(content: ContentsType, limit?: number): Promise<PostType[]> {
  const allPosts = await getPosts();

  const posts = allPosts
    .filter(post => post.data.status === StatusSchema.enum.published && post.data.contentType === content)
    .sort((a, b) =>
      Temporal.Instant.compare(Temporal.Instant.from(a.data.createdAt), Temporal.Instant.from(b.data.createdAt)),
    );

  return limit ? posts.slice(0, limit) : posts;
}
