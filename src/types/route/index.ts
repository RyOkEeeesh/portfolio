import type { ABOUT, TAGS } from '@/constants';
import type { ContentsType } from '@/types';

export type RouteType = ContentsType | typeof TAGS | typeof ABOUT;
