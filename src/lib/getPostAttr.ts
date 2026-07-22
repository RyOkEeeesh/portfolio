import type { PostsType } from '@/types';

export function getImgName(post: PostsType): string {
  return `${post.id}-img`;
}

export function getPostUrl(post: PostsType): string {
  return `/${post.data.contentType}/${post.id}`;
}
