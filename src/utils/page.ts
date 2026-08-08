import type { ROUTES } from '@/constants';
import { SITE_DATA } from '@/data';

type RouteValue = (typeof ROUTES)[keyof typeof ROUTES];

export const getPageTitle = (route: RouteValue): string => {
  return `${SITE_DATA.title} - ${route}`;
};
