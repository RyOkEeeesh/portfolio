import type { ROUTES } from '@/constants';
import { SITE_DATA } from '@/data';
import type { PostType } from '@/types';

type RouteValue = (typeof ROUTES)[keyof typeof ROUTES];

export const getPageTitle = (route: RouteValue): string => {
  return `${SITE_DATA.title} - ${route}`;
};

export function getImgName(post: PostType): string {
  return `${post.id}-img`;
}

export function getPostUrl(post: PostType): string {
  return `/${post.data.contentType}/${post.id}`;
}
