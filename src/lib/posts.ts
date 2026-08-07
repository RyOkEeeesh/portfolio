import { getCollection } from 'astro:content';
import { POSTS } from '@/constants';
import { StatusSchema } from '@/schema';
import type { ContentsType, PostsType, TagType } from '@/types';

let posts: PostsType[] | null = null;

export async function getPosts(): Promise<PostsType[]> {
  if (posts?.length) return posts;
  posts = await getCollection(POSTS, post => post.data.status === StatusSchema.enum.published);
  return posts;
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

export function getImgName(post: PostsType): string {
  return `${post.id}-img`;
}

export function getPostUrl(post: PostsType): string {
  return `/${post.data.contentType}/${post.id}`;
}

export async function getPublishedPosts(content: ContentsType, limit?: number): Promise<PostsType[]> {
  const allPosts = await getPosts();

  const posts = allPosts
    .filter(post => post.data.status === StatusSchema.enum.published && post.data.contentType === content)
    .sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());

  return limit ? posts.slice(0, limit) : posts;
}
