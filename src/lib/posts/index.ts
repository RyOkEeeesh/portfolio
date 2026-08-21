import { Temporal } from 'temporal-polyfill';
import { getAllPostsFromGithubIssues } from '@/api';

import { StatusSchema } from '@/schema';
import type { ContentsType, PostType, TagType } from '@/types';

let posts: PostType[] | null = null;

export async function getPosts(): Promise<PostType[]> {
  if (posts?.length) return posts;
  posts = await getAllPostsFromGithubIssues();
  return posts;
}

let tags: TagType[] | null = null;

export async function getTags(): Promise<TagType[]> {
  if (tags?.length) return tags;
  const allPosts = await getPosts();
  const tagMap = new Map<string, number>();

  for (const post of allPosts) {
    const postTags = post.tags || [];
    for (const tag of postTags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  tags = Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
  return tags;
}

export function getImgName(post: PostType): string {
  return `${post.number}-img`;
}

export function getPostUrl(post: PostType): string {
  return `/${post.contentType}/${post.number}`;
}

export async function getPublishedPosts(content: ContentsType, limit?: number): Promise<PostType[]> {
  const allPosts = await getPosts();

  const posts = allPosts
    .filter(post => post.status === StatusSchema.enum.published && post.contentType === content)
    .sort((a, b) => Temporal.Instant.compare(Temporal.Instant.from(a.createdAt), Temporal.Instant.from(b.createdAt)));

  return limit ? posts.slice(0, limit) : posts;
}
