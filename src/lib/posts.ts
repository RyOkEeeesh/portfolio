import { getCollection } from 'astro:content';
import { StatusSchema } from '@/api/github/schemas/postSchema';
import { POSTS } from '@/constants';
import type { ContentsType, PostType, TagType } from '@/types';
import { sortDateDesc } from '@/utils';

const posts: PostType[] | null = null;

export async function getPosts(): Promise<PostType[]> {
  if (posts?.length) return posts;

  return await getCollection(POSTS);
}

let tags: TagType[] | null = null;

export async function getTags(): Promise<TagType[]> {
  if (tags?.length) return tags;
  const allPosts = await getPosts();
  const tagMap = new Map<string, { count: number; color: string }>();

  for (const post of allPosts) {
    const postTags = post.data.tags || [];
    for (const tag of postTags) {
      tagMap.set(tag.name, { count: (tagMap.get(tag.name)?.count || 0) + 1, color: tag.color });
    }
  }

  tags = Array.from(tagMap, ([name, { count, color }]) => ({ name, count, color }));
  return tags;
}

export async function getPublishedPosts(content: ContentsType, limit?: number): Promise<PostType[]> {
  const allPosts = await getPosts();

  const posts = allPosts
    .filter(post => post.data.status === StatusSchema.enum.published && post.data.contentType === content)
    .sort((a, b) => sortDateDesc(a.data.createdAt, b.data.createdAt));

  return limit ? posts.slice(0, limit) : posts;
}
