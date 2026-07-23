import { getCollection } from 'astro:content';
import { POSTS } from '@/constants';
import { StatusSchema } from '@/schema';
import type { PostsType } from '@/types';

let posts: PostsType[] | null = null;

export async function getPosts(): Promise<PostsType[]> {
  if (posts?.length) return posts;
  posts = await getCollection(POSTS, post => post.data.status === StatusSchema.enum.published);
  return posts;
}

let tags: string[] | null = null;

export async function getTags(): Promise<string[]> {
  if (tags?.length) return tags;
  const allPosts = await getPosts();
  tags = [...new Set(allPosts.flatMap(post => post.data.tags || []))];
  return tags;
}

export function getImgName(post: PostsType): string {
  return `${post.id}-img`;
}

export function getPostUrl(post: PostsType): string {
  return `/${post.data.contentType}/${post.id}`;
}
