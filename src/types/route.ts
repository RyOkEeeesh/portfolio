import type { ROUTES } from '@/constants';
import type { ContentsType } from '@/types';

export type RouteType = ContentsType | typeof ROUTES.TAGS | typeof ROUTES.ABOUT;
